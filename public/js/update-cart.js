const cartItemFormEls = document.querySelectorAll(".cart-item-update");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const cartBadgeEls = document.querySelectorAll(".nav-items .badge");

async function updateCartItem(event) {
  event.preventDefault();
  const formEl = event.target;
  const productId = formEl.dataset.productid;
  const csrfToken = formEl.dataset.csrf;
  const quantity = formEl.firstElementChild.value;

  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        productId: productId,
        quantity: quantity,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch(err) {
    alert("Failed to update cart item.");
    return;
  }

  if (!response.ok) {
    alert("Failed to update cart item.");
    return;
  }

  const responseData = await response.json();

  if (responseData.newCart.newItemTotalPrice === 0) {
    formEl.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceEl = formEl.parentElement.querySelector(".cart-item-total-price");
    cartItemTotalPriceEl.textContent = responseData.newCart.newItemTotalPrice;
  }

  cartTotalPriceEl.textContent = responseData.newCart.totalPrice;
  for (let el of cartBadgeEls) {
    el.textContent = responseData.newCart.totalQuantity;
  }
}

for (const el of cartItemFormEls) {
  el.addEventListener("submit", updateCartItem);
}
