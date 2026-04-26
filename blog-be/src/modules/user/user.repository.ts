import { PublicUser, UpdateProfileDto } from './user.dto';



export interface IUserRepository {
  findUserActiveById(userId: string): Promise<PublicUser | null>;

  findUserByAdmin(userId: string): Promise<PublicUser | null>;

  findPasswordByUserId(userId: string): Promise<string | null>;

  getAllUsers(): Promise<PublicUser[]>;

  updateProfile(userId: string, data: UpdateProfileDto): Promise<PublicUser>;

  updateAvatar(userId: string, avatarUrl: string): Promise<PublicUser>;

  changePassword(userId: string, newPassword: string): Promise<void>;

  updateStatus(
    userId: string,
    currentUserId: string | undefined,
    newStatus: boolean,
  ): Promise<void>;
}
