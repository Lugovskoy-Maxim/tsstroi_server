import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { User } from '../../schemas/user.schema';

export interface RequestWithUser extends Express.Request {
  user: JwtPayload & Partial<User>;
}