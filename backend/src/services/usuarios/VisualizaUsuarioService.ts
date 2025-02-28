import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class VisualizaUsuarioService {
  // Método para visualizar todos os usuários
  async getUsers() {
    const users = await prisma.user.findMany();
    return users;
  }

  // Método para visualizar um usuário pelo seu id
  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  }
}

export const visualizaUsuarioService = new VisualizaUsuarioService();
