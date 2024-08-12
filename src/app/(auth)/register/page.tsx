"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register as registerUser } from "@/lib/pocketbase";

interface RegisterFormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormInputs>();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await registerUser(data.email, data.password, data.passwordConfirm);
      router.push("/login");
    } catch (e) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="passwordConfirm" className="block mb-1">
            Confirm Password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            {...register("passwordConfirm", {
              required: "Please confirm your password",
              validate: (val: string) => {
                if (watch("password") != val) {
                  return "Your passwords do not match";
                }
              },
            })}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
