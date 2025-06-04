const fileInput = document.getElementById("file");
const preview = document.getElementById("preview");
const button = document.getElementById("openOptions");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    button.style.display = "inline-block";
    preview.innerHTML = `<p><strong>Fichier sélectionné :</strong> ${file.name}</p>`;
    document.getElementById("sizeEstimate").innerText =
      (file.size / (1024 * 1024)).toFixed(2) + " MB";
  }
});

function openPopup(id) {
  document.getElementById(id).style.display = "flex";
}
function closePopup(id) {
  document.getElementById(id).style.display = "none";
}
button.addEventListener("click", () => openPopup("popup1"));

function confirmOptions() {
  closePopup("popup1");
  openPopup("popup2");
}

function submitPrint() {
  //const token = document.getElementById("tokenInput").value.trim();
  const file = fileInput.files[0];
  const color = document.querySelector('input[name="color"]:checked').value;
  const duplex = document.querySelector('input[name="duplex"]:checked').value;

  if (!file) {
    return alert("Merci de fournir un fichier");
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
  .then(response => response.json().then(data => ({ status: response.status, body: data })))
  .then(({ status, body }) => {
    closePopup('popup2');
    if (status === 200) {
      document.getElementById('successPopup').style.display = 'flex';
    } else {
      document.getElementById('errorPopup').style.display = 'flex';
    }
  })
  .catch(error => {
    console.error(error);
    closePopup('popup2');
    document.getElementById('errorPopup').style.display = 'flex';
  });
}

function goHome() {
  document.getElementById('popupSuccess').style.display = 'none';
  window.location.href = "/";
}