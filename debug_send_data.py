import requests

payload = {
    'sequence': [
        [37.2, 115, 97, 135, 88, 0.56],
        [37.3, 118, 96, 138, 90, 0.58]
    ]
}

r = requests.post('http://localhost:5000/send-data', json=payload, timeout=5)
print('status', r.status_code)
print(r.text)
