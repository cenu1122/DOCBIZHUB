
"use strict";

const FORMAT_KM = new Intl.NumberFormat("bs-BA", {
  style: "currency",
  currency: "BAM",
  minimumFractionDigits: 2
});

function PRIKAZI_KM(IZNOS) {
  return FORMAT_KM.format(Number(IZNOS) || 0);
}

function PRIKAZI_PORUKU(PORUKA) {
  const ELEMENT = document.getElementById("PORUKA_SISTEMA");
  if (ELEMENT) ELEMENT.textContent = PORUKA;
}

async function UCITAJ_FINANSIJE() {
  const DB = DOBAVI_SUPABASE();

  if (!DB) {
    PRIKAZI_PORUKU("Baza nije povezana.");
    return;
  }

  try {
    const { data: PODACI, error: GRESKA } = await DB
      .from("RACUNOVODSTVO")
      .select("*");

    if (GRESKA) {
      console.error("GREŠKA PRI UČITAVANJU:", GRESKA);
      PRIKAZI_PORUKU(
        "Podaci nisu učitani. Provjeri tabelu RACUNOVODSTVO i RLS dozvole u Supabaseu."
      );
      return;
    }

    let PRIHODI = 0;
    let TROSKOVI = 0;

    for (const RED of PODACI || []) {
      const IZNOS = Number(RED.IZNOS) || 0;
      const TIP = String(RED.TIP || "").toUpperCase();

      if (TIP === "PRIHOD") {
        PRIHODI += IZNOS;
      } else if (TIP === "TROSAK" || TIP === "TROŠAK") {
        TROSKOVI += IZNOS;
      }
    }

    const EL_PRIHODI = document.getElementById("UKUPNI_PRIHODI");
    const EL_TROSKOVI = document.getElementById("UKUPNI_TROSKOVI");
    const EL_REZULTAT = document.getElementById("NETO_REZULTAT");

    if (EL_PRIHODI) EL_PRIHODI.textContent = PRIKAZI_KM(PRIHODI);
    if (EL_TROSKOVI) EL_TROSKOVI.textContent = PRIKAZI_KM(TROSKOVI);

    if (EL_REZULTAT) {
      EL_REZULTAT.textContent = PRIKAZI_KM(PRIHODI - TROSKOVI);
    }

    PRIKAZI_PORUKU("Finansijski podaci su učitani.");
  } catch (GRESKA) {
    console.error("NEOČEKIVANA GREŠKA:", GRESKA);
    PRIKAZI_PORUKU("Došlo je do greške pri učitavanju podataka.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  UCITAJ_FINANSIJE();
});
