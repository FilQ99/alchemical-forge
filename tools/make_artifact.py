"""Skleja public/ w jeden plik HTML do publikacji jako Artifact (bez doctype/html/head/body)."""
import re,base64,os,sys
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','public')
rd=lambda p:open(os.path.join(R,p),encoding='utf-8').read()
t=rd('index.html')
css=rd('style.css')
js=''.join(rd('js/'+f)+'\n' for f in ['data.js','art.js','engine.js','ui.js'])
def uri(m):
    p=m.group(1)
    return '"data:image/webp;base64,'+base64.b64encode(open(os.path.join(R,p),'rb').read()).decode()+'"'
js=re.sub(r"""['"](assets/[A-Za-z0-9_]+\.webp)['"]""",uri,js)
title=re.search(r'<title>.*?</title>',t).group(0)
link=re.search(r'<link href="https://fonts.googleapis.com[^>]*>',t).group(0)
body=re.search(r'<body>(.*)</body>',t,re.S).group(1)
body=re.sub(r'<script src="js/[^"]+"></script>\n?','',body)
body=body.replace('<script>document.addEventListener','<script>'+js.replace('</script>','<\\/script>')+'</script>\n<script>document.addEventListener',1)
out=title+'\n'+link+'\n<style>\n'+css+'\n</style>\n'+body
dst=sys.argv[1] if len(sys.argv)>1 else '/home/claude/kamien-cienia-artifact.html'
open(dst,'w',encoding='utf-8').write(out); print(dst,len(out)//1024,'KB')
