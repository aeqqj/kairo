# Working on kairo issues with an agent

Pick one sub-issue from the [GitHub issue list](https://github.com/aeqqj/kairo/issues) and assign it to yourself. Each parent tracks a feature. Its sub-issues give people separate changes to build and review. Use the acceptance checks in your issue and the [shared FCFS and SRTF fixtures](https://github.com/aeqqj/kairo/issues/49) to verify your work.

## Pick the work

- Give the agent the issue URL, the [project spec](project-spec.md), and the [architecture guide](architecture.md). Ask it to read any local `AGENTS.md` as well. Use the GitHub number for branch names and PR links. For example, **01 Workload editor and controls** is [#53](https://github.com/aeqqj/kairo/issues/53).
- Use the issue's starting fixture or stub so you can build while other tickets are in progress. If a change affects an interface another teammate uses, include the proposed change in the draft pull request.
- File independent follow-up work under its feature parent. Say what to build, what data to start with, and what a reviewer can check.

## Naming conventions

Name issue branches `issue-<github-number>-<short-slug>`. Use lowercase words separated by hyphens. For example, `issue-53-workload-editor` or `issue-57-trace-playback`.

Write commit subjects as `<type>: <short action>`. Add a scope when it helps identify the area, as in `fix(scheduler): keep the running process on SRTF ties`. Start the action with a verb such as `add`, `fix`, or `document`.

| Type | Use | Example |
| --- | --- | --- |
| `feat` | Add behavior | `feat: add the workload process count control` |
| `fix` | Correct behavior | `fix(scheduler): keep the running process on SRTF ties` |
| `docs` | Change documentation | `docs: explain how to claim an issue` |
| `refactor` | Restructure code while preserving behavior | `refactor: extract timeline formatting` |
| `test` | Add or update tests | `test: cover idle gaps before the first arrival` |
| `chore` | Maintain tooling or dependencies | `chore: update the lockfile` |

## Branch and verify

Check the working tree, fetch `main`, and create an issue branch. These commands use #53 as an example. If the working tree contains unrelated edits, use a separate worktree for the issue so those edits stay intact.

```sh
git status --short --branch
git fetch origin
git switch -c issue-53-workload-editor origin/main
```

Keep edits scoped to the issue. After code changes, run `npm run build`. Exercise the affected UI flow or compare the scheduler output with the issue's expected timeline. Record the checks you actually ran and any remaining failures.

## Commit and push

Review the diff and stage the paths for this issue. Replace `path/to/changed-file` with the files you changed. Use a commit subject that describes what those files change.

```sh
git diff --check
git add -- path/to/changed-file
git diff --cached
git commit -m "feat: add the workload process count control"
git push -u origin HEAD
```

Push the issue branch and open a draft PR against `main` for review. Describe the behavior you changed, how you checked it, and any work left in the issue. Once the PR satisfies the issue's checks, put `Closes #53` in its description. GitHub closes the linked issue when the PR merges into the default branch. [GitHub’s PR linking guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)

## Prompt to give your agent

Replace the issue link and branch name. For a local coding task, end the prompt after verification.

```text
Implement https://github.com/aeqqj/kairo/issues/53.
Read docs/workflow.md, docs/architecture.md, docs/project-spec.md,
and any local AGENTS.md. Read the issue's scope and acceptance checks.
Start from origin/main on issue-53-workload-editor. Use a separate
worktree if there are unrelated local changes. Build against the issue's
fixture or stub and keep edits within its scope.
Run npm run build and verify the affected behavior.
Review and stage the files for this issue. Follow the commit naming
convention in the guide, then commit and push the branch to origin.
Open a draft pull request against main. Include the issue link and the
checks you ran. Use Closes #53 when the PR completes the issue. Report
the branch, commit, PR link, and any blocker.
```

If a push or GitHub action fails on permissions, report the failed operation, branch or issue, and exact error. Git pushes use the credentials for the Git remote. GitHub MCP issue and PR actions use the permissions of the connected GitHub account or token.
