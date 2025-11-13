// ---- Product catalog ----
const PRODUCTS = {
  dime353: {
    id: "dime353",
    name: 'Tip Shaper – Dime (.353")',
    sku: "CC-DIME-353",
    price: 15.0,
    minQty: 10,
  },
  nickel418: {
    id: "nickel418",
    name: 'Tip Shaper – Nickel (.418")',
    sku: "CC-NICKEL-418",
    price: 15.0,
    minQty: 10,
  },
  keychain: {
    id: "keychain",
    name: "CueCube Keychain – Nickel",
    sku: "CC-KEY-NICKEL",
    price: 15.0,
    minQty: 20,
  },
};

let cart = {};

// ---- Cart storage helpers ----
function loadCart() {
  try {
    const raw = localStorage.getItem("cuecube_cart");
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    console.error("Failed to load cart", e);
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("cuecube_cart", JSON.stringify(cart));
  } catch (e) {
    console.error("Failed to save cart", e);
  }
}

// ---- Add to cart from products page ----
function addToCart(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;

  // найти инпут количества
  const qtyInput = document.getElementById(`qty_${productId}`);
  let qty = qtyInput ? parseInt(qtyInput.value, 10) : NaN;

  if (isNaN(qty) || qty <= 0) {
    alert("Please enter a valid quantity.");
    return;
  }

  if (qty < product.minQty) {
    alert(
      `Minimum order for ${product.name} is ${product.minQty} pcs.`
    );
    qty = product.minQty;
    if (qtyInput) qtyInput.value = String(product.minQty);
  }

  cart[productId] = qty;
  saveCart();
  renderCartPanel();
}

// ---- Render cart on products page ----
function renderCartPanel() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return; // не на этой странице

  container.innerHTML = "";
  let total = 0;

  const ids = Object.keys(cart);
  if (ids.length === 0) {
    container.innerHTML = "<p class='muted'>No items in order yet.</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  ids.forEach((id) => {
    const product = PRODUCTS[id];
    if (!product) return;
    const qty = cart[id];
    const lineTotal = product.price * qty;
    total += lineTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    const left = document.createElement("div");
    left.className = "cart-item-left";
    left.innerHTML = `
      <div class="cart-item-name">${product.name}</div>
      <div class="cart-item-sub">
        ${product.sku} • $${product.price.toFixed(2)} × ${qty}
      </div>
    `;

    const right = document.createElement("div");
    right.className = "cart-item-right";
    right.textContent = `$${lineTotal.toFixed(2)}`;

    itemDiv.appendChild(left);
    itemDiv.appendChild(right);
    container.appendChild(itemDiv);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ---- Go to checkout ----
function goToCheckout() {
  saveCart();
  window.location.href = "checkout.html";
}

// ---- Render summary on checkout page ----
function renderCheckoutSummary() {
  const container = document.getElementById("checkoutSummary");
  const totalEl = document.getElementById("checkoutTotal");

  if (!container || !totalEl) return; // не на checkout

  container.innerHTML = "";
  let total = 0;
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    container.innerHTML =
      "<p class='muted'>Your order is empty. Go back to the catalog to add items.</p>";
    totalEl.textContent = "$0.00";
    return;
  }

  ids.forEach((id) => {
    const product = PRODUCTS[id];
    if (!product) return;
    const qty = cart[id];
    const lineTotal = product.price * qty;
    total += lineTotal;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    const left = document.createElement("div");
    left.className = "cart-item-left";
    left.innerHTML = `
      <div class="cart-item-name">${product.name}</div>
      <div class="cart-item-sub">
        ${product.sku} • $${product.price.toFixed(2)} × ${qty}
      </div>
    `;

    const right = document.createElement("div");
    right.className = "cart-item-right";
    right.textContent = `$${lineTotal.toFixed(2)}`;

    itemDiv.appendChild(left);
    itemDiv.appendChild(right);
    container.appendChild(itemDiv);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ---- Checkout form handler ----
function initCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  const msg = document.getElementById("checkoutMessage");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // здесь ты позже сможешь отправить данные на сервер / в ShipStation API
    const formData = new FormData(form);
    console.log("Checkout data:", Object.fromEntries(formData.entries()));
    console.log("Cart:", cart);

    if (msg) {
      msg.textContent =
        "Thank you! Your wholesale order request has been recorded. A sales representative will contact you to confirm pricing and shipping.";
    }

    // опционально можно очистить корзину:
    // cart = {};
    // saveCart();
    // renderCheckoutSummary();
  });
}

// ---- Init on page load ----
document.addEventListener("DOMContentLoaded", () => {
  cart = loadCart();
  renderCartPanel();
  renderCheckoutSummary();
  initCheckoutForm();
});
