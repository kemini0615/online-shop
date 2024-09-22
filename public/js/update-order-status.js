const updateOrderStatusFormEls = document.querySelectorAll(".order-actions form");

async function updateOrderStatus(event) {
  event.preventDefault();
  
  const formEl = event.target;
  const formData = new FormData(formEl);
  const status = formData.get("status");
  const orderId = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response;
  try {
    response = await fetch(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: status,
        _csrf: csrfToken
      }),
      headers: {
        'Content-Type': "application/json",
      },
    });
  } catch (error) {
    alert("Failed to update status of order.");
    return;
  }

  if(!response.ok) {
    alert("Failed to update status of order.");
    return;
  }

  const responseData = await response.json();

  formEl.parentElement.parentElement.querySelector(".badge").textContent = responseData.status.toUpperCase();
}

for (let el of updateOrderStatusFormEls) {
  el.addEventListener("submit", updateOrderStatus);
}