export function bySurname(a: { name: string }, b: { name: string }): number {
  const surname = (name: string) => name.trim().split(/\s+/).pop()!.toLowerCase();
  return surname(a.name).localeCompare(surname(b.name));
}

export function sortBySurname<T extends { name: string }>(people: T[]): T[] {
  return [...people].sort(bySurname);
}
