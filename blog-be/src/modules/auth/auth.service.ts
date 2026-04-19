import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@/common/utils/app-error';
import { IAuthRepository } from './auth.repository';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { Logger } from 'winston';
export class AuthService {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly logger: Logger,
   ) { }

   async register(body: SignUpDto) {
      const { name, email, password, confirmPassword } = body;

      if (password !== confirmPassword) {
         throw new UnauthorizedException("Passwords do not match");
      }

      const existingUser = await this.authRepository.findUserByEmail(email);

      if (existingUser) {
         throw new UnauthorizedException("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.authRepository.createUser({
         name,
         email,
         password: hashedPassword,
      });

      return newUser;
   }

   async login(body: SignInDto) {
      const { email, password } = body;

      const user = await this.authRepository.findUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
         throw new UnauthorizedException("Invalid email or password");
      }

      return this.authRepository.updateLastLogin(user.id, new Date());
   }
}



