import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";


export const Login: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your workspace"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          required
        />
        <Input
          label="Password"
          type="password"
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

        <Button className="w-full" size="lg">
          Sign in
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
