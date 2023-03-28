import { Injectable } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const role = this.roleRepo.create(createRoleDto);
    try {
      this.roleRepo.save(role);
      return role;
    } catch (error) {
      console.log(error);
    }
    return role;
  }

  async findRole(roleType: string) {
    return await this.roleRepo.findOneBy({ role: roleType });
  }

  removeRole(@Param('id') id: number) {
    return 'Delete ROute ';
  }

  updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return 'Update ROle Route';
  }
}
