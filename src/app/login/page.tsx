"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { supabase } from "../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
    setIsLoading(false);
  }
  return (
    <div className="flex items-center justify-center h-dvh">
      <Card className="w-full max-w-md">
        {/* card header component */}
        <CardHeader>
          <CardTitle>CRM Login</CardTitle>
          <CardDescription>Login To Your Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="email"
              type="email"
              disabled={isLoading}
            />
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="password"
              type="password"
              disabled={isLoading}
            />
            {error && <p className="text-red-400">Invalid Credentials</p>}
            <Button className="w-full" type="submit">
              {isLoading ? "Logging..." : "login in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
