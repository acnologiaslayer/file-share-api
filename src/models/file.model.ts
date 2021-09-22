import { Schema, model } from 'mongoose';
import { IFile } from '../interfaces/file.interface';

const fileSchema = new Schema(
  {
    name: {
      type: String
    },
    path: {
      type: String
    },
    mimeType: {
      type: String
    },
    size: {
      type: String
    },
    publicKey: {
      type: String
    },
    privateKey: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default model<IFile>('File', fileSchema);
