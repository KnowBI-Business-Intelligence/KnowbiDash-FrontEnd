export interface Connections {
  id?: string;
  password?: string;
  service?: string;
  username?: string;
  connected?: boolean;
  isLoading?: boolean;
  isConnected: boolean;
  isBlocked?: boolean;
}
