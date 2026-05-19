# KeelStack — Password & Secret Rotation Guide

## How often should I rotate?

**Modern guidance (NIST SP 800-63B, 2017+): time-based password rotation is no longer recommended for strong passwords.** It encourages weaker passwords (people just bump a number at the end) and gives a false sense of security.

Rotate **when something happens** — not on a calendar.

### Rotate immediately when
- The secret was exposed somewhere (chat log, screenshot, commit, support ticket, screen-share)
- You suspect or know there was a breach
- Someone with access leaves the team
- A device that had the secret cached is lost or stolen
- A vendor or service announces a breach affecting their side

### Rotate as a hygiene practice
- **Annually**, for high-value secrets (mailbox, AWS keys) — optional but reasonable
- **When the secret's TTL is about to expire** (e.g. our GitHub PAT was 90-day)

### Don't bother rotating
- Strong (16+ char), uniquely generated secret
- Stored only in a password manager / cloud secret store
- Never exposed
- Behind 2FA or scoped permissions

---

## KeelStack secret inventory

| # | Secret | Lives at | When to rotate |
|---|---|---|---|
| 1 | `hello@keelstack.uk` mailbox password | cPanel Email Accounts on Interserver | After exposure; annually optional |
| 2 | `SMTP_PASS` (mirrors #1) | Amplify Console env vars | Rotate in sync with #1 |
| 3 | AWS IAM access keys (`aerologue-ads-admin`) | IAM in Aerologue_Ads account | After laptop loss/leak/departure |
| 4 | GitHub PAT `amplify-keelstack` | github.com/settings/tokens (fine-grained) | At TTL expiry; after exposure |
| 5 | `VERIFY_SECRET` env var | Amplify Console env vars | Rarely — see notes |
| 6 | `ANTHROPIC_API_KEY` *(when added)* | Anthropic Console | After exposure |
| 7 | `RESEND_API_KEY` *(when added)* | Resend dashboard | After exposure |
| 8 | Stripe payment links | Stripe dashboard | Not secrets — public URLs, no rotation needed |

---

## How to rotate each

### 1 + 2. `hello@keelstack.uk` mailbox + `SMTP_PASS`

These two are the same password. Rotate together.

1. **cPanel → Email Accounts** → find `hello@keelstack.uk` → **Manage** → **Set password**
2. **Generate a strong password.** Suggested 20-char random:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | ForEach-Object {[char]$_})
   ```
   (PowerShell — copy output to clipboard.) Avoid `$` if you want a quieter `.env` build, though the build script escapes it correctly either way.
3. Paste the new password as the cPanel mailbox password. Save.
4. **AWS Amplify Console → Environment variables** → edit `SMTP_PASS` → paste the same value → **Save**
5. Amplify auto-rebuilds (~3 min)
6. **Verify**: submit a test on `https://www.keelstack.uk/seo` with a real email — confirm the verification email arrives

### 3. AWS IAM access keys

1. AWS Console → **IAM** → **Users** → `aerologue-ads-admin` → **Security credentials** tab
2. Under **Access keys**, click **Create access key** → select "Command Line Interface (CLI)" → confirm → save the new key + secret somewhere safe (you'll only see the secret once)
3. **Update your local CLI**:
   ```powershell
   aws configure --profile aerologue-ads-dev
   ```
   Paste the new key + secret when prompted. Region stays `us-east-1`.
4. **Test**:
   ```powershell
   aws sts get-caller-identity --profile aerologue-ads-dev
   ```
   Should show the same user ARN as before.
5. Back in IAM, **Deactivate** the old access key. Wait 24 hours of clean usage to confirm nothing breaks. Then **Delete** the old key.

### 4. GitHub PAT `amplify-keelstack`

1. github.com/settings/tokens?type=beta → find `amplify-keelstack`
2. Click **Regenerate** (preserves the same name, gives a new token value, new TTL)
3. Set TTL to 90 days again (or longer)
4. Re-authorize Amplify if it loses access (it usually doesn't, since OAuth handles the persistent install)

### 5. `VERIFY_SECRET`

⚠️ **Read this before rotating:** Anyone with an unclicked verification email at the time of rotation will get "this link has expired" when they click. There's no way to migrate signed tokens.

If you must rotate (e.g. it was exposed):
1. Pick a low-traffic window (early morning UK time)
2. Generate a new 48-char random string:
   ```powershell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
   ```
3. Amplify Console → Environment variables → edit `VERIFY_SECRET` → paste new value → Save
4. Amplify auto-rebuilds (~3 min)
5. Any pending verification links from the previous secret will return an "expired" error — those leads will need to re-submit. Consider a one-day announcement if you have an active campaign running.

### 6. `ANTHROPIC_API_KEY` *(when added)*

1. console.anthropic.com → API keys → click the key → **Revoke**
2. Generate new → copy
3. Amplify Console → Environment variables → edit `ANTHROPIC_API_KEY` → paste → Save

### 7. `RESEND_API_KEY` *(when added)*

1. resend.com/api-keys → revoke old → create new → copy
2. Amplify Console → Environment variables → edit `RESEND_API_KEY` → paste → Save

---

## Don't do these things

- **Don't reuse passwords** across cPanel, AWS, GitHub, etc. — one breach compromises everything
- **Don't store secrets in code, git, or screenshots**
- **Don't share passwords over chat/SMS/email** — use a password manager's secure share
- **Don't keep them in browser autofill on shared computers**
- **Don't write them on sticky notes** (yes, this still happens)
- **Don't put production secrets in `.env.example`** — that file gets committed; only `.env.local` is safe (and gitignored)

## Tools to use

- **Password manager**: 1Password, Bitwarden (free tier is great), KeePassXC
- **Random string generator**:
  - PowerShell one-liners above
  - `openssl rand -base64 32` (Mac/Linux/Git Bash)
  - 1Password's built-in generator
- **Burn inbox for testing the verify flow**: tempmail-now.com, mailinator.com — get a throwaway email for clicking through

## After every rotation

- ☐ Update memory of any team member who had the old secret
- ☐ Update any cron jobs / CI runners that used the old credentials
- ☐ Verify the affected service still works (form submit, deploy, API call)
- ☐ Note the rotation date in your password manager
