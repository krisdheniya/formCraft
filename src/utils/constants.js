// utils/constants.js — Question type list, operators, etc.

export const QUESTION_TYPES = [
  { value: 'short_answer',    label: 'Short Answer',    icon: 'Type' },
  { value: 'long_answer',     label: 'Long Answer',     icon: 'AlignLeft' },
  { value: 'true_false',      label: 'True / False',    icon: 'ToggleLeft' },
  { value: 'multiple_choice', label: 'Multiple Choice', icon: 'CircleDot' },
  { value: 'checkbox',        label: 'Checkbox',        icon: 'CheckSquare' },
  { value: 'dropdown',        label: 'Dropdown',        icon: 'ChevronDown' },
  { value: 'number',          label: 'Number',          icon: 'Hash' },
  { value: 'date',            label: 'Date',            icon: 'Calendar' },
  { value: 'email',           label: 'Mail',            icon: 'Mail' },
  { value: 'phone',           label: 'Phone',           icon: 'Phone' },
  { value: 'file_upload',     label: 'File Upload',     icon: 'Upload' },
  { value: 'rating',          label: 'Rating',          icon: 'Star' },
  { value: 'section_header',  label: 'Section Header',  icon: 'Minus' },
];

export const OPERATORS = [
  { value: 'equals',       label: 'equals' },
  { value: 'not_equals',   label: 'does not equal' },
  { value: 'contains',     label: 'contains' },
  { value: 'greater_than', label: 'greater than' },
  { value: 'less_than',    label: 'less than' },
  { value: 'is_answered',  label: 'is answered' },
];

// Types that can have children questions
export const TYPES_WITH_CHILDREN = [
  'true_false',
  'multiple_choice',
  'checkbox',
  'dropdown',
  'short_answer',
  'long_answer',
  'number',
  'rating',
];

export const MAX_DEPTH = 5;
export const STORAGE_KEY = 'form_builder_state_v1';
export const SCHEMA_VERSION = 1;

export const VALIDATION_RULES_BY_TYPE = {
  short_answer:    ['required', 'min_length', 'max_length', 'regex'],
  long_answer:     ['required', 'min_length', 'max_length'],
  number:          ['required', 'min_value', 'max_value'],
  email:           ['required', 'email_format'],
  phone:           ['required', 'phone_format'],
  file_upload:     ['required', 'file_size', 'file_type'],
  date:            ['required'],
  true_false:      ['required'],
  multiple_choice: ['required'],
  checkbox:        ['required'],
  dropdown:        ['required'],
  rating:          ['required'],
  section_header:  [],
};

export const TYPE_COLORS = {
  short_answer:    '#6366f1',
  long_answer:     '#8b5cf6',
  true_false:      '#10b981',
  multiple_choice: '#f59e0b',
  checkbox:        '#3b82f6',
  dropdown:        '#06b6d4',
  number:          '#ef4444',
  date:            '#ec4899',
  email:           '#84cc16',
  phone:           '#f97316',
  file_upload:     '#a855f7',
  rating:          '#eab308',
  section_header:  '#64748b',
};
