export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  password: (password) => {
    return password.length >= 6;
  },

  phone: (phone) => {
    const regex = /^\+?[\d\s-]{10,}$/;
    return regex.test(phone);
  },

  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value && value.length >= min;
  },

  maxLength: (value, max) => {
    return value && value.length <= max;
  },
};

export const validateForm = (data, rules) => {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const [rule, params] of Object.entries(fieldRules)) {
      if (rule === 'required' && !validators.required(data[field])) {
        errors[field] = `${field} is required`;
        break;
      }
      if (rule === 'email' && data[field] && !validators.email(data[field])) {
        errors[field] = 'Invalid email address';
        break;
      }
      if (rule === 'minLength' && !validators.minLength(data[field], params)) {
        errors[field] = `Minimum length is ${params}`;
        break;
      }
    }
  }
  
  return errors;
};