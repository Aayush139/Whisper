import mongoose from 'mongoose';

const bucketName = 'photos';

export const uploadImage = async (request, response) => {
    try {
        if (!request.file) {
            return response.status(404).json('File not found');
        }

        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
                bucketName
            }
        );

        const filename = `${Date.now()}-whisper-${request.file.originalname}`;

        const uploadStream = bucket.openUploadStream(filename, {
            contentType: request.file.mimetype
        });

        uploadStream.end(request.file.buffer);

        uploadStream.on('finish', () => {
            const imageUrl =
                `https://whisper-server-kqvy.onrender.com/file/${filename}`;
            response.status(200).json(imageUrl);
        });

        uploadStream.on('error', (error) => {
            response.status(500).json({
                msg: error.message
            });
        });

    } catch (error) {
        response.status(500).json({
            msg: error.message
        });
    }
};

export const getImage = async (request, response) => {
    try {
        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
                bucketName
            }
        );

        const files = await bucket.find({
            filename: request.params.filename
        }).toArray();

        if (!files.length) {
            return response.status(404).json('File not found');
        }

        const file = files[0];

        response.set('Content-Type', file.contentType || 'application/octet-stream');

        const readStream = bucket.openDownloadStream(file._id);

        readStream.on('error', (error) => {
            response.status(500).json({
                msg: error.message
            });
        });

        readStream.pipe(response);

    } catch (error) {
        response.status(500).json({
            msg: error.message
        });
    }
};