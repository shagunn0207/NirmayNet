import requests

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
        "username": "hospital_nand",
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

print("Seeding dummy users for testing...")
for u in users:
    try:
        res = requests.post(API_URL, json=u)
        if res.status_code == 200 or res.status_code == 201:
            print(f"Created: {u['username']}")
        else:
            print(f"Failed or already exists: {u['username']} ({res.text})")
    except Exception as e:
        print(f"Error seeding {u['username']}: {e}")
