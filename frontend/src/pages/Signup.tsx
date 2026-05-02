import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";

import { api } from "../lib/api";

const signupSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function Signup() {
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (values: SignupFormValues) => {
        setServerError(null);
        try {
            await api.post("/auth/signup", values);
            navigate("/login");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                setServerError("An account with this email already exists.");
            } else {
                setServerError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign up</h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("password")}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {serverError && (
                        <p className="text-red-600 text-sm">{serverError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {isSubmitting ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;