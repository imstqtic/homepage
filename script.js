// --- Clock and Date Logic ---
function updateClockAndGreeting() {
    const now = new Date();
    const clock = document.getElementById("clock");
    const date = document.getElementById("date");
    const greetingText = document.getElementById("greeting-text");

    // Clock format
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/New_York' };
    clock.textContent = now.toLocaleTimeString('en-US', timeOptions);

    // Date format
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'America/New_York' };
    date.textContent = now.toLocaleDateString('en-US', dateOptions);

    // Dynamic Greeting
    const hour = now.getHours();
    let greeting = "";
    if (hour < 12) {
        greeting = "Good Morning";
    } else if (hour < 18) {
        greeting = "Good Afternoon";
    } else {
        greeting = "Good Evening";
    }
    greetingText.textContent = greeting;
}
setInterval(updateClockAndGreeting, 1000);
updateClockAndGreeting(); // Call immediately to avoid initial blank display

// --- Scroll Position Logic ---
window.addEventListener("beforeunload", () => {
    localStorage.setItem("scroll-pos", window.scrollY);
});

window.addEventListener("load", () => {
    window.scrollTo(0, parseInt(localStorage.getItem("scroll-pos") || "0", 10));
});

// --- Last Visited Highlight Logic ---
window.addEventListener("load", () => {
    const last = localStorage.getItem("last-visited");
    if (last) {
        const link = document.querySelector(`section#link-sections a[href="${last}"], section#favorites-section a[href="${last}"]`);
        if (link) {
            link.style.border = "2px dashed var(--accent)";
            link.title += " (Last visited)";
        }
    }
});

// --- Weather Widget Logic ---
// IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
// Get one for free here: https://openweathermap.org/api
const WEATHER_API_KEY = 'YOUR_API_KEY'; // <--- !!! REPLACE THIS !!!
const WEATHER_CITY = 'New York'; // Or your preferred city, e.g., 'London', 'Tokyo'
const WEATHER_UNITS = 'imperial'; // 'metric' for Celsius, 'imperial' for Fahrenheit

async function fetchWeatherData() {
    if (WEATHER_API_KEY === 'YOUR_API_KEY') {
        document.getElementById('weather-location').textContent = 'Weather API Key Missing!';
        document.getElementById('weather-location').style.color = 'red';
        console.error('OpenWeatherMap API Key is not set. Please get one from openweathermap.org and replace YOUR_API_KEY in script.js');
        return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather data fetch failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        document.getElementById('weather-location').textContent = data.name;
        document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°${WEATHER_UNITS === 'imperial' ? 'F' : 'C'}`;
        document.getElementById('weather-desc').textContent = data.weather[0].description;
        
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIcon.style.display = 'block'; // Show icon once loaded
        weatherIcon.alt = data.weather[0].description;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-location').textContent = 'Failed to load weather.';
        document.getElementById('weather-location').style.color = 'red';
        document.getElementById('weather-icon').style.display = 'none';
    }
}
// Fetch weather data every 10 minutes (600,000 ms)
fetchWeatherData();
setInterval(fetchWeatherData, 600000);

// --- Dynamic Quotes Logic ---
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston S. Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

function displayRandomQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
}
displayRandomQuote(); // Display a quote on load

// --- To-Do List Logic ---
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    todoList.innerHTML = ''; // Clear current list
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', todo.completed);
        li.dataset.index = index; // Store index for easy access

        const span = document.createElement('span');
        span.textContent = todo.text;
        span.classList.add('todo-text');
        span.addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-todo-btn');
        deleteBtn.addEventListener('click', () => {
            todos.splice(index, 1); // Remove item from array
            saveTodos();
            renderTodos();
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

addTodoBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text) {
        todos.push({ text: text, completed: false });
        todoInput.value = ''; // Clear input
        saveTodos();
        renderTodos();
    }
});

// Allow adding with Enter key
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodoBtn.click();
    }
});

renderTodos(); // Initial render of todos on page load

// --- Favorites Bar Logic ---
const favoritesList = document.getElementById('favorites-list');
const FAVORITES_LIMIT = 5;

/**
 * Ensures a favorite object has the correct structure (href, text, count).
 * Handles old string-only formats or missing properties.
 * @param {string|object} favData The raw favorite data from localStorage.
 * @returns {object} A well-formed favorite object.
 */
function cleanFavoriteData(favData) {
    if (typeof favData === 'string') {
        const originalLink = document.querySelector(`a[href="${favData}"]`);
        return {
            href: favData,
            text: originalLink ? originalLink.textContent : favData,
            count: 1
        };
    } else if (typeof favData === 'object' && favData !== null) {
        const cleanedFav = {
            href: favData.href || '',
            text: favData.text || favData.href || '',
            count: (typeof favData.count === 'number' && !isNaN(favData.count)) ? favData.count : 1
        };
        return cleanedFav;
    }
    return { href: '', text: 'Invalid Link', count: 1 };
}

function renderFavorites() {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.map(cleanFavoriteData);
    favorites.sort((a, b) => b.count - a.count);
    const topFavorites = favorites.slice(0, FAVORITES_LIMIT);

    topFavorites.forEach(fav => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = fav.href;
        a.textContent = fav.text;
        a.classList.add('favorite-item-link'); 
        a.title = `Clicked ${fav.count} times`; 
        li.appendChild(a);
        favoritesList.appendChild(li);
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initial render of favorites on page load (already called above in window.onload)
window.addEventListener('load', renderFavorites); // Ensuring it runs even if order changes

// Add click listener to all GENERAL links (NOT favorites bar links)
document.querySelectorAll("section#link-sections a").forEach(link => { 
    link.addEventListener("click", (event) => {
        localStorage.setItem("last-visited", link.href);
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.map(cleanFavoriteData);
        const existingFavoriteIndex = favorites.findIndex(fav => fav.href === link.href);

        if (existingFavoriteIndex > -1) {
            favorites[existingFavoriteIndex].count++;
        } else {
            const newFavorite = {
                href: link.href,
                text: link.textContent,
                count: 1
            };
            favorites.push(newFavorite);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    });
});

// Add click listener to the favorites list itself for removal functionality
favoritesList.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.favorite-item-link'); 
    if (clickedLink) {
        event.preventDefault(); 
        const linkHref = clickedLink.href;
        const linkText = clickedLink.textContent;

        if (confirm(`Do you want to remove "${linkText}" from your favorites?`)) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.map(cleanFavoriteData);
            favorites = favorites.filter(fav => fav.href !== linkHref);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        } else {
            window.location.href = linkHref;
        }
    }
});

// --- Search Filter Logic ---
const searchInput = document.getElementById('search');
const clearSearchButton = document.getElementById('clear-search');

searchInput.addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    
    // Show/hide clear button based on input content
    if (this.value.length > 0) {
        clearSearchButton.style.display = 'block';
    } else {
        clearSearchButton.style.display = 'none';
    }

    // Filter <details> sections in #link-sections
    const linkSectionsDetails = document.querySelectorAll('section#link-sections details');
    linkSectionsDetails.forEach(details => {
        let sectionHasMatches = false;
        const listItems = details.querySelectorAll('li');
        
        listItems.forEach(li => {
            const aTag = li.querySelector('a');
            if (aTag) {
                const text = aTag.textContent.toLowerCase();
                if (text.includes(filter)) {
                    li.style.display = "";
                    sectionHasMatches = true;
                } else {
                    li.style.display = "none";
                }
            } else {
                const text = li.textContent.toLowerCase();
                if (text.includes(filter)) {
                    li.style.display = "";
                    sectionHasMatches = true;
                } else {
                    li.style.display = "none";
                }
            }
        });

        if (filter.length > 0) {
            if (!sectionHasMatches) {
                details.style.display = "none";
            } else {
                details.style.display = "";
                details.open = true; // Automatically open section if it has matches
            }
        } else {
            details.style.display = "";
            // Restore details state based on localStorage when search is cleared
            const detailId = details.querySelector('summary').textContent.trim().replace(/\s+/g, '-').toLowerCase(); 
            const savedState = localStorage.getItem(`details-state-${detailId}`);
            details.open = (savedState === 'open'); // Default to closed if no state or 'closed'
        }
    });

    // Handle #favorites-section
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection) {
        let favoritesSectionHasMatches = false;
        const favoritesListItems = favoritesSection.querySelectorAll('li');
        
        favoritesListItems.forEach(li => {
            const aTag = li.querySelector('a');
            if (aTag) {
                const text = aTag.textContent.toLowerCase();
                if (text.includes(filter)) {
                    li.style.display = "";
                    favoritesSectionHasMatches = true;
                } else {
                    li.style.display = "none";
                }
            } else {
                const text = li.textContent.toLowerCase();
                if (text.includes(filter)) {
                    li.style.display = "";
                    favoritesSectionHasMatches = true;
                } else {
                    li.style.display = "none";
                }
            }
        });

        if (filter.length > 0) {
            if (!favoritesSectionHasMatches) {
                favoritesSection.style.display = "none";
            } else {
                favoritesSection.style.display = "";
            }
        } else {
            favoritesSection.style.display = "";
        }
    }
});

clearSearchButton.addEventListener('click', function() {
    searchInput.value = ''; // Clear the input
    searchInput.dispatchEvent(new Event('input')); // Manually trigger the input event to reset filter
});


// --- Dark Mode Toggle Logic ---
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

// --- Remember details section open/closed state ---
document.querySelectorAll('details').forEach(details => {
    // Create a unique ID for each details element based on its summary text
    const detailId = details.querySelector('summary').textContent.trim().replace(/\s+/g, '-').toLowerCase(); 
    
    // Load state on page load
    const savedState = localStorage.getItem(`details-state-${detailId}`);
    if (savedState === 'open') {
        details.open = true;
    } else if (savedState === 'closed') {
        details.open = false;
    } else {
        // Default behavior if no saved state, ensure favorites are open
        if (details.closest('#favorites-section')) {
            details.open = true;
        }
    }

    // Save state on toggle
    details.addEventListener('toggle', () => {
        const currentState = details.open ? 'open' : 'closed';
        localStorage.setItem(`details-state-${detailId}`, currentState);
    });
});
