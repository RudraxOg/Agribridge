export function maskIdentifier(value: string): string {
  const compact = value.replace(/\s/g, "");
  if (compact.length < 4) return "••••";
  return `•••• •••• ${compact.slice(-4)}`;
}

export function redactSensitiveData(input: Record<string, unknown>) {
  const blocked = /aadhaar|card|cvv|fingerprint|faceTemplate|secret|password/i;
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, blocked.test(key) ? "[REDACTED]" : value]));
}
