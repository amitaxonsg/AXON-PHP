from pathlib import Path
p = Path(__file__).resolve().parents[1] / 'sitemap.xml'
s = p.read_text(encoding='utf-8')
needle = 'https://axon.com.sg/ask-axon.html'
if needle not in s:
    line = '  <url><loc>https://axon.com.sg/ask-axon.html</loc><changefreq>weekly</changefreq><priority>0.95</priority></url>\n'
    s = s.replace('  <url><loc>https://axon.com.sg/contact.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n', '  <url><loc>https://axon.com.sg/contact.html</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n' + line)
    p.write_text(s, encoding='utf-8')
    print('UPDATED sitemap.xml')
