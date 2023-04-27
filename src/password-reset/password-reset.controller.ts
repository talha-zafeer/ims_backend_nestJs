import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from "@nestjs/common";
import { PasswordResetService } from "./password-reset.service";
import { CreatePasswordResetDto } from "./dto/create-password-reset.dto";
import { UpdatePasswordResetDto } from "./dto/update-password-reset.dto";
import { VerificationCodeDto } from "./dto/verification-code.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("password-reset")
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post()
  create(@Body() createPasswordResetDto: CreatePasswordResetDto) {
    return this.passwordResetService.createPasswordResetRequest(
      createPasswordResetDto.email
    );
  }

  @Post("verification-code")
  @UseGuards(AuthGuard("jwt"))
  checkVerificationCode(
    @Body() verificationCodeDto: VerificationCodeDto,
    @Req() req: Request
  ) {
    return this.passwordResetService.verifyOtp(verificationCodeDto.otp, req);
  }

  @Get()
  findAll() {
    return this.passwordResetService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.passwordResetService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePasswordResetDto: UpdatePasswordResetDto
  ) {
    return this.passwordResetService.update(+id, updatePasswordResetDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.passwordResetService.remove(+id);
  }
}
