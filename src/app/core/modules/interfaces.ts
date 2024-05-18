export interface ProfileTable {
  id: string;
  name: string;
  observation: string;
  chartPaths: boolean;
}

export interface PathTable {
  id: string;
  name: string;
  observation: string;
  chartPaths: any;
  chartGroups: any;
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

export interface Path {
  id: string;
  name: string;
  checked: boolean;
}

export interface Axis {
  name: string;
  type: string;
  identifier: string;
  value: string;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface TableRow {
  [key: string]: any;
}

export interface ChartData {
  id: string;
  title: string;
  graphType: string;
  xAxisColumns: any[];
  yAxisColumns: any[];
  filters: any[];
}
