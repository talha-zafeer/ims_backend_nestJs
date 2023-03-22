export class CreateRoleDto {
  id?: number;
  role: 'Super Admin' | 'Admin' | 'Employee';
}
