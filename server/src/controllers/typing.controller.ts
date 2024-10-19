import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import Profile, { ProfileProperties } from '../models/profile.model';
import User from '../models/user.model';

export async function TypingStarted(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const username = req.user!.username;

  try {
    const user = (await User.findOne({ username }))!;

    await Profile.updateOne(
      { _id: user._id },
      { $inc: { 'stats.testsStarted': 1 } }
    );
    return res.json({ message: 'Success!' });
  } catch (err) {
    next(err);
  }
}