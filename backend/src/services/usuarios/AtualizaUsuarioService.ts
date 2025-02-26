import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AtualizaUsuarioService {
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

export const atualizaUsuarioService = new AtualizaUsuarioService();
