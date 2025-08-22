import { check } from 'k6';
import http from 'k6/http';
import { BASE_URL, DEFAULT_HEADERS, EXPECTED_STATUS_CODES } from '../utils/variaveis.js';

/**
 * Helper para gerenciar endpoints e realizar requisições
 */
export class EndpointHelper {
  constructor() {
    this.baseUrl = BASE_URL;
    this.headers = DEFAULT_HEADERS;
  }

  /**
   * Testa endpoint de saúde
   * @returns {Object} - Resultado do teste
   */
  testHealthEndpoint() {
    const response = http.get(`${this.baseUrl}/health`, {
      headers: this.headers,
      timeout: '5s'
    });

    const isAvailable = response.status === EXPECTED_STATUS_CODES.SUCCESS;

    const result = check(response, {
      'health status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'health response time < 2s': (r) => r.timings.duration < 2000,
      'health response time < 300ms': (r) => r.timings.duration < 300
    });

    return {
      success: result,
      responseTime: response.timings.duration,
      status: response.status,
      available: isAvailable
    };
  }

  /**
   * Testa endpoint de documentação da API
   * @returns {Object} - Resultado do teste
   */
  testDocsEndpoint() {
    const response = http.get(`${this.baseUrl}/api-docs`, {
      headers: this.headers,
      timeout: '10s'
    });

    const isAvailable = response.status === EXPECTED_STATUS_CODES.SUCCESS;

    const result = check(response, {
      'docs status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'docs response time < 2s': (r) => r.timings.duration < 2000,
      'docs response time < 300ms': (r) => r.timings.duration < 300
    });

    return {
      success: result,
      responseTime: response.timings.duration,
      status: response.status,
      available: isAvailable
    };
  }

  /**
   * Testa endpoint de usuários
   * @returns {Object} - Resultado do teste
   */
  testUsersEndpoint() {
    const response = http.get(`${this.baseUrl}/api/users`, {
      headers: this.headers,
      timeout: '5s'
    });

    const isAvailable = response.status === EXPECTED_STATUS_CODES.SUCCESS;

    const result = check(response, {
      'users status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'users response time < 300ms': (r) => r.timings.duration < 300,
      'users response time < 200ms': (r) => r.timings.duration < 200
    });

    return {
      success: result,
      responseTime: response.timings.duration,
      status: response.status,
      available: isAvailable
    };
  }

  /**
   * Testa endpoint de disponibilidade
   * @returns {Object} - Resultado do teste
   */
  testAvailabilityEndpoint() {
    const response = http.get(`${this.baseUrl}/api/availability`, {
      headers: this.headers,
      timeout: '5s'
    });

    const isAvailable = response.status === EXPECTED_STATUS_CODES.SUCCESS;

    const result = check(response, {
      'availability status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'availability response time < 300ms': (r) => r.timings.duration < 300,
      'availability response time < 200ms': (r) => r.timings.duration < 200
    });

    return {
      success: result,
      responseTime: response.timings.duration,
      status: response.status,
      available: isAvailable
    };
  }

  /**
   * Testa endpoint de agendamentos
   * @returns {Object} - Resultado do teste
   */
  testAppointmentsEndpoint() {
    const response = http.get(`${this.baseUrl}/api/appointments`, {
      headers: this.headers,
      timeout: '5s'
    });

    const isAvailable = response.status === EXPECTED_STATUS_CODES.SUCCESS;

    const result = check(response, {
      'appointments status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'appointments response time < 300ms': (r) => r.timings.duration < 300,
      'appointments response time < 200ms': (r) => r.timings.duration < 200
    });

    return {
      success: result,
      responseTime: response.timings.duration,
      status: response.status,
      available: isAvailable
    };
  }

  /**
   * Testa todos os endpoints principais
   * @returns {Object} - Resultados consolidados
   */
  testAllEndpoints() {
    const results = {
      health: this.testHealthEndpoint(),
      docs: this.testDocsEndpoint(),
      users: this.testUsersEndpoint(),
      availability: this.testAvailabilityEndpoint(),
      appointments: this.testAppointmentsEndpoint()
    };

    return {
      results,
      summary: {
        totalEndpoints: Object.keys(results).length,
        availableEndpoints: Object.values(results).filter(r => r.available).length,
        averageResponseTime: Object.values(results).reduce((sum, r) => sum + r.responseTime, 0) / Object.keys(results).length
      }
    };
  }
}

/**
 * Instância global do helper de endpoints
 */
export const endpointHelper = new EndpointHelper();
