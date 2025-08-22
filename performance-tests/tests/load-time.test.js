import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { endpointHelper } from '../helpers/endpoints.js';
import { CUSTOM_METRICS } from '../utils/variaveis.js';

// Métrica personalizada para conformidade de tempo de carregamento
const loadTimeCompliance = new Rate(CUSTOM_METRICS.LOAD_TIME_COMPLIANCE);

export const options = {
  stages: [
    { duration: '1m', target: 3 }, // Ramp up to 5 users over 1 minute
    { duration: '2m', target: 3 }, // Stay at 5 users for 3 minutes
    { duration: '0s', target: 0 },  // Ramp down to 0 users over 1 minute
  ],
  thresholds: {
    'load_time_compliance': ['rate>0.95'], // 95% of requests must load within 2 seconds
    'http_req_duration': ['p(95)<2000'],  // 95% of requests must complete below 2 seconds
    'http_req_failed': ['rate<0.01'],     // Error rate must be less than 1%
  },
};

export default function () {
  // Teste de tempo de carregamento dos endpoints principais
  const healthResult = endpointHelper.testHealthEndpoint();
  const docsResult = endpointHelper.testDocsEndpoint();
  const authResult = endpointHelper.testUsersEndpoint(); // Usando users como proxy para auth

  // Verificar conformidade com tempo de carregamento (2 segundos)
  const isHealthCompliant = healthResult.responseTime < 2000;
  const isDocsCompliant = docsResult.responseTime < 2000;
  const isAuthCompliant = authResult.responseTime < 2000;

  loadTimeCompliance.add(isHealthCompliant);
  loadTimeCompliance.add(isDocsCompliant);
  loadTimeCompliance.add(isAuthCompliant);

  // Verificações específicas para cada endpoint
  check(healthResult, {
    'health endpoint available': (r) => r.available,
    'health response time < 2s': (r) => r.responseTime < 2000,
    'health response time < 300ms': (r) => r.responseTime < 300,
  });

  check(docsResult, {
    'docs endpoint available': (r) => r.available,
    'docs response time < 2s': (r) => r.responseTime < 2000,
    'docs response time < 300ms': (r) => r.responseTime < 300,
  });

  check(authResult, {
    'auth endpoint available': (r) => r.available,
    'auth response time < 2s': (r) => r.responseTime < 2000,
    'auth response time < 300ms': (r) => r.responseTime < 300,
  });

  sleep(1);
}
