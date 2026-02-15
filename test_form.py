import requests
import json

BASE = "http://localhost:8000"

# 1. Register a test user
print("1️⃣ Registering test user...")
r = requests.post(f"{BASE}/users/register", json={
    "company_name": "TestGreen Ltd",
    "email": "testgreen@example.com",
    "password": "test123",
    "role": "company"
})
if r.status_code == 200:
    user_id = r.json()['id']
    print(f"   ✅ Registered - User ID: {user_id}")
else:
    print(f"   ❌ Error: {r.status_code} - {r.json()}")
    exit()

# 2. Login
print("\n2️⃣ Logging in...")
r = requests.post(f"{BASE}/users/login", data={
    "username": "testgreen@example.com",
    "password": "test123"
})
if r.status_code == 200:
    token = r.json()["access_token"]
    print(f"   ✅ Login successful")
else:
    print(f"   ❌ Error: {r.json()}")
    exit()

# 3. Submit green project application
print("\n3️⃣ Applying for green project...")
headers = {"Authorization": f"Bearer {token}"}
project_data = {
    "project_name": "Solar Farm Initiative",
    "project_type": "Solar",
    "description": "Large-scale solar energy project in California",
    "location": "California, USA",
    "company_reg_number": "REG-2024-12345",
    "estimated_annual_reduction": 5000,
    "project_start_date": "2026-01-01",
    "project_end_date": "2031-12-31",
    "certification_type": "Gold Standard",
    "budget": 500000,
    "expected_credits_per_year": 5000,
    "contact_person": "John Smith",
    "contact_email": "john@testgreen.com",
    "contact_phone": "+1-555-0123"
}

r = requests.post(f"{BASE}/projects/apply", json=project_data, headers=headers)
if r.status_code == 200:
    project = r.json()
    print(f"   ✅ Application submitted!")
    print(f"   Project ID: {project['id']}")
    print(f"   Status: {project['status']}")
else:
    print(f"   ❌ Error: {r.status_code}")
    print(f"   Response: {r.json()}")

# 4. Get my projects
print("\n4️⃣ Retrieving my projects...")
r = requests.get(f"{BASE}/projects/my-projects", headers=headers)
if r.status_code == 200:
    projects = r.json()
    print(f"   ✅ Retrieved {len(projects)} project(s)")
    for p in projects:
        print(f"      - {p['project_name']} ({p['status']})")
else:
    print(f"   ❌ Error: {r.json()}")

print("\n✅✅✅ Form test completed successfully!")
