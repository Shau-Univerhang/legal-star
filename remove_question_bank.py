
import os
import re

directory = r'c:\Users\30208\Desktop\bird\public\appui'

def remove_question_bank_refs(content):
    # Remove top nav link
    # Pattern: <a href="P-QUESTION_BANK.html" ...>题库</a>
    content = re.sub(r'<a href="P-QUESTION_BANK\.html"[^>]*>.*?题库.*?</a>', '', content, flags=re.DOTALL)
    
    # Remove sidebar link
    # Pattern: <a href="P-QUESTION_BANK.html" ...> ... <span>题库</span> ... </a>
    # The sidebar link has an icon and span inside
    content = re.sub(r'<a href="P-QUESTION_BANK\.html"[^>]*>[\s\S]*?<span>题库</span>\s*</a>', '', content, flags=re.DOTALL)
    
    # Remove event listeners in script
    # Pattern: document.querySelector('#nav-questions-top').addEventListener...
    content = re.sub(r"document\.querySelector\('#nav-questions-top'\)\.addEventListener\('click', function\(e\) \{[\s\S]*?\}\);", '', content, flags=re.DOTALL)
    content = re.sub(r"document\.querySelector\('#nav-questions'\)\.addEventListener\('click', function\(e\) \{[\s\S]*?\}\);", '', content, flags=re.DOTALL)
    
    # Remove quick practice listener if exists
    content = re.sub(r"var quickPractice = document\.querySelector\('#quick-practice'\);[\s\S]*?\}\);", '', content, flags=re.DOTALL)
    
    return content

for filename in os.listdir(directory):
    if filename.endswith(".html") and filename != "P-QUESTION_BANK.html":
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = remove_question_bank_refs(content)
        
        if content != new_content:
            print(f"Modifying {filename}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
        else:
            print(f"No changes in {filename}")

