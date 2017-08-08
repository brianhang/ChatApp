import * as mongoose from 'mongoose';
(<any>mongoose).Promise = global.Promise;

export default function connectToDb(uri: string) {
  return new Promise<void>((resolve, reject) => {
    const connection = mongoose.connect(uri);

    mongoose.connection.once('open', () => resolve());
    mongoose.connection.on('error', err => reject(err));
  });
}