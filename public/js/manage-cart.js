const addToCartBtnEl = document.querySelector("#product-details button");
const cartBadgeEl = document.querySelector(".nav-items .badge");

async function addToCart(event) {
  const productId = addToCartBtnEl.dataset.productid;
  const csrfToken = addToCartBtnEl.dataset.csrf;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    alert("Failed to add product to cart.");
    return;
  }

  if (!response.ok) {
    alert("Failed to add product to cart.");
    return;
  }

  const responseData = await response.json();
  const totalQuantity = responseData.totalQuantity;

cartBadgeEl.textContent = totalQuantity;
}

addToCartBtnEl.addEventListener("click", addToCart);