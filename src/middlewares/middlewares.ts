import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  let realToken = token.split(' ')[1];

  if(token.split(' ')[0] !== 'Bearer'){
      return res.status(401).json({ message: 'Invalid authorization header' });
  }

  try {
    const decoded = jwt.verify(realToken, process.env.TOKEN_KEY || 'secret that can come in backeup just in case') as JwtPayload;
    req.body.user = decoded; // Store user data in req.user
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
