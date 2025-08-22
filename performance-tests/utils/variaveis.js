// Variáveis globais para os testes de performance
export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Headers padrão para as requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'User-Agent': 'Clinn-API-Performance-Test/1.0'
};

// Timeouts para diferentes tipos de teste
export const TIMEOUTS = {
  SHORT: 1000,    // 1 segundo
  MEDIUM: 5000,   // 5 segundos
  LONG: 10000     // 10 segundos
};

// Configurações de retry
export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY: 1000
};

// Métricas personalizadas
export const CUSTOM_METRICS = {
  LOAD_TIME_COMPLIANCE: 'load_time_compliance',
  RESPONSE_TIME_COMPLIANCE: 'response_time_compliance'
};

// Status codes esperados
export const EXPECTED_STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};
