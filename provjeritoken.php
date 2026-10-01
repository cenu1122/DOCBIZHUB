```php
<?php

header('Content-Type: application/json; charset=utf-8');

$token = $_POST['token'] ?? '';

if ($token === '') {
    echo json_encode([
        "success" => false,
        "message" => "Kod nije unesen"
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "token" => $token
]);
?>
```
