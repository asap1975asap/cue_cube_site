// ===== products data aligned with your filenames =====
const PRODUCTS = {
  dime353: {
    id: "dime353",
    name: 'Tip Shaper – Dime (.353")',
    sku: "CC-DIME-353",
    price: 15,
    min: 10,
    images: [
      "img/cue-cube-grey-353-1.jpg",
      "img/cue-cube-grey-353-2.jpg",
      "img/cue-cube-grey-353-3.jpg",
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
      "img/cue-cube-grey-418-1.jpg",
      "img/cue-cube-grey-418-2.jpg",
      "img/cue-cube-grey-418-3.jpg",
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
      "img/cue-cube-keychain-353-1.jpg",
      "img/cue-cube-keychain-353-2.jpg",
      "img/cue-cube-keychain-353-3.jpg",
    ],
    desc: "Keyring version, great counter item for billiard stores.",
  },
};

// ===== login =====
const form = document.getElementById("loginForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    window.location.href = "products.html";
  });
}

// ===== cart =====
let CART = JSON.parse(localStorage.getItem("cuecube_cart") || "[]");

function saveCart() {
  localStorage.setItem("cuecube_cart", JSON.stringify(CART));
}

function renderCart() {
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!list) return;

  list.innerHTML = "";
  let total = 0;

  CART.forEach((item) => {
    const line = document.createElement("div");
    line.className = "cart-item";
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    line.innerHTML = `
      <div>
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-meta">${item.sku} • $${item.price.toFixed(
          2
        )} × ${item.qty}</div>
      </div>
      <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
    `;
    list.appendChild(line);
  });

  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}
renderCart();

const checkoutBtn = document.getElementById("cartCheckout");
checkoutBtn?.addEventListener("click", () => {
  if (!CART.length) {
    alert("Your wholesale order is empty.");
  } else {
    alert("Demo checkout — here we would send order to sales.");
  }
});

// ===== modal on products.html =====
const orderBtns = document.querySelectorAll(".order-btn");
const qtyModal = document.getElementById("qtyModal");
const qtyTitle = document.getElementById("qtyTitle");
const qtyMin = document.getElementById("qtyMin");
const qtyInput = document.getElementById("qtyInput");
const qtyAdd = document.getElementById("qtyAdd");
const qtyCancel = document.getElementById("qtyCancel");
let currentProductId = null;

function openModal(pid) {
  const p = PRODUCTS[pid];
  if (!p) return;
  currentProductId = pid;
  qtyTitle.textContent = `Add: ${p.name}`;
  qtyMin.textContent = `Minimum order: ${p.min} pcs`;
  qtyInput.value = p.min;
  qtyInput.min = p.min;
  qtyModal.classList.add("open");
}

function closeModal() {
  qtyModal.classList.remove("open");
  currentProductId = null;
}

function addToCart(pid, qty) {
  const p = PRODUCTS[pid];
  if (!p) return;
  const existing = CART.find((i) => i.id === pid);
  if (existing) existing.qty += qty;
  else CART.push({ id: p.id, name: p.name, sku: p.sku, price: p.price, qty });
  saveCart();
  renderCart();
}

orderBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    openModal(btn.dataset.product);
  });
});
qtyCancel?.addEventListener("click", closeModal);
qtyAdd?.addEventListener("click", () => {
  const q = parseInt(qtyInput.value, 10) || 0;
  const min = parseInt(qtyInput.min, 10) || 1;
  addToCart(currentProductId, Math.max(q, min));
  closeModal();
});
qtyModal?.addEventListener("click", (e) => {
  if (e.target === qtyModal) closeModal();
});

// ===== product.html page =====
const detail = document.getElementById("productDetail");
if (detail) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("product");
  const p = PRODUCTS[id];

  if (!p) {
    detail.innerHTML = "<p>Product not found</p>";
  } else {
    detail.innerHTML = `
      <div class="product-detail-left">
        <div class="product-detail-mainimg">
          <img id="detailMainImg" src="${p.images[0]}" alt="${p.name}" />
        </div>
        <div class="product-detail-thumbs" id="detailThumbs">
          ${p.images
            .map(
              (img, i) =>
                `<img src="${img}" class="detail-thumb ${
                  i === 0 ? "active" : ""
                }" data-img="${img}" />`
            )
            .join("")}
        </div>
      </div>
      <div class="product-detail-right">
        <h1>${p.name}</h1>
        <p class="sku">${p.sku}</p>
        <p class="desc">${p.desc}</p>
        <label for="detailQty">Quantity (min ${p.min})</label>
        <input id="detailQty" type="number" value="${p.min}" min="${p.min}" />
        <button class="detail-add" data-product="${p.id}">Add to order</button>
      </div>
    `;

    const mainImg = document.getElementById("detailMainImg");
    const thumbs = document.querySelectorAll(".detail-thumb");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        mainImg.src = thumb.dataset.img;
        thumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    const addBtn = document.querySelector(".detail-add");
    const detailQty = document.getElementById("detailQty");
    addBtn.addEventListener("click", () => {
      const q = parseInt(detailQty.value, 10) || p.min;
      addToCart(p.id, Math.max(q, p.min));
      alert("Added to order.");
    });
  }
}
