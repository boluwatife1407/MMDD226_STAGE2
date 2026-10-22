// Local JSON Filler Data (Embedded Fallback + Async Fetch)
let menuData = {
  "deliveryMethods": ["Delivery", "Pickup"],
  "breads": [
    { "id": "b1", "name": "Italian White", "price": 5.99, "icon": "🥖" },
    { "id": "b2", "name": "Whole Wheat", "price": 6.49, "icon": "🌾" },
    { "id": "b3", "name": "Italian Herbs & Cheese", "price": 6.99, "icon": "🧀🥖" },
    { "id": "b4", "name": "Honey Oat", "price": 6.79, "icon": "🍯🌾" }
  ],
  "ingredients": {
    "proteins": [
      { "id": "p1", "name": "Turkey Breast", "price": 2.00, "icon": "🦃" },
      { "id": "p2", "name": "Roast Beef", "price": 2.50, "icon": "🥩" },
      { "id": "p3", "name": "Tuna", "price": 2.00, "icon": "🐟" },
      { "id": "p4", "name": "Veggie Patty", "price": 1.75, "icon": "🧆" }
    ],
    "cheeses": [
      { "id": "c1", "name": "American Cheese", "price": 0.50, "icon": "🧀" },
      { "id": "c2", "name": "Cheddar", "price": 0.50, "icon": "🧀" },
      { "id": "c3", "name": "Provolone", "price": 0.75, "icon": "🧀" },
      { "id": "c4", "name": "Swiss", "price": 0.75, "icon": "🧀" }
    ],
    "veggies": [
      { "id": "v1", "name": "Lettuce", "price": 0.00, "icon": "🥬" },
      { "id": "v2", "name": "Tomatoes", "price": 0.00, "icon": "🍅" },
      { "id": "v3", "name": "Cucumbers", "price": 0.00, "icon": "🥒" },
      { "id": "v4", "name": "Green Peppers", "price": 0.00, "icon": "🫑" },
      { "id": "v5", "name": "Onions", "price": 0.00, "icon": "🧅" },
      { "id": "v6", "name": "Pickles", "price": 0.00, "icon": "🥒" }
    ],
    "sauces": [
      { "id": "s1", "name": "Mayonnaise", "price": 0.00, "icon": "🧴" },
      { "id": "s2", "name": "Honey Mustard", "price": 0.00, "icon": "🍯" },
      { "id": "s3", "name": "Chipotle Southwest", "price": 0.00, "icon": "🌶️" },
      { "id": "s4", "name": "Oil & Vinegar", "price": 0.00, "icon": "🫗" }
    ]
  },
  "drinks": [
    { "id": "d1", "name": "Fountain Soda (16 oz)", "price": 1.99, "icon": "🥤" },
    { "id": "d2", "name": "Bottled Water", "price": 1.49, "icon": "💧" },
    { "id": "d3", "name": "Fresh Iced Tea", "price": 2.29, "icon": "🍹" },
    { "id": "d4", "name": "Lemonade", "price": 2.29, "icon": "🍋" }
  ]
};

// Application State
let appState = {
  currentStep: 1,
  deliveryMethod: "Delivery",
  address: "",
  cart: []
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      menuData = data;
      renderMenuOptions();
    })
    .catch(() => {
      renderMenuOptions();
    });
});

// Navigate between flowchart steps
function goToStep(stepNum) {
  if (appState.currentStep === 1) {
    const selectedMethod = document.querySelector('input[name="deliveryMethod"]:checked');
    if (selectedMethod) appState.deliveryMethod = selectedMethod.value;
  }

  if (appState.currentStep === 2 && stepNum > 2) {
    const street = document.getElementById("streetAddress").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zipCode").value.trim();

    if (!street || !city || !zip) {
      alert("Please fill in all address fields to continue.");
      return;
    }
    appState.address = `${street}, ${city} ${zip}`;
  }

  document.getElementById("summaryDelivery").textContent = appState.deliveryMethod;
  document.getElementById("summaryAddress").textContent = appState.address || "Not provided";

  document.querySelectorAll(".step-card").forEach((card) => card.classList.remove("active"));
  const targetCard = document.getElementById(`step-${stepNum}`);
  if (targetCard) targetCard.classList.add("active");

  document.querySelectorAll(".step-badge").forEach((badge) => {
    const bStep = parseInt(badge.getAttribute("data-step"), 10);
    if (bStep === stepNum) {
      badge.classList.add("active");
    } else {
      badge.classList.remove("active");
    }
  });

  appState.currentStep = stepNum;

  if (stepNum === 5) {
    updateLiveSubPreview();
  }

  if (stepNum === 7 || stepNum === 8) {
    renderCartUI();
  }
}

// Render dynamic options & attach live preview listeners
function renderMenuOptions() {
  // Breads
  const breadContainer = document.getElementById("breadList");
  if (breadContainer) {
    breadContainer.innerHTML = menuData.breads
      .map(
        (b, idx) => `
        <label class="item-option">
          <input type="radio" name="selectedBread" value="${b.id}" ${idx === 0 ? "checked" : ""}>
          <div class="item-details">
            <span class="item-name">${b.icon || '🥖'} ${b.name}</span>
            <span class="item-price">$${b.price.toFixed(2)}</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Proteins
  const proteinContainer = document.getElementById("proteinList");
  if (proteinContainer) {
    proteinContainer.innerHTML = menuData.ingredients.proteins
      .map(
        (p) => `
        <label class="item-option">
          <input type="checkbox" name="selectedProtein" value="${p.id}">
          <div class="item-details">
            <span class="item-name">${p.icon || '🥩'} ${p.name}</span>
            <span class="item-price">+$${p.price.toFixed(2)}</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Cheeses
  const cheeseContainer = document.getElementById("cheeseList");
  if (cheeseContainer) {
    cheeseContainer.innerHTML = menuData.ingredients.cheeses
      .map(
        (c) => `
        <label class="item-option">
          <input type="checkbox" name="selectedCheese" value="${c.id}">
          <div class="item-details">
            <span class="item-name">${c.icon || '🧀'} ${c.name}</span>
            <span class="item-price">+$${c.price.toFixed(2)}</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Veggies
  const veggieContainer = document.getElementById("veggieList");
  if (veggieContainer) {
    veggieContainer.innerHTML = menuData.ingredients.veggies
      .map(
        (v) => `
        <label class="item-option">
          <input type="checkbox" name="selectedVeggie" value="${v.id}">
          <div class="item-details">
            <span class="item-name">${v.icon || '🥬'} ${v.name}</span>
            <span class="item-price">Free</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Sauces
  const sauceContainer = document.getElementById("sauceList");
  if (sauceContainer) {
    sauceContainer.innerHTML = menuData.ingredients.sauces
      .map(
        (s) => `
        <label class="item-option">
          <input type="checkbox" name="selectedSauce" value="${s.id}">
          <div class="item-details">
            <span class="item-name">${s.icon || '🧴'} ${s.name}</span>
            <span class="item-price">Free</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Drinks
  const drinkContainer = document.getElementById("drinkList");
  if (drinkContainer) {
    drinkContainer.innerHTML = menuData.drinks
      .map(
        (d) => `
        <label class="item-option">
          <input type="checkbox" name="selectedDrink" value="${d.id}">
          <div class="item-details">
            <span class="item-name">${d.icon || '🥤'} ${d.name}</span>
            <span class="item-price">+$${d.price.toFixed(2)}</span>
          </div>
        </label>
      `
      )
      .join("");
  }

  // Attach change event listeners to update live visual preview dynamically
  document.querySelectorAll('input[name="selectedBread"], input[name="selectedProtein"], input[name="selectedCheese"], input[name="selectedVeggie"], input[name="selectedSauce"]')
    .forEach((input) => {
      input.addEventListener("change", updateLiveSubPreview);
    });

  updateLiveSubPreview();
}

// Live Sub Ingredient Sandwich Stack Visualizer
function updateLiveSubPreview() {
  const stackContainer = document.getElementById("liveSubStack");
  if (!stackContainer) return;

  const breadRadio = document.querySelector('input[name="selectedBread"]:checked');
  const selectedBread = breadRadio ? menuData.breads.find((b) => b.id === breadRadio.value) : null;

  const selectedProteins = Array.from(document.querySelectorAll('input[name="selectedProtein"]:checked')).map((cb) =>
    menuData.ingredients.proteins.find((p) => p.id === cb.value)
  );

  const selectedCheeses = Array.from(document.querySelectorAll('input[name="selectedCheese"]:checked')).map((cb) =>
    menuData.ingredients.cheeses.find((c) => c.id === cb.value)
  );

  const selectedVeggies = Array.from(document.querySelectorAll('input[name="selectedVeggie"]:checked')).map((cb) =>
    menuData.ingredients.veggies.find((v) => v.id === cb.value)
  );

  const selectedSauces = Array.from(document.querySelectorAll('input[name="selectedSauce"]:checked')).map((cb) =>
    menuData.ingredients.sauces.find((s) => s.id === cb.value)
  );

  let layers = [];

  if (selectedBread) {
    layers.push({ name: `Top Bread (${selectedBread.name})`, icon: selectedBread.icon || "🥖", type: "bread-top" });
  }

  selectedSauces.forEach((s) => layers.push({ name: s.name, icon: s.icon || "🧴", type: "sauce" }));
  selectedVeggies.forEach((v) => layers.push({ name: v.name, icon: v.icon || "🥬", type: "veggie" }));
  selectedCheeses.forEach((c) => layers.push({ name: c.name, icon: c.icon || "🧀", type: "cheese" }));
  selectedProteins.forEach((p) => layers.push({ name: p.name, icon: p.icon || "🥩", type: "protein" }));

  if (selectedBread) {
    layers.push({ name: `Bottom Bread (${selectedBread.name})`, icon: selectedBread.icon || "🥖", type: "bread-bottom" });
  }

  if (layers.length === 0) {
    stackContainer.innerHTML = `<span class="placeholder-text">Select ingredients below to build your sub layers...</span>`;
    return;
  }

  stackContainer.innerHTML = layers
    .map(
      (layer) => `
      <div class="sub-layer-badge layer-${layer.type}">
        <span class="layer-icon">${layer.icon}</span>
        <span class="layer-name">${layer.name}</span>
      </div>
    `
    )
    .join("");
}

// Add current sub and optional drinks to cart state
function addCurrentSubToCart() {
  const breadRadio = document.querySelector('input[name="selectedBread"]:checked');
  if (!breadRadio) return;
  const bread = menuData.breads.find((b) => b.id === breadRadio.value);

  const selectedProteins = Array.from(document.querySelectorAll('input[name="selectedProtein"]:checked')).map((cb) =>
    menuData.ingredients.proteins.find((p) => p.id === cb.value)
  );

  const selectedCheeses = Array.from(document.querySelectorAll('input[name="selectedCheese"]:checked')).map((cb) =>
    menuData.ingredients.cheeses.find((c) => c.id === cb.value)
  );

  const selectedVeggies = Array.from(document.querySelectorAll('input[name="selectedVeggie"]:checked')).map((cb) =>
    menuData.ingredients.veggies.find((v) => v.id === cb.value)
  );

  const selectedSauces = Array.from(document.querySelectorAll('input[name="selectedSauce"]:checked')).map((cb) =>
    menuData.ingredients.sauces.find((s) => s.id === cb.value)
  );

  const selectedDrinks = Array.from(document.querySelectorAll('input[name="selectedDrink"]:checked')).map((cb) =>
    menuData.drinks.find((d) => d.id === cb.value)
  );

  let subPrice = bread.price;
  selectedProteins.forEach((p) => (subPrice += p.price));
  selectedCheeses.forEach((c) => (subPrice += c.price));

  const subItem = {
    type: "Sub Sandwich",
    bread: bread,
    proteins: selectedProteins,
    cheeses: selectedCheeses,
    veggies: selectedVeggies,
    sauces: selectedSauces,
    price: subPrice
  };

  appState.cart.push(subItem);

  selectedDrinks.forEach((drink) => {
    appState.cart.push({
      type: "Drink",
      name: drink.name,
      icon: drink.icon,
      price: drink.price
    });
  });

  resetSubSelections();
}

function resetSubSelections() {
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
  updateLiveSubPreview();
}

function resetBuilder() {
  resetSubSelections();
}

// Render Cart & Checkout Contents
function renderCartUI() {
  const cartContainer = document.getElementById("cartContents");
  const checkoutContainer = document.getElementById("checkoutDetails");
  const checkoutBtn = document.getElementById("btnCheckout");

  if (appState.cart.length === 0) {
    const emptyHtml = `<p>Your cart is currently empty. Please add items to proceed.</p>`;
    if (cartContainer) cartContainer.innerHTML = emptyHtml;
    if (checkoutContainer) checkoutContainer.innerHTML = emptyHtml;
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let totalCost = 0;
  let itemsHtml = appState.cart
    .map((item, index) => {
      totalCost += item.price;
      if (item.type === "Sub Sandwich") {
        const iconsList = [
          item.bread.icon || '🥖',
          ...item.proteins.map((p) => p.icon || '🥩'),
          ...item.cheeses.map((c) => c.icon || '🧀'),
          ...item.veggies.map((v) => v.icon || '🥬'),
          ...item.sauces.map((s) => s.icon || '🧴')
        ].join(" ");

        const details = [
          `Bread: ${item.bread.name}`,
          item.proteins.length ? `Proteins: ${item.proteins.map((p) => p.name).join(", ")}` : "",
          item.cheeses.length ? `Cheese: ${item.cheeses.map((c) => c.name).join(", ")}` : "",
          item.veggies.length ? `Veggies: ${item.veggies.map((v) => v.name).join(", ")}` : "",
          item.sauces.length ? `Sauces: ${item.sauces.map((s) => s.name).join(", ")}` : ""
        ]
          .filter(Boolean)
          .join(" | ");

        return `
        <div class="cart-item">
          <div class="cart-item-header">
            <span>Sub #${index + 1}: ${item.bread.name} Sub <span class="cart-item-icons">${iconsList}</span></span>
            <span>$${item.price.toFixed(2)}</span>
          </div>
          <div class="cart-item-details">${details}</div>
        </div>
      `;
      } else {
        return `
        <div class="cart-item">
          <div class="cart-item-header">
            <span>Drink: ${item.icon || '🥤'} ${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
          </div>
        </div>
      `;
      }
    })
    .join("");

  itemsHtml += `
    <div class="cart-total">
      Total: $${totalCost.toFixed(2)}
    </div>
  `;

  if (cartContainer) cartContainer.innerHTML = itemsHtml;

  if (checkoutContainer) {
    checkoutContainer.innerHTML = `
      <p><strong>Fulfillment Method:</strong> ${appState.deliveryMethod}</p>
      <p><strong>Delivery Address:</strong> ${appState.address || "Pickup in Store"}</p>
      <br>
      <h4>Items Ordered:</h4>
      ${itemsHtml}
    `;
  }
}

function placeOrder() {
  const refNum = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("orderRef").textContent = `#JM-${refNum}`;
  document.getElementById("orderConfirmation").classList.remove("hidden");
  document.getElementById("checkoutActions").classList.add("hidden");
}

function restartApp() {
  appState = {
    currentStep: 1,
    deliveryMethod: "Delivery",
    address: "",
    cart: []
  };

  document.getElementById("addressForm").reset();
  resetSubSelections();
  document.getElementById("orderConfirmation").classList.add("hidden");
  document.getElementById("checkoutActions").classList.remove("hidden");

  goToStep(1);
}
