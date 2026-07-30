export function formatPronouns(pronouns: string, pronounsOther?: string): string | null {
  if (!pronouns) return null;
  if (pronouns === 'other') return pronounsOther || null;
  return pronouns.replace('_', '/');
}
