import { Document } from 'mongoose';

export interface IFile extends Document {
  _id: string | number;
  name: any;
  path: any;
  mimeType: any;
  size: number;
  publicKey: any;
  privateKey: any;
}
