import { Router } from 'express';
import HomeController from '../controllers/home.js';
import {LogoutController, SignInController, SignInPostController, SignUpController, SignUpPostController} from '../controllers/login.js';
import { authGuard, setTemplateVars } from '../views/middlewares/session.js';
const appRouter = Router()

appRouter.use(setTemplateVars)


appRouter.get('/signup', SignUpController);
appRouter.post('/signup', SignUpPostController);

appRouter.get('/signin', SignInController);
appRouter.post('/signin', SignInPostController);
appRouter.get('/logout', LogoutController);

 appRouter.get('/', authGuard, HomeController);

export default appRouter;
