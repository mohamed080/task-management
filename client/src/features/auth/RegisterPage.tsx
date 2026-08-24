import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ApiError } from "../../api/http";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { AuthLayout } from "./AuthLayout";
import { registerSchema } from "./auth.schemas";
import { useAuth } from "./useAuth";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const validation = registerSchema.safeParse({ name, email, password });
    if (!validation.success) {
      setError(
        validation.error.issues[0]?.message ??
          "Check your details and try again.",
      );
      return;
    }
    setIsSubmitting(true);

    try {
      await register(validation.data);
      navigate("/tasks", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      description="Set up your workspace and turn the loose ends into a clear next step."
      eyebrow="Start fresh"
      title="Your work, gathered."
    >
      <form className="grid gap-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          label="Full name"
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
        <Input
          autoComplete="email"
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
        <div className="relative">
          <Input
            autoComplete="new-password"
            className="pr-20"
            label="Password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type={showPassword ? "text" : "password"}
            value={password}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-7.5 cursor-pointer flex size-10 items-center justify-center rounded-md p-0 text-slate-500 transition hover:text-slate-950"
            onClick={() => setShowPassword((visible) => !visible)}
            title={showPassword ? "Hide password" : "Show password"}
            type="button"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" size={18} />
            ) : (
              <Eye aria-hidden="true" size={18} />
            )}
          </button>
        </div>
        {error && (
          <p
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button
          className="mt-2 w-full bg-[#17231d] shadow-lg shadow-slate-900/10 hover:bg-emerald-950"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            className="font-bold text-emerald-800 hover:text-emerald-950"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
