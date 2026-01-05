import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { IsIn, IsNotEmpty } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';

class UpdateRoleDto {
  @IsNotEmpty({ message: 'Role không được để trống' })
  @IsIn(['USER', 'ADMIN'], { message: 'Role phải là USER hoặc ADMIN' })
  role: 'USER' | 'ADMIN';
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }
}
