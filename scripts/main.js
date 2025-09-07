import {
import { PEXELS_API_KEY } from "./keys.js";
  fetchPerfumeSuggestions,
  fetchQuizResults,
  fetchNoteExploration,
  fetchMoodSuggestions
} from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("quizForm");
  if (quizForm) {
    quizForm.addEventListener("submit", handleQuizSubmit);
  }

  loadFavorites(); // Load favorites on page load
});

async function getPerfumeSuggestions() {
  const keyword = document.getElementById("keywordInput").value.trim();
  if (!keyword) return alert("Please enter some keywords!");
  showLoading("suggestions");
  const response = await fetchPerfumeSuggestions(keyword);
  renderPerfumeCards(parsePerfumes(response), "suggestions");
}

async function handleQuizSubmit(event) {
  event.preventDefault();
  const season = event.target.season.value;
  const color = event.target.color.value;
  const occasion = event.target.occasion.value;
  showLoading("quizResult");
  const response = await fetchQuizResults(season, color, occasion);
  renderPerfumeCards(parsePerfumes(response), "quizResult");
}

async function getMoodSuggestions() {
  const mood = document.getElementById("moodInput").value;
  showLoading("moodResult");
  const response = await fetchMoodSuggestions(mood);
  renderPerfumeCards(parsePerfumes(response), "moodResult");
}

function showLoading(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="loading">Loading perfumes... ⏳</div>`;
}

async function getImageForPerfume(name) {
  const query = encodeURIComponent(`${name} perfume bottle`);
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=1`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });

    const data = await response.json();
    return data.photos?.[0]?.src?.medium || "https://via.placeholder.com/250x200?text=Image+Unavailable";
  } catch {
    return "https://via.placeholder.com/250x200?text=Image+Unavailable";
  }
}

async function parsePerfumes(text) {
  const blocks = text.split(/Name:/).slice(1);

  const perfumes = await Promise.all(
    blocks.map(async block => {
      const nameMatch = block.match(/^(.*?)\n/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown";
      const descMatch = block.match(/Description:\s*(.*)/);
      const description = descMatch ? descMatch[1].trim() : "";
      const image = await getImageForPerfume(name);
      return { name, description, image };
    })
  );

  return perfumes;
}

async function renderPerfumeCards(perfumePromise, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<div class="loading">Loading perfumes... ⏳</div>`;

  const perfumes = await perfumePromise;
  container.innerHTML = "";

  perfumes.forEach(perfume => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = perfume.image;
    img.alt = perfume.name;
    img.onerror = () => {
      img.src = "https://via.placeholder.com/250x200?text=Image+Unavailable";
    };

    const title = document.createElement("h3");
    title.textContent = perfume.name;

    const desc = document.createElement("p");
    desc.textContent = perfume.description;

    const query = encodeURIComponent(perfume.name + " perfume");
    const amazonLink = `https://www.amazon.com/s?k=${query}`;

    const link = document.createElement("a");
    link.href = amazonLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Buy on Amazon 🛒";
    link.className = "buy-link";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "❤️ Save to Favorites";
    saveBtn.className = "save-button";
    saveBtn.onclick = () => saveToFavorites(perfume);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);
    card.appendChild(saveBtn);

    container.appendChild(card);
  });
}

function saveToFavorites(perfume) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.some(p => p.name === perfume.name)) {
    alert("Already in favorites!");
    return;
  }
  favorites.push(perfume);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert("Saved!");
  loadFavorites();
}

function loadFavorites() {
  const container = document.getElementById("favorites");
  if (!container) return;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  container.innerHTML = "";

  favorites.forEach(perfume => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = perfume.image;
    img.alt = perfume.name;
    img.onerror = () => {
      img.src = "https://via.placeholder.com/250x200?text=Image+Unavailable";
    };

    const title = document.createElement("h3");
    title.textContent = perfume.name;

    const desc = document.createElement("p");
    desc.textContent = perfume.description;

    const query = encodeURIComponent(perfume.name + " perfume");
    const amazonLink = `https://www.amazon.com/s?k=${query}`;

    const link = document.createElement("a");
    link.href = amazonLink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Buy on Amazon 🛒";
    link.className = "buy-link";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "🗑 Remove";
    removeBtn.className = "remove-button";
    removeBtn.onclick = () => removeFromFavorites(perfume.name);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);
    card.appendChild(removeBtn);

    container.appendChild(card);
  });
}

function removeFromFavorites(name) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(p => p.name !== name);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}

window.getPerfumeSuggestions = getPerfumeSuggestions;
window.getMoodSuggestions = getMoodSuggestions;
window.handleQuizSubmit = handleQuizSubmit;