(function() {
    let texto = null;
    const ID_PREFIX = "gomes-typer-"; // Prefixo para evitar conflito de CSS

    // --- 1. INJEÇÃO DE ESTILOS CSS (Para um visual moderno e clean) ---
    const styles = `
        /* Botão Flutuante Principal */
        #${ID_PREFIX}botao-fixo {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            zIndex: 2147483647; /* Máximo possível */
            font-size: 28px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none;
            outline: none;
            user-select: none;
        }
        #${ID_PREFIX}botao-fixo:hover {
            transform: scale(1.1) rotate(-10deg);
            box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
        #${ID_PREFIX}botao-fixo:active {
            transform: scale(0.95);
        }

        /* Container do Menu */
        #${ID_PREFIX}menu {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 320px;
            background: #fff;
            border-radius: 16px;
            display: none; /* Escondido por padrão */
            zIndex: 2147483646;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.05);
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        }
        
        /* Estado visível do menu (controlado via JS) */
        #${ID_PREFIX}menu.show {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        /* Cabeçalho do Menu (Onde está o "By Gomes") */
        .${ID_PREFIX}header {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .${ID_PREFIX}titulo {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
        }
        .${ID_PREFIX}assinatura {
            font-size: 11px;
            color: #999;
            font-style: italic;
            letter-spacing: 0.5px;
        }

        /* Corpo do Menu */
        .${ID_PREFIX}body {
            padding: 20px;
        }

        /* Estilização dos inputs (Textarea e Select) */
        #${ID_PREFIX}textarea, #${ID_PREFIX}select {
            width: 100%;
            padding: 12px;
            box-sizing: border-box;
            border: 2px solid #e1e5eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            outline: none;
            font-family: inherit;
        }
        #${ID_PREFIX}textarea:focus, #${ID_PREFIX}select:focus {
            border-color: #2575fc;
        }
        #${ID_PREFIX}textarea {
            height: 120px;
            resize: vertical;
            margin-bottom: 15px;
        }

        /* Label da velocidade */
        .${ID_PREFIX}label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #555;
            margin-bottom: 5px;
        }

        /* Botão Ação Principal */
        #${ID_PREFIX}btn-salvar {
            width: 100%;
            padding: 12px;
            margin-top: 20px;
            background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 15px;
            transition: opacity 0.2s, transform 0.1s;
            box-shadow: 0 4px 6px rgba(37, 117, 252, 0.2);
        }
        #${ID_PREFIX}btn-salvar:hover {
            opacity: 0.9;
        }
        #${ID_PREFIX}btn-salvar:active {
            transform: translateY(1px);
        }
    `;

    // Injeta o CSS no <head>
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);


    // --- 2. CRIAÇÃO DOS ELEMENTOS HTML ---

    // Cria botão flutuante
    const botao = document.createElement("button");
    botao.id = `${ID_PREFIX}botao-fixo`;
    botao.innerText = "✏️";
    botao.title = "Abrir Simulador de Digitação";
    document.body.appendChild(botao);

    // Cria o Menu
    const menu = document.createElement("div");
    menu.id = `${ID_PREFIX}menu`;

    // Estrutura HTML do menu (com a assinatura By Gomes no header)
    menu.innerHTML = `
        <div class="${ID_PREFIX}header">
            <h3 class="${ID_PREFIX}titulo">Configurar Digitação</h3>
            <span class="${ID_PREFIX}assinatura">By Gomes</span>
        </div>
        <div class="${ID_PREFIX}body">
            <textarea id="${ID_PREFIX}textarea" placeholder="Cole seu texto aqui..."></textarea>
            
            <label class="${ID_PREFIX}label" for="${ID_PREFIX}select">Velocidade de digitação:</label>
            <select id="${ID_PREFIX}select">
                <option value="lento">🐢 Lenta</option>
                <option value="normal" selected>🧑‍💻 Normal</option>
                <option value="rapido">⚡ Rápida</option>
                <option value="flash">🚀 Muito Rápida (Flash)</option>
            </select>

            <button id="${ID_PREFIX}btn-salvar">Salvar e Iniciar</button>
        </div>
    `;

    document.body.appendChild(menu);


    // --- 3. LÓGICA JAVASCRIPT ---

    // Pegar referências dos elementos internos
    const textareaMenu = document.getElementById(`${ID_PREFIX}textarea`);
    const selectVelocidade = document.getElementById(`${ID_PREFIX}select`);
    const botaoSalvar = document.getElementById(`${ID_PREFIX}btn-salvar`);

    // Função auxiliar para abrir/fechar com animação
    function toggleMenu() {
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            // Espera a animação acabar para dar display:none
            setTimeout(() => { 
                if(!menu.classList.contains('show')) menu.style.display = 'none'; 
            }, 300);
        } else {
            menu.style.display = 'block';
            // Pequeno delay para o navegador processar o display:block antes da animação
            setTimeout(() => menu.classList.add('show'), 10);
            textareaMenu.focus();
        }
    }

    // Evento do botão flutuante
    botao.onclick = (e) => {
        e.stopPropagation(); // Evita fechar ao clicar no botão
        toggleMenu();
    };

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('show') && !menu.contains(e.target) && e.target !== botao) {
            toggleMenu();
        }
    });

    // Prevent close when clicking inside the menu
    menu.addEventListener('click', (e) => e.stopPropagation());


    // Função para calcular o tempo de espera (ms) baseado na velocidade
    function obterAtraso(velocidade) {
        // Mantém o fator randômico para parecer humano
        switch (velocidade) {
            case "lento": return Math.random() * 80 + 120;   // 120ms a 200ms
            case "rapido": return Math.random() * 15 + 15;   // 15ms a 30ms
            case "flash": return Math.random() * 4 + 1;      // 1ms a 5ms
            case "normal":
            default: return Math.random() * 30 + 40;         // 40ms a 70ms
        }
    }

    // Função principal de digitação
  function digitarTexto(texto, velocidade) {
    let campo = document.querySelector('textarea[placeholder*="Responder"]');

    if (!campo) {
        alert("Campo de resposta não encontrado!");
        return;
    }

    campo.focus();

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
    ).set;

    let i = 0;

    function digitar() {
        if (i >= texto.length) return;

        const char = texto[i];

        nativeInputValueSetter.call(campo, campo.value + char);
        campo.dispatchEvent(new Event("input", { bubbles: true }));

        i++;

        setTimeout(digitar, obterAtraso(velocidade));
    }

    digitar();
}

    // Ação do botão Salvar e Digitar
    botaoSalvar.onclick = () => {
        texto = textareaMenu.value;
        const velocidadeSelecionada = selectVelocidade.value;

        if (!texto) {
            alert("⚠️ Por favor, cole algum texto antes!");
            textareaMenu.focus();
            return;
        }

        // Fecha o menu
        toggleMenu();
        
        // Inicia a digitação
        digitarTexto(texto, velocidadeSelecionada);
    };
})();