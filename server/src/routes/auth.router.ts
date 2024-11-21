import { Router } from 'express';
import {
  GoogleAccessToken,
  GoogleFinalSteps,
  CreateAccount,
  Login,
  Logout,
  ChangePassword,
  ChangeUsername
} from '../controllers/auth.controller';

const authRouter = Router();


authRouter.get('/google/access-token', GoogleAccessToken);
authRouter.post('/google/final-steps', GoogleFinalSteps);


authRouter.post('/create-account', CreateAccount);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);

authRouter.post('/change-username', ChangeUsername);
authRouter.post('/change-password', ChangePassword);



export default authRouter;