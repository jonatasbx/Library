// ================================================
// 1. DADOS
// ================================================

// Nome que aparece na tela para cada valor do <select>
const GENEROS = {
  romance: "Romance",
  fantasia: "Fantasia",
  ficcao: "Ficção científica",
  tecnico: "Técnico",
};

// Molde de um livro
function Livro(titulo, autor, paginas, genero, lido = false) {
  this.id = crypto.randomUUID();   // identificador único de cada livro
  this.titulo = titulo;
  this.autor = autor;
  this.paginas = paginas;
  this.genero = genero;
  this.lido = lido;                // false por padrão
}

// Método compartilhado por todos os livros (prototype)
Livro.prototype.alternarLido = function () {
  this.lido = !this.lido;
};

// A biblioteca é um array de livros
const biblioteca = [];

function adicionarLivro(titulo, autor, paginas, genero, lido) {
  biblioteca.push(new Livro(titulo, autor, paginas, genero, lido));
}

// Mesmos 8 livros que estão no HTML
adicionarLivro("Dom Casmurro", "Machado de Assis", 256, "romance");
adicionarLivro("O Hobbit", "J. R. R. Tolkien", 336, "fantasia");
adicionarLivro("Duna", "Frank Herbert", 680, "ficcao");
adicionarLivro("Código Limpo", "Robert C. Martin", 425, "tecnico");
adicionarLivro("O Senhor dos Anéis", "J. R. R. Tolkien", 1200, "fantasia");
adicionarLivro("Fundação", "Isaac Asimov", 320, "ficcao");
adicionarLivro("Memórias Póstumas de Brás Cubas", "Machado de Assis", 208, "romance");
adicionarLivro("O Programador Pragmático", "Andrew Hunt e David Thomas", 352, "tecnico");


// ================================================
// 2. ELEMENTOS DO HTML
// ================================================
const main = document.querySelector(".main");
const filtro = document.querySelector("#filtro-genero");
const dialog = document.querySelector("#dialog-livro");
const form = document.querySelector("#form-livro");
const btnNovo = document.querySelector("#btn-novo");
const btnCancelar = document.querySelector("#btn-cancelar");


// ================================================
// 3. MOSTRAR OS LIVROS NA TELA
// ================================================

// Atalho para criar um elemento com classe e texto
function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

// Monta um card igual ao do HTML
function criarCard(livro) {
  const card = criarElemento("div", "card");
  card.dataset.id = livro.id;   // vira data-id="..." no HTML

  const acoes = criarElemento("div", "card-acoes");
  acoes.append(
    criarElemento("button", "btn-retirar", "Retirar"),
    criarElemento("button", "btn-lido", livro.lido ? "Marcar como não lido" : "Marcar como lido")
  );

  card.append(
    criarElemento("h3", "card-titulo", livro.titulo),
    criarElemento("p", "card-autor", livro.autor),
    criarElemento("p", "", `Páginas: ${livro.paginas}`),
    criarElemento("p", "", `Gênero: ${GENEROS[livro.genero]}`),
    criarElemento("p", "card-status", livro.lido ? "Lido" : "Não lido"),
    acoes
  );

  return card;
}

// Apaga os cards e desenha de novo a partir do array
function mostrarLivros() {
  main.innerHTML = "";

  const generoEscolhido = filtro.value;
  const livrosVisiveis = generoEscolhido === "todos"
    ? biblioteca
    : biblioteca.filter((livro) => livro.genero === generoEscolhido);

  livrosVisiveis.forEach((livro) => main.append(criarCard(livro)));
}


// ================================================
// 4. BOTÕES DOS CARDS
// Um único "ouvinte" no .main cuida de todos os cards,
// inclusive dos que forem criados depois
// ================================================
main.addEventListener("click", (evento) => {
  const card = evento.target.closest(".card");
  if (!card) return;

  const indice = biblioteca.findIndex((livro) => livro.id === card.dataset.id);
  if (indice === -1) return;

  if (evento.target.matches(".btn-retirar")) {
    biblioteca.splice(indice, 1);          // remove o livro do array
  } else if (evento.target.matches(".btn-lido")) {
    biblioteca[indice].alternarLido();     // true <-> false
  } else {
    return;                                // clicou no card, fora dos botões
  }

  mostrarLivros();
});


// ================================================
// 5. FILTRO POR GÊNERO
// ================================================
filtro.addEventListener("change", mostrarLivros);


// ================================================
// 6. FORMULÁRIO
// ================================================
btnNovo.addEventListener("click", () => dialog.showModal());

btnCancelar.addEventListener("click", () => {
  form.reset();
  dialog.close();
});

// O "required" do HTML só deixa chegar aqui se tudo estiver preenchido.
// Como o form tem method="dialog", o envio já fecha a janela sozinho.
form.addEventListener("submit", () => {
  adicionarLivro(
    form.titulo.value.trim(),
    form.autor.value.trim(),
    Number(form.paginas.value),
    form.genero.value,
    form.lido.checked             // desmarcado = false
  );

  form.reset();
  mostrarLivros();
});


// ================================================
// 7. INÍCIO
// ================================================
mostrarLivros();
