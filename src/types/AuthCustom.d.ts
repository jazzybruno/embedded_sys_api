import { User } from "../models/User.model";

// custom.d.ts
declare module 'express' {
    interface Request {
      user?: User; // Replace YourUserType with the actual type you are using
    }
  }
  