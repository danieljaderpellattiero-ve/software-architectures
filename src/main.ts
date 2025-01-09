import 'dotenv/config'
import bcrypt from 'bcrypt'
import express from 'express'
import jwt from 'jsonwebtoken'
import vine from '@vinejs/vine'
import { MongoClient } from 'mongodb'
import verifyToken from './middleware/auth.js'

// Database and API middleware configuration >>

// MongoDB configuration
let db: any
const client = new MongoClient(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/`
)

// Express (API) configuration
const app = express()
const port = process.env.PORT || 3000
app.use(express.json()) // Body parser middleware

// Validation middleware configuration
const userSchema = vine.object({
  name: vine.string(),
  birth: vine.date(),
  email: vine.string().email(),
  phone: vine.string(),
  address: vine.string(),
  insurance: vine.boolean(),
  password: vine.string()
})
const credentialsSchema = vine.object({
  email: vine.string().email(),
  password: vine.string()
})
const userValidator = vine.compile(userSchema)
const credentialsValidator = vine.compile(credentialsSchema)

// API endpoints >>

// Patient registration
app.post('/patient/register', async (req, res) => {
  try {
    const { name, birth, email, phone, address, insurance, password } =
      await userValidator.validate(req.body)
    const result = await db.collection('patients').insertOne({
      name,
      birth,
      email,
      phone,
      address,
      insurance,
      password: bcrypt.hashSync(password, 10)
    })
    res.status(201).json({ message: 'Patient registered successfully', id: result.insertedId })
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' })
  }
})

// Patient login
app.post('/patient/login', async (req, res) => {
  try {
    const { email, password } = await credentialsValidator.validate(req.body)
    const patient = await db.collection('patients').findOne({ email })
    if (patient && bcrypt.compareSync(password, patient.password)) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' })
      res.status(200).json({ message: 'Patient logged in successfully', token })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' })
  }
})

// Patient profile update (with JWT token verification)
app.patch('/patient/profile/:email', verifyToken, async (req, res) => {
  try {
    await db.collection('patients').updateOne(
      { email: req.params.email },
      {
        $set: {
          birth: req.body.birth,
          phone: req.body.phone,
          address: req.body.address,
          insurance: req.body.insurance
        }
      }
    )
    res.status(200).json({ message: 'Patient profile updated successfully' })
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' })
  }
})

// Patient profile deletion (with JWT token verification)
app.delete('/patient/profile/:email', verifyToken, async (req, res) => {
  try {
    await db.collection('patients').deleteOne({ email: req.params.email })
    res.status(200).json({ message: 'Patient profile deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' })
  }
})

// API entrypoint >>

app.listen(port, async () => {
  try {
    console.log(`Server connecting to MongoDB at localhost:27017`)
    const connection = await client.connect()
    db = connection.db('unive-sw-arch')
    console.log(`Server connected to MongoDB at localhost:27017`)
    console.log(`Server listening at http://localhost:${port}`)
  } catch (error) {
    console.error(`Server failed to connect to MongoDB at localhost:27017`)
    process.exit(1)
  }
})
