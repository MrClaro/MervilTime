import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class CadastraUsuarioService {
  // Método para registrar um novo usuário
  async registerUser(name: string, username: string, password: string) {
    // Verificar se o username já existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("Username já existe!");
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo usuário no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    return newUser;
  }
}

export const cadastraUsuarioService = new CadastraUsuarioService();
