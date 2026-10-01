<?php
// spremitoken.php - Prihvat FCM tokena iz mobilne aplikacije

if (isset($_GET['token'])) {
    $token = $_GET['token'];
    
    // Primjer A: Spremanje u bazu podataka (podesite vaše parametre baze)
    /*
    $conn = new mysqli("localhost", "korisnik_baze", "lozinka", "ime_baze");
    $stmt = $conn->prepare("INSERT INTO fcm_tokeni (token, datum) VALUES (?, NOW())");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    */

    // Primjer B: Brzi test - spremanje u obični tekstualni fajl (tokeni.txt)
    file_put_contents('tokeni.txt', $token . PHP_EOL, FILE_APPEND);

    echo "Token uspješno sačuvan!";
} else {
    echo "Greska: Token nije poslat.";
}
?>
