# Task

TASK_ID: TMCPS-20260428-003
MODE: REVIEW_ONLY
TARGET_REPO: Drs926/testmcps
TARGET_BRANCH: main
LOCAL_PATH: C:\Users\Harib\CascadeProjects\test mcps
STATUS: READY_FOR_AGENT
OWNER: codex

## OBJECTIVE

Évaluer si les 3 modifications locales non commitées peuvent être conservées et proposées au commit, ou si elles doivent être ajustées/restaurées, sans modifier ni committer le code.

## CONTEXT

Les tâches précédentes ont montré que 3 fichiers restent modifiés localement :

- mcp-memory-accelerator/src/server.js
- mcp-memory-accelerator/src/tools/reindex.js
- mcp-memory-accelerator/src/tools/search.js

La clarification TMCPS-20260428-002 indique que ces changements semblent cohérents avec un travail de robustesse : logging structuré, garde-fou anti-réindexation concurrente, validation de recherche et borne `limit`.

Cette tâche sert à produire une recommandation de décision, pas à appliquer la décision.

## SCOPE

- Lire `AGENTS.md` et `.codex/TASK.md`.
- Lire les diffs des 3 fichiers ciblés.
- Vérifier les fichiers de configuration disponibles dans `mcp-memory-accelerator`.
- Identifier les commandes de test ou de vérification disponibles sans installer de dépendance.
- Lancer uniquement les commandes disponibles et non destructrices si elles existent déjà.
- Produire une recommandation factuelle : conserver / ajuster / restaurer / committer plus tard.
- Mettre à jour uniquement `.codex/STATUS.md`, `.codex/RESULT.md`, `.codex/PROOF.md` et `.codex/HANDOFF.md`.

## OUT_OF_SCOPE

- Ne pas modifier les 3 fichiers de code.
- Ne pas restaurer les 3 fichiers de code.
- Ne pas committer les 3 fichiers de code.
- Ne pas installer de dépendance.
- Ne pas créer de branche.
- Ne pas ouvrir de PR.
- Ne pas modifier le repo central `Drs926/agent-control-tower`.

## FILES_ALLOWED

- .codex/STATUS.md
- .codex/RESULT.md
- .codex/PROOF.md
- .codex/HANDOFF.md

## FILES_READ_ALLOWED

- AGENTS.md
- .codex/TASK.md
- mcp-memory-accelerator/package.json
- mcp-memory-accelerator/src/server.js
- mcp-memory-accelerator/src/tools/reindex.js
- mcp-memory-accelerator/src/tools/search.js
- tout fichier README ou configuration strictement nécessaire dans `mcp-memory-accelerator`

## FILES_FORBIDDEN

- Toute modification hors `.codex/STATUS.md`, `.codex/RESULT.md`, `.codex/PROOF.md`, `.codex/HANDOFF.md`.
- Tout fichier du repo central `Drs926/agent-control-tower`.

## COMMANDS_ALLOWED

- git status --short
- git diff --stat
- git diff -- mcp-memory-accelerator/src/server.js
- git diff -- mcp-memory-accelerator/src/tools/reindex.js
- git diff -- mcp-memory-accelerator/src/tools/search.js
- git log --oneline -5
- type AGENTS.md
- type .codex\TASK.md
- type mcp-memory-accelerator\package.json
- npm test --prefix mcp-memory-accelerator
- npm run test --prefix mcp-memory-accelerator
- npm run lint --prefix mcp-memory-accelerator

## COMMAND_RULES

- Ne lancer `npm test`, `npm run test` ou `npm run lint` que si le script existe dans `mcp-memory-accelerator/package.json`.
- Ne pas exécuter `npm install`.
- Ne pas exécuter de commande destructive.

## EXPECTED_RESULT_FILE

.codex/RESULT.md

## EXPECTED_PROOF_FILE

.codex/PROOF.md

## BLOCK_CONDITIONS

- Les 3 fichiers ne sont plus modifiés localement.
- Un test ou lint nécessite installation de dépendance.
- Une commande disponible est destructive ou ambiguë.
- La recommandation nécessiterait une modification de code immédiate.

## NEXT_ACTION

Faire `git pull`, puis lancer Codex ou Claude avec : `Lis .codex/TASK.md et exécute strictement.`
