/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import HttpStatus from 'http-status-codes';

import fileService from '../services/file.service';


class FileController {
  public FileService = new fileService();

  /**
   * Controller to get all files available
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getAllFiles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.FileService.getAllFiles();
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'All files fetched successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to get a file
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public getFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.FileService.getFile(req.params.publicKey);
      res.setHeader("content-type", data.mimeType);
      fs.createReadStream(data.path).pipe(res);
      res.status(HttpStatus.OK);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to create new file
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public newFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.FileService.newFile(req, res);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: {publicKey: data.publicKey, privateKey: data.privateKey},
        message: 'File created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Controller to delete a single file
   * @param  {object} Request - request object
   * @param {object} Response - response object
   * @param {Function} NextFunction
   */
  public deleteFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const data = await this.FileService.deleteFile(req.params.privateKey);
      fs.unlinkSync(data.path);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: {},
        message: 'File deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default FileController;
