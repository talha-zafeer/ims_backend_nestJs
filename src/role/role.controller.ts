import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Get()
  getAllRoles() {
    return 'Get ALl roles';
  }

  @Get()
  findRole() {
    return 'Get single role by ID';
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Delete(':id')
  removeRole(@Param('id') id: number) {
    return 'Delete ROute ';
  }

  @Post()
  updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return 'Update ROle Route';
  }
}
