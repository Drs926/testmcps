# Task

TASK_ID: TMCPS-20260428-007
MODE: DOC_ONLY
TARGET_REPO: Drs926/testmcps
TARGET_BRANCH: review/mcp-memory-robustness-20260428
LOCAL_PATH: C:\Users\Harib\CascadeProjects\test mcps
STATUS: READY_FOR_AGENT
OWNER: codex

## OBJECTIVE

Corriger uniquement l'incohérence restante dans `.codex/PROOF.md` : le commit documentaire `36d09f0b028fc6e96b1dc62aacc9af0605927425` ne doit pas lister `mcp-memory-accelerator/src/server.js` dans `GIT_DIFF_CACHED_NAME_ONLY` ni dans `GIT_DIFF_CACHED_STAT`.

## CONTEXT

L'audit de `TMCPS-20260428-006` a confirmé que le commit documentaire ne modifie que les fichiers `.codex`, mais `.codex/PROOF.md` mélange encore la preuve du commit code `ce188381920464947988d2af243a4f2b8787c8c3` avec la preuve du commit documentaire `36d09f0b028fc6e96b1dc62aacc9af0605927425`.

## SCOPE

- Travailler uniquement sur la branche `review/mcp-memory-robustness-20260428`.
- Modifier uniquement `.codex/PROOF.md`, `.codex/STATUS.md`, `.codex/RESULT.md` et `.codex/HANDOFF.md` si nécessaire.
- Dans `.codex/PROOF.md`, supprimer `mcp-memory-accelerator/src/server.js` de `GIT_DIFF_CACHED_NAME_ONLY` pour la tâche documentaire.
- Dans `.codex/PROOF.md`, supprimer `mcp-memory-accelerator/src/server.js | 2 +-` de `GIT_DIFF_CACHED_STAT` pour la tâche documentaire.
- Indiquer clairement que le commit code référencé reste `ce188381920464947988d2af243a4f2b8787c8c3`, mais que le commit documentaire ne contient que `.codex/*`.
- Committer uniquement les fichiers `.codex`.

## OUT_OF_SCOPE

- Ne pas modifier de fichier de code.
- Ne pas modifier `mcp-memory-accelerator/src/server.js`.
- Ne pas modifier `reindex.js` ni `search.js`.
- Ne pas modifier `.codex/TASK.md`.
- Ne pas merger dans `main`.
- Ne pas ouvrir de PR.
- Ne pas modifier le repo central `Drs926/agent-control-tower`.

## FILES_ALLOWED

- .codex/STATUS.md
- .codex/RESULT.md
- .codex/PROOF.md
- .codex/HANDOFF.md

## FILES_FORBIDDEN

- tout fichier de code
- AGENTS.md
- .codex/TASK.md
- tout fichier du repo central `Drs926/agent-control-tower`

## COMMANDS_ALLOWED

- git status --short
- git branch --show-current
- git log --oneline -5
- git diff -- .codex/PROOF.md
- git add .codex/STATUS.md .codex/RESULT.md .codex/PROOF.md .codex/HANDOFF.md
- git diff --cached --name-only
- git diff --cached --stat
- git commit -m "Fix proof trace staged file list"
- git push

## EXPECTED_RESULT_FILE

.codex/RESULT.md

## EXPECTED_PROOF_FILE

.codex/PROOF.md

## PROOFS_REQUIRED

- branche courante confirmée : `review/mcp-memory-robustness-20260428`.
- `git diff --cached --name-only` avant commit ne contient que des fichiers `.codex`.
- nouveau commit SHA produit.
- push réussi.
- confirmation qu'aucun fichier de code n'a été modifié.

## BLOCK_CONDITIONS

- La branche courante n'est pas `review/mcp-memory-robustness-20260428`.
- Un fichier de code est modifié ou staged.
- `.codex/TASK.md` doit être modifié pour poursuivre.
- Le push échoue.

## NEXT_ACTION

Faire `git pull`, rester sur la branche `review/mcp-memory-robustness-20260428`, puis lancer Codex ou Claude avec : `Lis .codex/TASK.md et exécute strictement.`
