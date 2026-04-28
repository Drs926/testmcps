# Task

TASK_ID: TMCPS-20260428-005
MODE: CODE_ACTION
TARGET_REPO: Drs926/testmcps
TARGET_BRANCH: review/mcp-memory-robustness-20260428
LOCAL_PATH: C:\Users\Harib\CascadeProjects\test mcps
STATUS: READY_FOR_AGENT
OWNER: codex

## OBJECTIVE

Corriger uniquement le logging MCP incompatible avec le transport stdio dans `mcp-memory-accelerator/src/server.js`.

## CONTEXT

L'audit de la branche `review/mcp-memory-robustness-20260428` a bloqué le merge car `server.js` écrit les logs applicatifs avec `console.log`, donc sur stdout. Pour un serveur MCP en transport stdio, stdout doit rester réservé aux messages protocole. Les logs applicatifs doivent être envoyés sur stderr.

## SCOPE

- Travailler uniquement sur la branche `review/mcp-memory-robustness-20260428`.
- Modifier uniquement `mcp-memory-accelerator/src/server.js`.
- Dans la fonction `log(level, payload)`, remplacer l'écriture stdout par stderr.
- Conserver la forme JSON existante du log.
- Committer uniquement cette correction.
- Mettre à jour les fichiers `.codex/STATUS.md`, `.codex/RESULT.md`, `.codex/PROOF.md`, `.codex/HANDOFF.md` pour tracer l'exécution.

## OUT_OF_SCOPE

- Ne pas modifier `mcp-memory-accelerator/src/tools/reindex.js`.
- Ne pas modifier `mcp-memory-accelerator/src/tools/search.js`.
- Ne pas modifier d'autre fichier de code.
- Ne pas ajouter de dépendance.
- Ne pas refactorer.
- Ne pas merger dans `main`.
- Ne pas ouvrir de PR.
- Ne pas modifier le repo central `Drs926/agent-control-tower`.

## FILES_ALLOWED

- mcp-memory-accelerator/src/server.js
- .codex/STATUS.md
- .codex/RESULT.md
- .codex/PROOF.md
- .codex/HANDOFF.md

## FILES_FORBIDDEN

- mcp-memory-accelerator/src/tools/reindex.js
- mcp-memory-accelerator/src/tools/search.js
- tout autre fichier non listé dans FILES_ALLOWED
- tout fichier du repo central `Drs926/agent-control-tower`

## COMMANDS_ALLOWED

- git status --short
- git branch --show-current
- git diff --stat
- git diff -- mcp-memory-accelerator/src/server.js
- git add mcp-memory-accelerator/src/server.js .codex/STATUS.md .codex/RESULT.md .codex/PROOF.md .codex/HANDOFF.md
- git diff --cached --name-only
- git diff --cached --stat
- git commit -m "Fix MCP stdio logging output"
- git push

## EXPECTED_CHANGE

Dans `mcp-memory-accelerator/src/server.js` :

- remplacer `console.log(...)` par `console.error(...)` dans la fonction `log(level, payload)`.

## EXPECTED_RESULT_FILE

.codex/RESULT.md

## EXPECTED_PROOF_FILE

.codex/PROOF.md

## PROOFS_REQUIRED

- branche courante confirmée : `review/mcp-memory-robustness-20260428`.
- `git diff -- mcp-memory-accelerator/src/server.js` montrant uniquement `console.log` remplacé par `console.error`.
- `git diff --cached --name-only` avant commit.
- commit SHA produit.
- push réussi.
- confirmation qu'aucun autre fichier de code n'a été modifié.

## BLOCK_CONDITIONS

- La branche courante n'est pas `review/mcp-memory-robustness-20260428`.
- La correction nécessite plus que `console.log` vers `console.error`.
- Un fichier de code autre que `server.js` est modifié.
- Le commit inclut autre chose que `server.js` et les fichiers `.codex` de trace.
- Le push échoue.

## NEXT_ACTION

Faire `git pull`, rester sur la branche `review/mcp-memory-robustness-20260428`, puis lancer Codex ou Claude avec : `Lis .codex/TASK.md et exécute strictement.`
