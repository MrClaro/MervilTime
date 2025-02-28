import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

class AtualizaUsuarioService {
  async updateUser(
    id: number,
    data: { name?: string; username?: string; password?: string },
  ) {
    // Criptografa a senha se ela for fornecida
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data,
    });

    return updatedUser;
  }
}

export const atualizaUsuarioService = new AtualizaUsuarioService();
