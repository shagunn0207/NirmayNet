import urllib.request
import json

API_URL = "http://127.0.0.1:8000/api/v1/auth/register"

users = [
    {
        "username": "dr_sanjay",
        "password": "123456",
        "name": "Dr. Sanjay Mehta",
        "fullName": "Dr. Sanjay Mehta",
        "role": "ADMIN",
        "facility_name": "PHC Dhadgaon"
    },
    {
        "username": "HOSPITAL_NAND_001",
        "password": "123456",
        "name": "District Civil Hospital",
        "fullName": "District Civil Hospital Nandurbar",
        "role": "HOSPITAL",
        "facility_name": "Nandurbar DH"
    },
    {
        "username": "dho_arvind",
        "password": "123456",
        "name": "Dr. Arvind Patil",
        "fullName": "Dr. Arvind Patil",
        "role": "DHO",
        "facility_name": "DHO Office"
    }
]

print("Seeding dummy users...")
for u in users:
    data = json.dumps(u).encode("utf-8")
    req = urllib.request.Request(API_URL, data=data, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            if res.status == 200 or res.status == 201:
                print(f"Created: {u['username']}")
    except urllib.error.HTTPError as e:
        print(f"Failed: {u['username']} - HTTP {e.code} - {e.read().decode()}")
    except Exception as e:
        print(f"Failed: {u['username']} - {e}")
