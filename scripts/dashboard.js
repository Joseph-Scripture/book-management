
const totalBooks = document.querySelector('.line-value')

const API_BASE = "https://53911fcfda7e.ngrok-free.app"; 
const BOOKS_ENDPOINT = `${API_BASE}/books`; 
function getToken() {
 
  return localStorage.getItem("token");
}

async function fetchBooks() {
  const token = getToken();
  const response = await fetch(BOOKS_ENDPOINT, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
}

function updateBookStats(books) {
  const total = books.length;
  const issued = books.filter(b => b.status === "issued").length;
  const returned = books.filter(b => b.status === "returned").length;
  const pending = books.filter(b => b.status === "pending").length;

  totalBooks.textContent = `issued today:${total}`;
  document.querySelector('.stat-value.issued-books').textContent = issued;
  document.querySelector('.stat-value.returned-books').textContent = returned;
  document.querySelector('.stat-value.pending-books').textContent = pending;

  // If using Chart.js, update chart data here
}

window.onload = async () => {
  try {
    const books = await fetchBooks();
    updateBookStats(books);
    // You can also call your Chart.js update logic here
  } catch (err) {
    console.error(err);
    // Optionally show error to user
  }
};