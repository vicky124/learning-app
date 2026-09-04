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
          id: 'model',
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
          id: 'branching-merging',
          title: 'Branching, Merging & Rebasing',
          summary:
            'A branch is cheap (just a pointer), which is what makes Git branching workflows practical — but merge vs rebase is the distinction that trips up almost everyone at some point.',
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
          id: 'undoing',
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
          id: 'collaboration',
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
          ],
        },
      ],
    },
  ],
}
