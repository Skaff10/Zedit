import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const { user, isLoading, isError, isSuccess, message, login, reset } =
    useAuthStore();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    reset();
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
      email,
      password,
    };

    login(userData);
    console.log(userData);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-z-text-secondary cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-z-blue focus:ring-z-blue"
            />
            Remember me
          </label>
          <a href="#" className="text-z-blue hover:underline font-medium">
            Forgot password?
          </a>
        </div>

        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-z-text-secondary mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-z-blue hover:underline font-medium"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
