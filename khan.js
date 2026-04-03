(() => {
    'use strict';

    if (window._moon_loaded) return;
    window._moon_loaded = true;

    const CONFIG = {
        dbKey: 'MOON_DATABASE',
        ui: {
            p: '#ffffff',
            bg: 'linear-gradient(135deg, #0b0f19 0%, #06080d 100%)',
            glass: 'rgba(11, 15, 25, 0.7)'
        }
    };

    const DB =  {
        get: () => JSON.parse(localStorage.getItem(CONFIG.dbKey) || '{}'),
        check: async() => await hmac(await get(),'MoonScripts'),
        save: (data) => {
            const current = DB.get();
            localStorage.setItem(CONFIG.dbKey, JSON.stringify({ ...current, ...data }));
        }
    };

   const injectStyles = () => {
    const s = document.createElement('style');
    s.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Syne+Mono:wght@400;700&display=swap');

:root {
    --moon-primary: #ffffff;
    --moon-glow: rgba(255, 255, 255, 0.25);
    --moon-glow-soft: rgba(255, 255, 255, 0.08);
    --moon-bg: #000000;
    --moon-card: rgba(18, 18, 18, 0.75);
    --moon-card-solid: #111111;
    --moon-border: rgba(255, 255, 255, 0.12);
    --moon-border-hover: rgba(255, 255, 255, 0.25);
    --moon-text: #ffffff;
    --moon-muted: #9ca3af;
    --moon-success: #ffffff;
    --moon-error: #ffffff;
    --moon-warning: #ffffff;
}

/* OVERRIDES DA PÁGINA */
body {
    font-family: 'Space Grotesk', sans-serif !important;
    background: var(--moon-bg) !important;
    background-image:
        radial-gradient(ellipse 70% 50% at 80% 0%, var(--moon-glow-soft) 0%, transparent 60%),
        radial-gradient(ellipse 50% 60% at 10% 100%, rgba(255,255,255,0.04) 0%, transparent 55%) !important;
    color: var(--moon-text) !important;
}


/* TELA DE CARREGAMENTO */
#_m_loader {
    position: fixed;
     top: 0;
    left: 0;
    width: 100%;
    height: 130vh;
    inset: 0;
    background: var(--moon-bg);
    background-image: radial-gradient(circle at 50% 45%, var(--moon-glow-soft) 0%, transparent 55%);
    display: flex;
     flex-direction: column;
    justify-content: center;
    align-items: center;
       text-align: center;
    z-index: 999999;
}
/* ANIMAÇÃO ORBITAL */
.m_orbital_loader {
    position: relative;
    width: 88px;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.m_center {
    width: 16px;
    height: 16px;
    background: var(--moon-primary);
    border-radius: 50%;
    box-shadow:
        0 0 0 4px var(--moon-glow-soft),
        0 0 20px var(--moon-primary),
        0 0 40px var(--moon-glow);
}
.m_orbit {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border-top: 1px solid rgba(255,255,255,0.25);
    border-right: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    animation: spin 3s linear infinite;
}
/* Segundo anel com delay e direção oposta */
.m_orbit::after {
    content: '';
    position: absolute;
    inset: 10px;
    border-radius: 50%;
    border: 1px dashed rgba(255,255,255,0.1);
    animation: spin 6s linear infinite reverse;
}
.m_satellite {
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px #fff, 0 0 16px rgba(255,255,255,0.3);
}
@keyframes spin {
    100% { transform: rotate(360deg); }
}
.m_title {
    margin-top: 20px;
    font-size: 18px;
    letter-spacing: 6px;
    text-transform: uppercase;
    text-shadow: 0 0 25px var(--moon-glow);
}
.m_subtitle {
    color: var(--moon-muted);
    font-size: 10px;
    letter-spacing: 2px;
}
/* SISTEMA DE NOTIFICAÇÕES (TOASTS) */
#m_toast_container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999999;
}
.m_toast {
    background: var(--moon-card);
    backdrop-filter: blur(18px);
    border: 1px solid var(--moon-border);
    border-left: 3px solid var(--moon-primary);
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    color: var(--moon-text);
    padding: 12px 16px;
    border-radius: 10px;
    min-width: 260px;
    font-size: 13px;
    transform: translateX(110%);
    opacity: 0;
    transition: 0.4s;
}

.m_toast:hover {
    border-color: var(--moon-border-hover);
    border-left-color: var(--moon-primary);
}

.m_toast.active {
    transform: translateX(0);
    opacity: 1;
}

.m_toast::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--moon-primary);
    box-shadow: 0 0 8px var(--moon-primary), 0 0 16px var(--moon-glow-soft);
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.75); }
}

.m_toast.suc {
    border-left-color: var(--moon-success);
}
.m_toast.suc::before {
    background: var(--moon-success);
    box-shadow: 0 0 8px var(--moon-success);
    animation: none;
}

   .moon-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.moon-container,
.hero,
.main-screen {
    min-height: 130vh; /* aumenta a altura da tela */
}

.m_toast.err {
    border-left-color: var(--moon-error);
}
.m_toast.err::before {
    background: var(--moon-error);
    box-shadow: 0 0 8px var(--moon-error);
    animation: none;
}

.m_toast.warn {
    border-left-color: var(--moon-warning);
}
.m_toast.warn::before {
    background: var(--moon-warning);
    box-shadow: 0 0 8px var(--moon-warning);
    animation: none;
}

/* MINI PAINEL DE STATUS */
#moon_panel {
    position: fixed;
    top: 20px;
    left: 20px;
    background: var(--moon-card);
    backdrop-filter: blur(18px);
    border: 1px solid var(--moon-border);
    box-shadow: 0 8px 30px rgba(0,0,0,0.6);
    padding: 14px 16px;
    border-radius: 12px;
    color: var(--moon-text);
    font-size: 12px;
    z-index: 999999;
    min-width: 200px;
}

#moon_panel h3 {
    margin-bottom: 10px;
    font-size: 13px;
    font-weight: 600;
}

#moon_panel h3::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--moon-primary);
    box-shadow: 0 0 8px var(--moon-primary), 0 0 16px var(--moon-glow-soft);
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
}

#moon_panel .status {
    color: var(--moon-muted);
    line-height: 1.7;
    font-size: 11px;
    letter-spacing: 0.3px;
}


* {
    box-shadow: none !important;
}

[style*="rgb(124"], 
[style*="#7c3aed"], 
[class*="purple"] {
    color: #fff !important;
    background: #000 !important;
    border-color: #fff !important;
}


    `;
    document.head.appendChild(s);
};
    class Notifier {
        constructor() {
            this.c = document.createElement('div');
            this.c.id = 'm_toast_container';
            document.body.appendChild(this.c);
            this.last = "";
        }
        show(msg, type = '', dur = 3000) {
            if (msg === this.last) return;
            this.last = msg;
            const t = document.createElement('div');
            t.className = `m_toast ${type}`;
            t.innerHTML = `<span>${msg}</span>`;
            this.c.appendChild(t);
            // Delay para permitir o trigger da animação CSS
            requestAnimationFrame(() => {
                setTimeout(() => t.classList.add('active'), 10);
            });
            
            if (dur !== Infinity) {
                setTimeout(() => {
                    t.classList.remove('active');
                    setTimeout(() => { t.remove(); this.last = ""; }, 500);
                }, dur);
            }
        }
    }

    const _SPO_CLICK = () => {
        let done = false;
        const obs = new MutationObserver(() => {
            const start = [...document.querySelectorAll("button")].find(b => b.innerText.includes("Vamos lá"));
            if (start) { start.click(); return; }
            const radio = document.querySelector('button[aria-label*="Escolha"]');
            if (radio && !done) {
                radio.click();
                const check = document.querySelector('[data-testid="exercise-check-answer"]');
                if (check) { check.click(); done = true; obs.disconnect(); }
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    };

    const modifyItemData = (itemData) => {
        itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
        itemData.question.content = "**Dom Gomes™ ATIVO**\n\nClique no botão abaixo para concluir.\n\n[[☃ radio 1]]";
        itemData.question.widgets = {
            "radio 1": {
                type: "radio", alignment: "default", static: false, graded: true,
                options: {
                    choices: [{ content: "Validar Resposta (Dom Gomes)", correct: true, id: "correct-choice-" + Date.now() }],
                    randomize: false, multipleSelect: false, deselectEnabled: false
                },
                version: { major: 1, minor: 0 }
            }
        };
        itemData.hints = [];
        return true;
    };

    const modifyResponseData = (itemData) => {
        itemData.answerArea = { calculator: false, chi2Table: false, periodicTable: false, tTable: false, zTable: false };
        itemData.question.content = "**Dom Gomes™**\n\n✅ **QUESTÃO RESPONDIDA!**\n\nClique no botão abaixo para continuar.\n\n[[☃ radio 1]]";
        itemData.question.widgets = {
            "radio 1": {
                type: "radio", options: {
                    choices: [{ content: "✅ Resposta Validada (Dom Gomes)", correct: true, id: "response-choice-" + Date.now() }]
                }
            }
        };
        itemData.hints = [];
        return true;
    };

    const setupNetwork = (notifier) => {
        const _F = window.fetch;
        
        window.fetch = async function(input, init) {
            const url = input instanceof Request ? input.url : input;
            let body = null;
            try { body = input instanceof Request ? await input.clone().text() : init?.body; } catch(e){}

            if (url.includes("attemptProblem")) {
                try {
                    const payload = JSON.parse(body);
                    const cache = DB.get()[`${payload.variables.input.assessmentItemId}-${payload.variables.input.assessmentItemSha}`];
                    if (cache) {
                        payload.variables.input.attemptState = JSON.stringify(cache.attemptState);
                        payload.variables.input.userInput = JSON.stringify(cache.userInput);
                        payload.variables.input.attemptContent = cache.attemptContent;
                        const res = await _F.apply(this, [input, { ...init, body: JSON.stringify(payload) }]);
                        const resClone = res.clone();
                        try {
                            const resData = await resClone.json();
                            if (resData?.data?.attemptProblem?.result?.itemData) {
                                let responseItemData = JSON.parse(resData.data.attemptProblem.result.itemData);
                                modifyResponseData(responseItemData);
                                resData.data.attemptProblem.result.itemData = JSON.stringify(responseItemData);
                                notifier.show("🤵‍♂️ SPOOF MANTIDO NA RESPOSTA", "suc");
                                return new Response(JSON.stringify(resData), { status: res.status, headers: res.headers });
                            }
                        } catch(e) { console.error("Erro ao modificar resposta:", e); }
                        return res;
                    }
                } catch (e) {}
            }

            if (url.includes("getOrCreate")) {
                try {
                    const p = JSON.parse(body);
                    if (p?.variables?.ancestorIds) {
                        DB.save({ info: p.variables.ancestorIds, teste: p?.variables?.input?.topicId || 0 });
                    }
                } catch (e) {}
            }

            if (url.includes("getAssessment")) {
                const res = await _F.apply(this, arguments);
                const payload = JSON.parse(body);
                const clone = res.clone();

                try {
                    const data = await clone.json();
                    let item = data?.data?.assessmentItemById?.item || data?.data?.assessmentItemByProblemNumber?.item;
                    
                    if (item) {
                        _SPO_CLICK();
                        const signature = await DB.check();
                        const auth = await signRequest(signature);                        
                        const response = await _F('https://api.moonscripts.cloud/answers', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json','x-accept-request': signature, "x-device": auth.device, "x-session": auth.session, "x-ts": auth.ts, "x-signature": auth.sig},
                            body: JSON.stringify({ exerciseId: DB.get().teste || payload.variables.exerciseId, ancestorIds: DB.get().info, itemDataAnswerless: item.itemDataAnswerless, id: item.id, sha: item.sha })
                        });
                        const result = await response.json();
                        const update = {};
                        update[`${item.id}-${item.sha}`] = { attemptContent: result.khanmigo.answer.attemptContent, attemptState: result.khanmigo.answer.attemptState, userInput: result.khanmigo.answer.userInput };
                        DB.save(update);

                        let itemData = JSON.parse(item.itemDataAnswerless);
                        modifyItemData(itemData);
                        item.itemDataAnswerless = JSON.stringify(itemData);
                        
                        notifier.show("🤵‍♂️ SPOOF ATIVADO", "suc");
                        return new Response(JSON.stringify(data), { status: res.status, headers: res.headers });
                    }
                } catch(e) { notifier.show("ERRO NO SPOOF", "err"); }
                return res;
            }
            
            return _F.apply(this, arguments);
        };
    };

    const get = async() => {

        const encoder = new TextEncoder();

        function sha256(data){
            return crypto.subtle.digest("SHA-256", encoder.encode(data));
        }

        function buf2hex(buffer){
            return [...new Uint8Array(buffer)]
                .map(x => x.toString(16).padStart(2,"0"))
                .join("");
        }

        function canvasFP(){
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            ctx.textBaseline="top";
            ctx.font="14px Arial";
            ctx.fillStyle="#f60";
            ctx.fillRect(125,1,62,20);
            ctx.fillStyle="#069";
            ctx.fillText("moon-fp",2,15);
            ctx.fillStyle="rgba(102,204,0,0.7)";
            ctx.fillText("moon-fp",4,17);

            ctx.globalCompositeOperation="multiply";
            ctx.fillStyle="rgb(255,0,255)";
            ctx.beginPath();
            ctx.arc(50,50,50,0,Math.PI*2,true);
            ctx.fill();

            return canvas.toDataURL();
        }

        function webglFP(){
            const canvas=document.createElement("canvas");
            const gl=canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

            if(!gl) return "no-webgl";

            const dbg=gl.getExtension("WEBGL_debug_renderer_info");

            return [
                gl.getParameter(gl.VERSION),
                gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : "",
                dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "",
                gl.getParameter(gl.MAX_TEXTURE_SIZE),
                gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
                gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
            ].join("|");
        }

        function shaderFP(){
            const canvas=document.createElement("canvas");
            const gl=canvas.getContext("webgl");
            if(!gl) return "no-shader";

            const shader=gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(shader,"void main(){gl_FragColor=vec4(1.0);}");
            gl.compileShader(shader);

            return gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        }

        async function audioFP(){
            try{
                const ctx=new OfflineAudioContext(1,44100,44100);
                const osc=ctx.createOscillator();
                const comp=ctx.createDynamicsCompressor();

                osc.type="triangle";
                osc.connect(comp);
                comp.connect(ctx.destination);
                osc.start(0);

                const buffer=await ctx.startRendering();
                const data=buffer.getChannelData(0).slice(0,2000);

                return data.reduce((a,b)=>a+b,0).toString();
            }catch{
                return "no-audio";
            }
        }

        function fontsFP(){
            const fonts=["Arial","Verdana","Times","Courier","Roboto","Calibri","Tahoma","Georgia","Comic Sans MS"];
            const span=document.createElement("span");
            span.innerHTML="mmmmmmmmmmlli";
            span.style.fontSize="72px";
            span.style.visibility="hidden";
            document.body.appendChild(span);

            const defaultWidth=span.offsetWidth;

            const detected=fonts.filter(f=>{
                span.style.fontFamily=f;
                return span.offsetWidth!==defaultWidth;
            });

            span.remove();

            return detected.join(",");
        }

        function pluginsFP(){
            return [...navigator.plugins].map(p=>p.name+"::"+p.filename).join("|");
        }

        function mimeFP(){
            return [...navigator.mimeTypes].map(m=>m.type).join("|");
        }

        function cpuFP(){
            const start=performance.now();
            let x=0;
            for(let i=0;i<1000000;i++){
                x+=Math.sqrt(i);
            }
            return performance.now()-start;
        }

        function gamepadFP(){
            const pads=navigator.getGamepads ? navigator.getGamepads() : [];
            return [...pads].map(p=>p?.id || "null").join("|");
        }

        function networkFP(){
            const c=navigator.connection || {};
            return [
                c.downlink,
                c.effectiveType,
                c.rtt,
                c.saveData
            ].join("|");
        }

        async function mediaFP(){
            try{
                const devices=await navigator.mediaDevices.enumerateDevices();
                return devices.map(d=>d.kind+"-"+d.label).join("|");
            }catch{
                return "no-media";
            }
        }

        async function batteryFP(){
            try{
                const b=await navigator.getBattery();
                return [b.level,b.charging,b.chargingTime,b.dischargingTime].join("|");
            }catch{
                return "no-battery";
            }
        }

        async function permissionsFP(){
            const list=["geolocation","notifications","camera","microphone"];
            const res=[];

            for(const p of list){
                try{
                    const r=await navigator.permissions.query({name:p});
                    res.push(p+":"+r.state);
                }catch{}
            }

            return res.join("|");
        }

        function storageFP(){
            return [
                !!window.localStorage,
                !!window.sessionStorage,
                navigator.cookieEnabled
            ].join("|");
        }

        function iframeFP(){
            return window.self !== window.top;
        }

        function tamperFP(){
            const native=Function.prototype.toString.call(console.log);
            return native.includes("[native code]");
        }

        function perfFP(){
            const t=performance.timing;
            return [
                t.navigationStart,
                t.domComplete,
                t.domInteractive
            ].join("|");
        }

        const env=[
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            screen.width,
            screen.height,
            screen.colorDepth,
            screen.pixelDepth,
            window.devicePixelRatio,
            navigator.maxTouchPoints,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            new Date().getTimezoneOffset(),
            performance.memory ? performance.memory.jsHeapSizeLimit : "mem0",
            history.length,
            navigator.webdriver
        ].join("|");

        const signals=[
            env,
            canvasFP(),
            webglFP(),
            shaderFP(),
            fontsFP(),
            pluginsFP(),
            mimeFP(),
            storageFP(),
            perfFP(),
            cpuFP(),
            gamepadFP(),
            networkFP(),
            iframeFP(),
            tamperFP(),
            await permissionsFP(),
            await audioFP(),
            await mediaFP(),
            await batteryFP(),
            crypto.randomUUID(),
            Math.random(),
            performance.now()
        ].join("||");

        let hash=await sha256(signals);
        let hex=buf2hex(hash);

        for(let i=0;i<300;i++){
            hash=await sha256(
                hex +
                signals +
                i +
                performance.now() +
                Math.random()
            );
            hex=buf2hex(hash);
        }

        return hex;
    }

    const hmac = async(message, secret) => {
        const enc = new TextEncoder();

        const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            {name:"HMAC", hash:"SHA-256"},
            false,
            ["sign"]
        );

        const sig = await crypto.subtle.sign(
            "HMAC",
            key,
            enc.encode(message)
        );

        return [...new Uint8Array(sig)]
            .map(x=>x.toString(16).padStart(2,"0"))
            .join("");
    }

    const getSession = ()=>{
        if(!sessionStorage._moon_session){
            const arr = new Uint32Array(4);
            crypto.getRandomValues(arr);
            sessionStorage._moon_session =
                [...arr].map(x=>x.toString(16)).join("");
        }
        return sessionStorage._moon_session;
    };

    const getDeviceFP = async () => {
        const encoder = new TextEncoder();

        const sha256 = async(data)=>{
            const hash = await crypto.subtle.digest("SHA-256", encoder.encode(data));
            return [...new Uint8Array(hash)]
                .map(b=>b.toString(16).padStart(2,"0"))
                .join("");
        };

        const env = [
            navigator.userAgent,
            navigator.language,
            navigator.platform,
            navigator.hardwareConcurrency,
            navigator.deviceMemory,
            screen.width,
            screen.height,
            screen.colorDepth,
            window.devicePixelRatio,
            navigator.maxTouchPoints,
            Intl.DateTimeFormat().resolvedOptions().timeZone
        ].join("|");

        const canvas = (()=>{
            const c=document.createElement("canvas");
            const ctx=c.getContext("2d");
            ctx.textBaseline="top";
            ctx.font="16px Arial";
            ctx.fillStyle="#f60";
            ctx.fillRect(10,10,100,30);
            ctx.fillStyle="#069";
            ctx.fillText("moon-device",2,15);
            return c.toDataURL();
        })();

        const webgl = (()=>{
            const c=document.createElement("canvas");
            const gl=c.getContext("webgl");
            if(!gl) return "no-webgl";
            const dbg=gl.getExtension("WEBGL_debug_renderer_info");
            return [
                gl.getParameter(gl.VERSION),
                dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : "",
                dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : "",
                gl.getParameter(gl.MAX_TEXTURE_SIZE)
            ].join("|");
        })();

        const math = [
            Math.sin(1),
            Math.cos(1),
            Math.tan(1),
            Math.log(2)
        ].join("|");

        const raw = [env, canvas, webgl, math].join("||");

        return await sha256(raw);
    };

    const signRequest = async(data)=>{
        const device = await getDeviceFP();
        const session = getSession();
        const ts = Date.now();
        const raw = JSON.stringify(data) + "|" + device + "|" + session + "|" + ts;

        const hash = await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(raw)
        );

        const sig = [...new Uint8Array(hash)]
            .map(x=>x.toString(16).padStart(2,"0"))
            .join("");

        return { device, session, ts, sig };
    };    

    const init = async () => {
        injectStyles();
        
        const loader = document.createElement('div');
        loader.id = '_m_loader';
        loader.innerHTML = `
            <div class="m_orbital_loader">
                <div class="m_center"></div>
            </div>
            <h1 class="m_title">Rhenan Gayzao </h1>
            <div class="m_subtitle">Allen Schwuchteln. <br>Homosexuellen und Funkmusik-Fans wünsche ich <br>dass sie zusammen mit den Juden in der Hölle brennen.<br>
Hail Dimmu Dimmu Borgir, Hail Shagrath</div>
        `;
        document.body.appendChild(loader);

        const notifier = new Notifier();
        setupNetwork(notifier);

        try {
            const dr = await new Promise(res => {
                const s = document.createElement("script");
                s.src = "https://cdn.jsdelivr.net/npm/darkreader@4.9.96/darkreader.min.js";
                s.onload = () => res(window.DarkReader);
                document.head.appendChild(s);
            });
            dr.setFetchMethod(window.fetch);
          dr.enable({ 
    brightness: 100,
    contrast: 100,
    sepia: 0,
    grayscale: 0,
    darkSchemeBackgroundColor: '#000000',
    darkSchemeTextColor: '#ffffff'
}); // Integrado com o BG nativo

            const script = document.createElement('script');
          
            script.onload = () => console.log('Core loaded');
            script.onerror = () => console.error('Falha ao carregar script');
            document.head.appendChild(script);
        } catch (e) {}

        setTimeout(() => {
            loader.style.filter = 'blur(15px)';
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
                notifier.show("SISTEMA ONLINE", "suc");
                notifier.show("AGUARDANDO INTERCEPTAÇÃO...", "", Infinity);
            }, 600);
        }, 1200);
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();



