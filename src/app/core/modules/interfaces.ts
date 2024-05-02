export interface ProfileTable {
  id: string;
  name: string;
  observation: string;
  chartPaths: boolean;
}

export interface DashboardTable {
  id: string;
  name: string;
  pgTableName: string;
  sql: string;
  chartPath: any;
}

export interface Form {
  fullusername: null;
  username: null;
  password: null;
  email: null;
  occupation: null;
  access_levels: null;
}

export interface UserData {
  id: number;
  fullUserName: string;
  userName: string;
  password: string;
  email: string;
  cargo: string;
  roles: string | undefined;
  perfis: any;
}

export interface Roles {
  id: string;
  name: string;
}
