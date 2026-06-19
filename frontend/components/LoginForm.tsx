"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validation";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading("Logging in...");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      
      toast.dismiss(toastId);
      toast.success("Welcome back!", {
        description: "You have successfully logged in.",
      });
      
      router.push("/"); // Redirect to home/dashboard
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error("Login failed", {
        description: error.message || "Please check your email and password.",
      });
    
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full max-w-md bg-card/85 dark:bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-border dark:border-white/10 shadow-2xl ring-1 ring-border/40 dark:ring-white/5"
    >
      <div className="text-center mb-2">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
          Welcome Back
        </h2>
        <p className="text-muted-foreground text-sm mt-2">Enter your details to access your dashboard</p>
      </div>

      {/* Email Input Group */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground/80 dark:text-white/80 ml-1">Email Address</label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="bg-background/80 dark:bg-gray-900/50 border border-border dark:border-white/10 p-3.5 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-border/80 dark:hover:border-white/20"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-400 text-xs ml-1 font-medium">{errors.email.message}</p>}
      </div>

      {/* Password Input Group */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground/80 dark:text-white/80 ml-1">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className="bg-background/80 dark:bg-gray-900/50 border border-border dark:border-white/10 p-3.5 rounded-xl text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-200 hover:border-border/80 dark:hover:border-white/20"
          placeholder="••••••••"
        />
        {errors.password && <p className="text-red-400 text-xs ml-1 font-medium">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Logging in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Footer Link */}
      <div className="text-center mt-2">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-all"
          >
            Create one now
          </Link>
        </p>
      </div>
    </form>
  );
}