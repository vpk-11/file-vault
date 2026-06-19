import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import userModel from '../models/userData';
import { isAuthenticated } from '../middleware/auth';

const router = Router();
const BCRYPT_ROUNDS = 12;

router.post('/signup', async (req: Request, res: Response) => {
  const { uname, pswd, age, email } = req.body;

  if (!uname || !pswd || !age || !email) {
    res.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'All fields are required' } });
    return;
  }

  try {
    const existing = await userModel.findOne({ uname });
    if (existing) {
      res.status(409).json({ error: { code: 'USER_EXISTS', message: 'Username already taken' } });
      return;
    }

    const hashedPass = await bcrypt.hash(pswd, BCRYPT_ROUNDS);
    await new userModel({ uname, pass: hashedPass, age: Number(age), email, files: [] }).save();

    res.status(201).json({ message: 'Account created' });
  } catch (err) {
    console.error('Signup error:', (err as Error).message);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Signup failed' } });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { uname, pswd } = req.body;

  if (!uname || !pswd) {
    res.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'Username and password required' } });
    return;
  }

  try {
    const user = await userModel.findOne({ uname });
    if (!user) {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
      return;
    }

    const valid = await bcrypt.compare(pswd, user.pass);
    if (!valid) {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
      return;
    }

    req.session.user = { id: user._id.toString(), uname: user.uname };
    res.json({ message: 'Logged in', user: { uname: user.uname } });
  } catch (err) {
    console.error('Login error:', (err as Error).message);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Login failed' } });
  }
});

router.post('/logout', isAuthenticated, (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Logout failed' } });
      return;
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

router.get('/me', isAuthenticated, (req: Request, res: Response) => {
  res.json({ user: req.session.user });
});

export default router;
