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
  // TRUSTED ORIGINS
  // ============================================================

  trustedOrigins: [
    "http://localhost:3000",
    "https://yakkan-eg-llm-bpgr.vercel.app",
  ],

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

      subject: "YAKKAN-EG | رمز التحقق الخاص بك",

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
    background-color: #090a0d;
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
    background-color: #090a0d;
    padding: 18px 10px;
  "
>

<tr>
<td align="center">

<!-- CARD -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width: 480px;
    background-color: #15171c;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #292c33;
  "
>

<!-- RED TOP -->

<tr>
<td
  style="
    height: 3px;
    background-color: #C8102E;
    font-size: 0;
    line-height: 0;
  "
></td>
</tr>


<!-- HEADER -->

<tr>
<td
  align="center"
  style="
    padding: 22px 20px 12px;
  "
>

<!-- LOGO -->

<div
  style="
    width: 48px;
    height: 48px;
    margin: 0 auto 10px;
    border-radius: 13px;
    background-color: #0f1115;
    border: 1px solid #3a2027;
    text-align: center;
  "
>

<div
  style="
    width: 48px;
    height: 48px;
    line-height: 48px;
    color: #ffffff;
    font-size: 21px;
    font-weight: 900;
    font-family: Arial, Helvetica, sans-serif;
  "
>
Y
</div>

</div>


<!-- BRAND -->

<div
  style="
    margin-bottom: 4px;
    color: #e34a64;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
    direction: ltr;
  "
>
YAKKAN-EG
</div>


<!-- TITLE -->

<h1
  style="
    margin: 0;
    color: #f5f5f5;
    font-size: 20px;
    line-height: 1.4;
    font-weight: 800;
  "
>
تأكيد البريد الإلكتروني
</h1>


<!-- DESCRIPTION -->

<p
  style="
    margin: 6px 0 0;
    color: #8f959f;
    font-size: 12px;
    line-height: 1.7;
  "
>
استخدم رمز التحقق التالي لإكمال تسجيل الدخول
</p>

</td>
</tr>


<!-- OTP -->

<tr>
<td
  align="center"
  style="
    padding: 6px 20px 18px;
  "
>

<p
  style="
    margin: 0 0 8px;
    color: #8f959f;
    font-size: 11px;
  "
>
رمز التحقق الخاص بك
</p>


<div
  style="
    display: inline-block;
    padding: 14px 24px;
    min-width: 125px;
    border-radius: 13px;
    background-color: #211218;
    border: 1px solid #5c2633;
    letter-spacing: 7px;
    font-size: 27px;
    line-height: 1;
    font-weight: 900;
    color: #f04b66;
    direction: ltr;
  "
>
${otp}
</div>


<p
  style="
    margin: 10px 0 0;
    color: #686e78;
    font-size: 10px;
    line-height: 1.6;
  "
>
لا تشارك هذا الرمز مع أي شخص
</p>

</td>
</tr>


<!-- DIVIDER -->

<tr>
<td
  style="
    padding: 0 20px;
  "
>

<div
  style="
    height: 1px;
    background-color: #292c33;
  "
></div>

</td>
</tr>


<!-- SECURITY -->

<tr>
<td
  align="center"
  style="
    padding: 13px 20px;
  "
>

<span
  style="
    color: #4ade80;
    font-size: 11px;
  "
>
🔒
</span>

<span
  style="
    color: #777d87;
    font-size: 10px;
  "
>
بريد آمن من
</span>

<strong
  style="
    color: #c9cdd3;
    font-size: 10px;
  "
>
YAKKAN-EG
</strong>

</td>
</tr>


<!-- FOOTER -->

<tr>
<td
  align="center"
  style="
    padding: 11px 20px 14px;
    background-color: #111318;
    border-top: 1px solid #24272e;
  "
>

<div
  style="
    color: #e34a64;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1px;
    direction: ltr;
  "
>
YAKKAN-EG
</div>

<p
  style="
    margin: 4px 0 0;
    color: #646a73;
    font-size: 9px;
  "
>
© ${new Date().getFullYear()} YAKKAN-EG
</p>

</td>
</tr>

</table>


<!-- OUTSIDE TEXT -->

<p
  style="
    max-width: 430px;
    margin: 9px auto 0;
    color: #4f555e;
    font-size: 9px;
    line-height: 1.5;
    text-align: center;
  "
>
إذا لم تطلب تسجيل الدخول إلى YAKKAN-EG، يمكنك تجاهل هذا البريد.
</p>


</td>
</tr>

</table>

</body>
</html>
      `,
    });
  },
}),

    // ==========================================================
    // ADMIN
    // ==========================================================

    admin(),
  ],
})