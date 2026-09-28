<?php

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "error" => "Method not allowed"
    ]);

    exit;
}

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$message = trim($input["message"] ?? "");

if ($message === "") {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "error" => "Pitanje je prazno."
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| AI API
|--------------------------------------------------------------------------
| API ključ treba biti na serveru / u environment varijabli.
*/

$apiKey = getenv("OPENAI_API_KEY");

if (!$apiKey) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "AI API nije konfigurisan."
    ]);

    exit;
}

$payload = [
    "model" => "gpt-5.6",
    "input" => [
        [
            "role" => "system",
            "content" => "Ti si DocBiz AI, poslovni AI asistent platforme DocBizHub. Odgovaraj jasno, kratko i korisno. Ako nemaš dovoljno informacija, reci šta nedostaje."
        ],
        [
            "role" => "user",
            "content" => $message
        ]
    ]
];

$ch = curl_init("https://api.openai.com/v1/responses");

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey
    ],
    CURLOPT_POSTFIELDS => json_encode($payload)
]);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($result === false) {
    curl_close($ch);

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "AI konekcija nije uspjela."
    ]);

    exit;
}

curl_close($ch);

$data = json_decode($result, true);

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "error" => "AI servis je vratio grešku."
    ]);

    exit;
}

/*
|--------------------------------------------------------------------------
| Responses API rezultat
|--------------------------------------------------------------------------
*/

$answer = "";

if (isset($data["output"])) {
    foreach ($data["output"] as $item) {
        if (($item["type"] ?? "") === "message") {
            foreach ($item["content"] ?? [] as $content) {
                if (($content["type"] ?? "") === "output_text") {
                    $answer .= $content["text"] ?? "";
                }
            }
        }
    }
}

echo json_encode([
    "success" => true,
    "answer" => trim($answer)
], JSON_UNESCAPED_UNICODE);
