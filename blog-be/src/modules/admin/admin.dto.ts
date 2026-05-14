import { ROLE } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class AddUserDto {
  @IsString() name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsOptional() @IsString() role?: ROLE;
}

export class UpdateRoleDto {
  @IsString() targetId!: string;
  @IsEnum(ROLE) role!: ROLE;
}
