import { GROQ_API_KEY } from "./keys.js";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
async function callGroqAPI(prompt) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Error calling Groq API:", err);
    return "Oops! Couldn’t fetch suggestions. Try again later.";
  }
}

async function fetchPerfumeSuggestions(keyword) {
  const prompt = `Suggest 5 perfumes based on the following keywords: ${keyword}.
Return each in this format:
Name: [Perfume Name]
Description: [Short description]`;
  return await callGroqAPI(prompt);
}

async function fetchQuizResults(season, color, occasion) {
  const prompt = `Suggest 5 perfumes for someone who loves ${season}, prefers ${color}, and needs a scent for ${occasion}.
Return each in this format:
Name: [Perfume Name]
Description: [Short description]`;
  return await callGroqAPI(prompt);
}

async function fetchNoteExploration(note) {
  const prompt = `List 5 popular perfumes with a prominent ${note} note.
Return each in this format:
Name: [Perfume Name]
Description: [Short description]`;
  return await callGroqAPI(prompt);
}

async function fetchMoodSuggestions(mood) {
  const prompt = `Suggest 5 perfumes that match the mood "${mood}".
Return each in this format:
Name: [Perfume Name]
Description: [Short description]`;
  return await callGroqAPI(prompt);
}

export {
  fetchPerfumeSuggestions,
  fetchQuizResults,
  fetchNoteExploration,
  fetchMoodSuggestions
};
