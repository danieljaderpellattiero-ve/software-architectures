/**
 * 
 * The following script is used to create the database and the collection "patients" in the MongoDB instance.
 * It runs only once, when the MongoDB container is started for the first time.
 * 
 */

db = db.getSiblingDB('unive-sw-arch')

db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'unive-sw-arch'
    }
  ]
})

db.createCollection('patients')
