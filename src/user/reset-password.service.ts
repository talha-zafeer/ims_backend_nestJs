import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class ResetPasswordService {
  constructor(private readonly userService: UserService) {}

  generateOtp() {
    const otp = Math.floor(Math.random() * 999999);
  }

  resetPassword(email: string, password: string) {
    const hashedPassword = this.userService.hashPassword(password);
  }
}
