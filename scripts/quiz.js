export function buildQuizPrompt(season, color, occasion) {
    return `The user prefers the season "${season}", the color "${color}", and wants a perfume for "${occasion}".
  Based on this, suggest 5 perfumes.
  Each result must follow this format: Perfume Name - Description.`;
  }