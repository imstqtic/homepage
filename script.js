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
