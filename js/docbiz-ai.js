/* =========================================================
   DOCBIZ AI - FRONTEND
   Povezan direktno na Supabase Edge Function DOCBIZ_AI
   ========================================================= */

window.DocBizAI = (() => {

    const API_URL =
        "https://uduwpvdjmanrgpumdrfh.supabase.co/functions/v1/DOCBIZ_AI";


    /* =====================================================
       MARKDOWN -> HTML
    ===================================================== */

    function formatirajAI(tekst){

        if(!tekst){
            return "";
        }

        let html =
            String(tekst)
                .replace(/\r\n/g, "\n")
                .replace(/\r/g, "\n");

        /* HTML ZAŠTITA */

        html =
            html
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        /* SKINI ESCAPE IZ AI ODGOVORA */

        html =
            html.replace(/\\([\\`*_{}\[\]()#+.!|>-])/g, "$1");


        /* CODE BLOCK */

        html =
            html.replace(
                /```([\s\S]*?)```/g,
                function(match, code){

                    return (
                        '<pre class="docbiz-ai-code">' +
                        code.trim() +
                        '</pre>'
                    );

                }
            );


        /* TABELA */

        const redovi =
            html.split("\n");

        let rezultat = [];

        let uTabeli = false;
        let tabela = [];
        let tabelaHeader = false;


        function zavrsiTabelu(){

            if(!uTabeli){
                return;
            }

            if(tabela.length){

                let tableHTML =
                    '<table class="docbiz-ai-table">';

                tabela.forEach(
                    function(red, index){

                        const celije =
                            red
                                .split("|")
                                .map(
                                    function(c){
                                        return c.trim();
                                    }
                                )
                                .filter(
                                    function(c, i, arr){

                                        return !(
                                            i === 0 &&
                                            c === ""
                                        ) &&
                                        !(
                                            i === arr.length - 1 &&
                                            c === ""
                                        );

                                    }
                                );


                        if(!celije.length){
                            return;
                        }


                        /* SEPARATOR RED */

                        const separator =
                            celije.every(
                                function(c){

                                    return /^:?-{3,}:?$/.test(
                                        c
                                    );

                                }
                            );


                        if(separator){
                            tabelaHeader = true;
                            return;
                        }


                        const tag =
                            index === 0
                                ? "th"
                                : "td";


                        tableHTML += "<tr>";

                        celije.forEach(
                            function(celija){

                                tableHTML +=
                                    "<" +
                                    tag +
                                    ">" +
                                    celija +
                                    "</" +
                                    tag +
                                    ">";

                            }
                        );

                        tableHTML += "</tr>";

                    }
                );

                tableHTML += "</table>";

                rezultat.push(
                    tableHTML
                );

            }

            tabela = [];
            uTabeli = false;
            tabelaHeader = false;

        }


        redovi.forEach(
            function(red){

                const trim =
                    red.trim();


                /* TABELA RED */

                if(
                    trim.includes("|") &&
                    trim.split("|").length >= 2
                ){

                    if(!uTabeli){
                        uTabeli = true;
                    }

                    tabela.push(trim);

                    return;

                }


                zavrsiTabelu();


                rezultat.push(
                    red
                );

            }
        );


        zavrsiTabelu();


        html =
            rezultat.join("\n");


        /* NASLOVI */

        html =
            html
                .replace(
                    /^### (.+)$/gm,
                    "<h4>$1</h4>"
                )
                .replace(
                    /^## (.+)$/gm,
                    "<h3>$1</h3>"
                )
                .replace(
                    /^# (.+)$/gm,
                    "<h2>$1</h2>"
                );


        /* HORIZONTALNA LINIJA */

        html =
            html.replace(
                /^---+$/gm,
                "<hr>"
            );


        /* BOLD */

        html =
            html.replace(
                /\*\*(.+?)\*\*/g,
                "<strong>$1</strong>"
            );


        html =
            html.replace(
                /__(.+?)__/g,
                "<strong>$1</strong>"
            );


        /* ITALIC */

        html =
            html.replace(
                /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
                "<em>$1</em>"
            );


        html =
            html.replace(
                /(?<!_)_([^_\n]+)_(?!_)/g,
                "<em>$1</em>"
            );


        /* BULLET LISTE */

        html =
            html.replace(
                /(?:^|\n)(?:[-*]) (.+)(?=\n|$)/g,
                function(match, text){

                    return (
                        "\n<li>" +
                        text +
                        "</li>"
                    );

                }
            );


        /* GRUPIŠI LI ELEMENTE U UL */

        html =
            html.replace(
                /((?:<li>.*<\/li>\n?)+)/g,
                function(match){

                    return (
                        "<ul>" +
                        match +
                        "</ul>"
                    );

                }
            );


        /* NUMERISANE LISTE */

        html =
            html.replace(
                /(?:^|\n)\d+\.\s+(.+)(?=\n|$)/g,
                function(match, text){

                    return (
                        "\n<li>" +
                        text +
                        "</li>"
                    );

                }
            );


        /* NOVI RED */

        html =
            html.replace(
                /\n{2,}/g,
                "<br><br>"
            );


        html =
            html.replace(
                /\n/g,
                "<br>"
            );


        /* VRATI NATRAG BLOKOVE KOJI NE TREBAJU BR */

        html =
            html.replace(
                /<\/h2><br>/g,
                "</h2>"
            )
            .replace(
                /<\/h3><br>/g,
                "</h3>"
            )
            .replace(
                /<\/h4><br>/g,
                "</h4>"
            )
            .replace(
                /<hr><br>/g,
                "<hr>"
            )
            .replace(
                /<\/ul><br>/g,
                "</ul>"
            )
            .replace(
                /<\/table><br>/g,
                "</table>"
            )
            .replace(
                /<\/pre><br>/g,
                "</pre>"
            );


        return html;

    }


    /* =====================================================
       DODAJ PORUKU
    ===================================================== */

    function dodajPoruku(tekst, tip){

        const messages =
            document.getElementById(
                "docbiz-ai-messages"
            );

        if(!messages){
            return;
        }


        const div =
            document.createElement("div");


        div.className =
            "docbiz-ai-message " +
            (
                tip === "user"
                    ? "docbiz-ai-user"
                    : "docbiz-ai-bot"
            );


        if(tip === "user"){

            /* KORISNIČKA PORUKA */

            div.textContent =
                String(tekst);

        }else{

            /* AI ODGOVOR */

            div.innerHTML =
                formatirajAI(tekst);

        }


        messages.appendChild(div);


        messages.scrollTop =
            messages.scrollHeight;


        return div;

    }


    /* =====================================================
       LOADING
    ===================================================== */

    function prikaziLoading(){

        return dodajPoruku(
            "🤖 Razmišljam...",
            "bot"
        );

    }


    /* =====================================================
       POZOVI DOCBIZ AI
    ===================================================== */

    async function ask(message, context = {}){

        if(
            !message ||
            !message.trim()
        ){

            throw new Error(
                "Unesite pitanje."
            );

        }


        if(
            typeof _supabase === "undefined" ||
            !_supabase
        ){

            throw new Error(
                "Supabase nije dostupan."
            );

        }


        /* ---------------------------------------------
           1. DOHVATI TRENUTNU SESIJU
        --------------------------------------------- */

        const {
            data: sessionData,
            error: sessionError
        } =
            await _supabase.auth.getSession();


        if(sessionError){

            throw new Error(
                "Greška pri provjeri prijave."
            );

        }


        if(
            !sessionData ||
            !sessionData.session ||
            !sessionData.session.access_token
        ){

            throw new Error(
                "Niste prijavljeni. Prijavite se ponovo."
            );

        }


        const accessToken =
            sessionData.session.access_token;


        /* ---------------------------------------------
           2. POZOVI DOCBIZ_AI
        --------------------------------------------- */

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            accessToken
                    },

                    body:
                        JSON.stringify({

                            poruka:
                                message.trim(),

                            context:
                                context || {}

                        })
                }
            );


        let data = null;


        try{

            data =
                await response.json();

        }catch(error){

            throw new Error(
                "AI server je vratio neispravan odgovor."
            );

        }


        if(!response.ok){

            throw new Error(
                data &&
                (
                    data.error ||
                    data.message
                )
                    ? (
                        data.error ||
                        data.message
                    )
                    : "AI server trenutno nije dostupan."
            );

        }


        if(
            !data ||
            data.success !== true
        ){

            throw new Error(
                data &&
                data.error
                    ? data.error
                    : "AI nije uspio generisati odgovor."
            );

        }


        return data.odgovor || "";

    }


    /* =====================================================
       OTVORI AI
    ===================================================== */

    function otvori(){

        const ai =
            document.getElementById(
                "docbiz-ai"
            );

        if(!ai){
            return;
        }


        ai.style.display =
            "flex";

    }


    /* =====================================================
       ZATVORI AI
    ===================================================== */

    function zatvori(){

        const ai =
            document.getElementById(
                "docbiz-ai"
            );

        if(!ai){
            return;
        }


        ai.style.display =
            "none";

    }


    /* =====================================================
       POŠALJI PORUKU IZ PROZORA
    ===================================================== */

    async function posaljiPoruku(){

        const input =
            document.getElementById(
                "docbiz-ai-input"
            );

        if(!input){
            return;
        }


        const tekst =
            input.value.trim();


        if(!tekst){
            return;
        }


        input.value = "";


        /* USER PORUKA */

        dodajPoruku(
            tekst,
            "user"
        );


        /* LOADING */

        const loading =
            prikaziLoading();


        try{

            const odgovor =
                await ask(
                    tekst,
                    {
                        page:
                            window.location.pathname,

                        title:
                            document.title
                    }
                );


            if(loading){
                loading.remove();
            }


            dodajPoruku(
                odgovor,
                "bot"
            );


        }catch(error){

            if(loading){
                loading.remove();
            }


            dodajPoruku(
                "❌ " +
                (
                    error &&
                    error.message
                        ? error.message
                        : "Došlo je do greške."
                ),
                "bot"
            );

        }

    }


    /* =====================================================
       QUICK ACTION
    ===================================================== */

    async function quickAction(
        tekst
    ){

        const input =
            document.getElementById(
                "docbiz-ai-input"
            );


        if(input){

            input.value =
                tekst;

        }


        await posaljiPoruku();

    }


    /* =====================================================
       INICIJALIZACIJA
    ===================================================== */

    function init(){

        const openButton =
            document.getElementById(
                "docbiz-ai-open"
            );


        const closeButton =
            document.getElementById(
                "docbiz-ai-close"
            );


        const sendButton =
            document.getElementById(
                "docbiz-ai-send"
            );


        const input =
            document.getElementById(
                "docbiz-ai-input"
            );


        /* OTVORI */

        if(openButton){

            openButton.addEventListener(
                "click",
                otvori
            );

        }


        /* ZATVORI */

        if(closeButton){

            closeButton.addEventListener(
                "click",
                zatvori
            );

        }


        /* POŠALJI */

        if(sendButton){

            sendButton.addEventListener(
                "click",
                posaljiPoruku
            );

        }


        /* ENTER = POŠALJI */

        if(input){

            input.addEventListener(
                "keydown",
                function(event){

                    if(
                        event.key === "Enter" &&
                        !event.shiftKey
                    ){

                        event.preventDefault();

                        posaljiPoruku();

                    }

                }
            );

        }


        /* QUICK BUTTONS */

        document
            .querySelectorAll(
                "[data-ai]"
            )
            .forEach(
                function(button){

                    button.addEventListener(
                        "click",
                        function(){

                            const tekst =
                                button.getAttribute(
                                    "data-ai"
                                );


                            quickAction(
                                tekst
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       START
    ===================================================== */

    if(
        document.readyState === "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    }else{

        init();

    }


    /* =====================================================
       JAVNI API
    ===================================================== */

    return {

        ask:
            ask,

        open:
            otvori,

        close:
            zatvori,

        send:
            posaljiPoruku

    };

})();
