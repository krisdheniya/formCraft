// engine/validationEngine.js — Validates question configs and responses

/**
 * Validate a single question's configuration (builder-side).
 * Returns array of error objects { field, message }.
 */
export function validateQuestion(question) {
  const errors = [];

  if (!question.text || !question.text.trim()) {
    errors.push({ field: 'text', message: 'Question text is required' });
  }

  if (['multiple_choice', 'checkbox', 'dropdown'].includes(question.type)) {
    if (!question.options || question.options.length < 2) {
      errors.push({ field: 'options', message: 'At least 2 options required' });
    }
    if (question.options) {
      const labels = question.options.map((o) => o.label.trim().toLowerCase()).filter(Boolean);
      if (new Set(labels).size !== labels.length) {
        errors.push({ field: 'options', message: 'Duplicate option labels detected' });
      }
      if (question.options.some((o) => !o.label.trim())) {
        errors.push({ field: 'options', message: 'All options must have a label' });
      }
    }
  }

  return errors;
}

/**
 * Validate the entire form before save/preview.
 * Returns { isValid, errors: Record<questionId, ValidationError[]> }
 */
export function validateForm(form) {
  const errors = {};

  Object.values(form.questions).forEach((q) => {
    const qErrors = validateQuestion(q);
    if (qErrors.length > 0) {
      errors[q.id] = qErrors;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate a respondent's answer against a question's validation rules.
 */
export function validateAnswer(question, answer) {
  const errors = [];

  for (const rule of question.validationRules || []) {
    switch (rule.type) {
      case 'required':
        if (answer === undefined || answer === null || answer === '') {
          errors.push(rule.message || 'This field is required');
        }
        break;
      case 'min_length':
        if (typeof answer === 'string' && answer.length < Number(rule.value)) {
          errors.push(rule.message || `Minimum ${rule.value} characters required`);
        }
        break;
      case 'max_length':
        if (typeof answer === 'string' && answer.length > Number(rule.value)) {
          errors.push(rule.message || `Maximum ${rule.value} characters allowed`);
        }
        break;
      case 'min_value':
        if (Number(answer) < Number(rule.value)) {
          errors.push(rule.message || `Minimum value is ${rule.value}`);
        }
        break;
      case 'max_value':
        if (Number(answer) > Number(rule.value)) {
          errors.push(rule.message || `Maximum value is ${rule.value}`);
        }
        break;
      case 'email_format':
        if (answer && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answer)) {
          errors.push(rule.message || 'Invalid email address');
        }
        break;
      case 'phone_format':
        if (answer && !/^\+?[\d\s\-()]{7,15}$/.test(answer)) {
          errors.push(rule.message || 'Invalid phone number');
        }
        break;
      default:
        break;
    }
  }

  // Built-in required check
  if (question.required && (answer === undefined || answer === null || answer === '')) {
    if (!errors.length) errors.push('This field is required');
  }

  return errors;
}
