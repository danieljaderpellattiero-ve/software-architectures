#!/bin/sh

# Wait for MongoDB
echo "Waiting for MongoDB..."
until node -e "require('mongoose').connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).then(() => { console.log('MongoDB connected'); process.exit(0); }).catch(err => { console.error('MongoDB connection failed', err); process.exit(1); }) "; do
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done
echo "MongoDB is up and running."

# Run the admin creation script
echo "Running admin creation script..."
node createAdmin.js

# Execute the original command
echo "Starting Next.js application..."
exec "$@" 