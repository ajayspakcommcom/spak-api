import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface IMongoDBCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

declare global {
  var mongoose: IMongoDBCache;
}

let cached: IMongoDBCache = global.mongoose || { conn: null, promise: null };

async function connectToMongoDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 60000, // Increase timeout to 30 seconds
      // socketTimeoutMS: 60000 // Increase socket timeout to 45 seconds
      // keepAlive: true,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      return mongoose.connection;
    });

  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToMongoDB;
