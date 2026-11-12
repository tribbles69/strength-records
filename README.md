# Strength Records Registry

A video-verified strength records registry, run under the Hunchback Hercules brand. Strength only, every record backed by video, the same rules for everyone.

It is a plain static site on GitHub Pages: HTML, CSS and one script. There is no framework and no build step. Each approved record is one JSON file in `data/records/`.

- Design and rules: [docs/design.md](docs/design.md)
- Art log and costs: [docs/assets.md](docs/assets.md)

## Approving a submission from your phone

1. **A submission arrives by email** from Formspree. It lists every field the lifter filled in, and one line called **`approval_block`** that starts with `{` and ends with `}`. That line holds the public fields only. The lifter's email address is a separate line and is not inside it.
2. **Watch the video** against the standard for that lift (Rules page). Check:
   - one unedited take, every plate shown, the whole lift in frame
   - the plates add up to the weight claimed
   - the lift meets the standard, with none of the listed fails
   - for a bodyweight class: the scale check and the weigh-in are on video
   - it beats the standing record in its table by at least 0.5 kg, or the table is empty
3. **Approve it.** In the GitHub app: open this repository, tap **Actions**, choose **Approve submission**, tap **Run workflow**. Long-press and copy the whole `approval_block` line from the email, paste it into the box, and run it.
   - **Paste only that line. Never paste the email address.** This repository is public, and so is what you type into an action. The script refuses anything that looks like an email address, but it can only refuse it after you have typed it.
4. **Wait about two minutes.** The action writes the record file, checks every data file, commits to `main`, and GitHub Pages republishes the site. A green tick means it is live. A red cross means nothing was published: open the run to read the reason (for example "does not beat the standing record").
5. **Reply to the lifter** if they left an email, then delete the submission from Formspree and from your inbox.

To **decline**, reply with the one-line reason and delete the submission. Nothing is published.

If the lift is good but does not beat the record and you still want it listed, tick **force** when you run the action.

### Disputes, missing videos and removals

Use the **Change record status** action. It asks for the record id (the part after `?id=` in the record's page address), the new status and a short reason. The reason is shown on the site, so keep names and email addresses out of it.

| Status | When | What the site shows |
|---|---|---|
| `under-review` | A dispute has come in | "Under review"; the record keeps its place |
| `evidence-unavailable` | The video is private or deleted | A warning; remove it after 30 days |
| `standing` | A dispute was not upheld, or the video is back | Back to normal |
| `removed` | A dispute was upheld, or the evidence rules were broken | Leaves the tables. A history line stays with the date, weight and reason. The handle, videos and adaptive description are stripped. |
| `delete` | The lifter asked for it to be taken down | The file is deleted. Nothing is left on the site. |

`delete` takes the record off the site, but old versions stay in the repository's history. If a lifter asks for those to go as well, that needs a history rewrite on a computer; ask for help with it.

## One-time setup before launch

1. **Formspree.** Create a free account at formspree.io and make two forms, "Record submission" and "Record dispute", both sending to your email. Copy each form's id (the part after `formspree.io/f/`) into [assets/js/config.js](assets/js/config.js). In each form's settings, restrict it to this site's domain. Until the ids are filled in, the forms say "not connected yet" and cannot be sent.
2. **Contact details.** In the same file, set `contactEmail` (a dedicated address, not your personal one) and `secondModerator` (who rules on disputes about your own lifts).
3. **GitHub Pages.** Repository Settings, Pages: deploy from the `main` branch, root folder.
4. **Actions.** Repository Settings, Actions, General: set workflow permissions to "Read and write" so the approval action can commit.
5. **Delete the example records.** Remove every file in `data/records/` whose name starts with `example-`, then run `node scripts/validate.mjs --fix-index` and commit. Or run the **Change record status** action with `delete` on each.
6. **Confirm what the privacy page says about Formspree** (a US company, submissions kept until deleted) against Formspree's own privacy policy.

## Working on the site

Needs Node 20 or newer for the scripts. Nothing to install.

```bash
node scripts/serve.mjs
```

Then open http://localhost:4173.

```bash
node scripts/validate.mjs
```

Checks every data file. Add `--fix-index` to rebuild `data/index.json` after editing records by hand.

```bash
node scripts/test.mjs
```

Runs the tests for the approval script and the validator.

```bash
node scripts/approve.mjs --dry-run '{"handle":"ironmoth","lift":"squat","weight":"200","weight_unit":"kg","division":"open","group":"all","date":"2026-11-03","video":"https://youtu.be/abcdefghijk"}'
```

Shows the record a submission would become without writing anything. Drop `--dry-run` to write it.

### Where things are

| Path | What it is |
|---|---|
| `index.html`, `records.html`, `record.html`, `rules.html`, `submit.html`, `privacy.html` | The six pages |
| `assets/css/site.css`, `assets/js/site.js` | Styles and the one script |
| `assets/js/config.js` | Form ids and contact details |
| `data/lifts.json` | The lifts and their standards. The Rules page is drawn from this. |
| `data/divisions.json` | Divisions, tables, bodyweight classes, adaptive categories |
| `data/records/*.json` | One file per approved entry |
| `data/index.json` | All records in one file, rebuilt by the scripts. Do not edit by hand. |
| `scripts/approve.mjs`, `scripts/status.mjs`, `scripts/validate.mjs` | Approval, status changes, validation |
| `.github/workflows/` | The actions that run those scripts |

### Adding a lift

Add an entry to `data/lifts.json` in the same shape as the others. It appears on the Rules page, the Records filters and the Submit form without any other change.
