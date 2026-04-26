import prisma from "@/lib/prisma"


export const findByIdUserService = async (id: string) => {
   return await prisma.user.findFirst({
      where: {
         id,
         isDeleted: false,
         isActive: true,
      }
   })
}