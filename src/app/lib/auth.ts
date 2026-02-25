import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/email";
import { envVars } from "../../config/config";

export const auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      // callbackUrl: envVars.REDIRECT_URL,
      mapProfileToUser: () => {
        return {
          role: UserRole.PATIENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: false,
          isDeleted: false,
          deletedAt: null,
        };
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user && !user.emailVerified) {
            sendEmail({
              to: email,
              subject: "Verify you email",
              templateName: "otp",
              templateDate: {
                name: user.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Reset password",
              templateName: "otp",
              templateDate: {
                name: user.name,
                otp,
              },
            });
          }
        }
      },
      expiresIn: 2 * 60, // 2 minute in second
      otpLength: 6,
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 60 * 24, // 1 days
    updateAge: 60 * 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 60 * 24,
    },
  },

  // configuration for social login
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/",
        },
      },
    },
    sessionToken: {
      attributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        path: "/",
      },
    },
  },
});
