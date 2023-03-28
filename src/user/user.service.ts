import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async loginUser(@Body() loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new NotFoundException();
    }

    const isAutenticated = await bcrypt.compare(password, user.password);

    if (!isAutenticated) {
      throw new BadRequestException('Invalid password');
    }

    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return { accessToken, user };
  }

  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    const assignedRole = await this.roleService.findRole(role);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: assignedRole,
    });
    try {
      await this.userRepo.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(@Param('id') id: number) {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(@Param('id') id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Not found');
    }
    return user;
  }

  async sendOtp(email: string) {
    const otp = Math.floor(Math.random() * 999999);
    const user = await this.findUser(email);
    user.otp = otp;
    //send email here
    return await this.userRepo.save(user);
  }

  async resetPassword(otp: number, email: string, password: string) {
    // find user by email and otp
    const user = await this.userRepo.findOne({ where: { email, otp } });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;
    user.otp = null;

    return await this.userRepo.save(user);
  }

  async findUser(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({ message: 'User not found ...' });
    }
    try {
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
