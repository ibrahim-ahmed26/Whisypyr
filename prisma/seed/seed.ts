import { prisma } from "@/app/lib/prisma";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
const main = async () => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "ibrahim@gmail.com",
    password: "admin123",
    email_confirm: true,
  });
  if (error) {
    console.error(error.message);
  }
  return data;
};
const createProfile = async () => {
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      email: "ibrahim@gmail.com",
      name: "ibrahim",
      role: "ADMIN",
    },
  });
};
createProfile().catch((err) => err.message);
main();
createProfile();
