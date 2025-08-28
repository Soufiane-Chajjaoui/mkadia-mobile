// utils/Logger.ts
// TypeScript Console Logger utility for Flipper debugging

class Logger {
  // Basic log message
  static log(message: string, data: any = null): void {
    if (data) {
      console.log(`📝 ${message}`, data);
    } else {
      console.log(`📝 ${message}`);
    }
  }

  // Information message
  static info(message: string, data: any = null): void {
    if (data) {
      console.info(`ℹ️ INFO: ${message}`, data);
    } else {
      console.info(`ℹ️ INFO: ${message}`);
    }
  }

  // Warning message
  static warn(message: string, data: any = null): void {
    if (data) {
      console.warn(`⚠️ WARNING: ${message}`, data);
    } else {
      console.warn(`⚠️ WARNING: ${message}`);
    }
  }

  // Error message
  static error(message: string, error: Error | any = null): void {
    if (error) {
      console.error(`❌ ERROR: ${message}`, error);
    } else {
      console.error(`❌ ERROR: ${message}`);
    }
  }

  // Debug message (only in development)
  static debug(message: string, data: any = null): void {
    if (__DEV__) {
      if (data) {
        console.log(`🐛 DEBUG: ${message}`, data);
      } else {
        console.log(`🐛 DEBUG: ${message}`);
      }
    }
  }

  // Success message
  static success(message: string, data: any = null): void {
    if (data) {
      console.log(`✅ SUCCESS: ${message}`, data);
    } else {
      console.log(`✅ SUCCESS: ${message}`);
    }
  }

  // Network request logging
  static network(method: string, url: string, data?: any, response?: any): void {
    if (__DEV__) {
      const logData: any = { method, url };
      if (data) logData.requestData = data;
      if (response) logData.response = response;
      console.log(`🌐 NETWORK: ${method} ${url}`, logData);
    }
  }

  // Performance logging
  static performance(operation: string, duration: number, additionalData?: any): void {
    if (__DEV__) {
      const logData: any = { operation, duration: `${duration}ms` };
      if (additionalData) Object.assign(logData, additionalData);
      console.log(`⚡ PERFORMANCE: ${operation}`, logData);
    }
  }

  // User action logging
  static userAction(action: string, details?: any): void {
    if (__DEV__) {
      const logData: any = { 
        action, 
        timestamp: new Date().toISOString() 
      };
      if (details) Object.assign(logData, details);
      console.log(`👤 USER ACTION: ${action}`, logData);
    }
  }

  // Test all log types
  static testAllLogTypes(): void {
    this.log('This is a basic log message');
    this.info('This is an info message', { timestamp: new Date().toISOString() });
    this.warn('This is a warning message');
    this.error('This is an error message');
    this.debug('This is a debug message', { debugData: true });
    this.success('This is a success message');
    
    // Test with objects
    this.log('User data object:', { 
      id: 123, 
      name: 'John Doe', 
      email: 'john@example.com' 
    });
    
    // Test with arrays
    this.info('Array data:', ['item1', 'item2', 'item3']);
    
    // Test with nested objects
    this.debug('Complex object:', {
      user: { id: 1, name: 'Test' },
      settings: { theme: 'dark', notifications: true },
      timestamps: { created: new Date(), updated: new Date() }
    });

    // Test network logging
    this.network('GET', 'https://api.example.com/users', null, { status: 200, data: [] });
    
    // Test performance logging
    this.performance('API Call', 1250, { endpoint: '/users' });
    
    // Test user action logging
    this.userAction('BUTTON_PRESS', { buttonId: 'login', screen: 'LoginScreen' });
  }
}

export default Logger;