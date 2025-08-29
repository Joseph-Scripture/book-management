const books = [
    { id: 1, name:"Charlie and the Chocolate Factory", author:"Roald Dahl",  price: 15 },
    { id: 2, name:"Dune", author:"Frank Herbert", price: 20 },
    { id: 3, name:"Twisted Lies", author:"Ana Huang", price: 25 },
    { id: 3, name:"The Odyssey", author:"Homer", price: 30 }
];

let cart = [];

function renderBooks() {
    const booksDiv = document.getElementById('books');
    booksDiv.innerHTML = '';
    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book';
        div.innerHTML = `
            <span>${book.name} - $${book.price}</span>
            <button onclick="addToCart(${book.id})">Add to Cart</button>
        `;
        booksDiv.appendChild(div);
    });
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    if (cart.length === 0) {
        cartDiv.innerHTML = '<em>Your cart is empty.</em>';
        return;
    }
    cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} - $${item.price}</span>
            <button onclick="removeFromCart(${idx})">Remove</button>
        `;
        cartDiv.appendChild(div);
    });
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-item';
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    cartDiv.appendChild(totalDiv);
}

window.addToCart = function(id) {
    const book = books.find(b => b.id === id);
    cart.push(book);
    renderCart();
};

window.removeFromCart = function(idx) {
    cart.splice(idx, 1);
    renderCart();
};

document.getElementById('payment-form').onsubmit = function(e) {
    e.preventDefault();
    if (cart.length === 0) {
        document.getElementById('payment-message').textContent = "Cart is empty!";
        return;
    }
    document.getElementById('payment-message').textContent = "Payment successful! Thank you.";
    cart = [];
    renderCart();
    this.reset();
};

renderBooks();
renderCart();