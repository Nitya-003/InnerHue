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
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Update the user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: data.name
      });

      toast.dismiss(toastId);
      toast.success("Account Created!", {
        description: "Welcome to InnerHue.",
      });
      
      router.push("/");
    } catch (error: any) {
      toast.dismiss(toastId);
      setServerError(error.message || "Something went wrong.");
      toast.error("Signup failed", {
        description: error.message || "Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-card/85 dark:bg-white/10 backdrop-blur-md p-8 rounded-xl border border-border dark:border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4 text-center">Join InnerHue</h2>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80 dark:text-white/80">Full Name</label>
        <input
          {...register("name")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Aditya Patra"
        />
        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80 dark:text-white/80">Email</label>
        <input
          {...register("email")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80 dark:text-white/80">Password</label>
        <input
          type="password"
          {...register("password")}
          className="bg-background/80 dark:bg-black/20 border border-border dark:border-white/10 p-3 rounded-lg text-foreground dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80 dark:text-white/80">Confirm Password</label>
        <input
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