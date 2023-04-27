import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/guards/jwt.auth.guard";
import { CreateUserDto } from "./dtos/create-user.dto";
import { LoginUserDto } from "./dtos/login-user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  getUsers(@Req() req: Request) {
    return this.userService.getUsers(req);
  }

  @Get("org/:id")
  @UseGuards(AuthGuard("jwt"))
  findOrgUsers(@Param("id") id: number, @Req() req: Request) {
    return this.userService.findOrgUsers(id, req);
  }
  @Get(":id")
  findUser(@Param("id") id: number) {
    return this.userService.getUser(id);
  }

  @Post("reset")
  @UseGuards(AuthGuard("jwt"))
  reset(@Body() body: any, @Req() req: Request) {
    return this.userService.resetPassword(body.password, req);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  updateUser(@Req() req: Request) {
    return req.user;
  }

  @Delete()
  deleteUser() {
    return "Delete User";
  }
}
