import clientPromise from './mongodb';

export async function getDatabase() {
  const client = await clientPromise;
  return client.db();
}

// Example function to get a collection
export async function getCollection(collectionName: string) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Example function to insert a document
export async function insertDocument(collectionName: string, document: any) {
  const collection = await getCollection(collectionName);
  return collection.insertOne(document);
}

// Example function to find documents
export async function findDocuments(collectionName: string, query: any = {}) {
  const collection = await getCollection(collectionName);
  return collection.find(query).toArray();
} 