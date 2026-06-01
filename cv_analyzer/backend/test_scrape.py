import requests
from bs4 import BeautifulSoup

r = requests.get('https://github.com/Khushdeep058')
soup = BeautifulSoup(r.text, 'html.parser')
pinned_items = soup.select('.pinned-item-list-item-content span.repo')
print("Pinned repos:", [item.text for item in pinned_items])
