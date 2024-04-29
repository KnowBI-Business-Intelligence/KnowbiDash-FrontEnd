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
