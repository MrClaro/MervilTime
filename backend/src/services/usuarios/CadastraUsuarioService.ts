import { PrismaClient, EmployeeRole, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import createError from "http-errors";

const prisma = new PrismaClient();

class CadastraUsuarioService {
  async registerUser(
    name: string,
    username: string,
    password: string,
    role?: string,
  ) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw createError(
          409,
          "O nome de usuário fornecido já está em uso. Por favor, escolha outro.",
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let parsedRole: EmployeeRole = EmployeeRole.EMPLOYEE; // Default role

      if (role) {
        const upperRole = role.toUpperCase();
        if (Object.values(EmployeeRole).includes(upperRole as EmployeeRole)) {
          parsedRole = upperRole as EmployeeRole;
        } else {
          throw createError(400, "Role inválida.");
        }
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          password: hashedPassword,
          role: parsedRole,
        },
      });

      return newUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw createError(500, "Erro ao acessar o banco de dados.");
      } else if (error instanceof createError.HttpError) {
        //Re-throw http erros
        throw error;
      } else {
        throw createError(500, "Erro interno do servidor.");
      }
    }
  }
}

export const cadastraUsuarioService = new CadastraUsuarioService();
