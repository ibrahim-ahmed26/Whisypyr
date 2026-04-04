import { prisma } from "@/app/lib/prisma";
const createProfile = async () => {
  await prisma.profile.createMany({
    data: [
      {
        email: "john.doe@gmail.com",
        name: "John Doe",
        role: "AGENT",
      },
      {
        email: "jane.doe@gmail.com",
        name: "Jane Doe",
        role: "AGENT",
        password: "agent@123",
      },
      {
        email: "joe.doe@gmail.com",
        name: "Joe Doe",
        role: "AGENT",
      },
      {
        email: "lor@gmail.com",
        name: "Lor Doe",
        role: "AGENT",
      },
    ],
  });
};
createProfile().catch((err) => err.message);
createProfile();
