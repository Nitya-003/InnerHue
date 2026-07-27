"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/validation"; 
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

type SignupFormData = z.infer<typeof SignupSchema>;
  function getFriendlyErrorMessage(error: unknown): string {
      const code = (error as { code?: string })?.code

      switch (code) {
          case "auth/email-already-in-use":
              return "This email is already registered. Try logging in instead."
          case "auth/weak-password":
              return "Password should be at least 6 characters."
          case "auth/invalid-email":
              return "Please enter a valid email address."
          case "auth/network-request-failed":
              return "Network error. Please check your connection and try again."
          default:
              return "Something went wrong. Please try again."
      }
  }

export default function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    const toastId = toast.loading("Creating account...");
    let userCredential;
    try {
        userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
        );
    } catch (error: unknown) {
        const message = getFriendlyErrorMessage(error);
        toast.dismiss(toastId);
        setServerError(message) ;
        toast.error("Signup failed", {
            description: message,
        });
        return ;// stop here — don't try updateProfile if account creation failed
    }
    try {
        await updateProfile(userCredential.user, {
            displayName: data.name,
        });
    } catch (profileError) {
        console.error("Failed to set display name:", profileError) ;
    }

    toast.dismiss(toastId);
    toast.success("Account Created!", {
      description: "Welcome to InnerHue.",
    });
     router.push("/");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-card/85 dark:bg-white/10 backdrop-blur-md p-8 rounded-xl border border-border dark:border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4 text-center">Join InnerHue</h2>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground/80 dark:text-white/80">Full Name</label>
        <input
         id="name"
          {...register("name")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Aditya Patra"
        />
        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground/80 dark:text-white/80">Email</label>
        <input
        id="email"
        type="email"
          {...register("email")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground/80 dark:text-white/80">Password</label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground/80 dark:text-white/80">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
      </div>

      {serverError && <p className="text-red-400 text-sm text-center">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
      >
        {isSubmitting ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}