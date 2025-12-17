let lugares = JSON.parse(localStorage.getItem("lugares")) || [];

function adicionarLugar() {
  const lugar = {
    nome: nome.value,
    categoria: categoria.value,
    imagem: imagem.value,
    localizacao: localizacao.value,
    estrelas: 0,
    visitado: false
  };

  lugares.push(lugar);
  salvar();
  renderizar();
}

function salvar() {
  localStorage.setItem("lugares", JSON.stringify(lugares));
}

function renderizar(filtro = "todos") {
  const container = document.getElementById("lugares");
  const tabela = document.getElementById("tabela");
  container.innerHTML = "";
  tabela.innerHTML = `<tr><th>Nome</th><th>Status</th><th>Avaliação</th></tr>`;

  lugares.forEach((lugar, index) => {
    if (filtro !== "todos" && lugar.categoria !== filtro) return;

    const card = document.createElement("div");
    card.className = "card" + (lugar.visitado ? " visitado" : "");

    card.innerHTML = `
      <img src="${lugar.imagem}">
      <h3>${lugar.nome}</h3>

      <div class="estrelas">
        ${[1,2,3,4,5].map(n => 
          `<span onclick="avaliar(${index},${n})">
            ${n <= lugar.estrelas ? "⭐" : "☆"}
          </span>`).join("")}
      </div>

      <button onclick="marcarVisitado(${index})">
        ${lugar.visitado ? "Já visitamos 💖" : "Marcar como visitado"}
      </button>
    `;

    container.appendChild(card);

    tabela.innerHTML += `
      <tr>
        <td>${lugar.nome}</td>
        <td>${lugar.visitado ? "Já fomos" : "Falta ir"}</td>
        <td>${lugar.estrelas} ⭐</td>
      </tr>
    `;
  });

  atualizarMapa();
}

function avaliar(i, estrelas) {
  lugares[i].estrelas = estrelas;
  salvar();
  renderizar();
}

function marcarVisitado(i) {
  lugares[i].visitado = !lugares[i].visitado;
  salvar();
  renderizar();
}

function mostrarCategoria(cat) {
  renderizar(cat);
}

renderizar();
let map = L.map('mapa').setView([-23.5, -46.6], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
.addTo(map);

function atualizarMapa() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  lugares.filter(l => l.visitado).forEach(lugar => {
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${lugar.localizacao}`)
      .then(res => res.json())
      .then(data => {
        if (data[0]) {
          L.marker([data[0].lat, data[0].lon])
            .addTo(map)
            .bindPopup(lugar.nome);
        }
      });
  });
}
