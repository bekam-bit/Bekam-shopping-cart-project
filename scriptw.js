"use strict";

const shoppingCart = document.querySelector(".shopping-cart-lists");
const cartTotalElement = document.querySelector(".cart-summary p");
const checkoutForm = document.querySelector(".form-submit");
const cashInput = document.getElementById("cash");
const receiptCash = document.querySelector(".receipt-list:nth-child(1)");
const receiptBalance = document.querySelector(".receipt-list:nth-child(2)");
const receiptReturned = document.querySelector(".receipt-list:nth-child(3)");
const addToCartButtons = document.querySelectorAll(".btn-cart");
const cartSummary = document.querySelector(".cart-summary");

const fruits = [
  { id: 1, name: "1 kg of Cherries", price: 300, quantity: 1},
  { id: 2, name: "1 kg of Strawberries", price: 400, quantity: 1},
  { id: 3, name: "1 kg of Oranges", price: 150, quantity: 1},
  { id: 4, name: "1 kg of Grapes", price: 450, quantity: 1},
  { id: 5, name: "1 kg of Avocados", price: 60, quantity: 1},
  { id: 6, name: "1 kg of Watermelons", price: 200, quantity: 1},
  { id: 7, name: "1 kg of Apples", price: 250, quantity: 1},
  { id: 8, name: "1 kg of Yellow Pears", price: 120, quantity: 1},
  { id: 9, name: "1 kg of Papayas", price: 120, quantity: 1},
  { id: 10, name: "1 kg of Bananas", price: 50, quantity: 1},
  { id: 11, name: "1 kg of Pineapples", price: 160, quantity: 1},
];

let cart = [];

function renderCart() {
  shoppingCart.innerHTML = ""; // Clear previous items

  if (cart.length === 0) {
    shoppingCart.innerHTML = "<p>Your cart is empty</p>";
    shoppingCart.style.opacity = "1";
    cartTotalElement.textContent = "Cart Total: 0 br";
    return;
  }

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");

    const total = item.quantity * item.price;

    const cartButtonsDiv = document.createElement("div");
    cartButtonsDiv.classList.add("cart-buttons");

    cartButtonsDiv.innerHTML = `
    <button class="increase-btn" data-id="${item.id}">+</button>
    <button class="decrease-btn" data-id="${item.id}">-</button>
    <button class="remove-btn" data-id="${item.id}">Remove</button>
  `;

    cartItemDiv.innerHTML = `
            <p class="cart-name">${item.name}</p>
            <p class="cart-info1">Price: ${item.price} </p>
            <p class="cart-info2">Quantiy: ${item.quantity}</p>
            <p class="cart-info3">Total: ${total} </p>
            `;

    cartItemDiv.appendChild(cartButtonsDiv);

    shoppingCart.appendChild(cartItemDiv);
  });
  shoppingCart.style.opacity = "1";

  calculateTotal();
}

function addToCart(fruitId) {
  const fruit = fruits.find((p) => p.id === fruitId);
  if (fruit) {
    const cartItem = cart.find((item) => item.id === fruitId);
    if (cartItem) {
      cartItem.quantity;
    } else {
      cart.push({ ...fruit, quantity: 1 }); // Add new item to cart
    }
  }
  renderCart();
  toggleAddToCartButton(fruitId);
}

function toggleAddToCartButton(fruitId) {
  const button = document.querySelector(`.btn-cart[data-id="${fruitId}"]`);
  const cartItem = cart.find((item) => item.id === fruitId);

  if (cartItem) {
    button.textContent = "Added"; // Change button text to "Added" if item is in the cart
    button.disabled = true; // Optionally, disable the button after adding
  } else {
    button.textContent = "Add to Cart"; // Change button text back to "Add to Cart"
    button.disabled = false; // Re-enable button if item is removed
  }
}

function increaseQuantity(fruitId) {
  const cartItem = cart.find((item) => item.id === fruitId);
  if (cartItem) {
    cartItem.quantity += 1;
    renderCart();
  }
}

function decreaseQuantity(fruitId) {
  const cartItem = cart.find((item) => item.id === fruitId);
  if (cartItem && cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    renderCart();
  } else {
    removeFromCart(fruitId);
  }
}

function calculateTotal() {
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  cartTotalElement.textContent = `Cart Total: ${total} br`;
}

function removeFromCart(fruitId) {
  cart = cart.filter((item) => item.id !== fruitId);
  renderCart();
  toggleAddToCartButton(fruitId);
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const fruitId = parseInt(event.target.getAttribute("data-id"));
    addToCart(fruitId);
  });
});

// Event delegation for cart buttons (increase, decrease, remove)
shoppingCart.addEventListener("click", (event) => {
  const target = event.target;
  const fruitId = parseInt(target.getAttribute("data-id"));

  if (target.classList.contains("increase-btn")) {
    increaseQuantity(fruitId);
  } else if (target.classList.contains("decrease-btn")) {
    decreaseQuantity(fruitId);
  } else if (target.classList.contains("remove-btn")) {
    removeFromCart(fruitId);
  }
});

cashInput.addEventListener("input", function () {
  // If input is negative or not a number, reset to empty
  if (isNaN(cashInput.value) || cashInput.value < 0) {
    cashInput.value = "";
  }
});

const errorMessage = document.createElement("p");
const successMessage = document.createElement("p");

checkoutForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  if (cart.length === 0) {
    alert("No cart added");
    return (cashInput.value = "");
  }

  let cashReceived = parseFloat(cashInput.value);
  let cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  errorMessage.textContent = "";
  successMessage.textContent = "";

  receiptCash.textContent = `Cash Received: ${cashReceived} br`;

  if (cashReceived < cartTotal) {
    errorMessage.textContent = ` Please pay an additional amount.`;
    cartSummary.appendChild(errorMessage);

    let balance = cartTotal - cashReceived;
    receiptBalance.textContent = `Remaining Balance: ${balance} br`;

    receiptReturned.textContent = `Cash Returned: 0 br`;

    return;
  }

  let balance = cashReceived - cartTotal;
  receiptBalance.textContent = `Remaining Balance: 0 br`;

  receiptReturned.textContent = `Cash Returned: ${balance} br`;

  successMessage.textContent = "Payment finished successfully. Thank You!";
  cartSummary.appendChild(successMessage);
  // Reset cart
  cart = [];
  renderCart();
  cashInput.value = "";

  addToCartButtons.forEach((button) => {
    button.textContent = "Add to Cart";
    button.disabled = false;
  });
});

// Call renderCart() when the page loads
document.addEventListener("DOMContentLoaded", renderCart);
