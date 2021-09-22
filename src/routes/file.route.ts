import express, { IRouter } from 'express';
import fileController from '../controllers/file.controller';
import fileValidator from '../validators/file.validator';
import fileUtils from '../utils/file.util';

class FileRoutes {
  private FileController = new fileController();
  private router = express.Router();
  private FileValidator = new fileValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    //route to get all files
    this.router.get('', this.FileController.getAllFiles);

    //route to create a new file
    this.router.post(
      '',
      [fileUtils.upload, fileUtils.uploadLimiter, this.FileValidator.newFile],
      this.FileController.newFile
    );

    //route to get a single file
    this.router.get('/:publicKey', fileUtils.downloadLimiter, this.FileController.getFile);

    //route to delete a single file
    this.router.delete('/:privateKey', this.FileController.deleteFile);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default FileRoutes;
