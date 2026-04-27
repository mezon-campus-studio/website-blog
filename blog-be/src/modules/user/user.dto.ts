import { IsOptional, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(6, 50)
  currentPassword!: string;

  @IsString()
  @Length(6, 50)
  newPassword!: string;

  @IsString()
  @Length(6, 50)
  confirmNewPassword!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(2, 50)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  bio?: string;
}

