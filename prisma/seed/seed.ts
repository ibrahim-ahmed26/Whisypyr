import { prisma } from "@/app/lib/prisma";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
const createProfile = async () => {
  const { data: user } = await supabaseAdmin.auth.admin.createUser({
    email: "ibrahim@gmail.com",
    password: "admin@123",
    email_confirm: true,
  });
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      id: user.user?.id,
      email: "ibrahim@gmail.com",
      name: "ibrahim",
      role: "ADMIN",
    },
  });
};
createProfile().catch((err) => err.message);
createProfile();
