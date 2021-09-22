import fs from 'fs';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';

import File from '../models/file.model';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, process.env.FOLDER) ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ 
    storage, 
    limits: { 
        fileSize: 1000000 * 100 
    }, 
}).single('file'); //100mb

const downloadLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: process.env.DAILY_DOWNLOAD_LIMIT // Limit per IP
});

const uploadLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: process.env.DAILY_UPLOAD_LIMIT
});

const cleanUp = async () => {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - parseInt(process.env.INACTIVITY_TIME_MS))} })
    if(files.length) {
        for (const file of files) {
            try {
                await file.remove();
                fs.unlinkSync(file.path);
                console.log(`successfully deleted ${file.name}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Clean up done!');
  }

export default { upload, downloadLimiter, uploadLimiter, cleanUp };