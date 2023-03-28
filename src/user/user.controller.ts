import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return 'user get function';
  }

  @Get(':id')
  findUser(@Param('id') id: number) {
    return this.userService.getUser(id);
  }

  @Post('reset')
  reset(@Body() body: any) {
    return this.userService.resetPassword(body.otp, body.email, body.password);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Patch('send-otp')
  sendotp(@Body() body: any) {
    console.log(body.email);
    return this.userService.sendOtp(body.email);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(@Req() req: Request) {
    return req.user;
  }

  @Delete()
  deleteUser() {
    return 'Delete User';
  }
}
