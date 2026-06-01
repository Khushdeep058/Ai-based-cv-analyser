import re

filepath = r'c:\Users\khush\Desktop\cv_analyzer\frontend\src\pages\ResultsPage.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace size="{XX}" with size={XX}
text = re.sub(r'size="\{(\d+)\}"', r'size={\1}', text)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
