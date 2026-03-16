import { IsIn, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsIn(['USER', 'ADMIN'], { message: 'Role phải là USER hoặc ADMIN' })
  role: 'USER' | 'ADMIN';
}
