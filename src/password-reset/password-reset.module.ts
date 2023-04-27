import { Module } from "@nestjs/common";
import { PasswordResetService } from "./password-reset.service";
import { ConfigModule } from "@nestjs/config";

import { PasswordResetController } from "./password-reset.controller";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PasswordReset } from "./entities/password-reset.entity";
import { EmailModule } from "src/email/email.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset]),
    UserModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
    }),
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService],
})
export class PasswordResetModule {}
