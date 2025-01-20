import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import doctorRoutes from './routes/doctor.routes';
import patientRoutes from './routes/patient.routes';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Подключение маршрутов
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);

// Обработчик корневого маршрута
app.get('/', (req, res) => {
    res.send('Welcome to the Hospital Management API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
