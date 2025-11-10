// === PRODUCT DATA ===
const PRODUCTS = {
  dime353: {
    id: "dime353",
    name: 'Tip Shaper – Dime (.353")',
    sku: "CC-DIME-353",
    price: 15,
    min: 10,
    images: [
      "img/cuecube_353_01.jpg",
      "img/cuecube_353_02.jpg",
      "img/cuecube_353_03.jpg",
    ],
    desc: "Standard finish, scuff & shape, made in U.S.A.",
  },
  nickel418: {
    id: "nickel418",
    name: 'Tip Shaper – Nickel (.418")',
    sku: "CC-NICKEL-418",
    price: 15,
    min: 10,
    images: [
      "img/cuecube_418_01.jpg",
      "img/cuecube_418_02.jpg",
      "img/cuecube_418_03.jpg",
    ],
    desc: "Nickel radius for most popular cue tips.",
  },
  keychain: {
    id: "keychain",
    name: "CueCube Keychain – Nickel",
    sku: "CC-KEY-NICKEL",
    price: 15,
    min: 20,
    images: [
      "img/cuecube_keychain_01.jpg",
      "img/cuecube_keychain_02.jpg",
      "img/cuecube_keychain_03.jpg",
    ],
    desc: "Keyring version, perfect for billiard shop counters.",
  },
};

// === LOGIN HANDLER ===
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "products.html";
  });
}

// === CART LOGIC ===
let CART = JSON.parse(localStorage.getItem("cuecube_cart") || "[]");

function saveCart() {
  localStorage.setItem("cuecube_cart", JSON.stringify(CART));
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  if (!cartItems) return;
  cartItems.innerHTML = "";
  let total = 0;

  CART.forEach((item) => {
    const line = document.createElement("div");
    line.className = "cart-item";
    const sum = item.qty * item.price;
    total += sum;
    line.innerHTML = `<div>${item.name}<br><small>${item.sku}</small></div><div>$${sum.toFixed(
      2
    )}</div>`;
    cartItems.appendChild(line);
  });
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

renderCart();

// === ADD TO CART MODAL (products.html) ===
const orderBtns = document.querySelectorAll(".order-btn");
const qtyModal = document.getElementById("qtyModal");
const qtyInput = document.getElementById("qtyInput");
const qtyAdd = document.getElementById("qtyAdd");
const qtyCancel = document.getElementById("qtyCancel");
let currentProduct = null;

function openModal(id) {
  currentProduct = id;
  const product = PRODUCTS[id];
  if (product && qtyInput) qtyInput.value = product.min;
  qtyModal?.classList.add("open");
}
function closeModal() {
  qtyModal?.classList.remove("open");
  currentProduct = null;
}
function addToCart(id, qty) {
  const prod = PRODUCTS[id];
  if (!prod) return;
  const found = CART.find((x) => x.id === id);
  if (found) found.qty += qty;
  else CART.push({ id, name: prod.name, sku: prod.sku, price: prod.price, qty });
  saveCart();
  renderCart();
}

orderBtns.forEach((btn) =>
  btn.addEventListener("click", () => openModal(btn.dataset.product))
);
qtyCancel?.addEventListener("click", closeModal);
qtyAdd?.addEventListener("click", () => {
  const qty = parseInt(qtyInput.value) || 1;
  addToCart(currentProduct, qty);
  closeModal();
});

// === PRODUCT DETAIL PAGE ===
const detail = document.getElementById("productDetail");
if (detail) {
  const id = new URLSearchParams(window.location.search).get("product");
  const p = PRODUCTS[id];
  if (!p) {
    detail.innerHTML = "<p>Product not found.</p>";
  } else {
    detail.innerHTML = `
      <div class="product-detail-left">
        <div class="product-detail-mainimg">
          <img id="mainImg" src="${p.images[0]}" alt="${p.name}">
        </div>
        <div class="product-detail-thumbs">
          ${p.images
            .map(
              (img, i) =>
                `<img class="detail-thumb ${
                  i === 0 ? "active" : ""
                }" src="${img}" data-img="${img}">`
            )
            .join("")}
        </div>
      </div>
      <div class="product-detail-right">
        <h1>${p.name}</h1>
        <p class="sku">${p.sku}</p>
        <p class="desc">${p.desc}</p>
        <label>Quantity (min ${p.min})</label>
        <input id="detailQty" type="number" value="${p.min}" min="${p.min}">
        <button class="detail-add">Add to order</button>
      </div>`;

    const mainImg = document.getElementById("mainImg");
    const thumbs = document.querySelectorAll(".detail-thumb");
    thumbs.forEach((t) =>
      t.addEventListener("click", () => {
        mainImg.src = t.dataset.img;
        thumbs.forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
      })
    );
    document
      .querySelector(".detail-add")
      .addEventListener("click", () => {
        const qty = parseInt(document.getElementById("detailQty").value) || p.min;
        addToCart(id, Math.max(qty, p.min));
        alert("Added to order.");
      });
  }
}
