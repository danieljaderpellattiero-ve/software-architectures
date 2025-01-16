import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hospital');
        console.log('MongoDB connected successfully');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error connecting to MongoDB:', error.message);
        } else {
            console.error('Unknown error connecting to MongoDB:', error);
        }
        process.exit(1); // Завершаем процесс с ошибкой
    }
};

export default connectDB;
