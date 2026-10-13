// Formatters

export function formatCurrency(value: number, currency = 'BRL', locale?: string): string {
  const isUSD = currency === 'USD'
  const resolvedLocale = locale || (isUSD ? 'en-US' : 'pt-BR')
  return new Intl.NumberFormat(resolvedLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: isUSD ? 0 : 0
  }).format(value)
}

export function formatNumber(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatDate(date: string | Date, locale = 'pt-BR', options: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

export function formatRelativeTime(date: string | Date, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}min atrás`
  return 'agora'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function truncate(text: string, length: number, suffix = '...'): string {
  if (text.length <= length) return text
  return text.slice(0, length - suffix.length).trim() + suffix
}

export function formatArea(area: number): string {
  return `${formatNumber(area)} m²`
}

export function formatPrice(price: number): string {
  return formatCurrency(price)
}