import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { endpointHelper } from '../helpers/endpoints.js';
import { CUSTOM_METRICS } from '../utils/variaveis.js';

// Métrica personalizada para conformidade de tempo de resposta
const responseTimeCompliance = new Rate(CUSTOM_METRICS.RESPONSE_TIME_COMPLIANCE);

export const options = {
  stages: [
    { duration: '1m', target: 3 },  // Ramp up to 3 users over 1 minute
    { duration: '2m', target: 3 },  // Stay at 3 users for 2 minutes
    { duration: '1m', target: 0 },  // Ramp down to 0 users over 1 minute
  ],
  thresholds: {
    'response_time_compliance': ['rate>0.95'], // 95% of requests must respond within 300ms
    'http_req_duration': ['p(95)<300'],       // 95% of requests must complete below 300ms
    'http_req_duration': ['avg<300'],          // Average response time must be below 300ms
    'http_req_failed': ['rate<0.01'],         // Error rate must be less than 1%
  },
};

export default function () {
  // Teste de tempo de resposta de todos os endpoints
  const allResults = endpointHelper.testAllEndpoints();
  
  // Verificar conformidade com tempo de resposta (300ms)
  const isHealthCompliant = allResults.results.health.responseTime < 300;
  const isDocsCompliant = allResults.results.docs.responseTime < 300;
  const isUsersCompliant = allResults.results.users.responseTime < 300;
  const isAvailabilityCompliant = allResults.results.availability.responseTime < 300;
  const isAppointmentsCompliant = allResults.results.appointments.responseTime < 300;

  responseTimeCompliance.add(isHealthCompliant);
  responseTimeCompliance.add(isDocsCompliant);
  responseTimeCompliance.add(isUsersCompliant);
  responseTimeCompliance.add(isAvailabilityCompliant);
  responseTimeCompliance.add(isAppointmentsCompliant);

  // Verificações específicas para cada endpoint
  check(allResults.results.health, {
    'health endpoint available': (r) => r.available,
    'health response time < 300ms': (r) => r.responseTime < 300,
    'health response time < 200ms': (r) => r.responseTime < 200,
  });

  check(allResults.results.docs, {
    'docs endpoint available': (r) => r.available,
    'docs response time < 300ms': (r) => r.responseTime < 300,
    'docs response time < 200ms': (r) => r.responseTime < 200,
  });

  check(allResults.results.users, {
    'users endpoint available': (r) => r.available,
    'users response time < 300ms': (r) => r.responseTime < 300,
    'users response time < 200ms': (r) => r.responseTime < 200,
  });

  check(allResults.results.availability, {
    'availability endpoint available': (r) => r.available,
    'availability response time < 300ms': (r) => r.responseTime < 300,
    'availability response time < 200ms': (r) => r.responseTime < 200,
  });

  check(allResults.results.appointments, {
    'appointments endpoint available': (r) => r.available,
    'appointments response time < 300ms': (r) => r.responseTime < 300,
    'appointments response time < 200ms': (r) => r.responseTime < 200,
  });

  // Verificação do resumo geral
  check(allResults.summary, {
    'all endpoints tested': (s) => s.totalEndpoints === 5,
    'most endpoints available': (s) => s.availableEndpoints >= 3,
    'average response time reasonable': (s) => s.averageResponseTime < 1000,
  });

  sleep(0.5);
}
