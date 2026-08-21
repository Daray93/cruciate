// Placeholder legal text. Have a lawyer review before this is relied on for
// real users, especially given it covers health data under GDPR.
export const PRIVACY_POLICY_VERSION = '2026-08-21'

export const PRIVACY_POLICY_TEXT = `
Last updated: 21 August 2026.

What this covers

This is the privacy policy for Cruciate, a personal ACL prehab and rehab tracking app. It explains what data the app collects, why, and what your rights are.

What we collect

- Your email address, from Google sign-in or the magic-link sign-in flow.
- Your first name and age.
- Your track (prehab or rehab), surgery timeframe, surgery date, and injury date.
- Exercise logs, range-of-motion readings, and session dates you enter.
- Milestone check-in answers, and which phase they moved you into.
- Red-flag symptom reports you log.
- Load and run clearance toggles.
- A record that you accepted the in-app waiver, and which version.

Why we collect it

Every field above is used to run the app: name for greeting you, age to confirm you meet the minimum age, track and surgery/injury dates to work out which phase you're in and display your recovery timeline, and the rest to power your own exercise and progress tracking. We don't collect anything we don't use.

Legal basis

We process this data on the basis of your consent, given when you create an account and complete onboarding. You can withdraw consent at any time by deleting your account.

Who can see it

Only you. Every table is protected by row-level security, so your data is only readable by your own account, not by other users.

Where it's stored

Your data is stored with Supabase (database and authentication) and the app is hosted on Vercel. If you sign in with Google, Google processes your sign-in on our behalf. We don't use any advertising or analytics trackers.

How long we keep it

We keep your data until you ask us to delete it. There's no self-serve delete button yet, contact us using the details below and we'll remove your account and data.

Age

Cruciate is for people 16 and older, in line with Ireland's digital age of consent under GDPR.

Your rights

Under GDPR you have the right to access, correct, delete, or export your data, and to object to how it's processed. You can also lodge a complaint with the Irish Data Protection Commission if you think we've handled your data wrongly.

Changes

If this policy changes, we'll update the date at the top.

Contact

[contact email to be added]
`.trim()
