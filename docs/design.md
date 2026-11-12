# Strength Records Registry: design (v1)

Status: **approved 12 Nov 2026.** Decisions are recorded in [section 11](#11-decisions-12-nov-2026).
Anything marked **[Q1]**, **[Q2]** … points to an open question in [section 10](#10-open-questions-for-aaron).

## 1. What this is

A public registry of strength records, run under the Hunchback Hercules brand.

- Strength only. No novelty categories.
- Every record is backed by a public video anyone can watch.
- The same written rules are applied to everyone, including Aaron.
- Categories are never sold, and nobody pays to submit or to hold a record.

What it is **not**: a federation. There are no referees in the room, no calibrated plates and no drug testing. The honest label for a record here is **"video-verified"**, and the site says so on the rules page. That honesty is the point: the registry claims exactly what the video shows and nothing more.

Version 1 is the registry only: records, rules, a submission form and a privacy page.

## 2. General rules (apply to every lift)

1. **One rep.** v1 records are single-rep maximums (holds are a fixed time, see 3.8 and 3.9). No rep records yet.
2. **Units.** Kilograms are the stored unit. Pounds are accepted on the form and converted (lb ÷ 2.2046), rounded **down** to the nearest 0.5 kg. The site shows both.
3. **What counts as the weight.** Bar + plates + collars, as declared by the lifter and visible on video. The bar's weight must be stated (standard 20 kg bar assumed only if it plainly is one; specialty bars need their weight stated and, where possible, shown on the bar's label or on a scale).
4. **Breaking a record.** A new record must beat the standing one by at least 0.5 kg. A tie does not take the record: the earlier lift keeps it.
5. **Standard kit, allowed on every lift:** belt, chalk, wrist wraps, knee sleeves, any footwear or none.
6. **Never allowed:** squat/deadlift suits, bench shirts, knee wraps, elbow wraps or sleeves on pressing lifts, briefs, spotters touching the bar or lifter before the lift is complete, anything attached to the bar that helps (bands, chains, reverse bands).
7. **Straps** are a per-lift rule, stated for each lift below. Where straps are allowed they must be ordinary lifting straps (loop, lasso or figure-8).
8. **Liquid chalk and grip aids:** chalk and liquid chalk are fine. Tacky and other adhesives are not.
9. **The moderator's call.** If a lift technically ticks every box but something on the video is doubtful (plates that don't behave like their marked weight, a cut that might be hidden, a lockout that is borderline), the moderator can ask for a re-film or decline it. Every decline gets a one-line reason sent to the submitter if they left an email. The same standard applies to everyone.

### How standards apply to Adaptive / para lifters

The standards below describe the lift for a lifter with typical anatomy. In the Adaptive division a standard is applied **as far as the lifter's body allows**, and the adaptation is stated publicly on the record. Examples: lockout to the lifter's own end range where a joint or the spine does not fully straighten; a seated or strapped-in setup; a prosthesis, hook or one-arm variation; a different start position. The rule is: *declare it, show it, and it is judged against what you declared.* Equipment that is part of the adaptation (prosthesis, wheelchair, bench straps, a grip hook for a hand that cannot close) is allowed and is listed on the record. See section 4.1.

## 3. The starter lifts

Each lift has an id (used in data files and URLs). Launch list: ten lifts. The big three are here because people expect them; the rest are lifts federations cover badly or not at all.

### 3.1 Squat (`squat`)

- **Equipment:** barbell from a rack or stands. Standard kit. No straps (not relevant).
- **Start:** bar across the back, lifter standing upright with knees locked, feet still.
- **Range of motion:** descend until the hip crease is clearly **below the top of the knee**, then stand up.
- **Finish:** standing upright, knees and hips locked, in control, before re-racking.
- **Fails:** depth not reached or not visible; any downward movement of the bar once the ascent has started; a foot step during the lift; a spotter touching the bar before the finish; safety bars or straps touching the bar on the way up.
- **Camera:** side-on or front three-quarter at about hip height, so depth can be judged. A straight front view is not enough.

### 3.2 Bench press (`bench`)

- **Equipment:** flat bench, barbell. Standard kit. A lift-off from a helper is allowed; the helper must be clear of the bar before the descent starts.
- **Start:** bar held at arm's length, elbows locked.
- **Range of motion:** lower the bar to the chest or upper abdomen, **visibly pause it motionless**, then press.
- **Finish:** elbows locked, bar held still, before re-racking.
- **Fails:** no visible pause (touch-and-go or a bounce); the bar sinking into the chest after the pause and being heaved; any downward movement during the press; hips leaving the bench; feet leaving the floor (or the declared foot position moving); a spotter touching the bar before the finish; uneven lockout that never evens out.
- **Camera:** side-on or three-quarter, showing the bar, the chest and the hips on the bench.

### 3.3 Deadlift (`deadlift`)

- **Equipment:** standard barbell (stiff or deadlift bar; state which), plates of standard diameter (450 mm) so the bar starts about 225 mm off the floor. Standard kit. Conventional or sumo. **No straps**; hook grip and mixed grip are fine.
- **Start:** bar motionless on the floor.
- **Range of motion:** one continuous pull from the floor to standing.
- **Finish:** knees locked, hips locked, shoulders back (not rounded forward), bar under control. Lower it with both hands on the bar; do not drop it from the top.
- **Fails:** hitching (resting the bar on the thighs and re-bending the knees to jerk it up); any downward movement before lockout; lockout not reached; dropping the bar from the top; smaller-diameter plates or the bar raised on blocks/mats (that is a rack pull or block pull).
- **Camera:** side-on or three-quarter, full body and both ends of the bar where possible.

### 3.4 Trap bar deadlift (`trap-bar-deadlift`)

- **Equipment:** any hex/trap bar or open-back bar. The bar's empty weight must be stated (they vary from about 20 to 35 kg). Standard-diameter plates. Standard kit. **Straps allowed.**
- **Handles:** **low handles only** for this record, meaning the handles are level with the sleeves (about 225 mm off the floor with standard plates). High handles are a different lift and are not in the launch list **[Q6]**.
- **Start:** bar motionless on the floor.
- **Finish:** standing upright, knees and hips locked, in control; lowered under control.
- **Fails:** same as the deadlift, except straps are fine and there is no thigh to hitch on, so a bounce or a re-bend to jerk the bar up counts as the hitch.
- **Camera:** side-on or three-quarter. Show which handles are being used before the pull.

### 3.5 Rack pull, 46 cm / 18 in (`rack-pull-18`)

- **Equipment:** barbell resting on rack pins, safeties or blocks. Standard kit. **Straps allowed.**
- **Bar height:** the **centre of the bar is no higher than 46 cm (18 inches) above the surface the lifter stands on.** This is fixed so records are comparable; "below the knee" depends on the lifter. A tape measure against the bar must be shown on the video before the pull. Standing on a platform to shorten the pull is fine only if the 46 cm is measured from that platform.
- **Start:** bar motionless on the pins.
- **Finish:** knees and hips locked, shoulders back, in control. Return the bar to the pins under control.
- **Fails:** bar set higher than 46 cm or height not shown; hitching; downward movement before lockout; dropping from the top. Note that bar bend means the plates leave last: the lift starts when the bar leaves the pins, and that is fine.
- **Camera:** side-on, showing the pins and the full lifter.

### 3.6 Barbell shrug (`shrug`)

The hardest lift here to judge, so the standard is deliberately strict.

- **Equipment:** barbell, taken from a rack or from the floor. Standard kit. **Straps allowed.**
- **Start:** standing upright, knees locked, arms straight, shoulders fully relaxed down, bar motionless.
- **Range of motion:** raise the shoulders straight up so the bar **clearly and visibly rises**, and **hold the top for a visible one-second pause.**
- **Finish:** lower under control to the start position.
- **Fails:** any knee bend or hip drive (a "power shrug"); bending the elbows; rising onto the toes; leaning back to swing the bar; no visible pause at the top; movement so small it cannot be seen clearly at normal speed.
- **Camera:** front-on or front three-quarter, from knees to head, close enough to see the shoulders move.

### 3.7 Strict overhead press (`strict-press`)

- **Equipment:** barbell, taken from a rack. Standard kit. No straps.
- **Start:** bar on the upper chest/shoulders, standing upright, knees locked, motionless.
- **Range of motion:** press overhead using the arms and shoulders only.
- **Finish:** elbows locked, bar overhead and still, body upright.
- **Fails:** any knee bend or leg drive; feet moving; excessive lean-back (the torso should not turn it into a standing incline press); downward movement during the press; no lockout.
- **Camera:** side-on or three-quarter, full body, so knees and lean-back can be seen.

### 3.8 Rack hold, 10 seconds (`rack-hold`)

A supported-strength hold: how much can you stand up with and hold.

- **Equipment:** barbell on rack pins set just below lockout height. Standard kit. **Straps allowed.**
- **Start:** lift the bar clear of the pins and stand fully upright.
- **The hold:** **10 seconds** with knees and hips locked, the bar clearly off the pins and not resting on the thighs or belt. The 10 seconds start when the lifter is upright and still.
- **Timing:** judged from the video's own timeline. A visible clock or someone counting helps but is not required.
- **Finish:** return the bar to the pins under control.
- **Fails:** under 10 seconds; the bar touching the pins during the hold; knees unlocking; the bar supported on the thighs; dropping it.

### 3.9 Double-overhand hold, 10 seconds (`grip-hold`)

A grip record: the same hold as 3.8 with nothing helping the hands.

- **Equipment:** standard barbell (28 to 29 mm shaft; axles and thick bars are a different lift). Chalk only. **No straps, no hook grip, no mixed grip:** both palms face the lifter, thumbs around the bar.
- **Start, hold, timing, finish:** as 3.8. The bar can be taken from pins or deadlifted from the floor.
- **Fails:** as 3.8, plus the bar rolling out of the hands, re-gripping during the hold, hooking the thumb under the fingers, or bracing the bar against the body.
- **Camera:** front-on, close enough to see both hands.

### 3.10 Viking deadlift (`viking-deadlift`): **standard not written yet [Q1]**

I have not written a standard for this because I'm not certain which lift you mean, and I would rather ask than invent one. The name is used for at least two different things (a deadlift on a plate-loaded lever apparatus like a Viking press frame, and various local/strongman variations). Lever lifts also have a specific problem: the weight on the pins is not the weight in the hands, and it changes with the machine's geometry, so records on different machines can't be compared without fixing the apparatus. Tell me what the lift is and I'll write the standard to the same template before building.

## 4. Divisions

Three divisions at launch. A single lift can be entered in more than one if it qualifies (for example an adaptive lifter's deadlift can stand in Adaptive and in Open).

### 4.1 Adaptive / para

- **Classification is self-declared.** The lifter picks one category and writes a short description. There is no medical proof and no classifier at launch.
- **Categories:**
  - Upper limb (limb difference, amputation, impairment of an arm or hand)
  - Lower limb (limb difference, amputation, impairment of a leg or foot)
  - Spinal / trunk (scoliosis, kyphosis, fusion, spinal cord injury)
  - Seated / wheelchair
  - Short stature
  - Neurological (cerebral palsy, MS, stroke, and similar)
  - Visual impairment
  - Other (described by the lifter)
- **The description** is one or two sentences in the lifter's own words, covering what is relevant to the lift and any adaptation used, for example: *"Left below-elbow amputee, lifting with a hook attachment"* or *"Fused T4 to L2; lockout is to my own end range."* It is **published on the record**, because it is what makes the record meaningful and lets people compare like with like. The lifter decides how much to say. The form says clearly that it will be public.
- **Records are kept per lift, per category.** Bodyweight is shown on the record if given, but adaptive records are not split by bodyweight class at launch: the tables would be nearly empty **[Q4]**.
- **Good faith.** A self-declared category is taken on trust. If a declaration is credibly disputed (section 8), the moderator can ask the lifter privately for clarification. Nobody is asked to publish medical documents.

### 4.2 Bodyweight classes

- **Classes (kg), upper limit inclusive:** 60, 70, 80, 90, 100, 110, 125, 125+.
  Few and wide on purpose, so tables fill up. Whether records are also split Women / Open is **[Q2]**.
- **Proving bodyweight.** One of:
  1. **Same take (preferred):** the lifter steps on a scale in the same unedited video as the lift, with the reading legible on camera. Before stepping on, show the scale reading zero and then reading a marked plate (for example a 20 kg plate reading 20) so the scale itself is checked.
  2. **Same day:** a separate unedited video, linked on the form, filmed the same day, showing the same scale check and the weigh-in. The record is labelled "weigh-in: same day" rather than "same take", so readers can see which it was.
- Weigh in wearing what you like; no allowance is given for clothing. The class is decided by the number on the scale.
- No weigh-in evidence means the lift can still go in **Open**, just not in a bodyweight class.

### 4.3 Open

- Anyone, any bodyweight, no weigh-in needed. The heaviest verified lift for each lift is the Open record.
- Bodyweight may be given and is shown as "self-reported" unless a weigh-in was provided.

## 5. Evidence rules

A submission is judged only on its video. The rules:

1. **One unedited take.** A single continuous shot from showing the weight to the end of the lift. No cuts, no splicing, no speed changes, no filters, no cropping that removes part of the lifter or bar. Music laid over the top is discouraged because original sound helps (plates rattle, bars hit pins).
2. **The weight shown on camera.** Before the lift, in the same take, the camera goes to **both ends of the bar** and shows every plate, with markings readable, plus the collars and the bar. For a rack pull, the tape measure to the bar. For a bodyweight class, the scale (section 4.2).
3. **The whole lift in frame.** The lifter's whole body and the bar stay in frame from start position to finish position, at an angle the standard for that lift can be judged from (given per lift in section 3).
4. **Publicly viewable link.** The video is hosted by the lifter, not by the registry. **YouTube is preferred** (public or unlisted) because it embeds reliably. Instagram links are accepted but may show as a link instead of an embedded player **[Q7]**.
5. **The lifter is the person submitting,** or they have that person's permission. Lifters must be 18 or over **[Q5]**.
6. **The video must stay up.** If a record's video is deleted or made private, the record is marked "evidence unavailable". If it is not restored within 30 days the record is removed from the tables (section 8).
7. **Plates.** Calibrated plates are not required. Plates must be commercially made and marked. Home-made, unmarked or obviously altered plates are not accepted. Bumpers and iron are both fine.

The registry does not keep copies of videos in v1 **[Q8]**.

## 6. Submissions (no accounts)

### 6.1 The form

A plain HTML form on the site's Submit page. No login, no account.

| Field | Required | Published | Notes |
|---|---|---|---|
| Handle | yes | yes | The name shown on the record. An Instagram/Reddit handle or any name the lifter wants. |
| Lift | yes | yes | Chosen from the list in section 3. |
| Weight | yes | yes | Number plus kg/lb. |
| Bodyweight | for bodyweight classes | yes | Number plus kg/lb. Optional in Open and Adaptive. |
| Division | yes | yes | Adaptive / Bodyweight class / Open. Choosing Adaptive reveals the category list and description box (both published). |
| Date of lift | yes | yes | |
| Video link | yes | yes | Plus an optional second link for a same-day weigh-in. |
| Email | **no** | **never** | Only so Aaron can reply (approved, declined and why, or a question). |

Also on the form: a tick-box confirming "this is me (or I have the lifter's permission), I'm 18 or over, and I understand everything above except my email will be public", and a hidden honeypot field to catch bots.

### 6.2 Recommended form service: Formspree

**Recommendation: Formspree (free plan).** The form stays a normal HTML form on our own page, styled to match the site, and posts straight to Formspree. No script, no iframe, no third-party branding on the page.

What I checked on Formspree's plans page on 12 Nov 2026:

- Free plan: 50 submissions a month, unlimited forms, basic machine-learning spam filtering, optional reCAPTCHA, and the form can be restricted to our domain.
- Each submission is emailed to Aaron and also **stored in Aaron's Formspree account until he deletes it**. The free dashboard only *shows* the last 30 days.

What data it keeps and where:

- **What:** every field in the table above, including the email if given, plus the technical data any web request carries (IP address, browser, time). This is the only place a submitter's email ever exists apart from Aaron's inbox.
- **Where:** on Formspree's servers. Formspree is a US company; their plans page does not state the hosting region, so the privacy page should say "held by Formspree (USA)" until Aaron confirms otherwise in their privacy policy.
- **How long:** until Aaron deletes it. Proposed routine: delete each submission from Formspree and from the inbox once it is approved or declined and any conversation is finished, and at most 90 days after it arrived.

Alternative considered: **Tally** (Belgian company, form data stored in the EU, responses can be deleted). Better on data location, but the form is hosted by Tally or embedded in an iframe, so it looks and behaves less like part of the site. Worth switching to if EU storage matters more than the look, or if 50 a month becomes a limit **[Q3]**.

Not suitable: GitHub issue forms (the submitter needs a GitHub account) and anything needing a server of our own.

## 7. Approval flow and data

### 7.1 From submission to published record

1. A lifter submits the form. Formspree emails Aaron. The email is laid out so the public fields form one block of text and the email address sits apart from it.
2. Aaron watches the video against the standard for that lift (a checklist per lift goes in the README).
3. **Approve (from a phone):** in the GitHub mobile app or mobile site, Aaron runs the **"Approve submission"** action and pastes the block of public fields. The action:
   - runs the approval script, which turns the fields into a record file,
   - runs the validator on every data file,
   - refuses to continue if anything looks like an email address,
   - commits the new file to `main`. GitHub Pages republishes the site within a minute or two.
4. **Decline:** Aaron replies to the submitter with the one-line reason (if they left an email) and deletes the submission. Declined submissions are never published.

The action can only be run by someone with write access to the repo, which is Aaron. Anyone can read the repo, so nothing private ever goes into it: the approval script only accepts the public fields.

### 7.2 Data files

- **One JSON file per approved entry:** `data/records/<id>.json`. The id is readable and stable, e.g. `2026-11-03-trap-bar-deadlift-ironmoth`.
- **`data/lifts.json`** and **`data/divisions.json`:** the lift list (id, name, short standard) and the divisions, classes and adaptive categories. The site and the validator both read these, so the rules live in one place.
- **`data/index.json`:** a list of all records, rebuilt by the approval script whenever a record is added or changed. A static site cannot list a folder, so the pages read this one file. The validator checks it matches the record files exactly.

Example record:

```json
{
  "id": "2026-11-03-trap-bar-deadlift-ironmoth",
  "handle": "ironmoth",
  "lift": "trap-bar-deadlift",
  "weight_kg": 302.5,
  "entered_as": { "value": 302.5, "unit": "kg" },
  "bodyweight_kg": 98.4,
  "bodyweight_proof": "same-take",
  "division": "bodyweight",
  "class": "100",
  "adaptive": null,
  "date": "2026-11-03",
  "video": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  "weighin_video": null,
  "approved": "2026-11-12",
  "status": "standing",
  "notes": "",
  "example": false
}
```

For an adaptive entry, `"division": "adaptive"` and `"adaptive": { "category": "upper-limb", "description": "…" }`.

A lift that qualifies for two divisions is stored as two files that share the same video.

### 7.3 The site

Plain HTML, CSS and one small script. No framework, no build step. Pages read `data/index.json` in the browser and draw the tables.

- **Home:** what the registry is, the newest records, links to each lift.
- **Records:** one table per lift and division, with filters (lift, division, class or category) and a search box (handle). Each row opens the record.
- **Record page:** the lift, weight, lifter, date, division, the embedded video, and that lifter's history in that lift.
- **Rules:** sections 2 to 5 and 8 of this document, in plain language.
- **Submit:** the form.
- **Privacy:** section 9.

Seed data: three or four records with `"example": true`, shown with a loud **EXAMPLE** label, no real video and made-up handles. The validator only allows a missing video on example records. They are deleted before launch.

## 8. History, disputes and removal

### 8.1 Superseded records stay

"Current record" is not stored; it is worked out from the data: the heaviest standing entry for that lift, division and class/category, earliest date winning a tie. When a heavier lift is approved, the old record needs no edit. It simply shows as **superseded**, stays on the lift's page in a "record history" list with its video, and stays on the lifter's own history. Nothing is deleted when a record is beaten.

Approved lifts that never were the record (below the current record when approved) are not accepted in v1: the registry lists records, not every lift **[Q9]**.

### 8.2 Disputing a record

- Anyone can dispute a record by using the Submit page's "Dispute a record" option (same form service, different form): which record, what is wrong, and where in the video (a timestamp). An email is optional.
- Valid grounds: the lift doesn't meet the written standard; the weight shown doesn't match the claim; the video is edited; the bodyweight or adaptive declaration is false; the lifter isn't who was claimed.
- Not valid grounds: "that looks fake" with nothing specific, or disagreement with the standard itself (that is a rules suggestion, welcome separately).
- The moderator reviews it. While under review the record shows **"under review"** and keeps its place. The lifter is contacted if they left an email and given 14 days to answer.
- **Outcomes:** *upheld as valid* (the label is removed) or *removed*.
- Disputes against Aaron's own lifts cannot be judged by Aaron **[Q10]**.

### 8.3 Removal

A record is removed when:

- a dispute is upheld against it,
- its video has been unavailable for 30 days,
- the lifter asks for it to be taken down (always honoured, no reason needed),
- it turns out to break the evidence rules.

What removal looks like:

- **Removed for cause** (dispute, evidence): the record leaves the tables, and a line stays in that lift's history: date, weight, "removed", and a one-line reason. Whether the handle stays on that line is **[Q11]**. The previous record becomes current again automatically.
- **Removed at the lifter's request:** the file is deleted outright and nothing is left on the site.
- **A caveat to be honest about:** the repo is public and Git keeps history, so a deleted file can still be found in old commits. For a lifter's removal request, the old commits can be scrubbed on request; the privacy page says this plainly instead of promising instant, total erasure.

## 9. Privacy page (draft text)

> **Privacy**
>
> This registry stores as little as it can.
>
> **What is published.** If your record is approved, this is shown publicly on the site and stored in the site's public code repository on GitHub: your handle, the lift, the weight, your bodyweight (if you gave it), your division and class, the date of the lift, your video link, and, for adaptive entries, the category you chose and the description you wrote. Nothing else.
>
> **Adaptive entries.** Your category and description say something about your health or disability. They are published only because you chose to submit them, in your own words, and you can ask for them to be changed or removed at any time.
>
> **What is never published.** Your email address. It is optional. If you give one, it is used only to reply about your submission. It is never put on the site or in the repository, never shared and never added to a mailing list.
>
> **Where your submission goes.** The form is handled by Formspree (USA). Formspree receives what you typed, plus the technical details your browser sends with any web request, such as your IP address. It forwards your submission to the moderator by email and keeps a copy in the moderator's Formspree account. Submissions are deleted from Formspree and from the moderator's inbox once they have been dealt with, and no later than 90 days after you sent them.
>
> **Your video.** It stays on the service you uploaded it to (for example YouTube or Instagram), under your control. The registry links to it and embeds it. It does not copy it. Watching an embedded video loads content from that service, which may set its own cookies.
>
> **Cookies and tracking.** This site sets no cookies and uses no analytics or advertising.
>
> **Hosting.** The site is served by GitHub Pages. GitHub logs visitors' IP addresses for security, as any web host does.
>
> **Removing or correcting your record.** Contact the moderator (details below) and it will be changed or taken down. The site updates within minutes. Because the repository's history is public, earlier versions of a removed record can remain in that history; ask and they will be removed from the history as well.
>
> **Who runs this.** Aaron, as Hunchback Hercules. Contact: *[contact method, Q12]*.

## 10. Open questions for Aaron

Each has my recommended answer. A plain "agreed" accepts all the recommendations.

| # | Question | Recommendation |
|---|---|---|
| **Q1** | **What exactly is the Viking deadlift?** Apparatus, start position, how the weight is counted. | I need your definition; I won't guess. If it's a lever apparatus, record it as "weight loaded" on a named, fixed setup. If you'd rather not hold up the build, launch with nine lifts and add it after. |
| **Q2** | **Are records split Women / Open, or one table for everyone?** Your brief doesn't mention it, but people will ask on day one. It needs one more form field than you listed. | Split, self-declared: **Women** and **Open** (anyone). With women's bodyweight classes 50, 60, 70, 80, 90, 90+. Without it the tables will hold almost no women's records. |
| **Q3** | **Form service: Formspree or Tally?** | Formspree, for a form that looks like part of the site. Switch to Tally if EU storage matters more, or if 50 submissions a month gets tight. |
| **Q4** | **Should adaptive records also be split by bodyweight class?** | No at launch (per lift, per category only, bodyweight shown). Revisit when a category has enough entries to split. |
| **Q5** | **Minimum age?** | 18+ only at launch. Publishing minors' videos and details needs parental consent and more care than v1 has. |
| **Q6** | **Trap bar: low handles only, or a high-handle record as well?** | Low only at launch. Add `trap-bar-deadlift-high` later if people ask. |
| **Q7** | **Video hosts: YouTube only, or Instagram as well?** | Accept both, prefer YouTube. Instagram embeds are less reliable, so those records may show a "watch on Instagram" button instead of a player. |
| **Q8** | **Keep a private backup copy of record videos** in case the lifter's upload disappears? | No in v1. It means storing people's videos, which changes the privacy page and needs storage. The "evidence unavailable, 30 days" rule covers it. |
| **Q9** | **Records only, or a ranked list of every verified lift?** | Records only at launch (a submission must beat the standing record, or be the first in its table). A full leaderboard multiplies the moderation work. |
| **Q10** | **Who rules on disputes about your own lifts?** | Name one trusted second person (another r/DisabledWeightlifting mod, say) who decides those, and say so on the rules page. |
| **Q11** | **When a record is removed for cause, does the handle stay in the history line?** | No. Show the date, weight and reason only. The point is an honest history, not a public shaming. |
| **Q12** | **Public contact method** for removals, corrections and questions? | An Instagram DM to @hunchback_hercules plus a dedicated email address (not your personal one). |
| **Q13** | **Straps on the deadlift?** | No straps (matches what most people mean by a deadlift record). Straps are allowed on trap bar, rack pull, shrug and rack hold. |
| **Q14** | **Time limit between lift and submission?** | None, but the lift date must be consistent with the video's upload date. Old lifts are welcome if the video meets the evidence rules. |
| **Q15** | **Site name and address?** | Working title "Strength Records Registry by Hunchback Hercules", served at `tribbles69.github.io/strength-records` until you choose a domain. |

## 11. Decisions (12 Nov 2026)

Aaron approved the design and accepted every recommendation in section 10. What that means for the build:

- **Q1:** v1 launches with **nine lifts**. The Viking deadlift is added once its standard is defined.
- **Q2:** every table is split into **Everyone** and **Women** (self-declared; stored as `group`: `all` or `women`). Women's bodyweight classes are 50, 60, 70, 80, 90, 90+. The form has this one extra field. An entry sits in one table; a lifter who qualifies for both can be entered in both.
- **Q3:** Formspree. The form id is a placeholder until Aaron creates the form (see the README).
- **Q4 to Q9, Q11, Q13, Q14:** as recommended.
- **Q10:** the rules page says disputes about the moderator's own lifts are decided by a named second person; the name is a placeholder until Aaron picks someone.
- **Q12:** Instagram DM to @hunchback_hercules, plus a dedicated email address that is a placeholder until Aaron creates one.
- **Q15:** working title and address as recommended.
