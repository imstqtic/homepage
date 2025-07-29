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
        greeting = "good morning";
    } else if (hour < 18) {
        greeting = "good afternoon";
    } else {
        greeting = "good evening";
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
        // Target links in link-sections and favorites-section
        const link = document.querySelector(`section#link-sections a[href="${last}"], section#favorites-section a[href="${last}"]`);
        if (link) {
            link.style.border = "2px dashed var(--accent)";
            link.title += " (last visited)"; // Lowercase title
        }
    }
});

// --- Dynamic Quotes Logic ---
const quotes = [
    { text: "the only way to do great work is to love what you do.", author: "steve jobs" },
    { text: "success is not final, failure is not fatal: it is the courage to continue that counts.", author: "winston s. churchill" },
    { text: "believe you can and you're halfway there.", author: "theodore roosevelt" },
    { text: "the future belongs to those who believe in the beauty of their dreams.", author: "eleanor roosevelt" },
    { text: "the best way to predict the future is to create it.", author: "peter drucker" },
    { text: "strive not to be a success, but rather to be of value.", author: "albert einstein" },
    { text: "the mind is everything. what you think you become.", author: "buddha" },
    { text: "it is during our darkest moments that we must focus to see the light.", author: "aristotle" },
    { text: "keep your eyes on the stars, and your feet on the ground.", author: "theodore roosevelt" },
    { text: "the secret of getting ahead is getting started.", author: "mark twain" },
    { text: "the harder i work, the luckier i get.", author: "samuel goldwyn" },
    { text: "if you want to live a happy life, tie it to a goal, not to people or things.", author: "albert einstein" },
    { text: "the only person you are destined to become is the person you decide to be.", author: "ralph waldo emerson" },
    { text: "do not wait for a leader; do it alone, person to person.", author: "mother teresa" },
    { text: "the greatest glory in living lies not in never falling, but in rising every time we fall.", author: "nelson mandela" }
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
        // Try to find the original link's text content
        const originalLink = document.querySelector(`a[href="${favData}"]`);
        return {
            href: favData,
            text: originalLink ? originalLink.textContent : favData, // Use original text or href as fallback
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
    return { href: '', text: 'invalid link', count: 1 };
}

function renderFavorites() {
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.map(cleanFavoriteData); // Clean any old/malformed data
    favorites.sort((a, b) => b.count - a.count); // Sort by count descending
    const topFavorites = favorites.slice(0, FAVORITES_LIMIT); // Get top N favorites

    if (topFavorites.length === 0) {
        favoritesList.innerHTML = '<li>no favorites yet. click a link to add it!</li>';
        favoritesList.style.color = 'color-mix(in srgb, var(--text-color) 70%, transparent)';
        favoritesList.style.fontSize = '0.9em';
        favoritesList.style.textAlign = 'center';
    } else {
        topFavorites.forEach(fav => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = fav.href;
            a.textContent = fav.text;
            a.classList.add('favorite-item-link'); 
            a.title = `clicked ${fav.count} times`; 
            li.appendChild(a);
            favoritesList.appendChild(li);
        });
    }
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Save cleaned/sorted list
}

// Initial render of favorites on page load
window.addEventListener('load', renderFavorites); 

// Add click listener to all GENERAL links (NOT favorites bar links)
// This targets links within `section#link-sections`
document.querySelectorAll("section#link-sections a").forEach(link => { 
    link.addEventListener("click", (event) => {
        localStorage.setItem("last-visited", link.href); // Store last visited link

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.map(cleanFavoriteData); // Ensure favorites data is clean

        const existingFavoriteIndex = favorites.findIndex(fav => fav.href === link.href);

        if (existingFavoriteIndex > -1) {
            favorites[existingFavoriteIndex].count++; // Increment count if already exists
        } else {
            // Add new favorite with count 1
            const newFavorite = {
                href: link.href,
                text: link.textContent,
                count: 1
            };
            favorites.push(newFavorite);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites(); // Re-render favorites to show updated counts/new favorites
    });
});

// Add click listener to the favorites list itself for removal functionality
// This targets the specific '.favorite-item-link' class within the favorites list
favoritesList.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.favorite-item-link'); 
    if (clickedLink) {
        event.preventDefault(); // Prevent default navigation initially
        const linkHref = clickedLink.href;
        const linkText = clickedLink.textContent;

        if (confirm(`do you want to remove "${linkText}" from your favorites?`)) { // Lowercase confirmation
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.filter(fav => fav.href !== linkHref); // Filter out the removed link
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites(); // Re-render favorites
        } else {
            window.location.href = linkHref; // If not confirmed, navigate to the link
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
                    li.style.display = ""; // Show the list item
                    sectionHasMatches = true;
                } else {
                    li.style.display = "none"; // Hide the list item
                }
            }
        });

        // Toggle visibility of the <details> section itself
        if (filter.length > 0) {
            if (!sectionHasMatches) {
                details.style.display = "none"; // Hide section if no matches
            } else {
                details.style.display = ""; // Show section
                details.open = true; // Automatically open section if it has matches
            }
        } else {
            details.style.display = ""; // Show section if search is empty
            // Restore details state based on localStorage when search is cleared
            const detailId = details.querySelector('summary').textContent.trim().replace(/\s+/g, '-').toLowerCase(); 
            const savedState = localStorage.getItem(`details-state-${detailId}`);
            details.open = (savedState === 'open'); // Restore saved state
        }
    });

    // Handle #favorites-section separately for search
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
    searchInput.dispatchEvent(new Event('input')); // Manually trigger the input event to reset filter and display
});


// --- Dark Mode Toggle Logic ---
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Apply dark mode on load based on saved preference
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
        // Default behavior if no saved state, ensure favorites are open by default
        if (details.closest('#favorites-section')) {
            details.open = true;
        } else {
            // For other sections, default to closed if no state saved
            details.open = false;
        }
    }

    // Save state on toggle
    details.addEventListener('toggle', () => {
        const currentState = details.open ? 'open' : 'closed';
        localStorage.setItem(`details-state-${detailId}`, currentState);
    });
});
