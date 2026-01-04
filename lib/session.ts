export function getSessionToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('table_token')
}

export function setSessionToken(token: string) {
  localStorage.setItem('table_token', token)
}

export function clearSessionToken() {
  localStorage.removeItem('table_token')
}
