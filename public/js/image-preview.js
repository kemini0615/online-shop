const imageInputEl = document.querySelector("#image-preview input");
const imagePreviewEl = document.querySelector("#image-preview img");

function showImagePreview() {
  const files = imageInputEl.files;

  if (!files || files.length === 0) {
    imagePreviewEl.style.display = "none";
    return;
  }

  const imageFile = files[0]; // located in user's local directory
  imagePreviewEl.src = URL.createObjectURL(imageFile);
  imagePreviewEl.style.display = "block";
}

imageInputEl.addEventListener("change", showImagePreview);