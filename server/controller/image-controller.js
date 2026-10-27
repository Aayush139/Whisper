
import mongoose from 'mongoose';
import path from 'path';

const bucketName = 'photos';

const allowedExtensions = [
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp'
];

export const uploadImage = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(400).json({
                msg: 'No file uploaded'
            });
        }

        const extension = path
            .extname(request.file.originalname)
            .toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            return response.status(400).json({
                msg: 'Unsupported file type'
            });
        }

        if (!mongoose.connection.db) {
            return response.status(503).json({
                msg: 'Database is not connected'
            });
        }

        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            { bucketName }
        );

        // Keep the original filename readable while making it unique.
        const safeOriginalName = path
            .basename(request.file.originalname)
            .replace(/[\\/]/g, '_');

        const filename = `${Date.now()}-whisper-${safeOriginalName}`;

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: request.file.mimetype,
            metadata: {
                originalName: safeOriginalName
            }
        });

        uploadStream.on('error', (error) => {
            console.error('GridFS upload failed:', error);

            if (!response.headersSent) {
                response.status(500).json({
                    msg: 'File upload failed'
                });
            }
        });

        uploadStream.on('finish', () => {
            if (response.headersSent) return;

            const fileUrl =
                `https://whisper-server-kqvy.onrender.com/file/${encodeURIComponent(filename)}`;

            response.status(200).json(fileUrl);
        });

        uploadStream.end(request.file.buffer);
    } catch (error) {
        console.error('File upload error:', error);

        if (!response.headersSent) {
            response.status(500).json({
                msg: 'File upload failed'
            });
        }
    }
};

export const getImage = async (request, response) => {
    try {
        if (!mongoose.connection.db) {
            return response.status(503).json({
                msg: 'Database is not connected'
            });
        }

        const filename = request.params.filename;

        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            { bucketName }
        );

        const files = await bucket.find({ filename }).toArray();

        if (!files.length) {
            return response.status(404).json({
                msg: 'File not found'
            });
        }

        const file = files[0];

        // Use stored MIME type for PDFs, office documents and images.
        response.set(
            'Content-Type',
            file.contentType || 'application/octet-stream'
        );

        response.set(
            'X-Content-Type-Options',
            'nosniff'
        );

        // Preserve inline viewing for PDFs and images.
        // Download other documents as attachments.
        const extension = path.extname(filename).toLowerCase();

        const inlineTypes = [
            '.pdf',
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.webp'
        ];

        const disposition = inlineTypes.includes(extension)
            ? 'inline'
            : 'attachment';

        const downloadName = path
            .basename(file.metadata?.originalName || filename)
            .replace(/["\\\r\n]/g, '_');

        response.set(
            'Content-Disposition',
            `${disposition}; filename="${downloadName}"`
        );

        const readStream = bucket.openDownloadStream(file._id);

        readStream.on('error', (error) => {
            console.error('GridFS download failed:', error);

            if (!response.headersSent) {
                response.status(500).json({
                    msg: 'File retrieval failed'
                });
            } else {
                response.destroy(error);
            }
        });

        readStream.pipe(response);
    } catch (error) {
        console.error('File retrieval error:', error);

        if (!response.headersSent) {
            response.status(500).json({
                msg: 'File retrieval failed'
            });
        }
    }
};
