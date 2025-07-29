function updateClock() {
  const now = new Date(); // This gets the client's current date and time

  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  // --- IMPORTANT: CHOOSE YOUR DESIRED TIME ZONE ---
  // For example, if you are in New York (Eastern Time), use 'America/New_York'.
  // If you are in California (Pacific Time), use 'America/Los_Angeles'.
  // If you are in London, use 'Europe/London'.
  // Find your exact IANA time zone identifier from:
  // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  const desiredTimeZone = 'America/New_York'; // <--- **CHANGE THIS TO YOUR ACTUAL TIME ZONE**

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: desiredTimeZone // Specify the desired time zone
  };

  const dateOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: desiredTimeZone // Specify the desired time zone
  };

  // Get the time and date strings formatted for the specified time zone
  const timeString = now.toLocaleTimeString('en-US', timeOptions);
  const dateString = now.toLocaleDateString('en-US', dateOptions);

  clock.textContent = timeString;
  date.textContent = dateString;
}

// Update the clock every second
setInterval(updateClock, 1000);

// Initial call to display the clock immediately
updateClock();

// 🧠 Scroll position memory
window.addEventListener("beforeunload", () => {
  localStorage.setItem("scroll-pos", window.scrollY);
});
window.addEventListener("load", () => {
  const y = parseInt(localStorage.getItem("scroll-pos") || "0", 10);
  window.scrollTo(0, y);
});

// 🧭 Track last visited link
document.querySelectorAll("li[data-id] a").forEach(link => {
  link.addEventListener("click", () => {
    localStorage.setItem("last-visited", link.href);
  });
});

// 🔎 Highlight last visited link
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
