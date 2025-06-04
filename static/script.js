const fileInput = document.getElementById("file");
const preview = document.getElementById("preview");
const button = document.getElementById("openOptions");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    button.style.display = "inline-block";
    preview.innerHTML = `<p><strong>Selected file :</strong> ${file.name}</p>`;
    document.getElementById("sizeEstimate").innerText =
      (file.size / (1024 * 1024)).toFixed(2) + " MB";
  }
});
function goHome() {
  //document.getElementById('popupSuccess').style.display = 'none';
  window.location.href = "/";
}
function openPopup(id) {
  document.getElementById(id).style.display = "flex";
}
function closePopup(id) {
  document.getElementById(id).style.display = "none";
}
button.addEventListener("click", () => openPopup("popup1"));


function submitPrint() {
  //const token = document.getElementById("tokenInput").value.trim();
  const file = fileInput.files[0];
  const color = document.querySelector('input[name="color"]:checked').value;
  const duplex = document.querySelector('input[name="duplex"]:checked').value;

  if (!file) {
    return alert("Please provide a file");
  }

  const formData = new FormData();
  formData.append("file", file);
  //formData.append("token", token);
  formData.append("color", color);
  formData.append('duplex', duplex);

  fetch("/print", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      closePopup("popup1");
      alert(data.message);
    })
    .catch(() => alert("message': '✅ Print sent! "));
    window.location.href = "/";
}
