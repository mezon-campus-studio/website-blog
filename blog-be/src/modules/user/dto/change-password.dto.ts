import { IsString, Length } from 'class-validator';

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
