import { apiFetch } from "@/lib/api-client";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
};

export async function signup(input: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchMe(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
