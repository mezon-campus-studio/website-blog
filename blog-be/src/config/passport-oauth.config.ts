import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Env } from './env.config';
import { AuthService } from '@/modules/auth/auth.service';
import { PrismaAuthRepository } from '@/modules/auth/prisma-auth.repository';
import prisma from '@/lib/prisma';

const authRepository = new PrismaAuthRepository(prisma);
const authService = new AuthService(authRepository);

// ============ Google OAuth Strategy ============
if (Env.GOOGLE_CLIENT_ID && Env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: Env.GOOGLE_CLIENT_ID,
        clientSecret: Env.GOOGLE_CLIENT_SECRET,
        callbackURL: Env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), false);
          }

          const user = await authService.oauthLogin({
            email,
            name: profile.displayName || email.split('@')[0],
            avatar_url: profile.photos?.[0]?.value,
            provider: 'GOOGLE',
            providerId: profile.id,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      },
    ),
  );
}

// ============ GitHub OAuth Strategy ============
if (Env.GITHUB_CLIENT_ID && Env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: Env.GITHUB_CLIENT_ID,
        clientSecret: Env.GITHUB_CLIENT_SECRET,
        callbackURL: Env.GITHUB_CALLBACK_URL,
        scope: ['user:email'],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: {
          id: string;
          displayName?: string;
          username?: string;
          emails?: Array<{ value: string }>;
          photos?: Array<{ value: string }>;
        },
        done: (error: Error | null, user?: Express.User | false) => void,
      ) => {
        try {
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.com`;

          const user = await authService.oauthLogin({
            email,
            name: profile.displayName || profile.username || 'GitHub User',
            avatar_url: profile.photos?.[0]?.value,
            provider: 'GITHUB',
            providerId: profile.id,
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, false);
        }
      },
    ),
  );
}

export default passport;
