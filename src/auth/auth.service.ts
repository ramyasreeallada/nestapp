import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any | null> {
    console.log('AuthService: validateUser called with email:', email);

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.log('AuthService: User not found:', email);
      return null;
    }

    if (!user.isActive) {
      console.log('AuthService: User is inactive:', email);
      return null;
    }

    const match = await bcrypt.compare(password, user.password || '');
    if (!match) {
      console.log('AuthService: Password mismatch for user:', email);
      return null;
    }

    console.log('AuthService: User validated successfully:', email);

    // Remove password before returning
    const { password: _, ...safeUser } = user;
    console.log('AuthService: Returning safeUser:', safeUser);

    return safeUser;
  }
}
