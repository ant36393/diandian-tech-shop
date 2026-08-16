const products = {
  case: {
    shortName: "磁吸防摔手機殼",
    name: "透明磨砂磁吸 AI 相機按鍵防摔殼",
    price: 399,
    originalPrice: 590,
    image: "/products/magsafe-case.jpg",
    badge: "熱銷補貨",
    copy: "半透明磨砂背板保留手機原色，四角隱形氣囊緩衝日常碰撞，磁吸圈可搭配車架與充電座。",
    specs: ["磁吸支架相容", "四角氣囊防摔", "磨砂不沾指紋", "獨立金屬按鍵"],
  },
  cx01: {
    shortName: "3合1 磁吸行動電源",
    name: "VOORCA 3合1 磁吸行動電源 10000mAh",
    price: 999,
    originalPrice: 1190,
    image: "/products/power-bank-cx01.jpg",
    badge: "旅行推薦",
    copy: "手機、手錶、耳機一次補電，自帶 Type-C 與 Lightning 雙線，短途出門不用再另外翻線材。",
    specs: ["10000mAh", "自帶雙線", "15W 磁吸無線充", "iWatch 充電"],
  },
  lens: {
    shortName: "藍寶石鏡頭保護貼",
    name: "X-ONE 藍寶石鏡頭保護貼 iPhone 18 系列",
    price: 520,
    originalPrice: 690,
    image: "/products/lens-protector.jpg",
    badge: "新品上架",
    copy: "給鏡頭多一層硬派保護，通透清晰不影響拍攝，外框多色可選，與新機配色更好搭。",
    specs: ["GIA 藍寶石認證", "莫氏硬度 9", "光學級 AR 鍍層", "完整覆蓋"],
  },
  cable: {
    shortName: "100W Type-C 編織線",
    name: "UNIQTOUGH APEX 100W Type-C 編織快充線",
    price: 450,
    originalPrice: 560,
    image: "/products/charging-cable.jpg",
    badge: "店長主推",
    copy: "內建 E-marker 晶片自動調整電流，筆電、平板、手機都能穩定快充，168cm 桌邊使用剛剛好。",
    specs: ["100W PD 快充", "E-marker 晶片", "168cm 長度", "耐拉編織線身"],
  },
  db18: {
    shortName: "強磁支架行動電源",
    name: "DB18 3合1 強磁支架行動電源 10000mAh",
    price: 890,
    originalPrice: 1080,
    image: "/products/power-bank-db18.jpg",
    badge: "限時優惠",
    copy: "薄型金屬感機身搭配強磁吸附，邊追劇邊充電更順手，通勤與辦公桌都適合。",
    specs: ["10000mAh", "20W 有線快充", "15W 無線充", "支架設計"],
  },
};

const state = {
  category: "全部",
  query: "",
  featured: "cx01",
  cart: {},
};

const formatter = new Intl.NumberFormat("zh-TW");
const productCards = [...document.querySelectorAll("[data-product-card]")];
const searchInput = document.querySelector("#shopSearch");
const cartDrawer = document.querySelector("#cartDrawer");
const drawerBackdrop = document.querySelector("#drawerBackdrop");

function price(value) {
  return `NT$ ${formatter.format(value)}`;
}

function setFeatured(productId) {
  const product = products[productId];
  if (!product) return;

  state.featured = productId;
  document.querySelector("#featureImage").src = product.image;
  document.querySelector("#featureImage").alt = product.name;
  document.querySelector("#featureBadge").textContent = product.badge;
  document.querySelector("#featureName").textContent = product.shortName;
  document.querySelector("#featurePrice").textContent = price(product.price);
  document.querySelector("#dealImage").src = product.image;
  document.querySelector("#dealImage").alt = product.name;
  document.querySelector("#dealName").textContent = product.name;
  document.querySelector("#dealCopy").textContent = product.copy;
  document.querySelector("#dealPrice").textContent = price(product.price);
  document.querySelector("#dealOriginal").textContent = price(product.originalPrice);
  document.querySelector("#dealSpecs").innerHTML = product.specs.map((spec) => `<span>${spec}</span>`).join("");
  document.querySelector(".primary-action").dataset.addCart = productId;
}

function filterProducts() {
  const query = state.query.trim().toLowerCase();

  productCards.forEach((card) => {
    const categoryMatches = state.category === "全部" || card.dataset.category === state.category;
    const queryMatches = query.length === 0 || card.dataset.keywords.toLowerCase().includes(query);
    card.hidden = !(categoryMatches && queryMatches);
  });
}

function addToCart(productId, amount = 1) {
  const nextQuantity = Math.max((state.cart[productId] || 0) + amount, 0);

  if (nextQuantity === 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = nextQuantity;
  }

  renderCart();
  openCart();
}

function renderCart() {
  const entries = Object.entries(state.cart);
  const count = entries.reduce((total, [, quantity]) => total + quantity, 0);
  const total = entries.reduce((sum, [productId, quantity]) => sum + products[productId].price * quantity, 0);
  const cartItems = document.querySelector("#cartItems");

  document.querySelector("#cartCount").textContent = count;
  document.querySelector("#cartTitle").textContent = `${count} 件商品`;
  document.querySelector("#cartTotal").textContent = price(total);
  document.querySelector("#emptyCart").hidden = entries.length > 0;

  cartItems.innerHTML = entries
    .map(([productId, quantity]) => {
      const product = products[productId];
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" />
          <div>
            <strong>${product.shortName}</strong>
            <span>${price(product.price)}</span>
            <div class="quantity-control">
              <button type="button" data-cart-change="${productId}" data-amount="-1" aria-label="減少數量">−</button>
              <b>${quantity}</b>
              <button type="button" data-cart-change="${productId}" data-amount="1" aria-label="增加數量">＋</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const checkoutLink = document.querySelector("#checkoutLink");
  checkoutLink.classList.toggle("is-disabled", entries.length === 0);
  checkoutLink.href =
    entries.length === 0 ? "" : "mailto:diandian@example.com?subject=點點資訊企業社商品詢問";
}

function openCart() {
  cartDrawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-visible");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-visible");
}

document.addEventListener("click", (event) => {
  const featureButton = event.target.closest("[data-feature-product]");
  const addButton = event.target.closest("[data-add-cart]");
  const categoryButton = event.target.closest("[data-category-filter]");
  const cartChangeButton = event.target.closest("[data-cart-change]");

  if (featureButton) {
    setFeatured(featureButton.dataset.featureProduct);
  }

  if (addButton) {
    addToCart(addButton.dataset.addCart);
  }

  if (categoryButton) {
    state.category = categoryButton.dataset.categoryFilter;
    document
      .querySelectorAll("[data-category-filter]")
      .forEach((button) => button.classList.toggle("is-active", button === categoryButton));
    filterProducts();
  }

  if (cartChangeButton) {
    addToCart(cartChangeButton.dataset.cartChange, Number(cartChangeButton.dataset.amount));
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  filterProducts();
});

document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
renderCart();
