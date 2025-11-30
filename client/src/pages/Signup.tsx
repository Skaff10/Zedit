import React from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export const Signup: React.FC = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your 30-day free trial"
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Full Name" type="text" placeholder="John Doe" required />
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

        <Button className="w-full" size="lg">
          Create account
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
