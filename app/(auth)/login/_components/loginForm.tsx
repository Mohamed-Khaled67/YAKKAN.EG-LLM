// "use client";

// import { useState, useTransition } from "react";
// import Link from "next/link";

// import {
//   Eye,
//   EyeOff,
//   Loader,
//   Loader2,
//   Lock,
//   Mail,
//   Send,
// } from "lucide-react";

// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// export function LoginForm(){
//  const router = useRouter();
//     const [showPassword, setShowPassword] = useState(false);
//   const [GooglePending, startGoogleTransition] = useTransition();
//   const [FacebookPending, startFacebookTransition] = useTransition();
//   const [EmailTeansition, startEmailTransition] = useTransition();
//   const[email,setEmail]=useState("");
//   async function SignInWithGoogle() {
//     startGoogleTransition(async()=>{
//      await authClient.signIn.social({
//       provider:"google",
//       callbackURL:"/",
//       fetchOptions:{
//         onSuccess:()=>{
//           toast.success('sign in success')
//         },
//         onError:(error)=>{
//            toast.error(error.error.message);
//         },
//       },
//     });
//     });
//   }

//    async function SignInWithFacebook() {
//     startFacebookTransition(async()=>{
//      await authClient.signIn.social({
//       provider:"facebook",
//       callbackURL:"/",
//       fetchOptions:{
//         onSuccess:()=>{
//           toast.success('sign in success')
//         },
//         onError:(error)=>{
//            toast.error(error.error.message);
//         },
//       },
//     });
//     });
//   }
//   function  SignInWithEmail( ) {
//     startEmailTransition(async()=>{
//      await authClient.emailOtp.sendVerificationOtp({
//      email:email,
//      type:'sign-in',
//      fetchOptions:{
//      onSuccess:()=>{
//       toast.success('email send')
//        router.push(`/verify-request?email=${email}`);
//      },
//      onError:()=>{
//     toast.error('error sending email')
//      }
//      },
//     });
//     });
//   }


// return(
//      <div className="relative w-full">
    
//       {/* Background Glow */}
//       <div
//         className="
//           pointer-events-none
//           absolute
//           -top-24
//           left-1/2
//           size-56
//           -translate-x-1/2
//           rounded-full
//           bg-primary/15
//           blur-[80px]
//         "
//       />

//       {/* Login Card */}
//       <div
//         className="
//           relative
//           rounded-3xl
//           border
//           border-border/50
//           bg-background/75
//           p-5
//           shadow-2xl
//           backdrop-blur-2xl
//           sm:p-6
//         "
//       >

//         {/* Top Gradient */}
//         <div
//           className="
//             absolute
//             left-0
//             top-0
//             h-1
//             w-full
//             rounded-t-3xl
//             bg-gradient-to-r
//             from-transparent
//             via-primary
//             to-transparent
//           "
//         />

//         {/* Header */}
//         <div className="mb-4 text-center">

//           {/* Logo */}
//           <div
//             className="
//               mx-auto
//               mb-2.5
//               flex
//               size-12
//               items-center
//               justify-center
//               rounded-full
//               bg-background
//               p-1
//               shadow-lg
//               ring-1
//               ring-border
//             "
//           >
//             <img
//               src="/myLogo.png"
//               alt="YAKKAN EG"
//               className="size-full rounded-full object-cover"
//             />
//           </div>

//           <h1 className="text-2xl font-bold tracking-tight">
//             مرحبًا بعودتك
//           </h1>

//           <p className="mt-1 text-xs text-muted-foreground">
//             سجّل الدخول إلى حسابك في{" "}
//             <span className="font-semibold text-foreground">
//               YAKKAN EG
//             </span>
//           </p>

//         </div>

//         {/* Social Login */}
//         <div className="grid grid-cols-2 gap-2">

//           <Button
//             type="button"
//             variant="outline"
//             onClick={SignInWithGoogle}
//             disabled={GooglePending}
//             className="
//               h-9
//               gap-2
//               text-sm
//               transition-all
//               hover:-translate-y-0.5
//               hover:shadow-md
//             "
//           >
//           {GooglePending ? (
//           <>
//           <Loader className="size-4 animate-spin"/>
//           <span>Loading...</span>
//           </>
//           ):(
//             <>
//               <FcGoogle className="size-4" />
//             Google
        
//             </>
//           )}
//           </Button>

//           <Button
//             type="button"
//             variant="outline"
//             onClick={SignInWithFacebook}
//              disabled={FacebookPending}
//             className="
//               h-9
//               gap-2
//               text-sm
//               transition-all
//               hover:-translate-y-0.5
//               hover:shadow-md
//             "
//           >
//             {FacebookPending ? (
//           <>
//           <Loader className="size-4 animate-spin"/>
//           <span>Loading...</span>
//           </>
//           ):(
//             <>
//              <FaFacebook className="size-4 text-[#1877F2]" />
//             Facebook
//             </>
//           )}
//           </Button>

//         </div>

//         {/* Divider */}
//         <div className="relative my-4">

//           <div className="absolute inset-0 flex items-center">
//             <span className="w-full border-t border-border/60" />
//           </div>

//           <div className="relative flex justify-center">
//             <span
//               className="
//                 bg-background
//                 px-3
//                 text-[11px]
//                 text-muted-foreground
//               "
//             >
//               أو المتابعة بالبريد الإلكتروني
//             </span>
//           </div>

//         </div>

//         {/* Form */}
//         <form className="space-y-3.5">

//           {/* Email */}
//           <div className="space-y-1">

//             <Label
//               htmlFor="email"
//               className="text-sm"
//             >
//               البريد الإلكتروني
//             </Label>

//             <div className="relative">

//               <Mail
//                 className="
//                   absolute
//                   right-3
//                   top-1/2
//                   size-4
//                   -translate-y-1/2
//                   text-muted-foreground
//                 "
//               />

//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e)=>setEmail(e.target.value)}
//                 required
//                 placeholder="أدخل بريدك الإلكتروني"
//                 className="h-9 pr-10 text-right text-sm"
//                 dir="rtl"
//               />

//             </div>

//           </div>

         

//           {/* Login Button */}
//           <Button
//             type="submit"
//             onClick={SignInWithEmail}
//             disabled={EmailTeansition}
//             className="
//               h-10
//               w-full
//               font-semibold
//               shadow-md
//               transition-all
//               hover:-translate-y-0.5
//               hover:shadow-lg
//             "
//           >
//                {EmailTeansition ? (
//           <>
//           <Loader2 className="size-4 animate-spin"/>
//           <span>Loading...</span>
//           </>
//           ):(
//              <>
//              <Send className="size-4"/>
//              <span>تسجيل الدخول</span>
//              </>
//           )}
           
//           </Button>

//         </form>

//         {/* Register */}
//         <p
//           className="
//             mt-4
//             text-center
//             text-xs
//             text-muted-foreground
//           "
//         >
//           ليس لديك حساب؟{" "}

//           <Link
//             href="/register"
//             className="
//               font-semibold
//               text-primary
//               hover:underline
//             "
//           >
//             إنشاء حساب جديد
//           </Link>
//         </p>

//         {/* Security */}
//         <div
//           className="
//             mt-3
//             flex
//             items-center
//             justify-center
//             gap-1.5
//             text-[10px]
//             text-muted-foreground
//           "
//         >
//           <Lock className="size-3" />

//           بياناتك محمية ومشفرة بأمان
//         </div>

//       </div>
//     </div>
    
// )
// }














"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Loader,
  Loader2,
  Lock,
  Mail,
  Send,
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// ============================================================
// LOGIN FORM
// ============================================================

export function LoginForm() {
  const router = useRouter();

  const [GooglePending, startGoogleTransition] =
    useTransition();

  const [EmailTransition, startEmailTransition] =
    useTransition();

  const [email, setEmail] = useState("");

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  async function SignInWithGoogle() {
    startGoogleTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/",

          fetchOptions: {
            onError: (error) => {
              console.error(
                "GOOGLE LOGIN ERROR:",
                error
              );

              toast.error(
                error.error?.message ||
                  "حدث خطأ أثناء تسجيل الدخول باستخدام Google"
              );
            },
          },
        });
      } catch (error) {
        console.error(
          "GOOGLE LOGIN ERROR:",
          error
        );

        toast.error(
          "حدث خطأ أثناء الاتصال بـ Google"
        );
      }
    });
  }

  // ==========================================================
  // EMAIL OTP LOGIN
  // ==========================================================

  function SignInWithEmail() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error(
        "من فضلك أدخل البريد الإلكتروني"
      );

      return;
    }

    startEmailTransition(async () => {
      try {
        await authClient.emailOtp.sendVerificationOtp({
          email: cleanEmail,

          type: "sign-in",

          fetchOptions: {
            onSuccess: () => {
              toast.success(
                "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
              );

              router.push(
                `/verify-request?email=${encodeURIComponent(
                  cleanEmail
                )}`
              );
            },

            onError: (error) => {
              console.error(
                "EMAIL OTP ERROR:",
                error
              );

              toast.error(
                error.error?.message ||
                  "حدث خطأ أثناء إرسال رمز التحقق"
              );
            },
          },
        });
      } catch (error) {
        console.error(
          "EMAIL OTP ERROR:",
          error
        );

        toast.error(
          "حدث خطأ غير متوقع أثناء إرسال رمز التحقق"
        );
      }
    });
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="relative w-full">
      {/* ================================================== */}
      {/* BACKGROUND GLOW */}
      {/* ================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-24
          left-1/2
          size-56
          -translate-x-1/2
          rounded-full
          bg-primary/15
          blur-[80px]
        "
      />

      {/* ================================================== */}
      {/* LOGIN CARD */}
      {/* ================================================== */}

      <div
        className="
          relative
          rounded-3xl
          border
          border-border/50
          bg-background/75
          p-5
          shadow-2xl
          backdrop-blur-2xl
          sm:p-6
        "
      >
        {/* ================================================== */}
        {/* TOP GRADIENT */}
        {/* ================================================== */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-full
            rounded-t-3xl
            bg-gradient-to-r
            from-transparent
            via-primary
            to-transparent
          "
        />

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-4 text-center">
          {/* Logo */}

          <div
            className="
              mx-auto
              mb-2.5
              flex
              size-12
              items-center
              justify-center
              rounded-full
              bg-background
              p-1
              shadow-lg
              ring-1
              ring-border
            "
          >
            <img
              src="/myLogo.png"
              alt="YAKKAN EG"
              className="
                size-full
                rounded-full
                object-cover
              "
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            مرحبًا بعودتك
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            سجّل الدخول إلى حسابك في{" "}
            <span className="font-semibold text-foreground">
              YAKKAN EG
            </span>
          </p>
        </div>

        {/* ================================================== */}
        {/* GOOGLE LOGIN */}
        {/* ================================================== */}

        <Button
          type="button"
          variant="outline"
          onClick={SignInWithGoogle}
          disabled={GooglePending}
          className="
            h-9
            w-full
            gap-2
            text-sm
            transition-all
            hover:-translate-y-0.5
            hover:shadow-md
          "
        >
          {GooglePending ? (
            <>
              <Loader className="size-4 animate-spin" />

              <span>جاري الاتصال...</span>
            </>
          ) : (
            <>
              <FcGoogle className="size-4" />

              <span>المتابعة باستخدام Google</span>
            </>
          )}
        </Button>

        {/* ================================================== */}
        {/* DIVIDER */}
        {/* ================================================== */}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>

          <div className="relative flex justify-center">
            <span
              className="
                bg-background
                px-3
                text-[11px]
                text-muted-foreground
              "
            >
              أو المتابعة بالبريد الإلكتروني
            </span>
          </div>
        </div>

        {/* ================================================== */}
        {/* EMAIL FORM */}
        {/* ================================================== */}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            SignInWithEmail();
          }}
          className="space-y-3.5"
        >
          {/* Email */}

          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-sm"
            >
              البريد الإلكتروني
            </Label>

            <div className="relative">
              <Mail
                className="
                  absolute
                  right-3
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                placeholder="أدخل بريدك الإلكتروني"
                disabled={EmailTransition}
                className="
                  h-9
                  pr-10
                  text-right
                  text-sm
                "
                dir="rtl"
              />
            </div>
          </div>

          {/* ================================================== */}
          {/* LOGIN BUTTON */}
          {/* ================================================== */}

          <Button
            type="submit"
            disabled={EmailTransition}
            className="
              h-10
              w-full
              font-semibold
              shadow-md
              transition-all
              hover:-translate-y-0.5
              hover:shadow-lg
            "
          >
            {EmailTransition ? (
              <>
                <Loader2 className="size-4 animate-spin" />

                <span>جاري إرسال الرمز...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />

                <span>تسجيل الدخول</span>
              </>
            )}
          </Button>
        </form>

        {/* ================================================== */}
        {/* REGISTER */}
        {/* ================================================== */}

        <p
          className="
            mt-4
            text-center
            text-xs
            text-muted-foreground
          "
        >
          ليس لديك حساب؟{" "}

          <Link
            href="/register"
            className="
              font-semibold
              text-primary
              hover:underline
            "
          >
            إنشاء حساب جديد
          </Link>
        </p>

        {/* ================================================== */}
        {/* SECURITY */}
        {/* ================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            justify-center
            gap-1.5
            text-[10px]
            text-muted-foreground
          "
        >
          <Lock className="size-3" />

          بياناتك محمية ومشفرة بأمان
        </div>
      </div>
    </div>
  );
}