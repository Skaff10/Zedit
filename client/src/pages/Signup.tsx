import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message, register, reset } =
    useAuthStore();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      navigate("/");
    }

    // Only reset when there's an error or success to prevent infinite loops
    if (isError || isSuccess) {
      const timer = setTimeout(() => reset(), 100);
      return () => clearTimeout(timer);
    }
  }, [user, isError, isSuccess, message, navigate, reset]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };

    register(userData);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your 30-day free trial"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {message}
          </div>
        )}
        <Input
          label="Full Name"
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="name@company.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="••••••••"
          required
        />

        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-z-text-secondary mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-z-blue hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
