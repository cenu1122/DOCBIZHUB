
"use strict";

const AI_AGENT = {
  PORUKE: [],

  ODGOVORI: [
    {
      KLJUCNE_RIJECI: ["faktura", "fakture", "račun", "racun"],
      ODGOVOR:
        "Za fakture otvori sekciju Fakture. Tamo ćemo dodati unos broja fakture, kupca, datuma, iznosa i statusa plaćanja."
    },
    {
      KLJUCNE_RIJECI: ["trošak", "trosak", "troškovi", "troskovi"],
      ODGOVOR:
        "Troškove je potrebno evidentirati s datumom, opisom, kategorijom i iznosom. Sačuvaj i dokumentaciju za knjigovodstvo."
    },
    {
      KLJUCNE_RIJECI: ["prihod", "prihodi"],
      ODGOVOR:
        "Prihode ćemo evidentirati po datumu, iznosu i opisu. Tako ćeš lakše pratiti finansijski rezultat."
    },
    {
      KLJUCNE_RIJECI: ["izvještaj", "izvjestaj", "izvještaji", "izvjestaji"],
      ODGOVOR:
        "U sekciji Izvještaji planiramo pregled prihoda, troškova i rezultata za izabrani period."
    },
    {
      KLJUCNE_RIJECI: ["pdv", "porez"],
      ODGOVOR:
        "Mogu pomoći s općim objašnjenjima PDV-a i poreza. Za konkretan obračun treba provjeriti važeće propise i tvoje poslovne okolnosti."
    }
  ],

  ODGOVORI_NA_PORUKU(TEKST) {
    const PORUKA = String(TEKST || "").trim();

    if (!PORUKA) {
      return "Napiši pitanje pa ću pokušati pomoći.";
    }

    const NORMALIZOVANO = PORUKA.toLocaleLowerCase("bs");

    const REZULTAT = this.ODGOVORI.find((STAVKA) =>
      STAVKA.KLJUCNE_RIJECI.some((RIJEC) =>
        NORMALIZOVANO.includes(RIJEC)
      )
    );

    if (REZULTAT) {
      return REZULTAT.ODGOVOR;
    }

    return (
      "Hvala na pitanju! Ovo je trenutno demo verzija asistenta. " +
      "Za odgovor zasnovan na stvarnoj AI analizi potrebno je povezati siguran AI backend."
    );
  },

  POSALJI(TEKST) {
    const ODGOVOR = this.ODGOVORI_NA_PORUKU(TEKST);

    this.PORUKE.push({
      ULOGA: "KORISNIK",
      TEKST: TEKST
    });

    this.PORUKE.push({
      ULOGA: "ASISTENT",
      TEKST: ODGOVOR
    });

    return ODGOVOR;
  }
};

window.AI_AGENT = AI_AGENT;
