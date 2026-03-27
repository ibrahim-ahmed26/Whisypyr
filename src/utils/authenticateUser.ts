import { prisma } from "@/app/lib/prisma";
import { getServerClient } from "@/app/lib/supabase/server";
import { Role } from "@/generated/prisma/enums";
export class AuthenticationError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "Authentication Error";
  }
}
export async function authenticateUser(allowedRoles: Role[]) {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // authenticate if no user
  if (!user) {
    throw new AuthenticationError("unauthorized access", 401);
  }
  const profile = await prisma.profile.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!profile) {
    throw new AuthenticationError("No user found", 404);
  }
  if (!profile.isActive) {
    throw new AuthenticationError("Profile is not active", 403);
  }
  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    throw new AuthenticationError("Unkown Role", 403);
  }
  return profile;
}
