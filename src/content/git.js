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
          ],
          blocks: [
            {
              type: 'p',
              text: 'Version control solves a problem every codebase eventually has: multiple people (or just multiple past versions of yourself) changing the same files over time, needing to know what changed, when, why, and by whom — and needing a safe way to combine everyone\'s work without overwriting each other.',
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
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a first Git session',
              code: `git init my-project              # start a brand-new repo
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
              code: 'flowchart LR\n  WD[Working Directory<br/>files you edit] -- "git add" --> Stage[Staging Area / Index<br/>next commit, in progress]\n  Stage -- "git commit" --> Repo[Repository History<br/>permanent, HEAD]\n  Repo -- "git checkout / restore" --> WD',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A good commit message explains **why**, not just what — the diff already shows what changed. "Fix off-by-one error in pagination that skipped the last page" is far more useful later than "fix bug".',
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
              text: 'Internally, a branch is a tiny file containing just a commit hash — nothing is copied when you create one. This is why Git branching is instant, unlike some older systems where branching meant duplicating the entire codebase on disk.',
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
git branch -D feature/login    # force-delete even if unmerged`,
            },
          ],
        },
        {
          id: 'how-git-models-history',
          title: 'How Git Actually Models History',
          summary:
            'Git is a content-addressable graph of snapshots, not a list of diffs — understanding that one fact explains almost every command that otherwise seems arbitrary.',
          keyPoints: [
            'A commit is a full snapshot of the tree plus a pointer to its parent(s) — Git computes diffs on demand for display, it does not store them.',
            'Every object (blob, tree, commit) is identified by the SHA-1/SHA-256 hash of its content — identical content is stored once.',
            'A branch is just a movable pointer (a 41-byte file) to a commit; HEAD is a pointer to "the branch you are currently on" (or directly to a commit in detached HEAD state).',
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
              text: 'Almost every Git command is really just "copy content between these three trees, in this direction". `git add` is working-dir → index. `git commit` is index → HEAD. `git checkout -- file` is HEAD → working-dir. `git reset` moves HEAD (and optionally the index/working-dir) backward.',
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
            '`git stash` shelves uncommitted changes so you can switch context (e.g., to fix an urgent bug) and restore them later with `git stash pop`.',
            'A tag is a named pointer to one specific commit — unlike a branch, it never moves forward.',
            'Annotated tags (`git tag -a`) store metadata (author, date, message, optional GPG signature); lightweight tags are just a name.',
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
.env

# Stashing mid-task
git stash                     # shelve all uncommitted changes
git switch main
git switch -c hotfix/urgent-bug
# ... fix and commit the urgent bug ...
git switch feature/login
git stash pop                 # bring your shelved changes back`,
            },
            {
              type: 'code',
              language: 'bash',
              title: 'tagging a release',
              code: `git tag v1.0.0                       # lightweight tag on the current commit
git tag -a v1.0.0 -m "First release" # annotated tag, with metadata
git push origin v1.0.0               # tags aren't pushed by default — must push explicitly
git push origin --tags               # push all tags at once`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A file already tracked by Git before it was added to `.gitignore` keeps being tracked — the ignore rule only stops **untracked** files from being picked up. Untrack it explicitly with `git rm --cached <file>` (keeps the file on disk, just stops tracking it).',
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
              code: `git checkout -b feature/login          # create + switch to a new branch
git switch feature/login               # modern equivalent of checkout for switching

git merge feature/login                # merge feature/login into the current branch
git merge --no-ff feature/login        # always create a merge commit

git rebase main                        # replay current branch's commits onto tip of main
git rebase -i HEAD~3                   # interactively edit/squash/reorder the last 3 commits

# After a rebase that was already pushed, and you're SURE no one else based work on it:
git push --force-with-lease            # safer than --force: fails if the remote moved unexpectedly`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Prefer `--force-with-lease` over a bare `--force` when you must force-push after a rebase — it refuses to overwrite the remote branch if it has commits you have not seen yet, which is exactly the situation that indicates someone else pushed in the meantime.',
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
                ['`git restore <file>` / `checkout -- <file>`', 'Discards uncommitted working-dir changes to one file', 'N/A — does not touch commit history'],
              ],
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
              code: `git reflog                    # shows every place HEAD has pointed, including "deleted" commits
git checkout <sha-from-reflog>  # inspect it in detached HEAD
git branch recovered-work <sha> # turn it back into a real branch`,
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
              code: `git checkout main
git pull
git checkout -b feature/add-search
# ... make commits ...
git push -u origin feature/add-search
# open a pull request; address review comments with more commits
# once approved: squash-merge (or per team convention) via the hosting platform`,
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
            'Refs are just files: `.git/refs/heads/main` contains a commit hash; `.git/HEAD` contains a reference to the current branch.',
            'Loose objects (one file per object) get compacted into packfiles for efficiency — Git delta-compresses similar objects against each other.',
            'The plumbing commands (`git hash-object`, `git cat-file`, `git rev-parse`) expose this model directly and are what the porcelain commands (`add`, `commit`, `log`) are built on top of.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  HEAD[".git/HEAD"] -->|"ref: refs/heads/main"| MainRef[".git/refs/heads/main"]\n  MainRef -->|commit hash| Commit["commit object\\ntree + parent + message"]\n  Commit --> Tree["tree object\\n(a directory listing)"]\n  Tree --> Blob1["blob object\\n(App.jsx content)"]\n  Tree --> Blob2["blob object\\n(index.js content)"]\n  Tree --> Subtree["tree object\\n(src/ subdirectory)"]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'poking at the object database directly',
              code: `git cat-file -p HEAD              # inspect the current commit object: tree, parent, message
git cat-file -p HEAD^{tree}        # inspect the tree it points to — a directory listing
git rev-parse HEAD                 # the raw commit hash HEAD currently resolves to
git count-objects -v               # how many loose objects vs. objects packed in packfiles
git gc                             # compact loose objects into packfiles, prune unreachable ones`,
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
#   pick e4f5g6h WIP
#   pick h7i8j9k fix typo
#   pick k1l2m3n Actually fix the bug
#
# change to:
#   pick   a1b2c3d Add search input
#   squash e4f5g6h WIP
#   squash h7i8j9k fix typo
#   squash k1l2m3n Actually fix the bug
# → save, write one clean combined commit message, done

git commit --amend -m "Better message"   # rewrite the last commit's message
git commit --amend --no-edit             # add staged changes to the last commit, keep its message`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'If a rebase gets confusing partway through, `git rebase --abort` puts everything back exactly as it was before you started — there is no penalty for backing out and trying again.',
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
            'Because `.git/hooks/` is not tracked by Git itself, teams typically use a tool like Husky (JS) or `pre-commit` (Python) to version and share hook configuration through the repo.',
            'Common uses: run linters/formatters before commit, run the test suite before push, enforce a commit-message format.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'bash',
              title: 'a minimal pre-commit hook',
              code: `# .git/hooks/pre-commit  (must be executable: chmod +x)
#!/bin/sh
npm run lint || {
  echo "Lint failed — commit aborted."
  exit 1
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  A[git commit] --> B{pre-commit hook}\n  B -- exit 0 --> C[commit-msg hook]\n  B -- exit non-zero --> X[commit aborted]\n  C -- exit 0 --> D[commit created]\n  C -- exit non-zero --> X',
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
git submodule update --init --recursive   # actually fetch the submodule's content`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A submodule reference is a specific pinned commit, not a branch — pulling the parent repo does not automatically update the submodule\'s content. This is a common source of "it works on my machine" when one developer updated the submodule and others forgot to run `git submodule update`.',
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
git bisect run npm test`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Good["known-good\\ncommit"] -.-> C1 -.-> C2 -.-> C3["? bisect checks\\nout the midpoint"] -.-> C4 -.-> C5 -.-> Bad["known-bad\\n(current) commit"]',
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
                'It moves the current branch pointer to the given commit and overwrites both the index and the working directory to match — meaning any uncommitted changes, and any commits after that point that are not referenced elsewhere, are discarded. It is dangerous because there is no confirmation prompt and uncommitted work is lost permanently (commits can sometimes be recovered via `git reflog`, but working-directory-only changes cannot).',
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
                'Rotating/revoking the leaked credential immediately is the first and most important step — once a secret has been pushed, assume it is compromised regardless of what you do to history afterward, since it may already be cached, forked, or scraped. After that, remove it from history with a tool built for history rewriting (`git filter-repo`, or BFG Repo-Cleaner) rather than a single revert commit (which leaves the secret fully readable in the older commit), force-push the cleaned history, and have every collaborator re-clone rather than pull, since their local history has now diverged from the rewritten remote.',
            },
            {
              question: 'What is a detached HEAD state, and how do you get out of it safely?',
              answer:
                'Normally HEAD points at a branch, which in turn points at a commit. If you check out a specific commit hash (or a tag) directly, HEAD points straight at that commit instead of at a branch — you are in "detached HEAD" state. Any new commits you make there are not attached to any branch, so they can become unreachable and eventually garbage-collected once you switch away, unless you create a branch pointing at them first (`git branch new-branch-name` while still on that commit, or `git switch -c new-branch-name`).',
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
                'A submodule reference in the parent repo is a pointer to one specific pinned commit of the submodule, not to a branch — so pulling the parent repo\'s changes does not automatically update the submodule\'s checked-out content, and a plain `git clone` of the parent repo leaves submodule directories empty until explicitly initialized. This causes "it works on my machine" bugs when one developer bumps the submodule pointer and others simply run `git pull` without also running `git submodule update --init --recursive`. Teams avoid this with a post-checkout/post-merge hook that runs the submodule update automatically, or by preferring a monorepo when the coupling between projects is tight enough that this friction outweighs the benefit of separate repos.',
            },
          ],
        },
      ],
    },
  ],
}
