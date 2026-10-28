# Rollout Planner

See the spacing in an early network rollout and reuse that schedule as a clearly labelled planning exercise.

**[Open the utility](https://sreenivas-sadhu-prabhakara.github.io/rfc-0004-rollout-planner/)** · [Source repository](https://github.com/Sreenivas-Sadhu-Prabhakara/rfc-0004-rollout-planner) · [RFC 4](https://www.rfc-editor.org/rfc/rfc4.txt) · [Official metadata](https://www.rfc-editor.org/info/rfc4) · [Errata](https://www.rfc-editor.org/errata/rfc4)

## Who it helps

Students, small project teams and organizers learning staged rollout planning. Inspect seven original planned milestone dates alongside a user-chosen first milestone date, retain their calendar-day offsets, and download a CSV or all-day calendar for an original project exercise.

## Run and test

Serve this directory with `python3 -m http.server 8000`, then open http://localhost:8000.
Run `node --test` or `npm test` with Node 22 or newer. No install or build step is needed.
Behavioral tests cover normal outcomes, invalid input, boundary cases and exports.

All processing uses local browser modules with relative URLs. No external fonts,
scripts, runtime dependencies, tracking, uploads or automatic persistence.
The loaded tab continues to calculate and download files offline. Offline reload
is not promised: use a local server to work without a network connection.
Reloading the page resets your inputs; download anything you want to keep.

## Evidence and interpretation

Basis: RFC 4, dated items 2–8 (August 1 through December 15, 1969); items 2e and 4b (coordination); items 9–14 (undated follow-on work).

Interpret source dates as month/day/year in 1969. Preserve offsets of 0, 31, 45, 61, 75, 106 and 136 days from August 1. These are milestones, not task durations or proven dependencies. UTC date arithmetic avoids DST shifts; validate impossible dates and year overflow. Calendar output uses exclusive next-day DTEND, escaped text and RFC-style CRLF serialization as a modern export convenience. It does not add missing dates or infer completion.

Original dates are interpreted as month/day/year in 1969. Offsets are 0, 31, 45, 61, 75, 106 and 136 calendar days. No dependencies, working-day adjustments or completion claims are inferred. Items 9–14 (terminal access, file movement and debugging) have no dates and are not assigned invented ones. The calendar file is a modern export convenience.

Official status: UNKNOWN · Legacy stream. UNKNOWN is not the formal HISTORIC classification. These educational adaptations are not current Internet standards. No formal successor or updating RFC is listed in the retrieved official metadata. The archived text header says Informational; we retain UNKNOWN from the official catalog.

The retrieved official errata search showed no matching records. That does not resolve gaps or typographical errors in the source. Item 2f refers to an absent item 16; it is not treated as a reference to RFC 16. Item 14b repeats the label 14b3. All six text pages, including three ASCII network configurations, were reviewed. No missing protocol detail is filled in.

Source format: plain text. Full assigned source read and SHA-256 checked before planning.
Source SHA-256: `fb9d695bf83d189a747027bc26e8ec9fc801ae47d7c4f9df4b565dde99fc8d22`.
Review timestamp: 2026-10-28T23:33:30.595053+00:00.

## Try an example

Select the original dates and find the gap between installation of the communication gear and the host–IMP interface target. Then set the first milestone to February 1, 2028. Do leap days change the number of elapsed days?

Expected: The first gap stays 31 days. Starting on 2028-02-01 places the next milestone on 2028-03-03 and the last on 2028-06-16; the final offset stays 136 days.

## Publication and contribution

The daily runner tests and publishes this standalone directory to its own public
repository and GitHub Pages site. Canonical and source links use the configured
account. Those links become live after runner publication; this build does not
claim that publication has occurred. Pages serves `main` at `/`; `.nojekyll`
disables Jekyll processing.

`ci/test.yml` is an inactive Actions template. The runner enforces local tests.
The current CLI credential cannot upload `.github/workflows` files; the template
remains under `ci/`.

See [PROMOTION.md](PROMOTION.md) for prepared sharing copy and a teaching exercise.
No outreach is performed. Please report issues with the input, expected behavior,
and supporting RFC section. Original code is MIT licensed. Referenced RFCs retain
their own notices. Independent community project, unaffiliated with the IETF or RFC Editor.

Calendar serialization is a modern convenience informed by [RFC 5545, sections 3.1, 3.3.11 and 3.6.1](https://www.rfc-editor.org/rfc/rfc5545). It is not part of RFC 4. Exports have CRLF line endings, UTF-8 line folding, stable per-project/date/item IDs and exclusive next-day ends. CSV cells escape quotes and neutralize formula prefixes.
