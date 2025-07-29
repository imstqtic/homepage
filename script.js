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
// OpenWeatherMap API key for Valley Stream, NY
// API key generated for Valley Stream, NY (using coordinates)
// Source: OpenWeatherMap API - coordinates for Valley Stream, NY (40.6593, -73.7088)
// This is a dummy key, you'll need to use your own! (See previous instructions for getting a key)
// For actual use, generate your own key from openweathermap.org
const WEATHER_API_KEY = 'c13c79c882255776d6c95c378939c085'; // Placeholder: Please get your own key from OpenWeatherMap
const WEATHER_CITY_LAT = 40.6593; // Latitude for Valley Stream, NY
const WEATHER_CITY_LON = -73.7088; // Longitude for Valley Stream, NY
const WEATHER_UNITS = 'imperial'; // 'metric' for Celsius, 'imperial' for Fahrenheit

async function fetchWeatherData() {
    if (WEATHER_API_KEY === 'c13c79c882255776d6c95c378939c085') { // Check for the placeholder key
        document.getElementById('weather-location').textContent = 'API Key Missing/Invalid!';
        document.getElementById('weather-location').style.color = 'red';
        console.error('OpenWeatherMap API Key is not set or is a placeholder. Please get one from openweathermap.org and replace the key in script.js');
        return;
    }
    // Using coordinates for more precise location fetching
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${WEATHER_CITY_LAT}&lon=${WEATHER_CITY_LON}&units=${WEATHER_UNITS}&appid=${WEATHER_API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather data fetch failed: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Display city name (OpenWeatherMap might return a slightly different official name)
        document.getElementById('weather-location').textContent = `Valley Stream`; // Hardcode or use data.name if preferred
        document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)}°${WEATHER_UNITS === 'imperial' ? 'F' : 'C'}`;
        document.getElementById('weather-desc').textContent = data.weather[0].description;
        
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        weatherIcon.style.display = 'block';
        weatherIcon.alt = data.weather[0].description;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weather-location').textContent = 'Failed to load weather.';
        document.getElementById('weather-location').style.color = 'red';
        document.getElementById('weather-icon').style.display = 'none';
    }
}
fetchWeatherData();
setInterval(fetchWeatherData, 600000); // Fetch every 10 minutes

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
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The harder I work, the luckier I get.", author: "Samuel Goldwyn" },
    { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "Do not wait for a leader; do it alone, person to person.", author: "Mother Teresa" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" }
];

function displayRandomQuote() {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
}
displayRandomQuote();

// --- To-Do List Logic ---
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.classList.toggle('completed', todo.completed);
        li.dataset.index = index;

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
            todos.splice(index, 1);
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
        todoInput.value = '';
        saveTodos();
        renderTodos();
    }
});

todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodoBtn.click();
    }
});

renderTodos();

// --- Favorites Bar Logic ---
const favoritesList = document.getElementById('favorites-list');
const FAVORITES_LIMIT = 5;

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
    favorites.sort((a, b) => b.count - a.coun
