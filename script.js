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

// --- FAVORITES BAR LOGIC ---

const favoritesList = document.getElementById('favorites-list');
const FAVORITES_LIMIT = 5; // Set the limit to 5

/**
 * Ensures a favorite object has the correct structure (href, text, count).
 * Handles old string-only formats or missing properties.
 * @param {string|object} favData The raw favorite data from localStorage.
 * @returns {object} A well-formed favorite object.
 */
function cleanFavoriteData(favData) {
    if (typeof favData === 'string') {
        // Handle very old format (just URL string)
        const originalLink = document.querySelector(`a[href="${favData}"]`);
        return {
            href: favData,
            text: originalLink ? originalLink.textContent : favData, // Use link text or fallback to URL
            count: 1 // Assign a default count for old links
        };
    } else if (typeof favData === 'object' && favData !== null) {
        // Handle object format, ensure properties exist and are correct types
        const cleanedFav = {
            href: favData.href || '', // Ensure href exists
            text: favData.text || favData.href || '', // Ensure text exists, fallback to href
            count: (typeof favData.count === 'number' && !isNaN(favData.count)) ? favData.count : 1 // Ensure count is a valid number
        };
        return cleanedFav;
    }
    // Fallback for unexpected data format
    return { href: '', text: 'Invalid Link', count: 1 };
}

// Function to render the favorites list
function renderFavorites() {
    // Clear existing list items
    favoritesList.innerHTML = '';

    // Get favorites from localStorage, and clean/normalize the data immediately
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.map(cleanFavoriteData);

    // Sort favorites by count in descending order
    favorites.sort((a, b) => b.count - a.count);

    // Take only the top N links based on FAVORITES_LIMIT
    const topFavorites = favorites.slice(0, FAVORITES_LIMIT);

    // Populate the list with the sorted and limited favorites
    topFavorites.forEach(fav => {
        const li = document.createElement('li');
        const a = document.createElement('a'); // Create the <a> element
        a.href = fav.href; // Set its href attribute
        a.textContent = fav.text; // Set its display text (NO COUNT HERE)
        
        // Add a class for identifying favorite items, useful for click-to-remove
        a.classList.add('favorite-item-link'); 
        
        // Optional: Add a title with the count for debugging/info on hover
        a.title = `Clicked ${fav.count} times`; 
        
        li.appendChild(a); // Append the <a> to the <li>
        favoritesList.appendChild(li); // Append the <li> (which now contains an <a>) to the ul
    });

    // Save the potentially cleaned/updated favorites back to localStorage after rendering.
    // This helps clean up old formats over time as users visit the page.
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initial render of favorites on page load
window.addEventListener('load', renderFavorites);


// Add click listener to all general links to handle last visited and update/add to favorites count
document.querySelectorAll("section a").forEach(link => { // Target links within sections only
    link.addEventListener("click", (event) => {
        // Don't prevent default navigation here, let the link navigate normally.
        
        localStorage.setItem("last-visited", link.href);

        // Get favorites, and clean/normalize the data *before* processing
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites = favorites.map(cleanFavoriteData);

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

// Add click listener to the favorites list itself for removal functionality
favoritesList.addEventListener('click', (event) => {
    const clickedLink = event.target.closest('.favorite-item-link'); // Find the clicked <a> with the class
    
    if (clickedLink) {
        // Prevent default navigation for the clicked favorite item, as we're handling its click
        event.preventDefault(); 

        const linkHref = clickedLink.href;
        const linkText = clickedLink.textContent;

        if (confirm(`Do you want to remove "${linkText}" from your favorites?`)) {
            let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            favorites = favorites.map(cleanFavoriteData); // Clean data before filtering

            // Filter out the item to be removed
            favorites = favorites.filter(fav => fav.href !== linkHref);

            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites(); // Re-render the list
        } else {
            // If user cancels removal, navigate to the link normally
            window.location.href = linkHref;
        }
    }
});


// --- END FAVORITES BAR LOGIC ---

// Search filter
document.getElementById('search').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    // Select all <li> elements that are descendants of <section> and <ul>
    document.querySelectorAll('section ul li').forEach(li => {
        const aTag = li.querySelector('a'); // Get the anchor tag within the list item
        if (aTag) {
            const text = aTag.textContent.toLowerCase(); // Use the text content of the anchor
            li.style.display = text.includes(filter) ? "" : "none";
        } else {
            // Fallback for li elements that might not contain an <a> (though they should in this structure)
            const text = li.textContent.toLowerCase();
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
