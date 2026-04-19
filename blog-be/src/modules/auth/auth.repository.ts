import { User } from "@prisma/client";

export type CreateUserData = {
    name: string;
    email: string;
    password: string;
};

export interface IAuthRepository {
    findUserByEmail(email: string): Promise<User | null>;

    updateLastLogin(userId: string, lastLoginAt: Date): Promise<User>;

    createUser(data: CreateUserData): Promise<User>;
}