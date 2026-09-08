#!/bin/sh
# Vérifie le plugin sans ouvrir Obsidian. Node n'est pas installé sur ce Mac :
# on charge main.js dans JavaScriptCore (osascript) avec des bouchons.
#   sh tests/run.sh
cd "$(dirname "$0")/.." || exit 1
python3 - "$PWD" <<'PY' > /tmp/graphiques-harness.js
import io, os, sys, glob, re, json
racine = sys.argv[1]
def wrap(t):
    l = [x for x in t.rstrip().split('\n')]
    l[-1] = 'return ' + l[-1].strip()
    return '\n'.join(l)
src = io.open(os.path.join(racine, 'main.js'), encoding='utf-8').read()
# clés statiques seulement : celles construites par concaténation (tr('tool.' + id))
# se terminent par un point et sont vérifiées par famille dans i18n.js
cles = sorted(k for k in set(re.findall(r"(?<![A-Za-z0-9_])tr\('([^']+)'", src)) if not k.endswith('.'))
fichiers = sorted(glob.glob(os.path.join(racine, 'tests', '*.js')))
h = """
var module={exports:{}};
function require(){ return { Plugin: class{}, TextFileView: class{constructor(){}}, Modal: class{constructor(){}},
  FuzzySuggestModal: class{constructor(){}}, Component: class{constructor(){}}, Notice: class{}, Menu: class{},
  PluginSettingTab: class{constructor(){}}, Setting: class{constructor(){}}, setIcon: function(){},
  TFolder: class{}, TFile: class{} }; }
var window={devicePixelRatio:1,setTimeout:function(){},clearTimeout:function(){},localStorage:{getItem:function(){return 'fr';}}};
var document={body:{classList:{contains:function(){return false;}}},createElement:function(){return {};},head:{appendChild:function(){}}};
var CLES_UTILISEES = """ + json.dumps(cles) + ";\nvar SOURCE_MAIN = " + json.dumps(src) + ";\n" + src.replace('module.exports =', 'var __plugin =')
for i, f in enumerate(fichiers):
    h += "\nvar r%d=(function(){%s})();" % (i, wrap(io.open(f, encoding='utf-8').read()))
h += "\n" + "+'\\n'+".join('r%d' % i for i in range(len(fichiers)))
io.open('/dev/stdout', 'w', encoding='utf-8').write(h)
PY
osascript -l JavaScript -e 'const s=$.NSString.stringWithContentsOfFileEncodingError("/tmp/graphiques-harness.js",4,$()).js; try{ eval(s) }catch(e){ "PLANTAGE : "+e.message }'
