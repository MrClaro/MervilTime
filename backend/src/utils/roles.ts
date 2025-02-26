export const Roles = {
  MANAGER: "MANAGER",
  LEADER: "LEADER",
  IT_BOY: "IT_BOY",
  EMPLOYEE: "EMPLOYEE",
};

export const Permissions = {
  CADASTRO_USUARIO: [Roles.MANAGER, Roles.LEADER, Roles.IT_BOY],
  ATUALIZAR_USUARIO: [Roles.MANAGER, Roles.LEADER, Roles.IT_BOY],
  // ... outras permissões ...
};

export type PermissionKeys = keyof typeof Permissions;
