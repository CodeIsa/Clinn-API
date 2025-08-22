import { check } from 'k6';
import http from 'k6/http';
import { BASE_URL, DEFAULT_HEADERS, EXPECTED_STATUS_CODES } from '../utils/variaveis.js';

/**
 * Helper para autenticação nos testes de performance
 */
export class AuthHelper {
  constructor() {
    this.token = null;
    this.isAuthenticated = false;
  }

  /**
   * Realiza login e obtém token de autenticação
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {boolean} - True se autenticado com sucesso
   */
  login(email, password) {
    const payload = JSON.stringify({
      email: email,
      password: password
    });

    const params = {
      headers: DEFAULT_HEADERS,
      timeout: '10s'
    };

    const response = http.post(`${BASE_URL}/api/auth/login`, payload, params);

    const result = check(response, {
      'login status is 200': (r) => r.status === EXPECTED_STATUS_CODES.SUCCESS,
      'login response has token': (r) => r.json('token') !== undefined,
      'login response time < 2s': (r) => r.timings.duration < 2000
    });

    if (result && response.status === EXPECTED_STATUS_CODES.SUCCESS) {
      const data = response.json();
      this.token = data.token;
      this.isAuthenticated = true;
      return true;
    }

    return false;
  }

  /**
   * Obtém headers autenticados para requisições
   * @returns {Object} - Headers com token de autenticação
   */
  getAuthHeaders() {
    if (!this.isAuthenticated || !this.token) {
      return DEFAULT_HEADERS;
    }

    return {
      ...DEFAULT_HEADERS,
      'Authorization': `Bearer ${this.token}`
    };
  }

  /**
   * Verifica se está autenticado
   * @returns {boolean} - Status de autenticação
   */
  checkAuth() {
    return this.isAuthenticated && this.token !== null;
  }

  /**
   * Realiza logout
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
  }
}

/**
 * Instância global do helper de autenticação
 */
export const authHelper = new AuthHelper();
