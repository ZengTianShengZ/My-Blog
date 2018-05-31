import Router from 'koa-router';
import * as userController from '../controller/user';

const router = new Router();

router.get('/login/:openId', userController.getUser);
router.post('/createUser', userController.createtUser);

export default router;
