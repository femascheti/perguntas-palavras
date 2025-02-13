const campoPergunta = document.getElementById("campoPergunta");
const botaoGerar = document.getElementById("botaoGerar");
const linkGerado = document.getElementById("linkGerado");

function gerarCodigo() {
    return Math.random().toString(36).substring(2, 10);
}

function salvarPergunta(codigo, pergunta) {
    let bancoDePerguntas = JSON.parse(localStorage.getItem("bancoDePerguntas")) || {};
    bancoDePerguntas[codigo] = { pergunta, respostas: [] };
    localStorage.setItem("bancoDePerguntas", JSON.stringify(bancoDePerguntas));
}

if (botaoGerar) {
    botaoGerar.addEventListener("click", () => {
        const pergunta = campoPergunta.value.trim();
        
        if (pergunta === "") {
            alert("Digite uma pergunta antes de gerar o link!");
            return;
        }

        const codigo = gerarCodigo();
        salvarPergunta(codigo, pergunta);

        const url = `${window.location.origin}${window.location.pathname}?q=${codigo}`;
        linkGerado.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    });
}

function carregarPergunta() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoPergunta = urlParams.get("q");

    if (codigoPergunta) {
        let bancoDePerguntas = JSON.parse(localStorage.getItem("bancoDePerguntas")) || {}; // Buscar pergunta no LS

        if (bancoDePerguntas[codigoPergunta]) {
            document.body.innerHTML = `
                <div class="container">
                    <h1>${bancoDePerguntas[codigoPergunta].pergunta}</h1>
                    <input type="text" id="campoResposta" placeholder="Digite uma palavra...">
                    <button id="botaoEnviar">Enviar Palavra</button>
                    <div id="listaRespostas"></div>
                </div>
            `;

            const campoResposta = document.getElementById("campoResposta");
            const botaoEnviar = document.getElementById("botaoEnviar");
            const listaRespostas = document.getElementById("listaRespostas");

            function atualizarLista() {
                listaRespostas.innerHTML = bancoDePerguntas[codigoPergunta].respostas
                    .map(resp => `<p>${resp}</p>`)
                    .join("");
            }
            atualizarLista();

            campoResposta.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); 
                    botaoEnviar.click(); 
                }
            });

            botaoEnviar.addEventListener("click", () => {
                const resposta = campoResposta.value.trim();
                if (resposta !== "") {
                    bancoDePerguntas[codigoPergunta].respostas.push(resposta);
                    localStorage.setItem("bancoDePerguntas", JSON.stringify(bancoDePerguntas));
                    campoResposta.value = "";
                    atualizarLista();
                }
            });
        } else {
            document.body.innerHTML = "<h1>Pergunta não encontrada!</h1>";
        }
    }
}

function adicionarPalavraAleatoria(texto, listaRespostas) {
    const palavraElemento = document.createElement("span");
    palavraElemento.classList.add("palavra");
    palavraElemento.innerText = texto;

    // Gerar tamanho aleatório
    const tamanhoFonte = Math.floor(Math.random() * 20) + 14; // Entre 14px e 34px
    palavraElemento.style.fontSize = `${tamanhoFonte}px`;

    // Ajustando para garantir que as palavras fiquem dentro do contêiner
    const maxX = listaRespostas.clientWidth - 100; // Largura máxima sem cortar
    const maxY = listaRespostas.clientHeight - 50; // Altura máxima sem cortar

    const posX = Math.random() * maxX;
    const posY = Math.random() * maxY;

    palavraElemento.style.left = `${posX}px`;
    palavraElemento.style.top = `${posY}px`;

    listaRespostas.appendChild(palavraElemento);
}


function atualizarLista(listaRespostas, respostas) {
    listaRespostas.innerHTML = ""; 
    respostas.forEach(resposta => adicionarPalavraAleatoria(resposta, listaRespostas));
}

function carregarPergunta() {
    const urlParams = new URLSearchParams(window.location.search);
    const codigoPergunta = urlParams.get("q");

    if (codigoPergunta) {
        let bancoDePerguntas = JSON.parse(localStorage.getItem("bancoDePerguntas")) || {};

        if (bancoDePerguntas[codigoPergunta]) {
            document.body.innerHTML = `
                <div class="container">
                    <h1>${bancoDePerguntas[codigoPergunta].pergunta}</h1>
                    <input type="text" id="campoResposta" placeholder="Digite uma palavra...">
                    <button id="botaoEnviar">Enviar Palavra</button>
                    <div id="listaRespostas"></div>
                </div>
            `;

            const campoResposta = document.getElementById("campoResposta");
            const botaoEnviar = document.getElementById("botaoEnviar");
            const listaRespostas = document.getElementById("listaRespostas");

            atualizarLista(listaRespostas, bancoDePerguntas[codigoPergunta].respostas);

            botaoEnviar.addEventListener("click", () => {
                const resposta = campoResposta.value.trim();
                if (resposta !== "") {
                    bancoDePerguntas[codigoPergunta].respostas.push(resposta);
                    localStorage.setItem("bancoDePerguntas", JSON.stringify(bancoDePerguntas));
                    campoResposta.value = "";
                    adicionarPalavraAleatoria(resposta, listaRespostas);
                }
            });
        } else {
            document.body.innerHTML = "<h1>Pergunta não encontrada!</h1>";
        }
    }
}

carregarPergunta();
