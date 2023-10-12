import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  try {
    const decoded = jwt.verify(token, 'secret') as JwtPayload;
    req.body.user = decoded; // Store user data in req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
