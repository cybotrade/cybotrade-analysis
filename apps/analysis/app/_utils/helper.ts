export function capitalize(input: string) {
  if (input && typeof input === 'string') {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }
  return input;
}
