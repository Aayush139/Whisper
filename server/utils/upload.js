import dotenv from 'dotenv';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

dotenv.config();

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: {
        useNewUrlParser: true
    },
    file: (request, file) => {
        const match = ['image/png', 'image/jpg', 'image/jpeg'];

        if (match.indexOf(file.mimetype) === -1) {
            return `${Date.now()}-whisper-${file.originalname}`;
        }

        return {
            bucketName: 'photos',
            filename: `${Date.now()}-whisper-${file.originalname}`
        };
    }
});

export default multer({ storage });