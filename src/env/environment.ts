const globalUrlMainAPI = 'http://localhost:8080';
const globalUrlBOT = 'ws://localhost:8000';

// Variáveis de serviço do bot
export const API_CHAT = `${globalUrlBOT}/koios/ws`;

// Variáveis de serviço do banco tasy
export const API_ORACLE_DATABASE = `${globalUrlMainAPI}/config/oracle`;

// Variável para execução do SQL
export const API_ECXECUTE_SQL = `${globalUrlMainAPI}/script/execute-sql`;

// Variável para criação de gráficos e grupos de gráficos
export const API_CHARTS = `${globalUrlMainAPI}/api/charts`;
export const API_CARDS = `${globalUrlMainAPI}/api/cards`;
export const API_TABLES = `${globalUrlMainAPI}/api/tabledata`;
export const API_WORKSPACE = `${globalUrlMainAPI}/api/workspace`;
export const API_CHARTGROUP = `${globalUrlMainAPI}/api/chartgroup`;
export const API_CHARTPATH = `${globalUrlMainAPI}/api/chartpath`;

// Variável para criação de gráficos e grupos de gráficos
export const API_PROFILES = `${globalUrlMainAPI}/api/profiles`;

// Variáveis de manipulação do usuário
export const AUTH_API = `${globalUrlMainAPI}/api/auth`;
export const TEST_API = `${globalUrlMainAPI}/api/test`;
export const USERS_API = `${globalUrlMainAPI}/api/users`;

// Variáveis
export const FILTER_API = `${globalUrlMainAPI}/api/get/filterdate`;
export const ATENDIMENTO_API = `${globalUrlMainAPI}/api/get/atendimentopaciente`;
