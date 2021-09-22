import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class FileValidator {
  public newFile = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      name: Joi.string().min(4).required(),
      path: Joi.string().required(),
      mimeType: Joi.string().required(),
      size: Joi.string().required(),
      publicKey: Joi.string().required(),
      privateKey: Joi.string().required()
    });
    // const { error } = schema.validate(req.body);
    // if (error) {
    //   next(error);
    // }
    next();
  };
}

export default FileValidator;
