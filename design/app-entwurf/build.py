#!/usr/bin/env python3
"""Erzeugt dist/de/app-entwurf-screens.js aus den .dc.html-Entwürfen in diesem Ordner.
Aufruf aus dem Repo-Wurzelverzeichnis: python3 design/app-entwurf/build.py"""
import json, os, re
D = os.path.dirname(os.path.abspath(__file__)) + '/'
ORDER = [('Haushalt', 'Haushalt'), ('Budget', 'Budget'), ('Main', 'Mahlzeiten'), ('Woche', 'Woche'), ('Geschmack', 'Geschmack'),
         ('Wochenplan', 'Plan'), ('Wischen', 'Tauschen'), ('Korb', 'Einkauf')]
# Skizzen-Palette -> Webseiten-Palette
COLORS = {'#AD5137': '#0F6B3F', '#8A3F2A': '#0B3D2A', '#FCEEDD': '#EEF5F0', '#362B26': '#111827', '#75665D': '#5F6670',
          '#EADFD6': '#E5E7EB', '#FFFCF8': '#FFFFFF', '#D9CCC2': '#D1D5DB', '#F3EAE2': '#F3F4F6', '#B3A69C': '#9CA3AF',
          '#E8B386': '#F2B36B', '#F4D8BF': '#F6EBDD', '#E8DCCB': '#EFE8DC'}
BLOBS = {'/_blob/9bc8692cf3631aa3d17458f7d18d2838': '../assets/oats.webp', '/_blob/2c0ba3c590f91304b33340ac8f682c2c': '../assets/hamtoast.webp'}

def recolor(s):
    for a, b in COLORS.items():
        s = re.sub(re.escape(a), b, s, flags=re.I)
    return s

out = ['/* App-Entwurf: generiert von design/app-entwurf/build.py aus den .dc.html-Entwürfen – nicht von Hand ändern. */', '(function(){', 'var SCREENS = {};']
for name, label in ORDER:
    src = open(D + name + '.dc.html', encoding='utf-8').read()
    body = re.sub(r'<helmet>[\s\S]*?</helmet>', '', re.search(r'<x-dc>([\s\S]*?)</x-dc>', src).group(1)).strip()
    script = re.search(r'<script type="text/x-dc"[^>]*>([\s\S]*?)</script>', src).group(1).strip()
    title = re.search(r'<title>(.*?)</title>', src).group(1)
    for k, v in BLOBS.items():
        body, script = body.replace(k, v), script.replace(k, v)
    out.append('SCREENS[%s] = { label: %s, title: %s, html: %s, make: function (DCLogic) {\n%s\nreturn Component; } };' % (
        json.dumps(name), json.dumps(label), json.dumps(title), json.dumps(recolor(body), ensure_ascii=False), recolor(script)))
out.append('window.SB_APP_SCREENS = SCREENS; window.SB_APP_ORDER = %s;' % json.dumps([n for n, _ in ORDER]))
out.append('})();')
open(D + '../../dist/de/app-entwurf-screens.js', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('geschrieben:', len(ORDER), 'Screens')
