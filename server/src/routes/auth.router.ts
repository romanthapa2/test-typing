import { Router } from 'express';
import {
  httpGithubAccessToken,
  httpGithubFinalSteps,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/github/access-token', httpGithubAccessToken);
authRouter.post('/github/final-steps', httpGithubFinalSteps);


export default authRouter;