// ====== простая "авторизация" на фронте ======
(function () {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const errorEl = document.getElementById('loginError');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const validEmail = 'demo@cuecube.com';
    const validPassword = '123Qwerty123';

    if (email === validEmail && password === validPassword) {
      errorEl.hidden = true;
      window.location.href = 'products.html';
    } else {
      errorEl.hidden = false;
    }
  });
})();

// ====== работа с корзиной (localStorage) ======

const STORAGE_KEY = 'cuecubeCart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function formatMoney(n) {
  return `$${n.toFixed(2)}`;
}

// Отрисовка корзины на products.html
function renderCartOnProducts() {
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!container || !totalEl) return;

  const cart = loadCart();
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML =
      '<p class="cart-item-meta">No items yet. Select quantity and add to order.</p>';
    totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-main">
        <div class="cart-item-name">${item.name}</div>
        <div>${formatMoney(lineTotal)}</div>
      </div>
      <div class="cart-item-meta">
        ${item.sku} • ${item.qty} pcs × ${formatMoney(item.price)}
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = formatMoney(total);
}

// Обработчики на странице products.html
(function () {
  const productsPage = document.querySelector('.page-products');
  if (!productsPage) return;

  // первичный рендер корзины
  renderCartOnProducts();

  // клики по кнопкам "Add to order"
  document.querySelectorAll('.product-card').forEach((card) => {
    const addBtn = card.querySelector('.product-add');
    const qtyInput = card.querySelector('.qty-input');
    if (!addBtn || !qtyInput) return;

    addBtn.addEventListener('click', () => {
      const id = card.dataset.id;
      const name = card.dataset.name;
      const sku = card.dataset.sku;
      const price = parseFloat(card.dataset.price || '0');
      const min = parseInt(card.dataset.min || '1', 10);
      const qty = parseInt(qtyInput.value, 10);

      if (!qty || qty < min) {
        alert(`Minimum order for this item is ${min} pcs.`);
        qtyInput.value = min;
        qtyInput.focus();
        return;
      }

      const cart = loadCart();
      const existing = cart.find((i) => i.id === id);
      if (existing) {
        existing.qty = qty;
      } else {
        cart.push({ id, name, sku, price, qty });
      }

      saveCart(cart);
      renderCartOnProducts();
    });
  });

  // переход в checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
})();

// Отрисовка заказа на странице checkout.html
(function () {
  const summaryContainer = document.getElementById('summaryItems');
  const summaryTotal = document.getElementById('summaryTotal');
  if (!summaryContainer || !summaryTotal) return;

  const cart = loadCart();

  if (!cart.length) {
    summaryContainer.innerHTML =
      '<p class="cart-item-meta">Your order is empty. Go back to the catalog to add items.</p>';
    summaryTotal.textContent = '$0.00';
  } else {
    let total = 0;
    cart.forEach((item) => {
      const lineTotal = item.price * item.qty;
      total += lineTotal;

      const div = document.createElement('div');
      div.className = 'summary-item';
      div.innerHTML = `
        <div class="cart-item-main">
          <div class="cart-item-name">${item.name}</div>
          <div>${formatMoney(lineTotal)}</div>
        </div>
        <div class="cart-item-meta">
          ${item.sku} • ${item.qty} pcs × ${formatMoney(item.price)}
        </div>
      `;
      summaryContainer.appendChild(div);
    });

    summaryTotal.textContent = formatMoney(total);
  }

  const form = document.getElementById('checkoutForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(
        'Demo only.\n\nYour order request form would be sent to CueCube sales in a real deployment.'
      );
    });
  }
})();
