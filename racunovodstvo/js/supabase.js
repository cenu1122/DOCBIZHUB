
const SUPABASE_URL = "https://uduwpvdjmanrgpumdrfh.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_IfX6dxz-ILfYK_3VgelcMw_tYOX0y45";

let SUPABASE = null;

function POVEZI_SUPABASE() {
  const STATUS = document.getElementById("STATUS_BAZE");
  const PORUKA = document.getElementById("PORUKA_SISTEMA");

  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase biblioteka nije učitana.");

    if (STATUS) STATUS.textContent = "GREŠKA";
    if (PORUKA) {
      PORUKA.textContent =
        "Supabase biblioteka nije učitana. Provjeri internet vezu.";
    }

    return null;
  }

  try {
    if (!SUPABASE) {
      SUPABASE = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      );
    }

    if (STATUS) STATUS.textContent = "POVEZAN";

    if (PORUKA) {
      PORUKA.textContent = "Supabase klijent je spreman.";
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
  return SUPABASE || POVEZI_SUPABASE();
}

// Učini funkcije dostupnim ostalim JavaScript fajlovima.
window.POVEZI_SUPABASE = POVEZI_SUPABASE;
window.DOBAVI_SUPABASE = DOBAVI_SUPABASE;

// Pokreni povezivanje i ako je stranica već učitana.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", POVEZI_SUPABASE, {
    once: true
  });
} else {
  POVEZI_SUPABASE();
}
