const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const exportRoutes = require('./routes/exportRoutes');
app.use('/api/export', exportRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const medicalFormRoutes = require('./routes/medicalFormRoutes');
app.use('/api/medical-forms', medicalFormRoutes);

const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
app.use('/api/medical-records', medicalRecordRoutes);



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}



module.exports = app;
