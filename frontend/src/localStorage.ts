const PENDING_EMAIL_KEY = "pendingEmail";

export function setPendingEmail(email: string): void {
  localStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function getPendingEmail(): string | null {
  return localStorage.getItem(PENDING_EMAIL_KEY);
}

export function removePendingEmail(): void {
  localStorage.removeItem(PENDING_EMAIL_KEY);
}
