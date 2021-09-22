import express, { IRouter } from 'express';
const router = express.Router();

import fileRoute from './file.route';

/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = (): IRouter => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });

  router.use('/files', new fileRoute().getRoutes());
  return router;
};

export default routes;
