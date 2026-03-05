// lib/validations.ts
import { z } from "zod";

// 1. Login Schema
export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// 2. Signup Schema
export const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // Point the error to the confirmPassword field
});

// 3. Mood Entry Schema (Bonus for your dashboard)
export const MoodEntrySchema = z.object({
  mood: z.string().min(1, { message: "Please select a mood." }),
  note: z.string().max(500, { message: "Note cannot exceed 500 characters." }).optional(),
});