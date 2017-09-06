import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces/user-document';

const bcrypt = require('bcrypt-nodejs');

// The number of rounds to use for salt generation.
const SALT_ROUNDS = 10;

const schema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

/**
 * Hash the password if it was changed when saving.
 */
schema.pre('save', function(this: any, next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.model('User').hashPassword(this.password)
    .then((password: string) => {
      this.password = password;
      next();
    });
});

/**
 * Utility method to hash a password using bcrypt.
 */
schema.statics.hashPassword = function(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a salt to hash with.
    bcrypt.genSalt(SALT_ROUNDS, (err: any, salt: any) => {
      if (err) {
        reject(err);

        return;
      }

      // Then hash the password with the salt.
      bcrypt.hash(password, salt, null, (hashErr: any, res: any) => {
        if (hashErr) {
          reject(hashErr);
        } else {
          resolve(res);
        }
      });
    });
  });
};

schema.method('comparePassword', function(this: any, password: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err: any, res: any) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
});

export const Users = model<UserDocument>('User', schema);
