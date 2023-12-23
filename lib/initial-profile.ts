import { auth, redirectToSignIn } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";

export default async function initialProfile() {
  const { userId } = auth();

  if (!userId) return redirectToSignIn();

  const profile = await prisma.profile.findFirst({
    where: {
      userId,
    },
  });

  if (!profile) return null;

  return profile;
}
