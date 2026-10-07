export function isUniqueViolation(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const code =
    (err as { code?: string; driverError?: { code?: string } }).code ??
    (err as { driverError?: { code?: string } }).driverError?.code;
  return code === '23505';
}
