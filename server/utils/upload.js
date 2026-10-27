
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const allowedMimeTypes = {
    '.pdf': ['application/pdf'],

    '.doc': ['application/msword'],
    '.docx': [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],

    '.xls': ['application/vnd.ms-excel'],
    '.xlsx': [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],

    '.ppt': ['application/vnd.ms-powerpoint'],
    '.pptx': [
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],

    '.txt': ['text/plain'],

    '.jpg': ['image/jpeg'],
    '.jpeg': ['image/jpeg'],
    '.png': ['image/png'],
    '.gif': ['image/gif'],
    '.webp': ['image/webp']
};

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const acceptedTypes = allowedMimeTypes[extension];

    if (!acceptedTypes || !acceptedTypes.includes(file.mimetype)) {
        return cb(new Error('Unsupported file type.'));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    }
});

export default upload;
