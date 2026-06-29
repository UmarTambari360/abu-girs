"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { MapPin, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Incorrect email or password. Please try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full flex">
      {/* ── Left panel — brand / illustration ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background texture: subtle grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative location pins */}
        <div className="absolute top-24 right-16 w-3 h-3 rounded-full bg-green-400 opacity-60" />
        <div className="absolute top-40 right-32 w-2 h-2 rounded-full bg-green-300 opacity-40" />
        <div className="absolute bottom-48 left-24 w-4 h-4 rounded-full bg-green-400 opacity-50" />
        <div className="absolute bottom-64 right-24 w-2 h-2 rounded-full bg-green-200 opacity-30" />
        <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-green-300 opacity-40" />

        {/* Top: logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 rounded-xl">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl tracking-tight leading-none">
              GIRS
            </p>
            <p className="text-green-300 text-xs mt-0.5 leading-none">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Centre: tagline */}
        <div className="relative z-10 space-y-4">
          <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">
            Campus at your
            <br />
            <span className="text-green-300">fingertips.</span>
          </h1>
          <p className="text-green-200 text-base leading-relaxed max-w-sm">
            Manage locations, update campus data, and keep the map accurate for
            every student, visitor, and staff member at ABU Zaria.
          </p>
        </div>

        {/* Bottom: institution */}
        <div className="relative z-10">
          <p className="text-green-400 text-xs font-medium uppercase tracking-widest">
            Ahmadu Bello University
          </p>
          <p className="text-green-500 text-xs mt-0.5">Zaria, Nigeria</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-green-700 p-2.5 rounded-xl">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-bold text-lg tracking-tight leading-none">
                GIRS
              </p>
              <p className="text-green-600 text-xs mt-0.5">Admin Portal</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Enter your admin credentials to continue.
            </p>
          </div>

          {/* Server error banner */}
          {serverError !== null && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 mb-6">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="admin@abu.edu.ng"
                        className={cn(
                          "h-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                          "focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:border-green-600",
                          form.formState.errors.email &&
                            "border-red-400 focus-visible:ring-red-400",
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className={cn(
                            "h-11 pr-11 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400",
                            "focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:border-green-600",
                            form.formState.errors.password &&
                              "border-red-400 focus-visible:ring-red-400",
                          )}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 rounded"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-semibold text-sm tracking-wide transition-colors mt-2 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-gray-400">
            Access is restricted to authorised administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
