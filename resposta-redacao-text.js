(function() {
    let texto = null;
    const ID_PREFIX = "gomes-typer-";

    // --- 1. ESTILOS CSS ---
    const styles = `
        #${ID_PREFIX}botao-fixo {
            position: fixed; bottom: 20px; right: 20px;
            width: 60px; height: 60px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: #fff; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 2147483647;
            font-size: 28px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: none; outline: none; user-select: none;
        }
        #${ID_PREFIX}botao-fixo:hover { transform: scale(1.1) rotate(-10deg); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
        #${ID_PREFIX}botao-fixo:active { transform: scale(0.95); }

        #${ID_PREFIX}menu {
            position: fixed; bottom: 90px; right: 20px; width: 340px;
            background: #fff; border-radius: 16px;
            display: none; z-index: 2147483646;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
            opacity: 0; transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        #${ID_PREFIX}menu.show { display: block; opacity: 1; transform: translateY(0); }

        .${ID_PREFIX}header {
            background: #f8f9fa; padding: 15px 20px;
            border-bottom: 1px solid #eee;
            display: flex; justify-content: space-between; align-items: center;
        }
        .${ID_PREFIX}titulo { margin: 0; font-size: 16px; font-weight: 600; color: #333; }
        .${ID_PREFIX}assinatura { font-size: 11px; color: #999; font-style: italic; letter-spacing: 0.5px; }

        .${ID_PREFIX}body { padding: 20px; }

        #${ID_PREFIX}textarea, #${ID_PREFIX}select {
            width: 100%; padding: 12px; box-sizing: border-box;
            border: 2px solid #e1e5eb; border-radius: 8px;
            font-size: 14px; transition: border-color 0.2s;
            outline: none; font-family: inherit;
        }
        #${ID_PREFIX}textarea:focus, #${ID_PREFIX}select:focus { border-color: #2575fc; }
        #${ID_PREFIX}textarea { height: 120px; resize: vertical; margin-bottom: 15px; }

        .${ID_PREFIX}label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 5px; }

        #${ID_PREFIX}campo-info {
            font-size: 11px; color: #888; margin-bottom: 12px;
            padding: 6px 10px; background: #f0f4ff;
            border-radius: 6px; border-left: 3px solid #2575fc;
            word-break: break-all; line-height: 1.4;
        }
        #${ID_PREFIX}campo-info.erro { background: #fff0f0; border-color: #fc2525; color: #c0392b; }
        #${ID_PREFIX}campo-info.ok   { background: #f0fff4; border-color: #25c16f; color: #1a7a47; }

        #${ID_PREFIX}btn-salvar {
            width: 100%; padding: 12px; margin-top: 14px;
            background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
            color: white; border: none; border-radius: 8px;
            cursor: pointer; font-weight: bold; font-size: 15px;
            transition: opacity 0.2s, transform 0.1s;
            box-shadow: 0 4px 6px rgba(37,117,252,0.2);
        }
        #${ID_PREFIX}btn-salvar:hover { opacity: 0.9; }
        #${ID_PREFIX}btn-salvar:active { transform: translateY(1px); }
        #${ID_PREFIX}btn-salvar:disabled { opacity: 0.5; cursor: not-allowed; }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- 2. HTML ---
    const botao = document.createElement("button");
    botao.id = `${ID_PREFIX}botao-fixo`;
    botao.innerText = "✏️";
    botao.title = "Abrir Simulador de Digitação";
    document.body.appendChild(botao);

    const menu = document.createElement("div");
    menu.id = `${ID_PREFIX}menu`;
    menu.innerHTML = `
        <div class="${ID_PREFIX}header">
            <h3 class="${ID_PREFIX}titulo">Configurar Digitação</h3>
            <span class="${ID_PREFIX}assinatura">By Gomes</span>
        </div>
        <div class="${ID_PREFIX}body">
            <div id="${ID_PREFIX}campo-info">Clique em um campo de texto na página para selecionar o alvo.</div>
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

    // --- 3. LÓGICA ---
    const textareaMenu    = document.getElementById(`${ID_PREFIX}textarea`);
    const selectVelocidade = document.getElementById(`${ID_PREFIX}select`);
    const botaoSalvar     = document.getElementById(`${ID_PREFIX}btn-salvar`);
    const campoInfo       = document.getElementById(`${ID_PREFIX}campo-info`);

    let campoAlvo = null; // campo da página onde o texto será digitado

    // ── Detector de campo alvo ──
    // Quando o usuário clica em qualquer textarea/[contenteditable] na página,
    // capturamos esse elemento como alvo — exceto elementos do próprio menu.
    function onFocusCapture(e) {
        const el = e.target;
        // Ignora elementos do próprio menu
        if (menu.contains(el) || el === botao) return;

        const tag = el.tagName.toLowerCase();
        const isTextArea  = tag === 'textarea';
        const isInput     = tag === 'input' && (el.type === 'text' || el.type === 'search' || !el.type);
        const isEditable  = el.isContentEditable;

        if (isTextArea || isInput || isEditable) {
            campoAlvo = el;

            // Monta descrição do campo para exibir no info
            const id        = el.id   ? `#${el.id}` : '';
            const cls       = el.classList.length ? `.${[...el.classList].slice(0,2).join('.')}` : '';
            const desc      = id || cls || tag;
            campoInfo.textContent = `✅ Alvo: ${desc}`;
            campoInfo.className   = `${ID_PREFIX}campo-info ok`;
            botaoSalvar.disabled  = false;
        }
    }

    // Captura em fase de captura (antes do bubble) para pegar qualquer clique
    document.addEventListener('focus', onFocusCapture, true);
    document.addEventListener('click', (e) => {
        // Também captura click para contenteditable que não dispara focus via addEventListener facilmente
        if (menu.contains(e.target) || e.target === botao) return;
        onFocusCapture(e);
    }, true);

    // ── Toggle menu ──
    function toggleMenu() {
        if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            setTimeout(() => { if (!menu.classList.contains('show')) menu.style.display = 'none'; }, 300);
        } else {
            menu.style.display = 'block';
            setTimeout(() => menu.classList.add('show'), 10);
            // Atualiza status ao abrir
            if (!campoAlvo) {
                campoInfo.textContent = 'Clique em um campo de texto na página para selecionar o alvo.';
                campoInfo.className   = `${ID_PREFIX}campo-info`;
                botaoSalvar.disabled  = true;
            }
            textareaMenu.focus();
        }
    }

    botao.onclick = (e) => { e.stopPropagation(); toggleMenu(); };
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('show') && !menu.contains(e.target) && e.target !== botao) toggleMenu();
    });
    menu.addEventListener('click', (e) => e.stopPropagation());

    // ── Velocidade ──
    function obterAtraso(velocidade) {
        switch (velocidade) {
            case "lento":  return Math.random() * 80  + 120;  // 120–200ms
            case "rapido": return Math.random() * 15  + 15;   // 15–30ms
            case "flash":  return Math.random() * 4   + 1;    // 1–5ms
            default:       return Math.random() * 30  + 40;   // 40–70ms
        }
    }

    // ── Digitação ──
    function digitarTexto(campo, texto, velocidade) {
        campo.focus();

        // Suporte a textarea e input nativos do React/MUI (que usam controlled components)
        const proto = campo.tagName === 'TEXTAREA'
            ? window.HTMLTextAreaElement.prototype
            : window.HTMLInputElement.prototype;

        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

        // Suporte a contenteditable
        const isEditable = campo.isContentEditable;

        let i = 0;
        function digitar() {
            if (i >= texto.length) return;

            const char = texto[i];

            if (isEditable) {
                // Insere direto no cursor para contenteditable
                document.execCommand('insertText', false, char);
            } else if (nativeSetter) {
                // React/MUI: usa o setter nativo + dispara eventos que o React escuta
                nativeSetter.call(campo, campo.value + char);
                campo.dispatchEvent(new Event('input',  { bubbles: true }));
                campo.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                campo.value += char;
                campo.dispatchEvent(new Event('input',  { bubbles: true }));
            }

            i++;
            setTimeout(digitar, obterAtraso(velocidade));
        }

        digitar();
    }

    // ── Salvar e iniciar ──
    botaoSalvar.onclick = () => {
        texto = textareaMenu.value;
        const vel = selectVelocidade.value;

        if (!texto) {
            alert("⚠️ Por favor, cole algum texto antes!");
            textareaMenu.focus();
            return;
        }
        if (!campoAlvo || !document.body.contains(campoAlvo)) {
            alert("⚠️ Nenhum campo alvo selecionado! Clique no campo da página onde quer digitar e abra o menu novamente.");
            return;
        }

        toggleMenu();
        // Pequeno delay para o menu fechar antes de focar o campo
        setTimeout(() => digitarTexto(campoAlvo, texto, vel), 350);
    };

    // Estado inicial — desabilita salvar até ter um campo
    botaoSalvar.disabled = true;

})();