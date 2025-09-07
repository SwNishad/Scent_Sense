import { fetchNoteExploration } from "./api.js";

export const noteDescriptions = {
  floral: "🌸 Light, feminine, often with jasmine or rose notes. Perfect for daytime wear.",
  woody: "🌲 Earthy and warm, featuring sandalwood or cedar. Ideal for evenings.",
  citrus: "🍋 Fresh and zesty, with lemon or bergamot. Great for summer.",
  musky: "🧼 Sensual and deep, with amber or musk. Best for nightouts."
};

export async function fetchNoteDetails(note) {
  const perfumes = await fetchNoteExploration(note);
  return `${noteDescriptions[note]}\n\n${perfumes}`;
}
