import 'dotenv/config';
import mongoose from 'mongoose';

const Connection = async () => {
    try {
        const uri = process.env.MONGO_URI;

        console.log('MONGO_URI exists:', !!uri);
        console.log(
            'MONGO_URI starts with mongodb+srv:',
            uri?.startsWith('mongodb+srv://')
        );

        if (uri) {
            const safeUri = uri.replace(
                /^mongodb\+srv:\/\/([^:]+):([^@]+)@/,
                'mongodb+srv://***:***@'
            );

            console.log('MongoDB URI:', safeUri);
        }

        await mongoose.connect(uri);

        console.log('MongoDB Atlas Connected Successfully');
    } catch (error) {
        console.log('Database Error:', error.message);
    }
};

export default Connection;