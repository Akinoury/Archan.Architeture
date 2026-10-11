// Validation utilities

export interface ValidationRule<T> {
  test: (value: T) => boolean
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult {
  const errors = rules
    .filter(rule => !rule.test(value))
    .map(rule => rule.message)

  return {
    valid: errors.length === 0,
    errors
  }
}

export const required = <T>(message = 'Este campo é obrigatório'): ValidationRule<T | null | undefined> => ({
  test: (value) => value !== null && value !== undefined && value !== '',
  message
})

export const minLength = (min: number, message?: string): ValidationRule<string> => ({
  test: (value) => value.length >= min,
  message: message || `Mínimo de ${min} caracteres`
})

export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
  test: (value) => value.length <= max,
  message: message || `Máximo de ${max} caracteres`
})

export const email = (message = 'E-mail inválido'): ValidationRule<string> => ({
  test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message
})

export const min = (min: number, message?: string): ValidationRule<number> => ({
  test: (value) => value >= min,
  message: message || `Valor mínimo: ${min}`
})

export const max = (max: number, message?: string): ValidationRule<number> => ({
  test: (value) => value <= max,
  message: message || `Valor máximo: ${max}`
})

export const pattern = (regex: RegExp, message: string): ValidationRule<string> => ({
  test: (value) => regex.test(value),
  message
})

export const match = <T>(otherValue: T, message = 'Os valores não coincidem'): ValidationRule<T> => ({
  test: (value) => value === otherValue,
  message
})

export function composeRules<T>(...rules: ValidationRule<T>[]): ValidationRule<T>[] {
  return rules
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  form: T,
  rules: Record<keyof T, ValidationRule<any>[]>
): { valid: boolean; errors: Partial<Record<keyof T, string[]>> } {
  const errors: Partial<Record<keyof T, string[]>> = {}
  let valid = true

  for (const key of Object.keys(rules) as Array<keyof T>) {
    const result = validate(form[key], rules[key])
    if (!result.valid) {
      valid = false
      errors[key] = result.errors
    }
  }

  return { valid, errors }
}