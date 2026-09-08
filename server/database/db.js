import 'dotenv/config';
import mongoose from 'mongoose';

const Connection = async () => {
    try {
        console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
        console.log(
            'MONGO_URI starts with mongodb+srv:',
            process.env.MONGO_URI?.startsWith('mongodb+srv://')
        );

        await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB Atlas Connected Successfully');
    } catch (error) {
        console.log('Database Error:', error.message);
    }
};

export default Connection;