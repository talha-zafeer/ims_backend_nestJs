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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async hashPassword(password: string): Promise<string> {
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

    const payload = user.email;
    const accessToken = this.jwtService.sign({
      email: user.email,
      id: user.id,
    });

    return { accessToken, user };
  }

  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepo.create({ email, password: hashedPassword });
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
