# api-test.ps1
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Testing FreelanceHub API" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

# Login and get token
$loginBody = @{
    email = "john@test.com"
    password = "123456"
} | ConvertTo-Json

$loginResult = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $loginBody

$token = $loginResult.token
Write-Host "`n✅ Token obtained!" -ForegroundColor Green

# Get Current User
Write-Host "`n[1] Getting Current User..." -ForegroundColor Cyan
$user = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    }

Write-Host "User: $($user.user.name)" -ForegroundColor Green
Write-Host "Email: $($user.user.email)" -ForegroundColor Green
Write-Host "Role: $($user.user.role)" -ForegroundColor Green

# Create a Job
Write-Host "`n[2] Creating a Job..." -ForegroundColor Cyan
$jobBody = @{
    title = "React Developer Needed"
    description = "We need a React developer for a 3-month project"
    category = "Web Development"
    skills = @("React", "Node.js", "MongoDB")
    budget = 5000
    duration = "1-3 months"
    experienceLevel = "Intermediate"
    projectType = "Fixed Price"
} | ConvertTo-Json

$jobResult = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $jobBody

Write-Host "✅ Job created: $($jobResult.job.title)" -ForegroundColor Green
Write-Host "Job ID: $($jobResult.job._id)" -ForegroundColor Green

# Get All Jobs
Write-Host "`n[3] Getting All Jobs..." -ForegroundColor Cyan
$jobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" `
    -Method GET `
    -Headers @{"Content-Type" = "application/json"}

Write-Host "✅ Found $($jobs.count) job(s)" -ForegroundColor Green

# Display jobs
if ($jobs.jobs) {
    foreach ($job in $jobs.jobs) {
        Write-Host "`n  Title: $($job.title)" -ForegroundColor Yellow
        Write-Host "  Client: $($job.client.name)" -ForegroundColor Yellow
        Write-Host "  Budget: $$($job.budget)" -ForegroundColor Yellow
        Write-Host "  Status: $($job.status)" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  Testing Complete!" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow