function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/New_York' };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'America/New_York' };

  clock.textContent = now.toLocaleTimeString('en-US', options);
  date.textContent = now.toLocaleDateString('en-US', dateOptions);
}
setInterval(updateClock, 1000);
updateClock();

// Restore scroll position
window.addEventListener("beforeunload", () => {
  localStorage.setItem("scroll-pos", window.scrollY);
});
window.addEventListener("load", () => {
  window.scrollTo(0, parseInt(localStorage.getItem("scroll-pos") || "0", 10));
});

// Highlight last visited
window.addEventListener("load", () => {
  const last = localStorage.getItem("last-visited");
  if (last) {
    const link = document.querySelector(`a[href="${last}"]`);
    if (link) {
      link.style.border = "2px dashed var(--accent)";
      link.title += " (Last visited)";
    }
  }
});

// Handle favorites
const favoritesList = document.getElementById('favorites-list');
const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
savedFavorites.forEach(url => {
  const li = document.createElement('li');
  li.textContent = url;
  favoritesList.appendChild(li);
});

document.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    localStorage.setItem("last-visited", link.href);
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(link.href)) {
      favorites.push(link.href);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      const li = document.createElement('li');
      li.textContent = link.textContent;
      favoritesList.appendChild(li);
    }
  });
});

// Search filter
document.getElementById('search').addEventListener('input', function () {
  const filter = this.value.toLowerCase();
  document.querySelectorAll('section ul li').forEach(li => {
    const text = li.textContent.toLowerCase();
    li.style.display = text.includes(filter) ? "" : "none";
  });
});

// Dark mode toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
window.addEventListener('load', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});

