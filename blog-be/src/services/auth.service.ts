import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";
import { RegisterSchemaType, LoginSchemaType } from "@/validators/auth.validator";
import { UnauthorizedException } from '@/utils/app-error';

export const registerService = async (body: RegisterSchemaType) => {
   const { name, email, password } = body;

   const existingUser = await prisma.user.findFirst({
      where: {
         email: email,
         isDeleted: false,
         isActive: true,
      }
   });

   if (existingUser) {
      throw new UnauthorizedException("User with this email already exists");
   }


   const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = await prisma.user.create({
      data: {
         name,
         email,
         password: hashedPassword,
      }
   });
   return newUser;
};

export const loginService = async (body: LoginSchemaType) => {
   const { email, password } = body;

   const user = await prisma.user.findFirst({
      where: {
         email: email,
         isDeleted: false,
         isActive: true,
      }
   });

   if (!user) {
      throw new UnauthorizedException("Invalid email or password");
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
   }

   return user;
};
