$uri = "http://localhost:8000/api/login"
Write-Host "Testing: $uri"

$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    email = 'test1@example.com'
    password = 'password123'
} | ConvertTo-Json

try {
    Write-Host "Sending login request..."
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 30

    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
}
catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Message

    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:"
        Write-Host $responseBody
    }
}

