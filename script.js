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
updateClock(); // Call immediately to avoid initial blank display

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
            link.style.border = "2px dashed var(--accent)"; // Assuming you have --accent defined in your CSS
            link.title += " (Last visited)";
        }
    }
});

// --- FAVORITES BAR LOGIC (MODIFIED AGAIN) ---

const favoritesList = document.getElementById('favorites-list');
const FAVORITES_LIMIT = 5; // Set the limit to 5 as requested

// Function to render the favorites list
function renderFavorites() {
    // Clear existing list items
    favoritesList.innerHTML = '';

    // Get favorites from localStorage, default to empty array if none
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Sort favorites by count in descending order
    favorites.sort((a, b) => b.count - a.count);

    // Take only the top N links based on FAVORITES_LIMIT
    const topFavorites = favorites.slice(0, FAVORITES_LIMIT);

    // Populate the list with the sorted and limited favorites
    topFavorites.forEach(fav => {
        const li = document.createElement('li');
        const a = document.createElement('a'); // Create the <a> element
        a.href = fav.href; // Set its href attribute
        a.textContent = fav.text; // Set its display text (NOT the count unless you want it)
        
        // Optional: Add a title with the count for debugging/info on hover
        a.title = `Clicked ${fav.count} times`; 
        
        li.appendChild(a); // Append the <a> to the <li>
        favoritesList.appendChild(li); // Append the <li> to the ul
    });
}

// Initial render of favorites on page load
window.addEventListener('load', renderFavorites);


// Add click listener to all links to handle last visited and update/add to favorites
document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (event) => {
        // No event.preventDefault() here, let the link navigate normally.
        
        localStorage.setItem("last-visited", link.href);

        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // Find if the clicked link already exists in favorites
        const existingFavoriteIndex = favorites.findIndex(fav => fav.href === link.href);

        if (existingFavoriteIndex > -1) {
            // If exists, increment its count
            favorites[existingFavoriteIndex].count++;
        } else {
            // If not exists, add as a new favorite with count 1
            const newFavorite = {
                href: link.href,
                text: link.textContent, // Store the link's display text
                count: 1 // Initialize count to 1
            };
            favorites.push(newFavorite);
        }

        // Save the updated favorites array back to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Re-render the favorites list to reflect the updated counts and order
        renderFavorites();
    });
});

// --- END FAVORITES BAR LOGIC ---

// Search filter
document.getElementById('search').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    // Select all <li> elements that are descendants of <section> and <ul> (i.e., your bookmark lists)
    // This will filter both the main categories and the favorites list.
    document.querySelectorAll('section ul li').forEach(li => {
        const text = li.textContent.toLowerCase();
        // Check if the <a> tag inside the <li> contains the text
        const aTag = li.querySelector('a');
        if (aTag) { // Ensure there is an <a> tag
             li.style.display = aTag.textContent.toLowerCase().includes(filter) ? "" : "none";
        } else { // Fallback for any li without an <a>
             li.style.display = text.includes(filter) ? "" : "none";
        }
       
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
