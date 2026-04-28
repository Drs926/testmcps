# AGENTS.md

## GitHub Hybrid Control Rail

This repository is a project repository. It is not the central control repository.

## Core rule

The agent works in this local project repository only.

## Before any action

- Read `.codex/TASK.md`.
- Verify `TASK_ID`, `MODE`, `OBJECTIVE`, `SCOPE`, `OUT_OF_SCOPE`, `FILES_ALLOWED`, `FILES_FORBIDDEN`, and `BLOCK_CONDITIONS`.
- Stop if `.codex/TASK.md` is absent, empty, contradictory, or ambiguous.
- Do not execute anything if the task status is `IDLE` or `BLOCKED`.

## During execution

- Respect the declared mode.
- Modify only files explicitly allowed by the task.
- Keep the diff minimal.
- Do not modify the central control repository.
- Do not change the task objective or scope.
- Update `.codex/STATUS.md` when the execution state changes.

## After execution

- Write the structured result in `.codex/RESULT.md`.
- Write technical proof in `.codex/PROOF.md`.
- Update `.codex/HANDOFF.md`.
- Leave final PASS/BLOCK validation to external audit.

## Allowed states

- READY_FOR_AGENT
- EXECUTING
- READY_FOR_REVIEW
- BLOCKED
- DONE

## Blocking conditions

Stop immediately if:

- the task is missing or unclear;
- requested actions exceed the declared scope;
- required files are unavailable;
- the repository state prevents safe execution;
- required proof cannot be produced.
