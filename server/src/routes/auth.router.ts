import { Router } from 'express';
import {
  httpGithubAccessToken,
  httpGithubFinalSteps,
  httpGoogleAccessToken,
  httpGoogleFinalSteps,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/github/access-token', httpGithubAccessToken);
authRouter.post('/github/final-steps', httpGithubFinalSteps);


authRouter.get('/google/access-token', httpGoogleAccessToken);
authRouter.post('/google/final-steps', httpGoogleFinalSteps);

export default authRouter;