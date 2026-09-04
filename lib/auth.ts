
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"

import {
  emailOTP,
  admin,
} from "better-auth/plugins"

import { prisma } from "./db"
import { env } from "./env"
import { resend } from "./resend"

export const auth = betterAuth({
  // ============================================================
  // DATABASE
  // ============================================================

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ============================================================
  // SOCIAL PROVIDERS
  // ============================================================

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },

    facebook: {
      clientId: env.AUTH_FACEBOOK_CLIENT_ID,
      clientSecret: env.AUTH_FACEBOOK_SECRET,

      scopes: [
        "email",
        "public_profile",
      ],
    },
  },

  // ============================================================
  // PLUGINS
  // ============================================================

  plugins: [
    // ==========================================================
    // EMAIL OTP
    // ==========================================================

    emailOTP({
      async sendVerificationOTP({
        email,
        otp,
      }) {
        await resend.emails.send({
          from: "YAKKAN-EG <onboarding@resend.dev>",

          to: [email],

          subject:
            "YAKKAN-EG | رمز التحقق الخاص بك",

          html: `
<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>رمز التحقق - YAKKAN-EG</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
    direction: rtl;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #f4f6f8;
      padding: 40px 15px;
    "
  >

    <tr>
      <td align="center">

        <!-- Main Card -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          "
        >

          <!-- Top Gradient -->

          <tr>
            <td
              style="
                height: 5px;
                background: linear-gradient(
                  90deg,
                  #6366f1,
                  #8b5cf6,
                  #ec4899
                );
                font-size: 0;
                line-height: 0;
              "
            ></td>
          </tr>

          <!-- Header -->

          <tr>
            <td
              align="center"
              style="
                padding: 35px 30px 20px;
              "
            >

              <!-- Logo -->

              <div
                style="
                  width: 70px;
                  height: 70px;
                  margin: 0 auto 18px;
                  border-radius: 50%;
                  background: linear-gradient(
                    135deg,
                    #6366f1 0%,
                    #7c3aed 50%,
                    #ec4899 100%
                  );
                  box-shadow:
                    0 10px 30px rgba(99,102,241,0.28),
                    inset 0 1px 0 rgba(255,255,255,0.35);
                  text-align: center;
                "
              >

                <div
                  style="
                    width: 70px;
                    height: 70px;
                    line-height: 70px;
                    color: #ffffff;
                    font-size: 34px;
                    font-weight: 800;
                    font-family: Arial, Helvetica, sans-serif;
                    letter-spacing: -2px;
                  "
                >
                  Y
                </div>

              </div>

              <!-- Brand -->

              <div
                style="
                  margin-bottom: 8px;
                  color: #6366f1;
                  font-size: 12px;
                  font-weight: 800;
                  letter-spacing: 2px;
                  direction: ltr;
                "
              >
                YAKKAN-EG
              </div>

              <!-- Title -->

              <h1
                style="
                  margin: 0;
                  color: #111827;
                  font-size: 26px;
                  line-height: 1.4;
                  font-weight: 700;
                "
              >
                تأكيد البريد الإلكتروني
              </h1>

              <!-- Description -->

              <p
                style="
                  margin: 10px 0 0;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.8;
                "
              >

                مرحبًا بك في

                <strong style="color: #111827;">
                  YAKKAN-EG
                </strong>

                <br />

                استخدم رمز التحقق التالي لإكمال تسجيل الدخول.

              </p>

            </td>
          </tr>

          <!-- OTP -->

          <tr>
            <td
              align="center"
              style="
                padding: 10px 30px 25px;
              "
            >

              <p
                style="
                  margin: 0 0 12px;
                  color: #6b7280;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                رمز التحقق الخاص بك
              </p>

              <div
                style="
                  display: inline-block;
                  padding: 18px 30px;
                  border-radius: 16px;
                  background: linear-gradient(
                    135deg,
                    #f5f3ff,
                    #faf5ff
                  );
                  border: 1px solid #ddd6fe;
                  box-shadow: 0 8px 25px rgba(99,102,241,0.08);
                  letter-spacing: 10px;
                  font-size: 32px;
                  line-height: 1;
                  font-weight: 800;
                  color: #6366f1;
                  direction: ltr;
                "
              >
                ${otp}
              </div>

              <p
                style="
                  margin: 18px 0 0;
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 1.8;
                "
              >

                لا تشارك هذا الرمز مع أي شخص.

                <br />

                فريق YAKKAN-EG لن يطلب منك رمز التحقق.

              </p>

            </td>
          </tr>

          <!-- Divider -->

          <tr>
            <td
              style="
                padding: 0 30px;
              "
            >

              <div
                style="
                  height: 1px;
                  background-color: #eeeeee;
                "
              ></div>

            </td>
          </tr>

          <!-- Security -->

          <tr>
            <td
              align="center"
              style="
                padding: 25px 30px;
              "
            >

              <div
                style="
                  display: inline-block;
                  padding: 10px 15px;
                  border-radius: 12px;
                  background-color: #f9fafb;
                  border: 1px solid #f0f0f0;
                "
              >

                <span
                  style="
                    display: inline-block;
                    margin-left: 5px;
                    color: #16a34a;
                    font-size: 14px;
                    font-weight: bold;
                  "
                >
                  🔒
                </span>

                <span
                  style="
                    color: #6b7280;
                    font-size: 12px;
                  "
                >

                  هذا البريد تم إرساله بشكل آمن بواسطة

                  <strong style="color: #374151;">
                    YAKKAN-EG
                  </strong>

                </span>

              </div>

            </td>
          </tr>

          <!-- Footer -->

          <tr>
            <td
              align="center"
              style="
                padding: 22px 30px 30px;
                background-color: #fafafa;
                border-top: 1px solid #f0f0f0;
              "
            >

              <div
                style="
                  color: #6366f1;
                  font-size: 14px;
                  font-weight: 800;
                  letter-spacing: 1px;
                  direction: ltr;
                "
              >
                YAKKAN-EG
              </div>

              <p
                style="
                  margin: 7px 0 0;
                  color: #9ca3af;
                  font-size: 11px;
                  line-height: 1.8;
                "
              >

                منصة تعليمية تساعدك على التعلم والتطور.

                <br />

                © ${new Date().getFullYear()}
                YAKKAN-EG. All rights reserved.

              </p>

            </td>
          </tr>

        </table>

        <!-- Outside Footer -->

        <p
          style="
            max-width: 500px;
            margin: 18px auto 0;
            color: #9ca3af;
            font-size: 10px;
            line-height: 1.7;
            text-align: center;
          "
        >

          إذا لم تطلب تسجيل الدخول إلى YAKKAN-EG،

          <br />

          يمكنك تجاهل هذا البريد الإلكتروني بأمان.

        </p>

      </td>
    </tr>

  </table>

</body>
</html>
          `,
        })
      },
    }),

    // ==========================================================
    // ADMIN
    // ==========================================================

    admin(),
  ],
})