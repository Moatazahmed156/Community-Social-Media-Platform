export function getInitials(firstName?: string, lastName?: string): string {
  const a = firstName?.[0] ?? '';
  const b = lastName?.[0] ?? '';
  return (a + b).toUpperCase() || '?';
}
