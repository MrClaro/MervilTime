import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

class UsuarioService {
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

  // Método para atualizar informações do usuário
  async updateUser(userId: number, data: { name?: string; username?: string }) {
    // Atualiza as informações do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;
  }

  // Outros métodos para login, deletar usuário, etc.
}

export const usuarioService = new UsuarioService();
