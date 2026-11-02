"""Counts each post of an X thread file as X does: every ```text block is
one post; links (with or without https://) count 23, emoji and other
characters outside the basic plane count 2, e-mail addresses count as text.
Usage: python3 -I xlen.py <thread.md>
"""
import re
import sys

text = open(sys.argv[1], encoding="utf-8").read()
posts = re.findall(r"```text\n(.*?)\n```", text, flags=re.S)
url = re.compile(r"(?<![@\w.])(?:https?://)?(?:[a-z0-9-]+\.)+(?:org|com|at|de|eu|net|io)(?:/[^\s]*)?(?![\w@])", re.I)
for number, post in enumerate(posts, 1):
    links = url.findall(post)
    rest = url.sub("", post)
    length = 23 * len(links) + sum(2 if ord(c) > 0xFFFF else 1 for c in rest)
    print(number, length, "OK" if length <= 280 else "TOO LONG")
