import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entity/user.entity";
import * as bcrypt from "bcrypt";
import { LoginUserDto } from "./dtos/login-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { JwtService } from "@nestjs/jwt";
import { RoleService } from "src/role/role.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService
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
      throw new BadRequestException("Invalid password");
    }

    const queryBuilder = this.userRepo
      .createQueryBuilder("user")
      .select("user.roleId", "roleId")
      .where("user.email = :email", { email })
      .take(1);
    const result = await queryBuilder.getRawOne();

    const accessToken = this.jwtService.sign({
      email: user.email,
      role: result.roleId,
    });

    console.log(result.role);

    return { accessToken, role: result.roleId };
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

  async findOrgUsers(id: number, req) {
    const { role } = req.user;

    const users = await this.userRepo
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .leftJoinAndSelect("user.org", "org")
      .where("org.id = :orgId", { orgId: id })
      .andWhere("role.id = :roleId", { roleId: role })
      .getMany();

    return users.map(({ org, ...user }) => ({
      ...user,
      orgName: org.name,
      orgBio: org.bio,
      orgAddress: org.address,
      repName: org.rep_name,
      repContact: org.rep_contact,
    }));
  }

  async getUsers(req) {
    if (req.user.role === 1) {
      const users = await this.userRepo
        .createQueryBuilder("user")
        .select([
          "user.id",
          "user.name",
          "user.email",
          "user.contact",
          "org.name",
        ])
        .innerJoin("user.org", "org")
        .where("user.roleId = :roleId", { roleId: 2 })
        .getMany();

      return users.map(({ org, ...user }) => ({ ...user, orgName: org.name }));
    }
    if (req.user.role === 2) {
      return await this.userRepo.find({
        relations: { role: true },
        where: { role: { id: 3 } },
      });
    }
  }

  async deleteUser(@Param("id") id: number) {
    try {
      await this.userRepo.delete(id);
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(@Param("id") id: number) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("Not found");
    }
    return user;
  }

  async resetPassword(password: string, req) {
    const { email, otp } = req.user;
    const user = await this.userRepo.findOne({ where: { email } });

    console.log("Email, OTP", email, otp);

    if (!otp) {
      throw new BadRequestException({ message: "Please verify OTP first" });
    }

    const hashedPassword = await this.hashPassword(password);
    user.password = hashedPassword;

    return await this.userRepo.save(user);
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param("id") id: number
  ) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({ message: "User not found ..." });
    }
    try {
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}
