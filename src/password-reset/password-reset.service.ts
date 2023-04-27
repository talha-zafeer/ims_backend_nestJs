import { Injectable, NotFoundException } from "@nestjs/common";

import { UpdatePasswordResetDto } from "./dto/update-password-reset.dto";
import { UserService } from "src/user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordReset } from "./entities/password-reset.entity";
import { Repository } from "typeorm";
import { EmailService } from "src/email/email.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    private readonly userService: UserService,
    private readonly mailService: EmailService,
    private readonly jwtService: JwtService
  ) {}

  async createPasswordResetRequest(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const createdAt = new Date();

    const expirationTime = new Date();
    expirationTime.setMinutes(createdAt.getMinutes() + 30);

    const otp = this.generateOtp();

    const passwordReset = this.passwordResetRepository.create({
      email,
      otp,
      createdAt,
      expirationTime,
      user,
    });

    await this.passwordResetRepository.save(passwordReset);

    await this.mailService.sendPasswordResetEmail(user.email, otp);

    return this.jwtService.sign({ email });
  }

  async verifyOtp(otp: string, req) {
    const { email } = req.user;
    console.log(email);

    const passwordReset = await this.passwordResetRepository
      .createQueryBuilder("passwordReset")
      .where("passwordReset.email = :email", { email })
      .orderBy("passwordReset.createdAt", "DESC")
      .getOne();

    if (!passwordReset) {
      return false;
    }

    console.log(typeof otp, typeof passwordReset.otp);
    if (passwordReset.otp !== otp) {
      return false;
    }

    if (passwordReset.expirationTime < new Date()) {
      return false;
    }

    return this.jwtService.sign({ email, otp });
  }

  generateOtp() {
    const otpLength = 6;
    let otp = "";
    for (let i = 0; i < otpLength; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  }

  findAll() {
    return `This action returns all passwordReset`;
  }

  findOne(id: number) {
    return `This action returns a #${id} passwordReset`;
  }

  update(id: number, updatePasswordResetDto: UpdatePasswordResetDto) {
    return `This action updates a #${id} passwordReset`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordReset`;
  }
}
