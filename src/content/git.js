export const gitSection = {
  id: 'git',
  label: 'Git',
  icon: '🔧',
  groups: [
    {
      id: 'git-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-git',
          title: 'What Is Git, and Why Does Version Control Matter?',
          summary:
            'Git is a distributed version control system: every clone is a complete, independent copy of the full project history, not just a pointer back to one central server.',
          keyPoints: [
            'Version control tracks every change to a codebase over time, who made it, and why — enabling collaboration, rollback, and auditability.',
            "Distributed (Git) vs centralized (older systems like SVN/CVS): every developer's clone has the entire history, so most operations (commit, log, diff, branch) happen instantly, offline, with no server round-trip.",
            'A "repository" (repo) is a project directory plus its hidden `.git` folder, which holds the entire history as a database of objects.',
            'Git was created by Linus Torvalds in 2005 to manage the Linux kernel — a project with thousands of contributors and no single point of failure.',
            'Git is still actively evolving: the 2.x series ships a release roughly every few months, and a Git 3.0 is planned that changes several defaults for new repositories (`main` as the default branch, SHA-256 object hashes, the reftable ref backend). Keep your Git reasonably current — many modern conveniences covered here only exist in recent versions.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Version control solves a problem every codebase eventually has: multiple people (or just multiple past versions of yourself) changing the same files over time, needing to know what changed, when, why, and by whom — and needing a safe way to combine everyone\'s work without overwriting each other.',
            },
            {
              type: 'p',
              text: 'Git\'s design goals explain most of its behaviour: **speed** (everything local), **integrity** (every object is named by a cryptographic hash of its content, so silent corruption or tampering is detectable), and **non-linear development** (branching and merging are cheap enough to do dozens of times a day). When a Git command feels strange, ask which of those three goals it is serving.',
            },
            {
              type: 'heading',
              text: 'Centralized vs distributed version control',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  subgraph Centralized["Centralized (e.g. SVN)"]\n    Server1[(Central Server<br/>full history)]\n    DevA1[Dev A<br/>working copy only] --> Server1\n    DevB1[Dev B<br/>working copy only] --> Server1\n  end\n  subgraph Distributed["Distributed (Git)"]\n    Server2[(Remote<br/>e.g. GitHub)]\n    DevA2[Dev A<br/>FULL history] <--> Server2\n    DevB2[Dev B<br/>FULL history] <--> Server2\n  end',
            },
            {
              type: 'list',
              items: [
                '**Centralized systems** store the full history only on a central server; a developer\'s machine has just the current checked-out files, so most operations (history, diffs, branching) require network access to the server.',
                '**Git**, being distributed, gives every clone the complete history — you can commit, branch, view history, and diff entirely offline; only pushing/pulling to share with others needs a network.',
                'This is also what makes Git resilient: any clone can restore the entire project (and its history) if the central remote (e.g., GitHub) is ever lost.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'GitHub/GitLab/Bitbucket are not Git itself — they are hosting services built around Git, adding a web UI, pull requests, issue tracking, and access control on top of the plain Git protocol.',
            },
            {
              type: 'heading',
              text: 'What Git is not good at',
            },
            {
              type: 'list',
              items: [
                '**Large binary files** (videos, design assets, ML model weights): every version is stored in full history forever and binaries delta-compress poorly. Use Git LFS or an artifact store instead.',
                '**Fine-grained access control**: a clone contains the whole history, so you cannot give someone "read access to only this folder" inside one repository. Split repositories if that boundary matters.',
                '**Secrets**: anything ever committed is in history for every clone. Treat a committed secret as leaked (see the Interview Q&A).',
              ],
            },
            {
              type: 'table',
              headers: ['Concern', 'Git (the tool)', 'Hosting platform (GitHub, GitLab, Bitbucket...)'],
              rows: [
                ['History, branches, merges', 'Yes — all local', 'Mirrors what you push'],
                ['Pull/merge requests and code review', 'No', 'Yes'],
                ['Branch protection, required checks, merge queues', 'No (only local hooks)', 'Yes'],
                ['CI/CD pipelines', 'No', 'Yes (Actions, GitLab CI, Pipelines)'],
                ['Signature verification badges', 'Verifies locally (`git log --show-signature`)', 'Displays "Verified" in the UI'],
              ],
            },
          ],
        },
        {
          id: 'core-workflow',
          title: 'The Core Workflow: init, add, commit, status, log, diff',
          summary:
            'Nearly all day-to-day Git usage is a small set of commands moving changes through three stages — working directory, staging area, and repository history.',
          keyPoints: [
            '`git init` creates a new repository; `git clone <url>` copies an existing one, including its full history.',
            '`git status` shows what has changed and what is staged; `git diff` shows the actual line-by-line changes.',
            '`git add <file>` stages a change; `git commit -m "message"` permanently records the staged snapshot in history.',
            '`git log` shows the commit history; `git log --oneline --graph` is the compact, visual version most developers actually use day to day.',
            '`git add -p` stages individual hunks interactively — the single best habit for producing focused, reviewable commits from a messy working directory.',
            '`git restore <file>` discards working-directory edits; `git restore --staged <file>` unstages without losing the edit. These replaced the overloaded `git checkout -- <file>` / `git reset HEAD <file>` idioms.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a first Git session',
              code: `git init -b main my-project      # start a brand-new repo, explicitly on "main"
cd my-project

echo "hello" > README.md
git status                        # README.md shows as "untracked"

git add README.md                 # stage it
git status                        # now shows as "staged" / "to be committed"

git commit -m "Add README"        # permanently record it in history
git log --oneline                 # a1b2c3d Add README

echo "hello world" > README.md
git diff                          # shows the exact line changed, unstaged
git add -A                        # stage ALL changes (new/modified/deleted)
git commit -m "Update README"`,
            },
            {
              type: 'heading',
              text: 'Where a change lives at each step',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  WD["Working Directory<br/>files you edit"] -- "git add" --> Stage["Staging Area / Index<br/>next commit, in progress"]\n  Stage -- "git commit" --> Repo["Repository History<br/>HEAD"]\n  Stage -- "git restore file" --> WD\n  Repo -- "git restore --staged file" --> Stage\n  Repo -- "git restore --source=HEAD --staged --worktree file" --> WD',
            },
            {
              type: 'heading',
              text: 'Why the staging area exists',
            },
            {
              type: 'p',
              text: 'Newcomers often see the index as an annoying extra step. It is actually what lets you **decouple "what I changed" from "what I commit"**. A real working session produces a bug fix, a refactor and a debug `console.log` all tangled together; the index lets you carve that into separate, atomic commits that are each easy to review, revert, cherry-pick or bisect. Commit granularity is a gift to your future self.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'staging precisely and inspecting what you are about to commit',
              code: `git add -p src/cart.js          # walk hunks: y = stage, n = skip, s = split, e = edit
git diff                        # working dir vs index  (what is NOT yet staged)
git diff --staged               # index vs HEAD         (exactly what will be committed)
git restore --staged src/cart.js   # unstage, keep the edit on disk
git restore src/debug.js           # throw away unstaged edits to this file

git commit                      # opens your editor: write a subject + body
git commit -v                   # same, but shows the staged diff in the editor for reference
git log --oneline --graph --decorate --all   # visual history of every branch`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A good commit message explains **why**, not just what — the diff already shows what changed. Use a short imperative subject (about 50 chars, e.g. "Fix off-by-one in pagination") and a body that explains the reason, trade-offs and any ticket reference. "Fix bug" is useless six months later when you are running `git blame`.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`git add -A` / `git add .` stage **everything**, including stray files like `.env`, credentials, or large build outputs if your `.gitignore` is incomplete. Run `git status` (or `git diff --staged --stat`) before every commit until it is a reflex.',
            },
          ],
        },
        {
          id: 'configuring-git',
          title: 'Configuring Git: Identity, Defaults & Modern Settings',
          summary:
            'Git ships with conservative, backward-compatible defaults. A dozen lines of config turn on the modern behaviour experienced engineers rely on — and setting them once saves a lot of daily friction.',
          keyPoints: [
            'Config has three main scopes: `--system` (machine), `--global` (your user, `~/.gitconfig`), `--local` (one repo, `.git/config`). More specific scopes win.',
            '`git config --list --show-origin` (or `--show-scope`) tells you exactly which file a surprising setting came from.',
            'Set `init.defaultBranch main` so new repos match what hosting platforms create — Git 3.0 plans to make `main` the built-in default anyway.',
            'Settings such as `pull.rebase`, `push.autoSetupRemote`, `fetch.prune`, `rerere.enabled` and `merge.conflictStyle zdiff3` remove most everyday annoyances.',
            '`includeIf` lets you use a different identity (e.g. work vs personal email and signing key) automatically based on the repository path.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a sensible modern ~/.gitconfig, set via the CLI',
              code: `git config --global user.name  "Ada Lovelace"
git config --global user.email "ada@example.com"
git config --global init.defaultBranch main

# Pulling / pushing
git config --global pull.rebase true          # replay local commits instead of creating merge bubbles
git config --global rebase.autoStash true     # stash/unstash dirty work around a rebase automatically
git config --global push.autoSetupRemote true # first "git push" on a new branch sets its upstream
git config --global fetch.prune true          # drop remote-tracking branches deleted on the server

# Merging / diffing
git config --global merge.conflictStyle zdiff3  # conflict markers also show the common ancestor
git config --global rerere.enabled true         # remember how you resolved a conflict, reuse it
git config --global diff.algorithm histogram    # usually more readable diffs than the default
git config --global rebase.autoSquash true      # honour fixup!/squash! commits in rebase -i
git config --global rebase.updateRefs true      # move stacked branches along during a rebase

# Quality of life
git config --global branch.sort -committerdate  # most recently used branches first
git config --global column.ui auto
git config --global help.autocorrect prompt`,
            },
            {
              type: 'code',
              language: 'text',
              title: '~/.gitconfig — per-directory identity with includeIf',
              code: `[user]
    name = Ada Lovelace
    email = ada@personal.example

[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work     # overrides user.email, signing key, etc. for work repos

# ~/.gitconfig-work
[user]
    email = ada.lovelace@company.example`,
            },
            {
              type: 'table',
              headers: ['Setting', 'Default behaviour', 'Why change it'],
              rows: [
                ['`pull.rebase true`', 'Recent Git refuses to pull divergent branches until you choose a strategy', 'Linear local history; no accidental "Merge branch main of ..." commits'],
                ['`push.autoSetupRemote true`', '`git push` on a new branch errors: "has no upstream branch"', 'Removes the `push -u origin <branch>` ceremony'],
                ['`fetch.prune true`', 'Stale `origin/*` branches accumulate forever', 'Keeps `git branch -r` truthful'],
                ['`merge.conflictStyle zdiff3`', 'Markers show only "ours" and "theirs"', 'Seeing the base makes most conflicts obvious'],
                ['`rerere.enabled true`', 'You re-resolve the same conflict on every rebase', 'Git replays your recorded resolution'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Line endings cause endless noisy diffs on mixed Windows/macOS/Linux teams. Rather than relying on each developer\'s `core.autocrlf`, commit a `.gitattributes` file (e.g. `* text=auto eol=lf`, plus `*.png binary`) so the rule travels with the repository.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Some settings, like `rebase.updateRefs` and `zdiff3`, only exist in reasonably recent Git versions. If a setting seems to do nothing, check `git --version` — distribution packages (and some CI images) can lag years behind the current release.',
            },
          ],
        },
        {
          id: 'branching-basics',
          title: 'Branching Basics',
          summary:
            'A branch is just a movable, lightweight pointer to a commit — creating one is instant and cheap, which is what makes Git branching workflows practical for everyday work.',
          keyPoints: [
            '`git branch <name>` creates a branch; `git switch <name>` (or the older `git checkout <name>`) moves HEAD to it.',
            '`git switch -c <name>` creates and switches in one step — the most common way to start new work.',
            'HEAD is a pointer to "the branch you are currently on"; committing on a branch moves that branch\'s pointer forward automatically.',
            'Deleting a branch (`git branch -d <name>`) only deletes the pointer — the commits stay in history if any other branch/tag still reaches them.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Internally, a branch is just a named ref holding one commit hash — nothing is copied when you create one. (With the classic "files" backend that is literally a tiny file under `.git/refs/heads/` or a line in `.git/packed-refs`; the newer reftable backend stores refs in a compact binary table instead, but the idea is identical.) This is why Git branching is instant, unlike some older systems where branching meant duplicating the entire codebase on disk.',
            },
            {
              type: 'p',
              text: 'Each local branch can have an **upstream** (tracking) branch, such as `origin/feature/login`. The upstream is what `git status` compares against ("ahead 2, behind 1"), and what a bare `git pull` / `git push` use. `origin/main` itself is a *remote-tracking branch*: a read-only local snapshot of where `main` was on the server at your last fetch — not a live view.',
            },
            {
              type: 'mermaid',
              code: 'gitGraph\n  commit id: "C1"\n  commit id: "C2"\n  branch feature/login\n  checkout feature/login\n  commit id: "C3"\n  commit id: "C4"\n  checkout main\n  commit id: "C5"',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'everyday branch commands',
              code: `git branch                     # list local branches, * marks the current one
git switch -c feature/login    # create + switch to a new branch
# ... make commits ...
git switch main                # go back to main
git branch -d feature/login    # delete it once merged (safe: refuses if unmerged)
git branch -D feature/login    # force-delete even if unmerged

git branch -vv                 # show each branch's upstream and ahead/behind counts
git branch -m old-name new-name   # rename a branch
git switch -                   # jump back to the previous branch (like "cd -")
git switch --detach v2.3.0     # look at a tag/commit without creating a branch
git branch --merged main       # branches whose work is fully in main (safe to delete)
git push origin --delete feature/login   # delete the branch on the remote`,
            },
            {
              type: 'table',
              headers: ['Task', 'Modern command', 'Older equivalent'],
              rows: [
                ['Switch branch', '`git switch <branch>`', '`git checkout <branch>`'],
                ['Create and switch', '`git switch -c <branch>`', '`git checkout -b <branch>`'],
                ['Detach at a commit', '`git switch --detach <commit>`', '`git checkout <commit>`'],
                ['Discard file edits', '`git restore <file>`', '`git checkout -- <file>`'],
                ['Unstage a file', '`git restore --staged <file>`', '`git reset HEAD <file>`'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: '`git checkout` is not deprecated and will keep working, but it does two unrelated jobs (moving HEAD *and* overwriting files), which is why a typo like `git checkout main.js` vs `git checkout main` can silently discard edits. `switch` and `restore` split those jobs and are the recommended commands for new habits and documentation.',
            },
          ],
        },
        {
          id: 'how-git-models-history',
          title: 'How Git Actually Models History',
          summary:
            'Git is a content-addressable graph of snapshots, not a list of diffs — understanding that one fact explains almost every command that otherwise seems arbitrary.',
          keyPoints: [
            'A commit is a full snapshot of the tree plus a pointer to its parent(s) — Git computes diffs on demand for display. (Packfiles do delta-compress objects on disk, but that is a storage optimisation invisible to the data model.)',
            'Every object (blob, tree, commit, tag) is identified by the hash of its content — SHA-1 in almost all repositories today, SHA-256 in repositories created with `--object-format=sha256`. Identical content is stored once.',
            'A branch is just a movable pointer to a commit (one hash); HEAD is a pointer to "the branch you are currently on" (or directly to a commit in detached HEAD state).',
            'History is a DAG (directed acyclic graph): commits point to parents, never to children. "Reachable from a ref" is what keeps a commit alive; unreachable commits are eventually garbage-collected.',
            'The three trees: the working directory (files on disk), the index/staging area (what will go into the next commit), and HEAD (the last commit).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Most Git confusion comes from thinking of it like older centralized version control (a linear history of patches). Git instead stores each commit as a **complete snapshot** of the project tree, with a pointer back to its parent commit(s). Two commits with identical file contents in a directory point at the exact same tree object — Git deduplicates automatically because everything is addressed by the hash of its content.',
            },
            {
              type: 'mermaid',
              code: 'flowchart RL\n  C3["commit C3 (HEAD -> main)"] --> C2["commit C2"]\n  C2 --> C1["commit C1"]\n  C3 -.-> T3[tree]\n  T3 -.-> B1[blob: index.js]\n  T3 -.-> B2[blob: App.jsx]',
            },
            {
              type: 'heading',
              text: 'The three trees',
            },
            {
              type: 'list',
              items: [
                '**Working directory** — the actual files you edit on disk.',
                '**Index (staging area)** — a snapshot-in-progress; `git add` copies working-directory changes here.',
                '**HEAD** — the tip of the current branch, i.e. the last commit. `git commit` takes whatever is in the index and creates a new commit pointing at the current HEAD as its parent.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Almost every Git command is really just "copy content between these three trees, in this direction". `git add` is working-dir → index. `git commit` is index → HEAD. `git restore <file>` (like the classic `git checkout -- <file>`) is index → working-dir; add `--source=HEAD` to copy from the last commit instead. `git reset <commit>` moves the branch pointer to any commit (backward or forward) and, depending on `--soft`/`--mixed`/`--hard`, also overwrites the index and working dir.',
            },
            {
              type: 'heading',
              text: 'Naming commits: revision syntax',
            },
            {
              type: 'table',
              headers: ['Syntax', 'Meaning', 'Example'],
              rows: [
                ['`HEAD~3`', 'Third ancestor following first parents', '`git show HEAD~3`'],
                ['`HEAD^2`', 'Second parent of a merge commit (the merged-in branch)', '`git log HEAD^2`'],
                ['`main..feature`', 'Commits reachable from feature but not from main', '`git log main..feature`'],
                ['`main...feature`', 'Symmetric difference: on either side, not both', '`git log --left-right main...feature`'],
                ['`@{u}`', 'The upstream of the current branch', '`git log @{u}..` (unpushed commits)'],
                ['`main@{2.days.ago}`', 'Where main pointed 2 days ago, per your reflog', '`git diff main@{2.days.ago} main`'],
                ['`:/fix login`', 'Youngest commit whose message matches', '`git show :/fix login`'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Because each commit hash covers its tree **and** its parent hash, a commit ID effectively fingerprints the entire history behind it. Change one byte anywhere in the past and every descendant hash changes — this is the "Merkle DAG" property that makes rewritten history detectable and is why rebasing produces new commit IDs.',
            },
          ],
        },
        {
          id: 'ignoring-stashing-tagging',
          title: '.gitignore, Stashing & Tags',
          summary:
            'Three small but constantly-used tools: keeping noise out of the repo, temporarily shelving unfinished work, and marking a specific commit as meaningful (like a release).',
          keyPoints: [
            '`.gitignore` lists patterns Git should never track (build output, dependencies, local secrets/env files).',
            '`git stash` shelves uncommitted changes to tracked files so you can switch context and restore them later with `git stash pop`. Add `-u` to include untracked files — by default they are left behind.',
            'A tag is a named pointer to one specific commit — unlike a branch, it never moves forward.',
            'Annotated tags (`git tag -a`) store metadata (tagger, date, message) and can be signed (`git tag -s`, with GPG or SSH keys); lightweight tags are just a name.',
            'Ignore rules come from three places: the committed `.gitignore` (shared), `.git/info/exclude` (this clone only), and a global excludes file (your editor/OS junk, e.g. `.DS_Store`).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: '.gitignore and stashing',
              code: `# .gitignore
node_modules/
dist/
*.log
.env*
# negation: still track the template (comments must be on their own line)
!.env.example
# leading slash: anchored to the repo root only
/config/local.json

# Debugging ignore rules
git check-ignore -v dist/app.js   # prints which file + line ignores this path

# Stashing mid-task
git stash push -u -m "WIP login form"   # shelve tracked + untracked changes, with a label
git switch main
git switch -c hotfix/urgent-bug
# ... fix and commit the urgent bug ...
git switch feature/login
git stash list                # stash@{0}: On feature/login: WIP login form
git stash pop                 # re-apply AND drop; on conflict the stash is kept
git stash apply stash@{1}     # re-apply but keep it in the list
git stash push -p             # stash only selected hunks
git stash branch fix-later stash@{0}   # turn a stash into a branch at its original base`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'tagging a release',
              code: `git tag v1.0.0                       # lightweight tag on the current commit
git tag -a v1.0.0 -m "First release" # annotated tag, with metadata
git tag -s v1.0.0 -m "First release" # signed annotated tag (GPG or SSH, per gpg.format)
git push origin v1.0.0               # tags aren't pushed by default — must push explicitly
git push --follow-tags               # push commits plus the annotated tags that point at them
git push origin --tags               # push ALL local tags (including stray lightweight ones)
git describe --tags                  # e.g. v1.0.0-14-g3f2a9c1: 14 commits after v1.0.0`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never move or re-create a tag that has already been published. Other clones will **not** pick up the change on a normal fetch (Git deliberately refuses to silently overwrite existing tags), so different machines end up building different code for "v1.0.0". Cut a new version (v1.0.1) instead.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Stashes are easy to forget and are local only — they are never pushed. For anything you will not come back to within the hour, prefer a real WIP commit on a branch (you can squash it later) or a separate worktree.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A file already tracked by Git before it was added to `.gitignore` keeps being tracked — the ignore rule only stops **untracked** files from being picked up. Untrack it explicitly with `git rm --cached <file>` (keeps the file on disk, just stops tracking it).',
            },
          ],
        },
        {
          id: 'worktrees',
          title: 'Worktrees: Several Branches Checked Out at Once',
          summary:
            '`git worktree` gives one repository multiple working directories, each on its own branch — the modern alternative to stash-juggling or keeping several full clones.',
          keyPoints: [
            'Each worktree has its own working directory, index and HEAD, but they all share one object database and one set of refs — no duplicate history on disk, and a commit made in one is instantly visible in the others.',
            'A branch can be checked out in only one worktree at a time; Git refuses a second checkout to stop two directories fighting over the same branch tip.',
            'Ideal for reviewing a PR or hot-fixing production while a long build, test run or half-finished refactor stays untouched in your main directory.',
            'Also the standard way to run several AI coding agents or parallel experiments against the same repo without them overwriting each other\'s files.',
            'Remove worktrees with `git worktree remove`, not `rm -rf` — otherwise stale metadata keeps the branch "checked out" until you `git worktree prune`.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'hotfix without disturbing your current work',
              code: `# You are mid-refactor on feature/search with a dirty tree. Production is on fire.
git worktree add ../app-hotfix -b hotfix/payment-timeout origin/main
cd ../app-hotfix
# ... fix, test, commit, push, open PR ...
cd ../app
git worktree list          # /work/app  [feature/search]   /work/app-hotfix  [hotfix/payment-timeout]
git worktree remove ../app-hotfix

# Review a colleague's PR branch side by side
git worktree add ../app-review origin/feature/new-checkout --detach`,
            },
            {
              type: 'table',
              headers: ['Approach', 'Disk cost', 'Context switch', 'Main risk'],
              rows: [
                ['`git stash` + switch', 'None', 'Rebuild / reinstall after switching', 'Forgotten or conflicting stashes'],
                ['Second full clone', 'Full history again', 'None', 'Clones drift; fetch in each separately'],
                ['`git worktree`', 'Only checked-out files', 'None', 'Per-directory build caches (e.g. `node_modules`) still need installing'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Untracked, ignored files (`node_modules`, `.env`, build caches) are **not** shared between worktrees — each directory is a fresh checkout. Budget for a dependency install in a new worktree, and make sure local secrets are copied deliberately rather than assumed present.',
            },
          ],
        },
        {
          id: 'merging-rebasing',
          title: 'Merging vs Rebasing',
          summary:
            'Both combine work from two branches, but merge preserves history exactly as it happened while rebase rewrites it into a straight line — the distinction that trips up almost everyone at some point.',
          keyPoints: [
            'A merge creates a new commit with two parents, preserving both histories exactly as they happened.',
            'A rebase replays your commits on top of a new base, producing new commits (new hashes) and a linear history.',
            'Never rebase commits that have already been pushed and that someone else might have based work on — it rewrites history and breaks their clone.',
            '`git merge --no-ff` always creates a merge commit even when a fast-forward would be possible, preserving the fact that a feature branch existed.',
            'Since Git 2.34 the default merge backend is `ort`, a rewrite of the older `recursive` strategy that is much faster and handles renames more reliably — you rarely need to pick a strategy by hand.',
            '`git rebase --update-refs` (or `rebase.updateRefs`) moves every branch that pointed into the rebased range, which makes "stacked" branches (PR 2 built on PR 1) practical.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A **merge** takes two branch tips and creates a new commit with two parents, combining their histories without altering either branch\'s existing commits. A **rebase** instead takes your branch\'s commits and replays them one-by-one on top of a different base commit, producing brand-new commits with different hashes — the history looks linear afterward, as if you had branched off the new base to begin with.',
            },
            {
              type: 'mermaid',
              code: 'gitGraph\n  commit id: "C1"\n  branch feature\n  checkout feature\n  commit id: "C2"\n  commit id: "C3"\n  checkout main\n  commit id: "C4"\n  merge feature id: "Merge"',
            },
            {
              type: 'p',
              text: 'Above: a **merge** — C2 and C3 keep their original hashes and a merge commit with two parents joins the lines. Below: the same work after `git rebase main` on `feature` — C2 and C3 have been re-created as C2\' and C3\' on top of C4 (new hashes, same changes), so main can now simply fast-forward.',
            },
            {
              type: 'mermaid',
              code: 'gitGraph\n  commit id: "C1"\n  commit id: "C4"\n  branch feature\n  checkout feature\n  commit id: "C2-prime"\n  commit id: "C3-prime"',
            },
            {
              type: 'heading',
              text: 'Fast-forward vs three-way merge',
            },
            {
              type: 'p',
              text: 'If the current branch has no commits that the other branch lacks, Git can just slide the pointer forward — a **fast-forward**, with no new commit. Otherwise it performs a **three-way merge**: it finds the merge base (the best common ancestor, see `git merge-base`), diffs base→ours and base→theirs, and combines the two change sets. A conflict happens only when both sides changed the same region differently relative to the base.',
            },
            {
              type: 'table',
              headers: ['', 'Merge', 'Rebase'],
              rows: [
                ['History shape', 'True, non-linear history', 'Linear, "as if" history'],
                ['Existing commits', 'Untouched', 'Re-created with new hashes'],
                ['Conflicts', 'Resolved once, in the merge commit', 'Possibly once per replayed commit (rerere helps)'],
                ['Safe on shared branches', 'Yes', 'Only with team agreement + `--force-with-lease`'],
                ['bisect / revert', 'Revert a whole feature via its merge commit (`-m 1`)', 'Each commit must build on its own for bisect to be clean'],
                ['Signed commits', 'Preserved', 'Re-signed by whoever rebases (original signatures lost)'],
              ],
            },
            {
              type: 'heading',
              text: 'The golden rule of rebasing',
            },
            {
              type: 'p',
              text: 'Never rebase a branch that other people have already pulled and built work on top of. Because rebase produces new commits with new hashes, anyone with the old commits now has a history that has "diverged" from yours in a way Git cannot reconcile automatically — their next pull/push will be a confusing mess of duplicate-looking commits. Rebase freely on your own local, not-yet-pushed (or not-yet-shared) work; merge (or a team-agreed rebase workflow with force-push discipline) once it is shared.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'common branch/merge/rebase commands',
              code: `git switch -c feature/login            # create + switch to a new branch

git switch main
git merge feature/login                # merge feature/login into the current branch
git merge --no-ff feature/login        # always create a merge commit
git merge --ff-only origin/main        # only fast-forward; fail instead of creating a merge
git merge --abort                      # bail out of a conflicted merge

git switch feature/login
git fetch origin
git rebase origin/main                 # replay this branch's commits onto the latest main
git rebase --onto main old-base feature   # transplant commits after old-base onto main
git rebase --update-refs main          # also move stacked branches inside the range
git rebase --abort                     # restore everything to the pre-rebase state

# After a rebase that was already pushed, and you're SURE no one else based work on it:
git push --force-with-lease --force-if-includes`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Prefer `--force-with-lease` over a bare `--force` — it refuses to overwrite the remote branch if it no longer points where your remote-tracking ref says it does. Caveat: if something (your IDE, a cron job) ran `git fetch` in the background, your remote-tracking ref is already up to date and the lease passes anyway. Adding `--force-if-includes` closes that hole by also checking that the remote tip is actually in your branch\'s reflog, i.e. that you integrated it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A pragmatic team convention used widely: **rebase your own feature branch onto main** to stay current (private history, linear), and **integrate into main via the platform** (squash or merge commit). That gets you a readable main without anyone rewriting shared history.',
            },
          ],
        },
        {
          id: 'merge-conflicts',
          title: 'Resolving Merge Conflicts Like a Pro',
          summary:
            'Conflicts are not errors — they are Git asking a human to decide. Knowing how to read the markers, which side is "ours", and which tools reduce repeated pain turns conflicts from scary into routine.',
          keyPoints: [
            'A conflict arises only when both sides changed the same lines (or one deleted/renamed what the other edited) relative to the merge base.',
            'During a conflict the index holds three versions of the file: stage 1 = base, stage 2 = ours, stage 3 = theirs (`git ls-files -u` shows them).',
            '"ours" and "theirs" are **swapped during a rebase**: ours is the branch you are rebasing onto, theirs is your own commit being replayed.',
            '`merge.conflictStyle zdiff3` adds the base version to the markers — usually the difference between guessing and knowing.',
            '`rerere` ("reuse recorded resolution") remembers how you resolved a conflict hunk and applies it automatically next time.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'text',
              title: 'conflict markers with zdiff3',
              code: `<<<<<<< HEAD
const TIMEOUT_MS = 10_000;
||||||| merge base
const TIMEOUT_MS = 5_000;
=======
const TIMEOUT_MS = 5_000; // TODO: read from config
const RETRIES = 3;
>>>>>>> feature/retries`,
            },
            {
              type: 'p',
              text: 'Reading this with the base visible: main raised the timeout; the feature branch kept the timeout but added a comment and a retry constant. The correct resolution is obvious — keep 10 000 **and** the new constant. Without the base section you would only see two different lines and have to guess which side changed what.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'a disciplined conflict workflow',
              code: `git merge feature/retries          # CONFLICT (content): Merge conflict in src/http.js
git status                         # lists "both modified" paths
git diff                           # combined diff of the unresolved hunks

# Take one side wholesale for a file (e.g. a lockfile you will regenerate):
git checkout --theirs package-lock.json   # or: git restore --theirs package-lock.json
npm install                        # regenerate the lockfile properly, then:
git add package-lock.json

# Edit the rest by hand or with a tool, then mark resolved:
git mergetool                      # opens configured tool (VS Code, meld, vimdiff...)
git add src/http.js
npm test                           # never commit a resolution you have not built/tested
git merge --continue               # or: git rebase --continue / git cherry-pick --continue

# Inspect what you actually resolved vs. what Git did automatically:
git show --remerge-diff HEAD       # for a merge commit`,
            },
            {
              type: 'table',
              headers: ['Operation', '"ours" (--ours)', '"theirs" (--theirs)'],
              rows: [
                ['`git merge feature` on main', 'main (current branch)', 'feature'],
                ['`git rebase main` on feature', 'main (the new base, plus already-replayed commits)', 'your feature commit being replayed'],
                ['`git cherry-pick X`', 'current branch', 'commit X'],
                ['`git stash pop`', 'current working tree state', 'the stash'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`git merge -X ours` (a strategy *option*: prefer our side only for conflicting hunks) is completely different from `git merge -s ours` (a *strategy*: ignore the other branch\'s changes entirely and just record the merge). Mixing them up silently drops a teammate\'s work.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The best conflict is the one you never have: integrate often (small PRs, rebase or merge main daily), avoid mass reformatting in the same PR as logic changes, and keep generated files (lockfiles, snapshots) regenerated rather than hand-merged. If a conflict is too tangled, `git merge --abort` and re-approach it in smaller steps.',
            },
          ],
        },
        {
          id: 'undoing-things',
          title: 'Undoing Things: reset, revert, checkout, restore',
          summary:
            'Four different commands can "undo" something in Git, and picking the wrong one is how history gets rewritten by accident on a shared branch.',
          keyPoints: [
            '`git revert` creates a new commit that undoes a previous one — safe on shared/pushed history.',
            '`git reset` moves the current branch pointer (and optionally the index/working dir) — rewrites history, only safe on local/unshared commits.',
            '`git restore` (modern) and `git checkout -- <file>` (classic) discard working-directory changes to a file without touching history at all.',
            '`reset --soft` keeps changes staged, `--mixed` (default) unstages them but keeps them in the working dir, `--hard` discards them entirely.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Command', 'What it does', 'Safe on pushed/shared commits?'],
              rows: [
                ['`git revert <commit>`', 'Creates a **new** commit that applies the inverse of the given commit', 'Yes — history is preserved, only added to'],
                ['`git reset --soft <commit>`', 'Moves HEAD/branch pointer back; changes stay staged', 'No — rewrites history'],
                ['`git reset --mixed <commit>`', 'Moves HEAD back; changes stay in working dir, unstaged', 'No — rewrites history'],
                ['`git reset --hard <commit>`', 'Moves HEAD back; **discards** all changes since', 'No — rewrites history, and destructive'],
                ['`git reset --keep <commit>`', 'Like `--hard`, but aborts instead of clobbering uncommitted local edits', 'No — rewrites history (but safer than `--hard`)'],
                ['`git restore <file>` / `checkout -- <file>`', 'Discards uncommitted working-dir changes to one file', 'N/A — does not touch commit history'],
                ['`git restore --staged <file>`', 'Unstages a file, keeps the edit', 'N/A'],
                ['`git commit --amend`', 'Replaces the last commit with a new one', 'No — new hash'],
              ],
            },
            {
              type: 'heading',
              text: 'Which undo do I need?',
            },
            {
              type: 'mermaid',
              code: 'flowchart TD\n  Q{"Is the change committed?"} -- No --> S{"Staged?"}\n  S -- Yes --> RS["git restore --staged file"]\n  S -- No --> RW["git restore file<br/>(edits lost)"]\n  Q -- Yes --> P{"Already pushed / shared?"}\n  P -- Yes --> RV["git revert commit<br/>(new inverse commit)"]\n  P -- No --> L{"Keep the changes?"}\n  L -- "Yes, re-commit differently" --> RSoft["git reset --soft / --mixed"]\n  L -- "No, throw away" --> RH["git reset --keep / --hard"]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'reverting safely on shared branches',
              code: `git revert a1b2c3d                 # new commit undoing a1b2c3d
git revert --no-commit a1b2c3d..HEAD   # revert a range, commit once at the end
git revert -m 1 <merge-sha>         # revert a merge: keep parent 1 (main), undo the feature

# Undo the last local commit but keep its changes staged (e.g. to split it):
git reset --soft HEAD~1`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Reverting a merge commit has a long tail: Git now considers that branch\'s commits "already merged", so merging the same branch again later will **not** bring the changes back. To re-land the feature you must first revert the revert (`git revert <revert-sha>`), then merge the follow-up fixes.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`git reset --hard` permanently discards uncommitted changes with no confirmation prompt. Before running it, `git stash` anything you might want to keep — `reflog` can often recover a lost *commit*, but it cannot recover working-directory changes that were never committed.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'recovering "lost" work',
              code: `git reflog                        # every place HEAD has pointed, including "deleted" commits
git reflog show feature/login     # per-branch reflog
git switch --detach <sha-from-reflog>   # inspect it in detached HEAD
git branch recovered-work <sha>   # turn it back into a real branch

# "I just did a bad rebase/reset" — put the branch back where it was:
git reset --hard ORIG_HEAD        # rebase/reset/merge record the old tip in ORIG_HEAD
git reset --hard feature/login@{1}   # or: one step back in that branch's reflog

# Lost a dropped stash or a commit no ref ever pointed to?
git fsck --lost-found             # lists dangling commits/blobs you can still inspect`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The reflog is **local and temporary**: it is not pushed or cloned, and entries expire (by default after about 90 days for reachable entries and 30 days for unreachable ones) before `git gc` prunes the objects. It is a safety net for your own recent mistakes, not a backup system.',
            },
          ],
        },
        {
          id: 'remote-collaboration',
          title: 'Remote Collaboration Workflows',
          summary:
            'fetch vs pull, forks vs shared branches, and the pull-request review cycle — the parts of Git that are really about people, not the object model.',
          keyPoints: [
            '`git fetch` downloads remote history without touching your working branches; `git pull` = `fetch` + `merge` (or `rebase` with `--rebase`).',
            'A fork + pull request workflow is common for open source / external contributors; a shared-repo + feature-branch workflow is common inside a single team.',
            'Squash-merging a PR collapses many small commits into one clean commit on the target branch, trading granular history for a tidy main-branch log.',
            'Protected branches + required reviews + required CI checks are how teams enforce quality gates at the Git-hosting-platform level, not the Git CLI level.',
            'Recent Git refuses a `git pull` on divergent branches until you choose a strategy (`pull.rebase`, `pull.ff only`, or flags) — configure it once instead of fighting the prompt.',
            'Most high-velocity teams use short-lived branches merged into one trunk (GitHub flow / trunk-based development); Git flow\'s long-lived `develop` + release branches suits versioned, multi-release products more than continuously deployed services.',
          ],
          blocks: [
            {
              type: 'p',
              text: '`git fetch origin` updates your local copies of the remote\'s branches (e.g. `origin/main`) without changing anything you\'re currently working on. `git pull` is shorthand for `fetch` immediately followed by `merge FETCH_HEAD` into your current branch — which is also why `git pull` can unexpectedly create a merge commit if your local branch has diverged; `git pull --rebase` replays your local commits on top instead, keeping history linear.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant Local as Your local repo\n  participant Remote as origin (GitHub)\n  Local->>Remote: git fetch\n  Remote-->>Local: updates origin/main (your main untouched)\n  Local->>Local: git merge origin/main\n  Note right of Local: git pull = fetch + merge, in one step',
            },
            {
              type: 'heading',
              text: 'Merge strategies at PR time',
            },
            {
              type: 'list',
              items: [
                '**Merge commit** — preserves every individual commit plus a merge commit marking where the branch joined; most information-preserving, noisiest history.',
                '**Squash and merge** — all of the PR\'s commits become one commit on the target branch; clean history, loses the individual step-by-step commits (still visible in the closed PR itself on most platforms).',
                '**Rebase and merge** — the PR\'s commits are individually replayed onto the target branch with no merge commit at all; linear history, individual commits preserved.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'typical feature-branch workflow',
              code: `git switch main
git pull --ff-only                  # fail loudly if local main somehow diverged
git switch -c feature/add-search
# ... make commits ...
git push -u origin feature/add-search   # -u not needed with push.autoSetupRemote
# open a pull request; address review comments with more commits

# keep the branch current while the PR is open:
git fetch origin
git rebase origin/main               # or: git merge origin/main if the branch is shared
git push --force-with-lease

# once approved: squash-merge (or per team convention) via the hosting platform
git switch main && git pull --ff-only && git branch -d feature/add-search`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'fork workflow: keeping your fork in sync',
              code: `git clone git@github.com:you/project.git
git remote add upstream https://github.com/original-org/project.git
git remote -v                     # origin = your fork (push), upstream = canonical (fetch)

git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main`,
            },
            {
              type: 'heading',
              text: 'Branching strategies',
            },
            {
              type: 'table',
              headers: ['Strategy', 'Shape', 'Fits', 'Watch out for'],
              rows: [
                ['Trunk-based development', 'Everyone merges small changes to `main` at least daily; unfinished work hidden behind feature flags', 'Continuous delivery, strong CI, experienced teams', 'Requires fast, reliable tests and flag hygiene'],
                ['GitHub flow', 'Short-lived feature branch + PR + deploy from `main`', 'Most web services and SaaS teams', 'Long-lived PRs drift and conflict'],
                ['Git flow', '`main` + `develop` + feature/release/hotfix branches', 'Shipped, versioned software with parallel supported releases', 'Heavy ceremony; slow feedback for web apps'],
                ['Release branches', '`main` plus `release/x.y` branches cut for stabilisation; fixes cherry-picked back', 'Mobile apps, libraries, on-prem products', 'Forgetting to port a fix to every live branch'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'On busy repositories, a **merge queue** (offered by GitHub, GitLab and others) tests each PR against the latest main *plus* the PRs queued ahead of it before merging. That prevents the classic "two green PRs merge and main goes red" problem without forcing every author to rebase repeatedly.',
            },
          ],
        },
        {
          id: 'git-internals',
          title: 'Git Internals: Objects, Refs & Packfiles',
          summary:
            'Under the hood, `.git` is a simple key-value object database plus a handful of pointer files — knowing this makes every higher-level command feel obvious rather than magic.',
          keyPoints: [
            'Four object types, all content-addressed by SHA hash: blob (file content), tree (a directory listing), commit (a snapshot + metadata), and tag (an annotated tag).',
            'Refs are names for hashes: with the classic "files" backend, `.git/refs/heads/main` (or a line in `.git/packed-refs`) contains a commit hash; `.git/HEAD` contains `ref: refs/heads/main`. The newer **reftable** backend (opt-in now, planned default for new repos in Git 3.0) stores refs in binary tables that scale to millions of refs with atomic updates.',
            'Loose objects (one zlib-compressed file per object) get compacted into packfiles for efficiency — Git delta-compresses similar objects against each other, regardless of which commit or path they came from.',
            'Auxiliary indexes such as the commit-graph and multi-pack-index make history walks and object lookups fast in large repos; `git maintenance` keeps them fresh.',
            'The plumbing commands (`git hash-object`, `git cat-file`, `git rev-parse`) expose this model directly and are what the porcelain commands (`add`, `commit`, `log`) are built on top of.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  HEAD[".git/HEAD"] -->|"ref: refs/heads/main"| MainRef["refs/heads/main"]\n  MainRef -->|commit hash| Commit["commit object<br/>tree + parent + message"]\n  Commit --> Tree["tree object<br/>(a directory listing)"]\n  Tree --> Blob1["blob object<br/>(App.jsx content)"]\n  Tree --> Blob2["blob object<br/>(index.js content)"]\n  Tree --> Subtree["tree object<br/>(src/ subdirectory)"]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'poking at the object database directly',
              code: `git cat-file -p HEAD              # inspect the current commit object: tree, parent, message
git cat-file -p HEAD^{tree}        # inspect the tree it points to — a directory listing
git cat-file -t a1b2c3d            # object type: blob / tree / commit / tag
git rev-parse HEAD                 # the raw commit hash HEAD currently resolves to
git count-objects -vH              # loose vs. packed objects, human-readable sizes
git rev-parse --show-object-format # sha1 or sha256

# Build a blob by hand: the ID is hash("blob <size>\\0" + content)
echo "hello" | git hash-object --stdin       # ce013625030ba8dba906f756967f9e9ca394464a

git gc                             # one-off: pack loose objects, prune unreachable ones
git maintenance start              # schedule background maintenance for this repo`,
            },
            {
              type: 'table',
              headers: ['Object', 'Contains', 'Created by'],
              rows: [
                ['blob', 'Raw file bytes — no filename, no permissions', '`git add`'],
                ['tree', 'Entries of (mode, name, blob/tree hash) — one per directory', '`git commit` (via `write-tree`)'],
                ['commit', 'Tree hash, parent hash(es), author, committer, message, optional signature', '`git commit`, merge, rebase, cherry-pick'],
                ['tag', 'Target object, tag name, tagger, message, optional signature', '`git tag -a` / `git tag -s`'],
              ],
            },
            {
              type: 'heading',
              text: 'SHA-1, SHA-256 and the hash transition',
            },
            {
              type: 'p',
              text: 'Git originally used SHA-1. After practical SHA-1 collisions were demonstrated (SHAttered, 2017), Git switched to a hardened SHA-1 variant that detects known collision attacks, and added support for SHA-256 repositories (`git init --object-format=sha256`). The Git project plans to make SHA-256 the default for **new** repositories in Git 3.0, but interoperability between SHA-1 and SHA-256 repositories, and support across hosting platforms and tools, is still maturing — check your host\'s support before creating a SHA-256 repository for real work. Existing repositories are not converted automatically.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is why a commit hash changes if you amend a commit, rebase, or even just change its commit message: the hash is a function of the commit object\'s entire content (tree, parent, author, message) — change any of it and you get a brand-new object with a brand-new hash.',
            },
          ],
        },
        {
          id: 'interactive-rebase-history',
          title: 'Interactive Rebase & Rewriting History',
          summary:
            'Beyond replaying commits onto a new base, `rebase -i` lets you edit, reorder, squash, or drop individual commits — the main tool for cleaning up a messy branch before merging.',
          keyPoints: [
            '`git rebase -i HEAD~N` opens an editable list of the last N commits — reorder lines to reorder commits, or change the leading keyword to act differently.',
            '`squash`/`fixup` combine a commit into the one before it — turning "WIP", "fix typo", "actually fix it" into one clean commit.',
            '`git commit --amend` rewrites the most recent commit (message and/or content) instead of creating a new one.',
            'Only rewrite history that has not been shared/pushed — the golden rule from Merging vs Rebasing applies here even more strongly.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'cleaning up a branch before opening a PR',
              code: `git rebase -i HEAD~4
# opens an editor with something like:
#   pick a1b2c3d Add search input
#   pick e4f5a6b WIP
#   pick 7c8d9e0 fix typo
#   pick 1f2a3b4 Actually fix the bug
#
# change to:
#   pick   a1b2c3d Add search input
#   squash e4f5a6b WIP
#   fixup  7c8d9e0 fix typo
#   fixup  1f2a3b4 Actually fix the bug
# → save, write one clean combined commit message, done

git commit --amend -m "Better message"   # rewrite the last commit's message
git commit --amend --no-edit             # add staged changes to the last commit, keep its message`,
            },
            {
              type: 'table',
              headers: ['Command', 'Effect'],
              rows: [
                ['`pick` (p)', 'Keep the commit as is'],
                ['`reword` (r)', 'Keep the changes, edit the message'],
                ['`edit` (e)', 'Stop after applying, so you can amend or split it (`git reset HEAD~` then commit in pieces)'],
                ['`squash` (s)', 'Meld into the previous commit, combine messages'],
                ['`fixup` (f)', 'Meld into the previous commit, discard this message (`fixup -C` keeps this one instead)'],
                ['`drop` (d)', 'Remove the commit entirely (same as deleting the line)'],
                ['`exec` (x)', 'Run a shell command; the rebase stops if it fails'],
                ['`break` / `label` / `reset` / `merge`', 'Pause, and advanced commands used to rebuild merges with `--rebase-merges`'],
              ],
            },
            {
              type: 'heading',
              text: 'The fixup-commit workflow (autosquash)',
            },
            {
              type: 'p',
              text: 'Instead of hand-editing the todo list, mark corrections as you make them. `git commit --fixup=<sha>` creates a commit titled `fixup! <original subject>`; `git rebase -i --autosquash` (or `rebase.autoSquash = true`) moves each one under its target and marks it `fixup` automatically. This is how experienced engineers address review feedback while keeping a clean, logical series of commits.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'addressing review feedback on a multi-commit PR',
              code: `git add src/search.js
git commit --fixup=a1b2c3d             # "fixup! Add search input"
git commit --fixup=reword:a1b2c3d      # amend only the message of a1b2c3d
git rebase -i --autosquash origin/main # todo list already arranged — just save

# Verify every commit in the series still builds and passes tests:
git rebase -i --exec "npm test" origin/main

# Compare the series before and after the rewrite (great for reviewers):
# (feature@{1} = where the branch pointed before the rebase)
git range-diff <old-base>..feature@{1} origin/main..feature`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If a rebase gets confusing partway through, `git rebase --abort` puts everything back exactly as it was before you started — there is no penalty for backing out and trying again. And if you already finished a rebase you regret, `git reset --hard ORIG_HEAD` (or the branch reflog) gets the old version back.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Plain `git rebase` flattens merge commits inside the rebased range — the merged work is linearised and the merge structure is lost. If the branch intentionally contains merges, use `git rebase --rebase-merges` to recreate them.',
            },
          ],
        },
        {
          id: 'hooks-automation',
          title: 'Git Hooks & Automation',
          summary:
            'Hooks are scripts Git runs automatically at specific points (before a commit, before a push, after a merge) — the foundation of local quality gates like linting and formatting on commit.',
          keyPoints: [
            'Hooks live in `.git/hooks/` as executable scripts named after the event (`pre-commit`, `commit-msg`, `pre-push`, `post-merge`).',
            'A non-zero exit code from a hook script aborts the action — e.g., a `pre-commit` hook that fails stops the commit from happening.',
            'Because `.git/hooks/` is not tracked or cloned (deliberately — cloning a repo must never run its code), teams version hooks in the repo and point Git at them with `core.hooksPath`, usually via a tool like Husky or lefthook (JS) or the `pre-commit` framework (Python).',
            'Common uses: run linters/formatters on staged files before commit, run fast tests before push, enforce a commit-message format (e.g. Conventional Commits).',
            'Client-side hooks are a convenience, not enforcement: anyone can skip them with `--no-verify`. Anything that truly must hold belongs in CI and branch protection (or server-side `pre-receive` hooks on self-hosted servers).',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a minimal pre-commit hook (.git/hooks/pre-commit, chmod +x)',
              code: `#!/bin/sh
# The shebang MUST be the very first line, or the hook will not execute correctly.
npm run lint || {
  echo "Lint failed — commit aborted."
  exit 1
}`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'sharing hooks through the repository',
              code: `mkdir -p .githooks
cp my-pre-commit .githooks/pre-commit && chmod +x .githooks/pre-commit
git config core.hooksPath .githooks   # each developer runs this once (or a setup script does)

# Bypass in an emergency — and note CI must catch what this skips:
git commit --no-verify -m "WIP: spike"`,
            },
            {
              type: 'table',
              headers: ['Hook', 'Runs', 'Typical use'],
              rows: [
                ['`pre-commit`', 'Before the commit message is requested', 'Lint/format staged files (lint-staged), block secrets'],
                ['`prepare-commit-msg`', 'Before the editor opens', 'Pre-fill the ticket ID from the branch name'],
                ['`commit-msg`', 'After the message is written', 'Validate format (commitlint)'],
                ['`pre-push`', 'Before objects are sent', 'Run fast tests, block pushes to `main`'],
                ['`post-checkout` / `post-merge`', 'After switching / merging', 'Reinstall deps, update submodules'],
                ['`pre-receive` / `update` (server)', 'On the server, before refs update', 'Enforce policy that clients cannot bypass'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Slow hooks get bypassed. A `pre-commit` that runs the full test suite trains everyone to type `--no-verify`. Keep commit hooks to seconds by checking only staged files, and push heavier checks to `pre-push` or CI.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  A[git commit] --> B{pre-commit hook}\n  B -- exit 0 --> C[commit-msg hook]\n  B -- exit non-zero --> X[commit aborted]\n  C -- exit 0 --> D[commit created]\n  C -- exit non-zero --> X',
            },
          ],
        },
        {
          id: 'signing-security',
          title: 'Signing Commits & Repository Security',
          summary:
            'Anyone can type any name and email into `user.email` — Git does not authenticate authors. Signatures, secret hygiene and a few safety settings close the most common supply-chain gaps.',
          keyPoints: [
            'Commit author metadata is unauthenticated; a signature proves the commit was created by the holder of a specific private key.',
            'Since Git 2.34 you can sign with an **SSH key** (`gpg.format ssh`) — usually the same kind of key you already use to push — instead of managing a GPG keyring.',
            'Verification locally needs an allowed-signers file (`gpg.ssh.allowedSignersFile`); hosting platforms show "Verified" when the signing key is registered to the account.',
            'Secrets committed even once live in every clone\'s history. Prevent with pre-commit/push scanning and platform push protection; respond by rotating the credential first.',
            '`safe.directory` protects you from running Git (and its config-defined commands) inside repositories owned by another user — a guard added after real-world vulnerabilities.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'signing every commit and tag with an SSH key',
              code: `git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true

# Local verification: map emails to trusted public keys
echo "ada@example.com $(cat ~/.ssh/id_ed25519.pub)" >> ~/.config/git/allowed_signers
git config --global gpg.ssh.allowedSignersFile ~/.config/git/allowed_signers

git log --show-signature -1        # Good "git" signature for ada@example.com ...
git verify-commit HEAD
git verify-tag v1.0.0`,
            },
            {
              type: 'table',
              headers: ['Option', 'Key management', 'Expiry / revocation', 'Notes'],
              rows: [
                ['GPG (OpenPGP)', 'Separate keyring, web of trust', 'Built in', 'Mature, but the tooling is a common source of friction'],
                ['SSH keys', 'Reuse existing SSH key types, hardware keys (FIDO2) work', 'Via allowed-signers validity options', 'Simplest path for most developers'],
                ['X.509 (S/MIME), keyless signing', 'Org certificates or short-lived certs from an identity provider (e.g. Sigstore gitsign)', 'Certificate-based', 'Common in enterprises / supply-chain programmes'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A signature attests **who committed**, not that the code is safe. It is one layer: combine it with branch protection that requires signed commits, mandatory review, and CI checks. Also remember that rebasing or squash-merging on the platform creates new commits — they are signed by whoever (or whatever service) performed the rewrite.',
            },
            {
              type: 'heading',
              text: 'Secret hygiene',
            },
            {
              type: 'list',
              items: [
                'Keep secrets out of the tree entirely: `.env` in `.gitignore`, commit only `.env.example`, load real values from a secret manager.',
                'Scan before the secret leaves your machine: a `pre-commit` hook running a scanner such as gitleaks or trufflehog, plus the hosting platform\'s push protection / secret scanning.',
                'If a secret is pushed: **revoke and rotate first**, then purge history with `git filter-repo` (the officially recommended replacement for the old `git filter-branch`), force-push, and ask collaborators to re-clone. Platform caches, forks and PR refs may still hold the old commits, so purging is clean-up, not remediation.',
                'Never run Git commands or hooks from repositories you do not trust with elevated privileges; hooks and config like `core.fsmonitor` can execute arbitrary programs.',
              ],
            },
          ],
        },
        {
          id: 'submodules-monorepos',
          title: 'Submodules & Monorepo Strategies',
          summary:
            'Two opposite answers to "how do I manage multiple related codebases": keep them as separate repos linked together (submodules), or put everything in one repo (a monorepo).',
          keyPoints: [
            'A submodule embeds another Git repository at a specific commit inside your repo — useful for a genuinely independent dependency you also develop.',
            'Submodules are notoriously easy to get out of sync (`git submodule update --init --recursive` is required after every clone/pull) — a common source of "why is this file missing" confusion.',
            'A monorepo keeps multiple projects/packages in one repo instead, sharing one history and one set of commits — simpler day-to-day at the cost of a larger single repo.',
            'Large monorepos (Google, Meta) typically pair this with tooling for partial checkouts and scoped CI, since a plain `git clone` of everything would be impractical at that scale.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'working with a submodule',
              code: `git submodule add https://github.com/org/shared-lib libs/shared-lib
git commit -m "Add shared-lib as a submodule"

# after someone else clones the parent repo:
git clone https://github.com/org/main-app
git submodule update --init --recursive   # actually fetch the submodule's content

# or in one step, and make future pulls/switches update submodules automatically:
git clone --recurse-submodules https://github.com/org/main-app
git config --global submodule.recurse true

# bump the pinned version deliberately:
git submodule update --remote libs/shared-lib   # move to the tip of its tracked branch
git add libs/shared-lib && git commit -m "Bump shared-lib to latest"`,
            },
            {
              type: 'table',
              headers: ['Approach', 'How it works', 'Good for', 'Pain points'],
              rows: [
                ['Package manager (npm, Maven, pip...)', 'Depend on a published, versioned artifact', 'Most shared libraries', 'Release step for every change'],
                ['Submodule', 'Parent repo pins an exact commit of another repo', 'Vendored third-party code, firmware, docs themes', 'Easy to forget updates; detached HEAD inside the submodule'],
                ['Subtree (`git subtree`)', 'Copies another repo\'s history into a subdirectory', 'Consumers who should not need to know about the dependency', 'Pushing changes back upstream is awkward'],
                ['Monorepo', 'All projects in one repository and history', 'Tightly coupled services/packages with atomic cross-cutting changes', 'Needs build tooling (Nx, Turborepo, Bazel) and scale features (sparse-checkout, partial clone)'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A submodule reference is a specific pinned commit, not a branch — pulling the parent repo does not automatically update the submodule\'s content. This is a common source of "it works on my machine" when one developer updated the submodule and others forgot to run `git submodule update`.',
            },
          ],
        },
        {
          id: 'large-repos-performance',
          title: 'Scaling Git: Partial Clone, Sparse-Checkout, LFS & Maintenance',
          summary:
            'Plain `git clone` downloads every version of every file. For big monorepos, long histories or binary-heavy projects, modern Git can fetch and check out only what you need — and keep itself fast in the background.',
          keyPoints: [
            '**Partial clone** (`--filter=blob:none`) downloads all commits and trees but fetches file contents lazily on demand — usually the best default for large repos.',
            '**Shallow clone** (`--depth=1`) truncates history; great for throwaway CI builds, but breaks or slows history operations (log, blame, bisect, merge-base) for daily development.',
            '**Sparse-checkout** (cone mode) limits which directories are materialised in your working tree, so tooling only sees the part of the monorepo you work on.',
            '**Git LFS** replaces large binaries with small pointer files and stores the content on a separate server — the standard answer for media, datasets and model weights.',
            '`git maintenance start` schedules background tasks (prefetch, commit-graph, loose-object packing, incremental repack) so the repository stays fast without blocking `gc` pauses. `scalar` bundles these settings for very large repositories.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'working in only part of a huge monorepo',
              code: `# Blobless partial clone + sparse checkout, nothing checked out yet
git clone --filter=blob:none --sparse https://github.com/org/monorepo.git
cd monorepo
git sparse-checkout set apps/web packages/ui   # cone mode: whole directories
git sparse-checkout add packages/api-client
git sparse-checkout list
git sparse-checkout disable                     # back to a full working tree

# Fast CI checkout: no history at all
git clone --depth=1 --single-branch --branch main https://github.com/org/app.git
git fetch --unshallow                           # later, if you need full history after all

# Keep it fast
git maintenance start          # registers the repo and schedules background tasks
git config core.fsmonitor true # use the built-in file-system monitor (macOS/Windows)
git config core.untrackedCache true`,
            },
            {
              type: 'table',
              headers: ['Technique', 'What you skip', 'History commands', 'Best for'],
              rows: [
                ['Full clone', 'Nothing', 'All fast, offline', 'Small/medium repos'],
                ['Blobless (`--filter=blob:none`)', 'Old file contents until needed', 'Work; may fetch blobs on demand (needs network)', 'Developers on large repos'],
                ['Treeless (`--filter=tree:0`)', 'Trees and blobs until needed', 'Slow for history-heavy work', 'Build machines that need one commit but may fetch more'],
                ['Shallow (`--depth=N`)', 'Commits older than N', 'Truncated / misleading', 'One-shot CI jobs'],
                ['Sparse-checkout', 'Files outside chosen directories (on disk only)', 'Unaffected', 'Monorepos, combine with partial clone'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'Git LFS for large binaries',
              code: `git lfs install                          # once per machine
git lfs track "*.psd" "models/**/*.onnx"  # writes rules to .gitattributes
git add .gitattributes models/classifier.onnx
git commit -m "Track model weights with LFS"
git lfs ls-files

# Migrating existing history into LFS rewrites commits — coordinate with the team:
git lfs migrate import --include="*.psd" --everything`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Deleting a large file in a new commit does not shrink the repository — every clone still downloads it from history. Find the culprits with `git rev-list --objects --all | git cat-file --batch-check` (sort by size) or `git filter-repo --analyze`, then rewrite history with `git filter-repo` if you genuinely need it gone.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Partial and sparse clones depend on server support for the relevant protocol features (protocol v2, object filters). The major hosts support them, but self-hosted or older servers may silently fall back to a full clone.',
            },
          ],
        },
        {
          id: 'debugging-bisect-blame',
          title: 'Debugging History: bisect, blame & log Search',
          summary:
            'When something broke and you don\'t know which commit did it, Git has purpose-built tools for searching history itself rather than just the current code.',
          keyPoints: [
            '`git bisect` automates a binary search over commit history to find exactly which commit introduced a bug.',
            '`git blame <file>` shows which commit last touched each line — the starting point for "why is this line here?".',
            '`git log -S"search term"` finds commits that added or removed a specific string ("the pickaxe") — useful when blame just points to a big refactor.',
            '`git log --follow <file>` tracks a file\'s history across renames, which plain `git log <file>` does not do.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'bisecting to find a regression',
              code: `git bisect start
git bisect bad                    # current commit is broken
git bisect good v1.2.0             # this older tag was known-good
# Git checks out the midpoint commit — test it, then:
git bisect good                    # or: git bisect bad
# ... repeat until Git identifies the exact first-bad commit ...
git bisect reset                   # return to where you started

# fully automated, given a script that exits non-zero on failure:
git bisect run npm test
# exit 0 = good, 1-124/126/127 = bad, 125 = "cannot test this commit, skip it"

git bisect skip                    # this commit does not build — pick another nearby
git bisect log > bisect.log        # save your session; replay with: git bisect replay bisect.log
git bisect start --first-parent    # only test merge commits on main (find the bad PR)
git bisect start --term-old=fast --term-new=slow   # hunt a perf change, not a "bug"`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Good["known-good<br/>commit"] -.-> C1 -.-> C2 -.-> C3["? bisect checks<br/>out the midpoint"] -.-> C4 -.-> C5 -.-> Bad["known-bad<br/>(current) commit"]',
            },
            {
              type: 'p',
              text: 'Bisect needs about log2(N) tests: 1 000 commits take roughly 10 steps. It works best when every commit builds and passes tests on its own — another practical reason to keep commits atomic and to avoid "WIP, broken" commits landing on main.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'archaeology: blame and log, done properly',
              code: `git blame -w -C -C -C src/cart.js   # ignore whitespace; follow code moved/copied across files
git blame -L 120,160 src/cart.js     # only a line range

# Skip mass-formatting commits in blame, permanently, for the whole team:
echo "3f2a9c1d..." >> .git-blame-ignore-revs   # full SHA of the "run prettier" commit
git config blame.ignoreRevsFile .git-blame-ignore-revs

git log -S"calculateTax" --oneline     # commits where the count of this string changed
git log -G"maxRetries *=" --oneline    # commits whose added/removed lines match a regex
git log -L :applyDiscount:src/cart.js  # full history of a single function
git log --follow -p -- src/legacy/old-name.js
git log --since="2 weeks ago" --author="ada" --no-merges --stat`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Blame tells you **who last touched a line**, not who is responsible for the bug. Use it to find the commit and its message/PR, read the reasoning, then talk to the person — never as a tool for assigning fault.',
            },
          ],
        },
      ],
    },
    {
      id: 'git-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Common Git interview questions, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'What is the fundamental difference between `git merge` and `git rebase`, and when would you choose each?',
              answer:
                'Merge combines two branches by creating a new commit with two parents, preserving both histories exactly as they occurred — nothing is rewritten. Rebase replays your branch\'s commits onto a new base one at a time, producing new commits with new hashes and a linear history, as if you had started from the new base. Use merge for shared/public branches (it never rewrites history, so it is always safe), and rebase to clean up your own local, not-yet-shared work before merging or opening a PR.',
            },
            {
              question: 'What does `git reset --hard` do, and why is it dangerous?',
              answer:
                'It moves the current branch pointer to the given commit and overwrites both the index and the working directory to match — meaning any uncommitted changes, and any commits after that point that are not referenced elsewhere, are discarded. It is dangerous because there is no confirmation prompt and uncommitted work is lost permanently. Nuances a senior engineer adds: commits "lost" this way are still recoverable via `git reflog` / `ORIG_HEAD` until they expire; content that was **staged** (`git add`) but never committed already exists as blob objects and can often be fished out with `git fsck --lost-found`; but edits that were never staged are truly gone. Safer alternatives are `git reset --keep` (refuses to clobber local edits) or `git stash` first.',
            },
            {
              question: 'Why does Git deduplicate storage automatically, and what makes that possible?',
              answer:
                'Every object in Git — a file\'s content (blob), a directory listing (tree), or a commit — is stored and addressed by the SHA hash of its own content, not by filename or path. If two commits contain a file with byte-for-byte identical content, they reference the exact same blob object rather than storing it twice. This content-addressable design is also what makes Git\'s integrity model work: any corruption changes a hash, so tampering or corruption is detectable.',
            },
            {
              question: 'What is the difference between `git fetch` and `git pull`?',
              answer:
                '`git fetch` downloads the latest commits/branches from the remote into your local copies of the remote-tracking branches (e.g. `origin/main`) without touching your current working branch at all. `git pull` is `fetch` immediately followed by a `merge` (or `rebase`, with `--rebase`) of the fetched changes into your current branch — it actually changes your working branch, which is why an unexpected merge commit from a plain `git pull` is a common surprise.',
            },
            {
              question: 'You accidentally committed a secret (API key) to a repository that has already been pushed. What do you do?',
              answer:
                'Rotating/revoking the leaked credential immediately is the first and most important step — once a secret has been pushed, assume it is compromised regardless of what you do to history afterward, since it may already be cached, forked, or scraped. After that, remove it from history with a tool built for history rewriting (`git filter-repo`, or BFG Repo-Cleaner) rather than a single revert commit (which leaves the secret fully readable in the older commit), force-push the cleaned history, and have every collaborator re-clone rather than pull, since their local history has now diverged from the rewritten remote. Avoid the legacy `git filter-branch` (slow and error-prone; its own docs point to filter-repo). Even after a rewrite, forks, PR refs and platform caches may retain the old commits — which is exactly why rotation, not purging, is the real fix — and prevention belongs in pre-commit secret scanning and platform push protection.',
            },
            {
              question: 'What is a detached HEAD state, and how do you get out of it safely?',
              answer:
                'Normally HEAD points at a branch, which in turn points at a commit. If you check out a specific commit hash (or a tag) directly, HEAD points straight at that commit instead of at a branch — you are in "detached HEAD" state. Any new commits you make there are not attached to any branch, so they can become unreachable and eventually garbage-collected once you switch away, unless you create a branch pointing at them first (`git branch new-branch-name` while still on that commit, or `git switch -c new-branch-name`). If you already switched away, the commits are still in `git reflog` for a while — find the hash there and branch from it. Detached HEAD is normal and useful (inspecting a tag, CI checkouts, the middle of a rebase or bisect); modern Git makes it explicit with `git switch --detach <commit>`.',
            },
            {
              question: 'What is the purpose of a `.gitignore` file, and does it affect files Git is already tracking?',
              answer:
                '`.gitignore` tells Git which untracked files/patterns to exclude from `git status` and `git add .` — build artifacts, dependency folders, local environment files, and similar noise that should never be committed. It has no effect on files Git is already tracking: if a file was committed before being added to `.gitignore`, Git continues tracking it until it is explicitly removed with `git rm --cached <file>` (which untracks it going forward while leaving the file on disk).',
            },
            {
              question: 'Explain what `git cherry-pick` does and a realistic scenario for using it.',
              answer:
                '`git cherry-pick <commit>` applies the changes introduced by a single specific commit from one branch onto your current branch, as a new commit. A realistic use case: a critical bug fix was committed on a feature branch or `main`, and you need that exact fix on a separate release/hotfix branch without merging in the rest of that branch\'s unrelated, not-yet-ready changes.',
            },
            {
              question: 'What is the difference between a lightweight tag and an annotated tag?',
              answer:
                'A lightweight tag is just a named pointer to a commit, essentially like a branch that never moves. An annotated tag is a full Git object of its own — it stores the tagger\'s name/email, date, a message, and can be GPG-signed — and is what `git tag -a` creates. Annotated tags are the recommended choice for anything meaningful (releases), since they carry metadata and can be cryptographically verified; lightweight tags are more of a quick local bookmark.',
            },
            {
              question: 'How would you find which commit introduced a specific bug, in a large history?',
              answer:
                '`git bisect` automates a binary search over commit history: you mark a known-good commit and a known-bad commit, and Git checks out the midpoint for you to test, narrowing the range by half on each iteration based on whether you mark that commit good or bad — turning what could be a linear scan through hundreds of commits into a logarithmic number of tests. `git bisect run <test-script>` can even automate the "test and mark" step entirely if you have a script that exits non-zero on the bug.',
            },
            {
              question: 'What actually happens inside `.git` when you run `git commit`?',
              answer:
                'Git first writes a tree object representing the current staged directory structure (recursively, one tree per directory, referencing blob objects for file contents — reusing any blob/tree that already exists with identical content). It then writes a commit object containing that tree\'s hash, the current HEAD commit as its parent, the author/committer metadata, and the commit message. Finally, it updates the current branch\'s ref file to point at this new commit hash, and moves HEAD along with it (since HEAD is a symbolic reference to the branch).',
            },
            {
              question: 'What is the difference between `git rebase -i` squash and fixup?',
              answer:
                'Both combine a commit into the one immediately before it in the list, but `squash` keeps that commit\'s message and lets you edit the combined message, while `fixup` discards its message entirely and silently folds it into the previous commit\'s message unchanged. `fixup` is the right choice for "oops, fix a typo in the last commit" — you don\'t want a trivial fix-up message cluttering the final history.',
            },
            {
              question: 'Why can pulling submodule-based dependencies be a source of confusing bugs on a team, and how do you avoid it?',
              answer:
                'A submodule reference in the parent repo is a pointer to one specific pinned commit of the submodule, not to a branch — so pulling the parent repo\'s changes does not automatically update the submodule\'s checked-out content, and a plain `git clone` of the parent repo leaves submodule directories empty until explicitly initialized. This causes "it works on my machine" bugs when one developer bumps the submodule pointer and others simply run `git pull` without also running `git submodule update --init --recursive`. Teams avoid this with `git clone --recurse-submodules` plus `submodule.recurse = true` (so pull and switch update submodules automatically), a post-checkout/post-merge hook, or by preferring a package dependency or a monorepo when the coupling between projects is tight enough that this friction outweighs the benefit of separate repos.',
            },
            {
              question: 'What is the difference between `git switch`/`git restore` and `git checkout`? Is checkout deprecated?',
              answer:
                '`git checkout` historically did two unrelated jobs: moving HEAD to another branch/commit, and overwriting files from the index or a commit. That overloading caused real data loss (`git checkout foo` means "switch to branch foo" or "discard edits to file foo" depending on what exists). `git switch` handles only branch movement (`-c` to create, `--detach` for a commit) and `git restore` only file content (`--staged` for the index, `--source=<commit>` to choose where from). Checkout is **not** deprecated — the Git project has explicitly said it stays — but switch/restore are the recommended commands for new habits, docs and scripts written for people.',
            },
            {
              question: 'How does `--force-with-lease` work, and why is it sometimes still not safe enough?',
              answer:
                'It turns a force-push into a compare-and-swap: the push only succeeds if the remote branch still points at the commit your remote-tracking ref (e.g. `origin/feature`) says it does, so you cannot blindly overwrite a teammate\'s push that you never fetched. The gap: if a background fetch (an IDE, a script) updated `origin/feature` without you integrating those commits, the lease matches and you overwrite them anyway. `--force-if-includes` (Git 2.30+) additionally requires that the remote tip appears in your local branch\'s reflog, i.e. that you actually incorporated it. You can also pin the expectation explicitly: `--force-with-lease=feature:<expected-sha>`.',
            },
            {
              question: 'Walk through how Git performs a three-way merge and what causes a conflict.',
              answer:
                'Git finds the merge base — the best common ancestor of the two tips (`git merge-base A B`; with criss-cross histories there can be several, which `ort` merges recursively into a virtual base). It then computes base→ours and base→theirs changes per file, detecting renames by content similarity. Hunks changed on only one side are taken automatically; identical changes on both sides are taken once. A conflict occurs when both sides changed overlapping regions differently, or for structural cases like modify/delete or rename/rename. Conflicted files get markers in the working tree and three index stages (base, ours, theirs) until you `git add` the resolution.',
            },
            {
              question: 'During a rebase, why do "ours" and "theirs" appear reversed?',
              answer:
                'Rebase works by checking out the new base and then cherry-picking your commits onto it one by one. So at the moment of a conflict, the branch being built (HEAD, the "ours" side) is the upstream plus your already-replayed commits, and the commit being applied ("theirs") is your own original work. Hence `git checkout --ours file` during a rebase takes the upstream version, which surprises people who expect "ours" to mean "my branch". Understanding the mechanism (rebase = repeated cherry-pick) makes the naming logical.',
            },
            {
              question: 'Your team\'s main branch has a bad merge that was deployed. Walk through how you would undo it safely, and what happens when the feature is fixed and needs to be re-merged.',
              answer:
                'Because main is shared, do not reset or force-push. Use `git revert -m 1 <merge-sha>`, which creates a commit undoing the changes the merge introduced relative to its first parent (main). Deploy that. The trap comes later: the feature branch\'s commits are still reachable from main, so Git considers them merged — merging the branch again only brings in commits made after the revert, not the original changes. To re-land it, first revert the revert commit (restoring the original changes), then merge the follow-up fixes; alternatively rebuild the feature as new commits on a fresh branch.',
            },
            {
              question: 'A colleague says "I ran `git push --force` and now my teammate\'s commits are gone from the remote." How do you recover?',
              answer:
                'The commits almost certainly still exist somewhere. First check the teammate\'s local clone: their branch, or their `origin/<branch>` remote-tracking ref (if they have not fetched since), still points at the old tip — they can simply push it back (with a lease) or someone merges it in. The person who force-pushed may also have the old tip in their reflog for `origin/<branch>` (`git reflog show origin/feature`) if they fetched before. Hosting platforms often record the previous tip in the PR timeline or audit log, and some allow restoring it. Then prevent recurrence: protect the branch against force-pushes and teach `--force-with-lease --force-if-includes`.',
            },
            {
              question: 'How would you make a very large monorepo fast to clone and work in?',
              answer:
                'Start with a blobless partial clone (`git clone --filter=blob:none`) so history is complete but file contents are fetched on demand, and combine it with cone-mode sparse-checkout so only the directories a developer owns are materialised. Enable `git maintenance start` for background prefetch, commit-graph and incremental repacking, plus `core.fsmonitor` and `core.untrackedCache` to make `git status` cheap on big trees (`scalar` sets most of this up at once). Keep binaries in Git LFS, keep generated artifacts out of the repo, and give CI shallow or treeless clones. Avoid shallow clones for developers because they degrade log, blame, bisect and merge-base. Finally, pair it with build tooling that only builds and tests affected projects, since Git speed alone does not fix CI time.',
            },
            {
              question: 'What does `git rerere` do, and when is it worth enabling?',
              answer:
                '"Reuse recorded resolution": with `rerere.enabled = true`, Git records the pre-image of each conflicted hunk and the resolution you committed. The next time the identical conflict appears — very common when you repeatedly rebase a long-lived branch, or test-merge a branch then discard the merge — Git applies the recorded resolution automatically (it still leaves the file for you to review and `git add`). It is worth enabling globally; the risk is replaying a resolution that was wrong, which you can clear with `git rerere forget <path>`.',
            },
            {
              question: 'What are the trade-offs between squash-merge, rebase-merge and merge commits for PRs?',
              answer:
                'Squash produces one commit per PR on main: very readable, easy to revert a whole feature, and the PR link carries the detail — but intermediate commits are lost, co-authorship must be recorded via trailers, and the feature branch no longer looks merged, so stacked branches built on it need `git rebase --onto`. Rebase-merge keeps each commit linearly, which is great for bisect only if every commit builds; commits get new hashes and new committer signatures. Merge commits preserve true history and branch boundaries (`git log --first-parent` gives a PR-level view) at the cost of a busier graph. The right choice follows from commit discipline: teams with curated, atomic commits benefit from rebase or merge; teams with "WIP" commits are better served by squash.',
            },
            {
              question: 'Why can you not trust the author name on a commit, and how do you establish authenticity?',
              answer:
                '`user.name` and `user.email` are free text that anyone can set, and the commit stores them without verification; even "committer" is just more metadata. Authenticity comes from cryptographic signatures: sign commits and tags with GPG, SSH keys (`gpg.format ssh`, available since Git 2.34) or X.509 certificates, verify them with `git verify-commit` / `git log --show-signature` (for SSH, against an allowed-signers file), and let the hosting platform enforce "require signed commits" on protected branches. Remember a signature proves key possession, not code quality, and platform rewrites (squash/rebase merges) are signed by the platform rather than the author.',
            },
            {
              question: 'What is a shallow clone, and why can it cause problems in CI?',
              answer:
                '`git clone --depth=N` fetches only the last N commits, grafting the oldest one as if it had no parents. It is fast, but anything that needs history then fails or lies: `git describe` cannot find the last tag, version tools that count commits produce wrong numbers, `git merge-base` with the target branch fails (breaking "changed files since main" logic in monorepo CI), and blame/log are truncated. Fixes: fetch enough depth, `git fetch --unshallow` when needed, fetch the target branch and tags explicitly, or use a blobless partial clone, which keeps full history cheaply.',
            },
            {
              question: 'What changes are planned for Git 3.0, and do they affect existing repositories?',
              answer:
                'The Git project documents several breaking changes for a future 3.0 (no fixed release date has been announced): new repositories default to SHA-256 object hashes, the reftable reference backend, and `main` as the default branch name; some long-deprecated features (such as grafts and `git whatchanged`) are removed; and Rust becomes a required build dependency. These are mostly defaults for **new** repositories — existing SHA-1/files-backend repositories keep working and are not converted automatically. Practical prep today: set `init.defaultBranch`, stop relying on removed commands in scripts, and check that your tooling and hosting platform support SHA-256 and reftable before adopting them.',
            },
          ],
        },
      ],
    },
  ],
}
