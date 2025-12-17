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
const USUARIO = "amor";
const SENHA = "paraSempre";

function entrar() {
  const u = document.getElementById("user").value;
  const p = document.getElementById("password").value;

  if (u === USUARIO && p === SENHA) {
    localStorage.setItem("logado", "sim");
    document.getElementById("login").style.display = "none";
  } else {
    alert("Usuário ou senha incorretos 💔");
  }
}

if (localStorage.getItem("logado") === "sim") {
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("login").style.display = "none";
  });
}
const USUARIO = "amor";
const SENHA = "paraSempre";
function alternarTema() {
  document.body.classList.toggle("dark");

  const tema = document.body.classList.contains("dark") ? "escuro" : "claro";
  localStorage.setItem("tema", tema);

  document.getElementById("darkToggle").innerText =
    tema === "escuro" ? "☀️" : "🌙";
}

document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema");

  if (temaSalvo === "escuro") {
    document.body.classList.add("dark");
    document.getElementById("darkToggle").innerText = "☀️";
  }
});
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
card.innerHTML = `
  <img src="${lugar.imagem}">
  <h3>${lugar.nome}</h3>

  <div class="estrelas">
    ${[1,2,3,4,5].map(n => 
      `<span onclick="avaliar(${index},${n})">
        ${n <= lugar.estrelas ? "⭐" : "☆"}
      </span>`).join("")}
  </div>

  <p>💁‍♀️ Você:
    <select onchange="emojiEla(${index}, this.value)">
      <option value="">—</option>
      <option>💖</option>
      <option>😍</option>
      <option>😊</option>
      <option>🥰</option>
      <option>😐</option>
      <option>🙄</option>
      <option>😰</option>
      <option>🍅</option>
    </select>
  </p>

  <p>👨 Ele:
    <select onchange="emojiEle(${index}, this.value)">
      <option value="">—</option>
      <option>💖</option>
      <option>😍</option>
      <option>😊</option>
      <option>🥰</option>
      <option>😐</option>
      <option>🙄</option>
      <option>😰</option>
      <option>🍅</option>
    </select>
  </p>

  <button onclick="marcarVisitado(${index})">
    ${lugar.visitado ? "Já visitamos 💕" : "Marcar como visitado"}
  </button>
`;
function emojiEla(i, valor) {
  lugares[i].emojiEla = valor;
  salvar();
}

function emojiEle(i, valor) {
  lugares[i].emojiEle = valor;
  salvar();
}
const favorito =
  lugar.estrelas >= 4 ||
  lugar.emojiEla === "💖" ||
  lugar.emojiEle === "💖";
card.className = "card" + 
  (lugar.visitado ? " visitado" : "") +
  (favorito ? " favorito" : "");
.favorito {
  border: 2px solid var(--rose);
}
const dataInicio = new Date("2022-08-15"); // MUDE AQUI 💕

function atualizarContador() {
  const hoje = new Date();
  const diff = hoje - dataInicio;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  document.getElementById("dias").innerText =
    `${dias} dias de amor 💕`;
}

atualizarContador();
