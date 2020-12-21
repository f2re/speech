path1 = "forecasts.txt.bak"
path2 = "forecasts.txt.utf"

c_to = "utf-8"
c_from = "cp1251"

f= open(path1, 'r', encoding=c_from)
content= f.read()
f.close()
f= open(path2, 'w', encoding=c_to)
f.write(content)
f.close()

print("done")