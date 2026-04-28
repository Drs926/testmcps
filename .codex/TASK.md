# Task

TASK_ID: TMCPS-20260428-001
MODE: PROOF_ONLY
TARGET_REPO: Drs926/testmcps
TARGET_BRANCH: main
LOCAL_PATH: À RENSEIGNER PAR L'UTILISATEUR
STATUS: READY_FOR_AGENT
OWNER: codex

## OBJECTIVE

Auditer la structure actuelle du repo `Drs926/testmcps` sans modifier le code.

## CONTEXT

Ce repo est le pilote du GitHub Hybrid Control Rail. L’objectif est de vérifier que Codex ou Claude peut lire une tâche depuis `.codex/TASK.md`, produire un résultat structuré et fournir des preuves exploitables sans long prompt manuel.

## SCOPE

- Lire la structure du repo.
- Lire `AGENTS.md`.
- Lire les fichiers `.codex/*`.
- Identifier les fichiers principaux présents dans le repo.
- Produire un résultat structuré dans `.codex/RESULT.md`.
- Produire les preuves dans `.codex/PROOF.md`.
- Mettre à jour `.codex/HANDOFF.md`.

## OUT_OF_SCOPE

- Aucune modification de code.
- Aucun refactor.
- Aucune installation de dépendance.
- Aucune modification hors `.codex/RESULT.md`, `.codex/PROOF.md`, `.codex/HANDOFF.md` et `.codex/STATUS.md`.
- Aucune modification du repo central `Drs926/agent-control-tower`.

## FILES_ALLOWED

- .codex/STATUS.md
- .codex/RESULT.md
- .codex/PROOF.md
- .codex/HANDOFF.md

## FILES_FORBIDDEN

- Tous les fichiers hors `.codex/STATUS.md`, `.codex/RESULT.md`, `.codex/PROOF.md`, `.codex/HANDOFF.md`.
- Tout fichier du repo central `Drs926/agent-control-tower`.

## COMMANDS_ALLOWED

- git status --short
- git diff --stat
- git ls-files
- dir /s /b .codex
- type AGENTS.md
- type .codex\TASK.md
- type .codex\STATUS.md

## EXPECTED_RESULT_FILE

.codex/RESULT.md

## EXPECTED_PROOF_FILE

.codex/PROOF.md

## BLOCK_CONDITIONS

- `.codex/TASK.md` absent.
- `AGENTS.md` absent.
- Périmètre ambigu.
- Repo local non accessible.
- Besoin de modifier un fichier hors scope.

## NEXT_ACTION

Faire un `git pull` dans le dossier local `testmcps`, puis lancer Codex ou Claude avec : `Lis .codex/TASK.md et exécute strictement.`
