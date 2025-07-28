function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  const date = document.getElementById("date");

  // Subtract 4 hours to correct the time
  now.setHours(now.getHours() - 4);

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clock.textContent = `${hours}:${minutes}:${seconds}`;

  // Using 'en-US' locale for consistency, you can change 'undefined' back if you prefer
  const options = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
  date.textContent = now.toLocaleDateString('en-US', options);
}

setInterval(updateClock, 1000);
updateClock();
