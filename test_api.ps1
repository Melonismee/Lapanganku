$uri = "http://localhost:8000/api/register"
Write-Host "Testing: $uri"

$headers = @{
    'Content-Type' = 'application/json'
}

$body = @{
    name = 'testuser1'
    email = 'test1@example.com'
    password = 'password123'
} | ConvertTo-Json

Write-Host "Body: $body"
Write-Host "Headers: $($headers | Out-String)"

try {
    Write-Host "Sending request..."
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 30

    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    Write-Host $response.Content

    $json = $response.Content | ConvertFrom-Json
    Write-Host "Parsed JSON:"
    Write-Host ($json | Out-String)
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

