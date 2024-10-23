import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import { TypingCompleted, TypingStarted } from '../controllers/typing.controller';

const typingRouter = Router();

typingRouter.post('/started', auth, TypingStarted);
typingRouter.post('/completed', auth, TypingCompleted);

export default typingRouter;