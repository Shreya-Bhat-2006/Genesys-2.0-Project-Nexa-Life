import requests
import json

BASE = "http://localhost:8000"

# 1. Register company user
print("1. Registering company user...")
r = requests.post(f"{BASE}/users/register", json={
    "company_name": "EcoFresh Inc",
    "email": "company@ecofresh.com",
    "password": "company123",
    "role": "company"
})
print(f"   Status: {r.status_code}")
if r.status_code != 200:
    print(f"   Error: {r.text}")
else:
    print(f"   ✓ Registered user ID: {r.json()['id']}")

# 2. Login as company user
print("\n2. Logging in as company user...")
r = requests.post(f"{BASE}/users/login", data={
    "username": "company@ecofresh.com",
    "password": "company123"
})
print(f"   Status: {r.status_code}")
token = r.json()["access_token"]
print(f"   ✓ Got token: {token[:30]}...")

# 3. Apply as green project
print("\n3. Applying as green project...")
headers = {"Authorization": f"Bearer {token}"}
r = requests.post(f"{BASE}/projects/apply", 
    json={
        "project_name": "Solar Farm Initiative",
        "description": "Large-scale solar energy project"
    },
    headers=headers
)
print(f"   Status: {r.status_code}")
if r.status_code != 200:
    print(f"   Response: {r.json()}")
else:
    print(f"   ✓ Project applied successfully")

# 4. Get my projects
print("\n4. Fetching my projects...")
r = requests.get(f"{BASE}/projects/my-projects", headers=headers)
print(f"   Status: {r.status_code}")
print(f"   Projects count: {len(r.json())}")

print("\n✅ Workflow test completed!")
