import { _IRole, _IPermission, _IAccountRole, _IRolePermission } from "./_db";
import { observable, runInAction } from "mobx";
import { select } from "../kit/req";

export interface IRole extends _IRole {}

export interface IPermission extends _IPermission {}

export interface IAccountRole extends _IAccountRole {}

export interface IRolePermission extends _IRolePermission {}

export class Role implements IRole {
  @observable id: number = 0;
  @observable name: string = "";
  @observable createAt: number = 0;

  static from(i: IRole) {
    const instance = new Role();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<Role[]> {
    const roles = await select<IRole>(
      "/select/manager",
      `
        select * from role
      `
    );
    return observable(roles.map(Role.from));
  }
}

export class Permission implements IPermission {
  @observable id: number = 0;
  @observable actionKey: string = "";
  @observable controller: string = "";
  @observable remark?: string | undefined;

  static from(i: IPermission) {
    const instance = new Permission();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<Permission[]> {
    const permissions = await select<IPermission>(
      "/select/manager",
      `
        select * from permission
      `
    );
    return observable(permissions.map(Permission.from));
  }
}

export class AccountRole implements IAccountRole {
  @observable accountId: number = 0;
  @observable roleId: number = 0;

  static from(i: IAccountRole) {
    const instance = new AccountRole();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<AccountRole[]> {
    const accountRoles = await select<IAccountRole>(
      "/select/manager",
      `
        select * from account_role
      `
    );
    return observable(accountRoles.map(AccountRole.from));
  }
}

export class RolePermission implements IRolePermission {
  @observable roleId: number = 0;
  @observable permissionId: number = 0;

  static from(i: IRolePermission) {
    const instance = new RolePermission();
    runInAction(() => Object.assign(instance, i));
    return instance;
  }

  static async fetch(): Promise<RolePermission[]> {
    const rolePermissions = await select<IRolePermission>(
      "/select/manager",
      `
        select * from role_permission
      `
    );
    return observable(rolePermissions.map(RolePermission.from));
  }
}
