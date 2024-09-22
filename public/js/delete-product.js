const deleteBtnEls = document.querySelectorAll(".product-item button");

async function deleteProduct(event) {
  const deleteBtnEl = event.target;
  const productId = deleteBtnEl.dataset.productid;
  const csrfToken = deleteBtnEl.dataset.csrf;

  const response = await fetch(
    "/admin/products/delete/" + productId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    alert("Failed to delete the product.");
    return;
  }

  const liEl =
    deleteBtnEl.parentElement.parentElement.parentElement.parentElement;
  liEl.remove();
}

for (const el of deleteBtnEls) {
  el.addEventListener("click", deleteProduct);
}
