import requests

r = requests.get('http://127.0.0.1:8000/api/auth/register/', timeout=5)
print(r.status_code)
print(r.text[:500])
