/**
 * Strapi Authentication Service (JavaScript version for fetch-tutorials.ts)
 * Simple version to get JWT tokens dynamically
 */

class StrapiAuthService {
  constructor(baseUrl = 'http://help.savameta.local:1337') {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  /**
   * Login and get JWT token
   */
  async login(identifier, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Login failed with status ${response.status}`
        );
      }

      const data = await response.json();
      this.token = data.jwt;
      
      console.log('✅ Login successful');
      return data;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  }

  /**
   * Register new user and get JWT token
   */
  async register(username, email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Registration failed with status ${response.status}`
        );
      }

      const data = await response.json();
      this.token = data.jwt;
      
      console.log('✅ Registration successful');
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      throw error;
    }
  }

  /**
   * Get current stored token
   */
  getToken() {
    return this.token;
  }

  /**
   * Set token manually
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Clear stored token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Auto-login helper: Try login, if fails try register
   */
  async autoLogin(email, password) {
    try {
      return await this.login(email, password);
    } catch (loginError) {
      console.log('⚠️  Login failed, attempting to register...');
      const username = email.split('@')[0];
      return await this.register(username, email, password);
    }
  }
}

// Create singleton instance
const authService = new StrapiAuthService();

// Export for CommonJS
module.exports = {
  StrapiAuthService,
  authService,
  default: StrapiAuthService
};
