#!/usr/bin/env python3
"""
Sync note.com RSS feed to data/note-articles.json
"""
import urllib.request
import xml.etree.ElementTree as ET
import json, re, os, datetime

def sync():
    rss_url = "https://note.com/shiganaibio/rss"
    req = urllib.request.Request(rss_url, headers={"User-Agent": "Mozilla/5.0"})
    content = urllib.request.urlopen(req).read()
    root = ET.fromstring(content)

    articles = []
    for item in root.findall(".//item"):
        title = item.find("title").text if item.find("title") is not None else ""
        link = item.find("link").text if item.find("link") is not None else ""
        pub_date_raw = item.find("pubDate").text if item.find("pubDate") is not None else ""
        desc_raw = item.find("description").text if item.find("description") is not None else ""
        
        desc_clean = re.sub(r"<[^>]+>", " ", desc_raw).strip()
        desc_clean = re.sub(r"続きをみる.*", "", desc_clean).strip()
        desc_clean = re.sub(r"\s+", " ", desc_clean)
        if len(desc_clean) > 120:
            desc_clean = desc_clean[:120] + "…"
            
        formatted_date = pub_date_raw
        try:
            dt = datetime.datetime.strptime(pub_date_raw[:25].strip(), "%a, %d %b %Y %H:%M:%S")
            formatted_date = dt.strftime("%Y.%m.%d")
        except Exception:
            pass
            
        articles.append({
            "title": title,
            "link": link,
            "pubDate": formatted_date,
            "excerpt": desc_clean
        })

    os.makedirs("data", exist_ok=True)
    out_path = "data/note-articles.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    print(f"Synced {len(articles)} articles to {out_path}")

if __name__ == "__main__":
    sync()
