
const SUPABASE_URL = "https://uduwpvdjmanrgpumdrfh.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_IfX6dxz-ILfYK_3VgelcMw_tYOX0y45";

let SUPABASE = null;

function POVEZI_SUPABASE() {
  const STATUS = document.getElementById("STATUS_BAZE");
  const PORUKA = document.getElementById("PORUKA_SISTEMA");

  if (!window.supabase || !window.supabase.createClient) {
    if (STATUS) STATUS.textContent = "GREŠKA";
    if (PORUKA) {
      PORUKA.textContent =
        "Supabase biblioteka nije učitana. Provjeri internet vezu.";
    }
    return null;
  }

  try {
    SUPABASE = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    if (STATUS) STATUS.textContent = "POVEZAN";
    if (PORUKA) {
      PORUKA.textContent =
        "Supabase klijent je spreman. Čekamo konfiguraciju tabele.";
    }

    return SUPABASE;
  } catch (GRESKA) {
    console.error("SUPABASE GREŠKA:", GRESKA);

    if (STATUS) STATUS.textContent = "GREŠKA";
    if (PORUKA) {
      PORUKA.textContent = "Povezivanje nije uspjelo.";
    }

    return null;
  }
}

function DOBAVI_SUPABASE() {
  return SUPABASE;
}

document.addEventListener("DOMContentLoaded", () => {
  POVEZI_SUPABASE();
});
