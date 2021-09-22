import { expect } from 'chai';
import FileService from '../../src/services/file.service';
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

describe('File', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  describe('Get Files', () => {
    it('should return empty array', async () => {
      const result = await new FileService().getAllFiles();
      expect(result).to.be.an('array');
    });
  });

});
