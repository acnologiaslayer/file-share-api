import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';

import File from '../models/file.model';
import { IFile } from '../interfaces/file.interface';

class FileService {

  //get all files
  public getAllFiles = async (): Promise<IFile[]> => {
    const data = await File.find();
    return data;
  };

  //create new file
  public newFile = async (
    req: any,
    res: any  
  ): Promise<IFile> => {
      const data = await File.create({
          name: req.file.filename,
          path: req.file.path,
          mimeType: req.file.mimetype,
          size: req.file.size,
          publicKey: uuidv4(),
          privateKey: uuidv4()
      });
      return data;
  };

  //delete a file
  public deleteFile = async (privateKey: string): Promise<IFile> => {
    const data = await File.findOne({privateKey: privateKey});
    data.remove();
    return data;
  };

  //get a single file
  public getFile = async (publicKey: string): Promise<IFile> => {
    const data = await File.findOne({publicKey: publicKey});
    return data;
  };
}

export default FileService;
