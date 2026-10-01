/* =========================================================
   DOCBIZ AI - FRONTEND
   Povezan direktno na Supabase Edge Function DOCBIZ_AI
   ========================================================= */

window.DocBizAI = (() => {

    const API_URL =
        "https://uduwpvdjmanrgpumdrfh.supabase.co/functions/v1/DOCBIZ_AI";


    /* =====================================================
       POMOĆNA FUNKCIJA
    ===================================================== */

    function dodajPoruku(tekst, tip){

        const messages =
            document.getElementById("docbiz-ai-messages");

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

        div.innerHTML =
            String(tekst)
                .replace(/\n/g, "<br>");

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
                    method:"POST",

                    headers:{
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
