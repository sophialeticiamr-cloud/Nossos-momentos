
  const tema = localStorage.getItem("tema");
  if (tema === "escuro") {
    document.body.classList.add("dark");
    document.getElementById("darkToggle").innerText = "☀️";
  }

  renderizar();
  atualizarContador();
});

/* =========================
   MODO ESCURO
========================= */
function alternarTema() {
  document.body.classList.toggle("dark");

  const tema = document.body.classList.contains("dark") ? "escuro" : "claro";
  localStorage.setItem("tema", tema);

  document.getElementById("darkToggle").innerText =
    tema === "escuro" ? "☀️" : "🌙";
}

/* =========================
   DADOS
========================= */
let lugares = JSON.parse(localStorage.getItem("lugares")) || [];

function salvar() {
  localStorage.setItem("lugares", JSON.stringify(lugares));
}

/* =========================
   ADICIONAR LUGAR
========================= */
function adicionarLugar() {
  const lugar = {
    nome: nome.value,
    categoria: categoria.value,
    imagem: imagem.value,
    localizacao: localizacao.value,
    estrelas: 0,
    visitado: false,
    emojiEla: "",
    emojiEle: ""
  };

  lugares.push(lugar);
  salvar();
  renderizar();
}

/* =========================
   RENDERIZAÇÃO
========================= */
function renderizar(filtro = "todos") {
  const container = document.getElementById("lugares");
  const tabela = document.getElementById("tabela");

  container.innerHTML = "";
  tabela.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Status</th>
      <th>Avaliação</th>
    </tr>
  `;

  lugares.forEach((lugar, index) => {
    if (filtro !== "todos" && lugar.categoria !== filtro) return;

    const favorito =
      lugar.estrelas >= 4 ||
      lugar.emojiEla === "💖" ||
      lugar.emojiEle === "💖";

    const card = document.createElement("div");
    card.className =
      "card" +
      (lugar.visitado ? " visitado" : "") +
      (favorito ? " favorito" : "");

    card.innerHTML = `
      <img src="${lugar.imagem}">
      <h3>${lugar.nome}</h3>

      <div class="estrelas">
        ${[1,2,3,4,5].map(n =>
          `<span onclick="avaliar(${index},${n})">
            ${n <= lugar.estrelas ? "⭐" : "☆"}
          </span>`
        ).join("")}
      </div>

      <p>💁‍♀️ Você:
        <select onchange="emojiEla(${index}, this.value)">
          <option value="">—</option>
          ${emojiOptions(lugar.emojiEla)}
        </select>
      </p>

      <p>👨 Ele:
        <select onchange="emojiEle(${index}, this.value)">
          <option value="">—</option>
          ${emojiOptions(lugar.emojiEle)}
        </select>
      </p>

      <button onclick="marcarVisitado(${index})">
        ${lugar.visitado ? "Já visitamos 💕" : "Marcar como visitado"}
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

/* =========================
   EMOJIS
========================= */
function emojiOptions(selecionado) {
  const emojis = ["💖","😍","😊","🥰","😐","🙄","😰","🍅"];
  return emojis.map(e =>
    `<option ${e === selecionado ? "selected" : ""}>${e}</option>`
  ).join("");
}

function emojiEla(i, valor) {
  lugares[i].emojiEla = valor;
  salvar();
  renderizar();
}

function emojiEle(i, valor) {
  lugares[i].emojiEle = valor;
  salvar();
  renderizar();
}

/* =========================
   AÇÕES
========================= */
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

/* =========================
   MAPA
========================= */
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

/* =========================
   CONTADOR DE DIAS
========================= */
const dataInicio = new Date("2025-05-03"); // MUDE AQUI 💖

function atualizarContador() {
  const hoje = new Date();
  const diff = hoje - dataInicio;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("dias").innerText =
    `${dias} dias de amor 💕`;
}
