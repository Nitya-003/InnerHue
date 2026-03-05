"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/validation"; 
import { z } from "zod";
import { useState } from "react";

type SignupFormData = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      console.log("Submitting form:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake network delay
      alert("Validation Passed! Data ready for backend.");
    } catch (error) {
      setServerError("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Join InnerHue</h2>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-200">Full Name</label>
        <input
          {...register("name")}
          className="bg-black/20 border border-white/10 p-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Aditya Patra"
        />
        {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-200">Email</label>
        <input
          {...register("email")}
          className="bg-black/20 border border-white/10 p-3 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-200">Password</label>
        <input
          type="password"
          {...register("password")}
          className="bg-black/20 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-200">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          className="bg-black/20 border border-white/10 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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