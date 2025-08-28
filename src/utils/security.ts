/**
 * Client-side security utilities for input validation and sanitization
 */

// HTML/XSS sanitization function
export const sanitizeInput = (input: string | undefined | null): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (char) => { // Escape dangerous characters
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char] || char;
    })
    .trim();
};

// Validate input for suspicious patterns and length
export const validateInput = (input: string | undefined | null, maxLength = 10000): boolean => {
  if (!input || typeof input !== 'string') return false;
  if (input.length > maxLength) return false;
  
  // Check for suspicious XSS patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
    /onmouseover=/i,
    /onfocus=/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ];
  
  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validate phone number (Brazilian format)
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-numeric characters for validation
  const numericPhone = phone.replace(/\D/g, '');
  
  // Brazilian phone: 10-11 digits (with area code)
  return numericPhone.length >= 10 && numericPhone.length <= 11;
};

// Sanitize HTML for PDF/DOC generation
export const sanitizeForDocument = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  // Allow only safe HTML tags for documents
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  
  // Remove script tags and event handlers completely
  let sanitized = html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  
  // Remove any tags not in the allowed list
  sanitized = sanitized.replace(/<\/?([a-zA-Z0-9]+)[^>]*>/g, (match, tagName) => {
    const tag = tagName.toLowerCase();
    if (!allowedTags.includes(tag)) {
      return '';
    }
    return match;
  });
  
  return sanitized;
};

// Rate limiting for client-side operations
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }
    
    const attemptTimes = this.attempts.get(key)!;
    
    // Remove old attempts outside the window
    const recentAttempts = attemptTimes.filter(time => time > windowStart);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Secure form validation
export const validateFormData = (data: Record<string, any>, rules: Record<string, {
  required?: boolean;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}>): { isValid: boolean; errors: string[]; sanitizedData: Record<string, any> } => {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    // Check required fields
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${field} é obrigatório`);
      continue;
    }
    
    if (value && typeof value === 'string') {
      // Sanitize if requested
      let processedValue = rule.sanitize ? sanitizeInput(value) : value;
      
      // Check max length
      if (rule.maxLength && processedValue.length > rule.maxLength) {
        errors.push(`${field} excede o limite de ${rule.maxLength} caracteres`);
        continue;
      }
      
      // Validate pattern
      if (rule.pattern && !rule.pattern.test(processedValue)) {
        errors.push(`${field} tem formato inválido`);
        continue;
      }
      
      // Additional security validation
      if (!validateInput(processedValue, rule.maxLength)) {
        errors.push(`${field} contém conteúdo inválido`);
        continue;
      }
      
      sanitizedData[field] = processedValue;
    } else {
      sanitizedData[field] = value;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
};