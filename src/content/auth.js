export const authSection = {
  id: 'auth',
  label: 'Authentication & Authorization',
  icon: '🔐',
  groups: [
    {
      id: 'auth-guide',
      label: 'Guide',
      topics: [
        {
          id: 'identity-fundamentals',
          title: 'What Is Identity? Principals, Credentials & Claims',
          summary:
            'Before any protocol or algorithm enters the picture, every auth system rests on three basic ideas: a principal (who or what is acting), a credential (proof of that identity), and a claim (a fact asserted about the principal) — naming these precisely is the foundation everything else builds on.',
          keyPoints: [
            'A **principal** is the entity being identified — a human user, but equally a service, a device, or an API client.',
            'A **credential** is evidence offered to prove a claimed identity — a password, a private key, a fingerprint, a signed certificate.',
            'A **claim** is a fact asserted about a principal once identity is established — an email address, a role, a subscription tier, a tenant ID.',
            'Identification (stating who you are) and authentication (proving it) are different steps — a username alone is only a claim of identity, unverified until a credential check succeeds.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Every authentication system, from a plain password box to a WebAuthn passkey, is built from the same three ingredients. A **principal** is whoever (or whatever) is trying to act — usually a human user, but in a distributed system just as often a background service, a mobile device, or a third-party API client. A **credential** is the evidence that principal presents to back up its claimed identity: a password, a private key, a fingerprint, a signed certificate. A **claim** is a fact the system is now willing to assert about that principal once identity is established — "this is user 4471, email alice@example.com, role admin, tenant acme-corp".',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Principal[Principal<br/>user, service, or device] -->|presents| Credential[Credential<br/>password, key, biometric]\n    Credential -->|verified by| System[Identity System]\n    System -->|issues| Claims[Claims<br/>sub, email, role, tenant_id]\n    Claims -->|attached to| Session[Session or Token]',
            },
            {
              type: 'list',
              items: [
                '**Identification** is merely *stating* who you claim to be (typing a username, presenting an email address) — it carries no proof on its own.',
                '**Authentication** is the act of *proving* that claim, by presenting and verifying a credential.',
                '**Claims** are what the system is willing to hand back downstream once authentication succeeds — every later topic in this guide, from a session cookie to a JWT to a SAML assertion, is really just a different transport mechanism for a bundle of claims about a principal.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'This vocabulary is worth using precisely in an interview: saying "the principal presents a credential, which the identity provider verifies before issuing claims" signals a level of precision well above "the user logs in and gets a token" — and it is the same vocabulary the rest of this guide (and most real specs, like OIDC and SAML) uses throughout.',
            },
          ],
        },
        {
          id: 'simple-login-flow',
          title: 'A Simple Login Flow, Step by Step',
          summary:
            'Before OAuth, JWTs, or SSO enter the picture, it helps to walk through the oldest pattern in the book: a username, a password, and a server-side session — nearly everything else in this guide is either a variation on this flow or a fix for one of its weaknesses.',
          keyPoints: [
            'Registration: the server never stores the plaintext password — only a hash of it (see the Password-Based Authentication topic).',
            'Login: the client sends credentials once; the server verifies them and issues something the client can present on every future request instead of resending the password.',
            'That "something" is classically an opaque session ID, stored server-side and set as a cookie — the client never needs to know or reconstruct any of the server-side state itself.',
            'Almost every topic later in this guide exists to fix a specific weakness of this basic flow: password storage (hashing), scaling the session store (tokens), stolen sessions (cookie attributes, MFA), and delegated access to third parties (OAuth).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Strip away every advanced mechanism and the oldest working pattern is still this: the user submits a username and password once; if they match, the server remembers "this browser is now user 4471" and gives the browser a way to prove that on every subsequent request without resending the password each time.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Browser\n    participant Server\n    participant DB as User Database\n\n    Note over Browser,DB: Registration (once)\n    Browser->>Server: POST /register {username, password}\n    Server->>Server: hash(password) — never store plaintext\n    Server->>DB: save {username, password_hash}\n\n    Note over Browser,DB: Login\n    Browser->>Server: POST /login {username, password}\n    Server->>DB: look up user by username\n    DB-->>Server: password_hash\n    Server->>Server: verify(password, password_hash)\n    Server->>Server: create session, store server-side\n    Server-->>Browser: Set-Cookie: session_id=abc123 (HttpOnly)\n\n    Note over Browser,DB: Every later request\n    Browser->>Server: GET /profile (Cookie: session_id=abc123)\n    Server->>Server: look up session_id in session store\n    Server-->>Browser: profile data (if session valid)',
            },
            {
              type: 'p',
              text: 'Notice what this simple flow is *not* doing: it is not thinking about horizontal scaling of the session store, third-party delegated access, single sign-on across multiple apps, or a second factor beyond the password. Every one of those is a real gap in this basic flow, and each has its own dedicated topic later in this guide — session-vs-token addresses scaling and revocation, MFA and passkeys address "a leaked password alone is enough," OAuth/OIDC address delegated and federated access.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'This is also the mental model worth defaulting to when a system design question does not specify otherwise: start from "username, password, server-side session," then layer on exactly the mechanisms the requirements actually call for — do not reach for OAuth or JWTs just because they sound more advanced if a simple session cookie genuinely solves the problem.',
            },
          ],
        },
        {
          id: 'authn-vs-authz',
          title: 'Authentication vs Authorization',
          summary:
            'They are always sequential — you authorize based on an already-established identity — but architecturally separable, and conflating them is a common design mistake.',
          keyPoints: [
            'Authentication (AuthN): proving who you are.',
            'Authorization (AuthZ): deciding what you are allowed to do, given who you are.',
            '401 Unauthorized = an authentication failure ("I don\'t know who you are").',
            '403 Forbidden = an authorization failure ("I know who you are, and you can\'t do this").',
          ],
          blocks: [
            {
              type: 'p',
              text: '**Authentication (AuthN)**: proving *who you are*. "Is this really Alice?" **Authorization (AuthZ)**: deciding *what you\'re allowed to do*, given who you are. "Can Alice delete this file?"',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Request --> AuthN{Authentication<br/>Who are you?}\n    AuthN -->|Identity established| AuthZ{Authorization<br/>What can you do?}\n    AuthN -->|Failed| Reject401[401 Unauthorized]\n    AuthZ -->|Allowed| Resource[Access granted]\n    AuthZ -->|Denied| Reject403[403 Forbidden]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The 401 vs 403 distinction, precisely: 401 means "I don\'t know who you are, or your credentials are invalid/missing." 403 means "I know who you are, and you\'re not allowed to do this." Returning 403 for an invalid token, or 401 for a valid-but-insufficiently-privileged user, is a common and frequently-tested API design mistake.',
            },
          ],
        },
        {
          id: 'password-auth',
          title: 'Password-Based Authentication, Done Correctly',
          summary: 'Hashing algorithm choice, salting, peppering, and rate limiting — the checklist for storing and checking passwords safely.',
          keyPoints: [
            'Never store plaintext passwords; hash with a slow, memory-hard algorithm (bcrypt, scrypt, Argon2id).',
            'Salting (handled internally by bcrypt/Argon2) defeats precomputed rainbow-table attacks.',
            'Peppering adds a secret stored outside the database as an extra layer.',
            'Rate-limit login attempts with exponential backoff — lock the attempt, not the account, to avoid enabling DoS against a legitimate user.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Never store plaintext passwords.** Hash with a slow, memory-hard algorithm designed for passwords: bcrypt, scrypt, or Argon2 (Argon2id is the current best-practice default). Never use fast general-purpose hashes (MD5, SHA-256) for passwords — their speed is exactly what makes brute-forcing feasible.',
                '**Salting**: a unique, random salt per password prevents precomputed rainbow-table attacks and ensures two users with the same password get different hashes. bcrypt/Argon2 handle this internally — don\'t roll your own.',
                '**Peppering** (optional, extra layer): a secret value stored outside the database (e.g., in a secrets manager), combined with the password before hashing, so a full database leak alone isn\'t enough to brute-force offline.',
                '**Rate limiting and account lockout** on login attempts, with exponential backoff — but lock the *attempt*, not the account indefinitely, to avoid a denial-of-service against a legitimate user via repeated failed logins from an attacker. (See the dedicated Rate Limiting & Brute-Force Defense topic below.)',
                '**Constant-time comparison** for any secret comparison (modern password-hashing libraries handle this) to avoid timing side-channel attacks.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    subgraph Registration\n        PW1[Plaintext password] --> Salt[Generate random salt]\n        Salt --> Hash1[Argon2id hash password + salt]\n        Hash1 --> Store[(Store: hash + salt, never plaintext)]\n    end\n    subgraph Login\n        PW2[Plaintext password entered] --> Lookup[Fetch stored hash + salt]\n        Lookup --> Hash2[Argon2id hash entered password + stored salt]\n        Hash2 --> Compare{Constant-time compare<br/>to stored hash}\n        Compare -->|match| Allow[Authenticated]\n        Compare -->|no match| Deny[Reject]\n    end',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Encrypting a password (with a reversible cipher) instead of hashing it is a serious anti-pattern that still shows up in real systems: encryption is designed to be reversed, which means anyone with the decryption key — including a compromised application server — can recover every user\'s plaintext password. Hashing is deliberately one-way; there is no key that turns a hash back into the password.',
            },
          ],
        },
        {
          id: 'session-vs-token',
          title: 'Session-Based vs Token-Based Authentication',
          summary: 'The revocation problem is the crux of most "JWT vs sessions" discussions — stateless tokens are hard to invalidate early by design.',
          keyPoints: [
            'Session-based: server holds state (memory/Redis/DB), client holds only an opaque session ID.',
            'Token-based (JWT): server holds nothing; the token itself carries signed claims — naturally stateless.',
            'Revoking a session is trivial (delete server-side); revoking a JWT before its expiry is hard.',
            'Production systems pair short-lived access tokens with a long-lived, server-side-revocable refresh token.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Session-based', 'Token-based (JWT)'],
              rows: [
                ['Server state', 'Server stores session state, client holds an opaque session-ID cookie', 'Server stores nothing; the token carries the claims, signed'],
                ['Revocation', 'Trivial — delete the session server-side, effective immediately', 'Hard — valid until expiry unless you maintain a blocklist'],
                ['Scalability', 'Needs a shared session store (Redis) or sticky sessions', 'Naturally stateless — any server can validate independently'],
                ['Payload size', 'Small (just an ID)', 'Larger (claims embedded, sent every request)'],
                ['Typical transport', 'HttpOnly, Secure, SameSite cookie', '`Authorization: Bearer <token>` header, or a cookie'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph Session-Based\n        C1[Client] -- opaque session_id --> S1[Server]\n        S1 <--> Store[(Session Store<br/>Redis / DB)]\n    end\n    subgraph Token-Based\n        C2[Client] -- signed JWT, self-contained --> S2A[Server A]\n        C2 -- same JWT --> S2B[Server B]\n        S2A -.no shared store needed.-> S2B\n    end',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The standard production fix for "JWTs are hard to revoke": pair short-lived access tokens (5-15 minutes) with a long-lived, server-side-revocable refresh token — the blast radius of "can\'t revoke instantly" is capped at the access token\'s short lifetime, while the thing that actually needs revocation is checked against server state on every refresh.',
            },
          ],
        },
        {
          id: 'jwt-structure',
          title: 'JWT Structure: Header, Payload & Signature',
          summary: 'header.payload.signature — three base64url segments, readable by anyone, but only forgeable by whoever holds the signing key.',
          keyPoints: [
            'Three base64url segments joined by dots: header, payload (claims), signature.',
            'A JWT payload is base64-encoded, not encrypted — anyone can read it; only the signer can produce a valid signature for modified claims.',
            'HS256 = one shared secret for signing and verifying. RS256 = private key signs, public key verifies — correct choice when multiple services verify tokens from a central issuer.',
            'Standard claims: `sub`, `iss`, `aud`, `exp`, `iat`, `jti` — plus whatever custom claims the issuer chooses to add.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A JWT is three base64url-encoded segments joined by dots: `header.payload.signature`.',
            },
            {
              type: 'code',
              language: 'text',
              code: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsImV4cCI6MTcxOTk5OTk5OX0.<signature>',
            },
            {
              type: 'list',
              items: [
                '**Header**: algorithm (`alg`, e.g. `RS256` or `HS256`) and token type.',
                '**Payload**: claims — `sub` (subject/user ID), `iss` (issuer), `aud` (audience — which service this token is meant for), `exp` (expiry), `iat` (issued at), `jti` (unique token ID, useful for revocation lists), plus custom claims (roles, tenant ID).',
                '**Signature**: proves the token was not tampered with. Anyone can *read* a JWT (it\'s base64, not encrypted) — only the holder of the signing key can produce a valid signature for modified claims.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    subgraph Issue["Signing (Auth Server)"]\n        Claims[Claims: sub, exp, roles] --> Sign[Sign with private/shared key]\n        Sign --> Token[header.payload.signature]\n    end\n    subgraph Verify["Verification (Any Resource Server)"]\n        Token2[Incoming JWT] --> Check[Verify signature with<br/>public key HS/RS pinned in advance]\n        Check -->|valid| Trust[Trust claims, no DB lookup]\n        Check -->|invalid| Reject[Reject request]\n    end\n    Token -.sent as Authorization: Bearer.-> Token2',
            },
            {
              type: 'p',
              text: '**HS256 vs RS256** — a frequently tested distinction: HS256 uses one shared secret for both signing and verification, fine when only one party (a single backend) ever needs to verify tokens. RS256 uses a private key to sign and a public key to verify — the public key can be distributed to any number of services that need to verify tokens without ever holding the ability to *create* valid ones, which is why RS256 (or ES256) is the correct choice whenever multiple services or third parties verify tokens issued by a central auth server.',
            },
          ],
        },
        {
          id: 'jwt-security-pitfalls',
          title: 'JWT Security Pitfalls',
          summary: 'alg:none, localStorage, and algorithm confusion are the three pitfalls that show up in nearly every real-world JWT vulnerability report — name them unprompted.',
          keyPoints: [
            'Never trust the `alg` header to decide how to verify a token — pin the accepted algorithm(s) explicitly.',
            'Algorithm confusion: an attacker can turn a service\'s public RS256 key into the HMAC secret for a forged HS256 token, if the verifier blindly trusts the header.',
            'Storing JWTs in `localStorage` exposes them to any XSS on the page; an `HttpOnly` cookie trades that risk for a CSRF one instead.',
            'Never put sensitive data in the payload — it is base64, not encryption.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**`alg: none` attack** — some libraries historically accepted a token with `alg` set to `none` and skipped verification entirely. Always explicitly pin the accepted algorithm(s) when verifying.',
                '**Algorithm confusion (RS256 → HS256 downgrade)** — a more subtle variant: an attacker takes a service\'s known RS256 *public* key and crafts an HS256 token using that public key\'s contents as the HMAC secret. If the verifier blindly trusts the attacker-controlled `alg` header and treats the token as HS256, it "verifies" a forged token using a value the attacker legitimately knows (the public key is, after all, public).',
                '**Storing JWTs in `localStorage`** exposes them to any XSS on the page. Prefer an `HttpOnly`, `Secure`, `SameSite=Strict` cookie for browser clients (which then requires CSRF protection instead — see Session Security).',
                '**Putting sensitive data in the payload** — it\'s base64, not encryption; never put a password, SSN, or other secret in a claim.',
                '**No revocation plan** — always pair short-lived access tokens with a revocable refresh mechanism.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Attacker[Attacker] -->|1: obtains known-public RS256 key| PubKey[Service public key<br/>meant only for verifying]\n    Attacker -->|2: crafts forged token,<br/>header claims alg: HS256| Forged["forged_token = HMAC(payload, PubKey)"]\n    Forged -->|3: sends to server| Verifier{Verifier}\n    Verifier -->|BUG: trusts header,<br/>treats key as HMAC secret| Accept[Forged token accepted!]\n    Verifier -->|FIX: alg pinned server-side,<br/>ignores header instruction| Reject[Rejected: expected RS256]',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The fix for both `alg:none` and algorithm confusion is the same principle: the verifying service must hardcode/pin which algorithm(s) a given key is expected to use, and treat the token\'s own `alg` header as informational at most — never as an instruction for how to verify it.',
            },
          ],
        },
        {
          id: 'mfa',
          title: 'Multi-Factor Authentication: TOTP, SMS & Push',
          summary: 'MFA combines two or more independent proof factors — something you know, have, or are — so that a single leaked password is no longer enough to take over an account.',
          keyPoints: [
            'Three classic factor categories: knowledge (password), possession (phone/hardware key), inherence (biometrics).',
            'TOTP: a shared secret plus the current time produces a 6-digit code, computed independently on both sides — no network call needed at verification time.',
            'SMS-based OTP is the weakest common MFA factor (SIM-swapping, SS7 interception) — usable, but not a good sole option for sensitive accounts.',
            'Push-approval MFA trades convenience for a new risk: "MFA fatigue" / push-bombing attacks, mitigated with number-matching.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'True multi-factor authentication combines proof from at least two *different* categories: **something you know** (a password, a PIN), **something you have** (a phone, a hardware security key), and **something you are** (a fingerprint, face recognition). Two passwords, or a password plus a memorized security-question answer, are both "knowledge" factors and do not count as MFA despite being two separate secrets.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant App as Authenticator App\n    participant User\n    participant Server\n\n    Note over App,Server: Enrollment (once)\n    Server->>User: Show QR code encoding shared secret\n    User->>App: Scan QR code\n    App->>App: store shared secret\n    Server->>Server: store same shared secret for this user\n\n    Note over App,Server: Login (every time)\n    User->>Server: username + password (factor 1)\n    Server-->>User: password OK, enter 6-digit code\n    App->>App: code = TOTP(secret, current_time)\n    User->>Server: enter code (factor 2)\n    Server->>Server: independently compute TOTP(secret, current_time)\n    Server->>Server: compare codes (small time-drift window allowed)\n    Server-->>User: MFA verified, session issued',
            },
            {
              type: 'list',
              items: [
                '**TOTP (Time-based One-Time Password)** — RFC 6238. Both the authenticator app and the server independently derive the same 6-digit code from a shared secret and the current time, with no network call between them at verification time; a small clock-drift window (e.g. ±30s) is tolerated.',
                '**SMS/voice OTP** — sends a one-time code to the user\'s phone number. Vulnerable to SIM-swapping (a social-engineering attack against the carrier) and, more fundamentally, to weaknesses in the SS7 telecom signaling protocol — neither requires physical access to the device. NIST no longer recommends SMS OTP as a primary MFA method for this reason.',
                '**Push approval** (Okta Verify, Duo) — the app shows "approve this login?" as a tap. Convenient, but enables **MFA fatigue / push-bombing**: an attacker who already has the password sends repeated push prompts hoping the user taps "approve" out of habit or annoyance. Number-matching (the user must enter a number shown on the login screen into the app) closes this gap.',
                '**Hardware security keys / WebAuthn** — the strongest common possession factor, and phishing-resistant by design; covered in depth in the next topic.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'MFA fatigue attacks were behind several high-profile real-world breaches (attackers with a leaked password simply spammed push approvals until an exhausted employee tapped "yes"). Number-matching push, or moving to WebAuthn/hardware keys entirely, are the standard mitigations — not just "more prompts."',
            },
          ],
        },
        {
          id: 'passwordless-webauthn',
          title: 'Passwordless Authentication & Passkeys (WebAuthn/FIDO2)',
          summary: 'WebAuthn replaces the shared secret entirely with public-key cryptography — the private key never leaves the user\'s device, which is what makes passkeys inherently phishing-resistant, unlike a password or even a TOTP code.',
          keyPoints: [
            'WebAuthn/FIDO2 generates an asymmetric key pair per site (relying party); the private key stays on the device, only the public key is registered with the server.',
            'Phishing resistance comes from origin-binding: the browser will only complete an authentication ceremony for the exact origin a key was registered to.',
            'A "passkey" is a WebAuthn credential, typically now synced across a user\'s devices via a platform cloud keychain (Apple/Google/Microsoft) for usability.',
            'Because the server only ever stores a public key, a full database breach leaks nothing an attacker can use to authenticate — unlike a password database.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A password or TOTP code is a secret the user manually enters, which means it can be typed into a convincing fake login page and immediately replayed against the real site — phishing works precisely because the credential carries no awareness of which site it is being used on. WebAuthn removes that weakness structurally: the browser/OS generates and signs challenges using a private key that is cryptographically bound to the origin it was registered for, and simply will not produce a valid signature for a lookalike domain, no matter how convincing the fake page looks to the human.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Device as User Device<br/>(secure enclave/TPM)\n    participant Browser\n    participant Server\n\n    Note over Device,Server: Registration ceremony\n    Browser->>Server: request registration\n    Server-->>Browser: challenge + relying party ID (e.g. example.com)\n    Browser->>Device: create key pair for this origin\n    Device->>Device: generate {private key (stays on device), public key}\n    Device->>Device: sign challenge with private key\n    Browser->>Server: public key + signed challenge + attestation\n    Server->>Server: store public key against user account\n\n    Note over Device,Server: Authentication ceremony (later login)\n    Browser->>Server: request login\n    Server-->>Browser: new challenge\n    Browser->>Device: sign challenge (origin checked automatically)\n    Device->>Device: unlock private key via biometric/PIN (local only)\n    Device-->>Browser: signed assertion\n    Browser->>Server: signed assertion\n    Server->>Server: verify with stored public key\n    Server-->>Browser: authenticated',
            },
            {
              type: 'list',
              items: [
                'The **biometric or device PIN never leaves the device and is never sent to the server** — it only unlocks the local private key. The server never sees, and never could see, anything equivalent to a password.',
                '**No server-side secret to leak**: a database breach exposes only public keys, which are useless for authenticating without the corresponding private key still sitting in the user\'s device hardware.',
                '**Synced vs device-bound passkeys**: modern "passkeys" sync the private key across a user\'s devices via a platform keychain (iCloud Keychain, Google Password Manager) for usability — a real tradeoff against the original FIDO2 guarantee that the key material never leaves one specific piece of hardware. Device-bound (hardware security key) passkeys keep the stronger single-device guarantee, at the cost of "what if I lose the key."',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Passkeys eliminate an entire class of attacks at once — password reuse, credential stuffing, password-database leaks, and classic phishing — because there is no password-equivalent shared secret anywhere in the system, only a public key that is safe to leak by design.',
            },
          ],
        },
        {
          id: 'rate-limiting-brute-force',
          title: 'Rate Limiting, Account Lockout & Credential-Stuffing Defense',
          summary: 'A correct login system defends against three related but distinct attacks — brute force, credential stuffing, and enumeration — and a naive defense against one, like hard account lockout, can itself become a denial-of-service against legitimate users.',
          keyPoints: [
            'Brute force: many guesses against one account. Credential stuffing: leaked username/password pairs from other breaches, replayed at scale, betting on password reuse. Enumeration: inferring which usernames/emails are valid from response differences.',
            'Layered defenses: per-account and per-IP rate limiting combined, exponential backoff, CAPTCHA after N failures.',
            'Never let account lockout be the only defense — an attacker can intentionally fail logins to lock a legitimate user out (a lockout-based DoS); prefer increasing delays over indefinite hard locks.',
            'Return uniform responses and timing for "wrong password" vs "no such user" to avoid enabling username enumeration.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Attack', 'Shape', 'Defense that specifically targets it'],
              rows: [
                ['Brute force', 'Many password guesses against one known account', 'Per-account rate limiting with exponential backoff; CAPTCHA after N attempts'],
                ['Credential stuffing', 'One leaked username/password pair tried against many sites at once, at scale, betting on reuse', 'Per-IP / per-device rate limiting, bot detection, checking new passwords against known-breached-password lists, MFA'],
                ['Enumeration', 'Probing which usernames/emails exist by comparing response content or timing', 'Identical response body and timing for "wrong password" and "no such user"'],
              ],
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n    [*] --> Normal\n    Normal --> Normal: successful login (reset counter)\n    Normal --> ShortBackoff: 1st-3rd failed attempt\n    ShortBackoff --> Normal: wait a few seconds, retry\n    ShortBackoff --> LongerBackoff: more failures\n    LongerBackoff --> CaptchaRequired: further failures\n    CaptchaRequired --> Normal: CAPTCHA passed + correct password\n    CaptchaRequired --> CaptchaRequired: still failing\n    note right of CaptchaRequired\n        Never a permanent, unconditional\n        lockout — that enables a DoS\n        against the legitimate user\n    end note',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Hard, indefinite account lockout after N failed attempts is a classic well-intentioned mistake: an attacker who has zero interest in guessing the password can simply submit N wrong passwords on purpose to lock a legitimate user out of their own account — a self-inflicted denial-of-service. Prefer increasing delays, CAPTCHA challenges, and step-up verification over an outright lock, and if a hard lock is used, make it time-boxed and notify the account owner.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A modern, often-overlooked layer: check new/changed passwords against a known-breached-password list (e.g. via the k-anonymity API pattern popularized by Have I Been Pwned) and reject them at registration/change time — this defeats credential stuffing before it can even start, since the password was never usable in the first place.',
            },
          ],
        },
        {
          id: 'session-security',
          title: 'Session Security: CSRF, XSS & Cookie Attributes',
          summary: 'HttpOnly, Secure, and SameSite each defend against a different attack — none of them substitutes for the others.',
          keyPoints: [
            'XSS: attacker script runs in your origin, can read anything JS can read.',
            'CSRF: a malicious site rides the browser\'s automatically-attached cookies to make a forged state-changing request.',
            'HttpOnly stops JS from reading a cookie; SameSite stops it being sent cross-site; a CSRF token is an explicit third layer.',
            'Bearer tokens in an Authorization header are inherently immune to CSRF (a forging site cannot set that header cross-site without triggering a CORS preflight).',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**XSS (Cross-Site Scripting)**: attacker-injected script runs in your page\'s origin. Mitigate with output encoding/escaping, a strict Content-Security-Policy, and `HttpOnly` cookies.',
                '**CSRF (Cross-Site Request Forgery)**: a malicious site tricks a logged-in user\'s browser into making a state-changing request to your site. Mitigate with `SameSite` (`Strict`/`Lax`) and/or an explicit CSRF token.',
                '**Cookie attributes**: `HttpOnly` (not readable by JS), `Secure` (HTTPS only), `SameSite=Strict/Lax/None` (controls cross-site sending).',
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant User as User Browser\n    participant Bank as bank.com (logged in, has cookie)\n    participant Evil as evil.com\n\n    User->>Bank: login, receives Set-Cookie: session=abc (no SameSite)\n    User->>Evil: visits malicious page\n    Evil-->>User: auto-submitting hidden form to bank.com/transfer\n    User->>Bank: POST /transfer (cookie auto-attached by browser!)\n    Bank->>Bank: cookie looks valid — request appears legitimate\n    Note right of Bank: Without SameSite/CSRF token,<br/>the transfer succeeds — the browser<br/>attaches cookies regardless of<br/>which site initiated the request',
            },
          ],
        },
        {
          id: 'oauth2',
          title: 'OAuth 2.0 — What It Actually Is (and Isn\'t)',
          summary: 'OAuth 2.0 is an authorization delegation protocol, not an authentication protocol — confusing the two is one of the most common mistakes in interviews and real implementations.',
          keyPoints: [
            'Roles: Resource Owner (user), Client (third-party app), Authorization Server, Resource Server.',
            'The Authorization Code flow (with PKCE) is the one to know cold.',
            'The code is exchanged server-side/PKCE-protected rather than returned in the redirect, precisely because redirects are visible in browser history/logs/Referer headers.',
            'ROPC and Implicit grants are deprecated in OAuth 2.1.',
          ],
          blocks: [
            {
              type: 'p',
              text: '**OAuth 2.0 is an authorization delegation protocol, not an authentication protocol.** It answers "can this third-party app access this user\'s data on Google, with this specific scope, without ever seeing the user\'s Google password?" It does *not* by itself tell the third-party app who the user is — that\'s what OIDC adds on top.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant User\n    participant Client as Client App\n    participant AuthServer as Authorization Server\n    participant ResourceServer as Resource Server (API)\n\n    User->>Client: Click "Login with Google"\n    Client->>AuthServer: Redirect to /authorize?client_id&redirect_uri&scope&state&code_challenge\n    AuthServer->>User: Show consent screen\n    User->>AuthServer: Approve\n    AuthServer->>Client: Redirect back with ?code=xyz&state\n    Client->>AuthServer: POST /token {code, client_secret, code_verifier}\n    AuthServer-->>Client: {access_token, refresh_token, id_token}\n    Client->>ResourceServer: GET /api/data (Authorization: Bearer access_token)\n    ResourceServer-->>Client: Protected data',
            },
            {
              type: 'p',
              text: '**PKCE (Proof Key for Code Exchange)**: the client generates a random `code_verifier`, derives a `code_challenge = SHA256(code_verifier)`, sends the challenge with the initial `/authorize` request, then sends the original verifier when exchanging the code for a token. PKCE is now recommended for all clients, not just public ones (SPAs/mobile), per current OAuth best practice.',
            },
            {
              type: 'p',
              text: 'Other grant types, briefly: **Client Credentials** (machine-to-machine), **Refresh Token** (exchange a refresh token for a new access token), **Device Code** (input-constrained devices like smart TVs). The **Resource Owner Password Credentials** grant and the **Implicit** grant are both deprecated in OAuth 2.1.',
            },
          ],
        },
        {
          id: 'oidc',
          title: 'OpenID Connect (OIDC)',
          summary: 'OIDC adds a standardized identity layer on top of OAuth 2.0\'s delegation mechanics — the ID Token is what tells the client who just logged in.',
          keyPoints: [
            'Same Authorization Code flow as OAuth, plus an ID Token — a signed JWT about the authenticated user.',
            'The access token is for calling APIs; the ID token is for knowing who logged in.',
            '"Sign in with Google/Apple/GitHub" buttons are OIDC, not raw OAuth.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'OIDC adds a standardized **identity layer** on top of OAuth 2.0\'s delegation mechanics: the same Authorization Code flow, but the token response also includes an **ID Token** — a JWT specifically about the *authenticated user* (claims like `sub`, `email`, `name`, `email_verified`), signed by the authorization server (now acting as an "Identity Provider").',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    AuthServer[Authorization Server<br/>acting as Identity Provider] -->|token response| Both{Two tokens,<br/>two purposes}\n    Both --> AccessToken[Access Token<br/>opaque or JWT<br/>"what can this app do"]\n    Both --> IDToken[ID Token<br/>always a signed JWT<br/>"who just logged in"]\n    AccessToken -->|sent to| API[Resource Server / API calls]\n    IDToken -->|validated locally by| Client[Client App<br/>checks signature, iss, aud, exp]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The one-sentence distinction that resolves most confusion: OAuth 2.0 answers "what can this app do on my behalf," OIDC (built on OAuth 2.0) answers "who is this user." A login flow that only obtains an access token but never validates an ID token isn\'t actually authenticating the user — it\'s just obtaining delegated API access.',
            },
          ],
        },
        {
          id: 'sso-saml',
          title: 'Single Sign-On (SSO) & SAML',
          summary: 'SSO lets one authentication event at an identity provider grant access to many otherwise-unrelated applications — SAML is the older, XML-based protocol that still dominates enterprise SSO despite OIDC being the more modern alternative.',
          keyPoints: [
            'SSO separates the Identity Provider (IdP, e.g. Okta/Azure AD) from Service Providers (SP, the individual apps) — one login at the IdP grants a trusted assertion to every federated SP.',
            'SAML exchanges signed XML "assertions" via browser redirects/POSTs; OIDC exchanges JSON Web Tokens — SAML predates and remains entrenched in enterprise identity.',
            'SP-initiated flow (user starts at the app) is generally preferred over IdP-initiated flow (user starts at the IdP dashboard) because the SP can verify the exact request that led to the assertion, closing a class of replay/confusion attacks.',
            'Deprovisioning at the IdP should immediately cascade to revoke access across every federated SP — a hard enterprise requirement.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'SSO separates *who verifies your identity* from *the many applications that trust that verification*. An **Identity Provider (IdP)** — Okta, Azure AD, Google Workspace — authenticates the user once; each **Service Provider (SP)** — Slack, Salesforce, an internal admin tool — trusts a signed assertion from the IdP instead of running its own login. **SAML (Security Assertion Markup Language)** is the older of the two common federation protocols, exchanging XML-based, digitally-signed assertions; OIDC (built on OAuth 2.0) is the newer, JSON/JWT-based alternative. Many large enterprises\' identity infrastructure predates OIDC, so SAML remains the protocol a B2B product must support to close enterprise deals, regardless of technical preference.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant User\n    participant SP as Service Provider (the app)\n    participant IdP as Identity Provider (Okta/Azure AD)\n\n    Note over User,IdP: SP-initiated flow\n    User->>SP: request protected resource\n    SP-->>User: redirect with SAMLRequest (or OIDC AuthnRequest)\n    User->>IdP: follows redirect, authenticates (password/MFA)\n    IdP->>IdP: sign assertion: user identity + attributes\n    IdP-->>User: redirect back to SP\'s Assertion Consumer Service URL, POST SAMLResponse\n    User->>SP: delivers signed assertion\n    SP->>SP: validate signature, issuer, audience, timestamp\n    SP-->>User: local session created, access granted',
            },
            {
              type: 'list',
              items: [
                '**SP-initiated** (the diagram above): the user starts at the application, which redirects to the IdP and later verifies the exact request/response pair — the more common and more secure pattern.',
                '**IdP-initiated**: the user starts by clicking a tile in the IdP\'s own dashboard. Weaker, because the SP receives an assertion it never explicitly requested and cannot correlate against an outstanding request, which historically enabled certain replay and confusion attacks — still supported for convenience, but SP-initiated is generally preferred where possible.',
                'Deprovisioning: disabling an employee at the IdP should cascade to every federated SP essentially immediately — this is why SSO\'d sessions are typically kept shorter-lived, with periodic re-validation against the IdP, rather than trusting one long-lived local session indefinitely.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A well-known, advanced SAML-specific attack class is **XML Signature Wrapping**: because SAML assertions are XML, a manipulated document can be crafted so that the part the signature actually covers differs from the part the application logic actually reads and trusts, letting an attacker forge claims within an otherwise validly-signed document. Robust SAML libraries defend against this; hand-rolled XML parsing/validation is a common source of real vulnerabilities.',
            },
          ],
        },
        {
          id: 'api-auth-patterns',
          title: 'API Authentication Patterns: Keys, Client Credentials & mTLS',
          summary: 'Not every caller is a human at a browser — service-to-service and third-party integration traffic needs its own authentication patterns, each with a different threat model than a user login.',
          keyPoints: [
            'API keys: a long-lived static secret identifying a calling application/integration, not a specific user — simple, but hard to scope and rotate well.',
            'OAuth 2.0 Client Credentials grant: a service authenticates as itself and receives a scoped, short-lived access token — the standard machine-to-machine pattern.',
            'mTLS: certificate-based mutual authentication at the transport layer, common inside a service mesh or for the highest-trust B2B integrations.',
            'Never embed an API key in browser/client-side code — anyone can read it from the network tab; proxy the call through your own backend instead.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'API Key', 'OAuth Client Credentials', 'mTLS'],
              rows: [
                ['Identity granularity', 'Usually one key per integration/account', 'Scoped, short-lived token per request/session', 'Per-service certificate identity'],
                ['Typical lifetime', 'Long-lived, often until manually rotated', 'Minutes (re-requested via client_secret)', 'Rotated automatically by a service mesh'],
                ['Revocation', 'Manual, key-by-key', 'Immediate at the auth server; short expiry limits blast radius anyway', 'Certificate revocation / short-lived certs'],
                ['Typical use', 'Simple third-party integrations', 'Machine-to-machine within an OAuth-based architecture', 'Internal service mesh, high-assurance B2B links'],
              ],
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Service as Calling Service\n    participant AuthServer as Authorization Server\n    participant ResourceServer as Resource Server\n\n    Service->>AuthServer: POST /token {client_id, client_secret, grant_type=client_credentials, scope}\n    AuthServer->>AuthServer: verify client identity, check allowed scopes\n    AuthServer-->>Service: {access_token, expires_in: 300}\n    Service->>ResourceServer: request (Authorization: Bearer access_token)\n    ResourceServer->>ResourceServer: verify signature + scope, no user involved at all',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'An API key is frequently treated as if it were a narrowly-scoped capability, but most implementations actually grant broad access equivalent to the entire creating account — a single leaked key can be catastrophic. Scope keys as narrowly as the provider allows, rotate them on a schedule, and prefer OAuth Client Credentials (short-lived, individually scoped tokens) wherever the integration supports it.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Never put an API key directly in browser/mobile client code — it is trivially visible to anyone via devtools or a packet capture. Proxy the third-party call through your own backend, which holds the key server-side, and authenticate the *browser-to-your-backend* leg with normal session/token auth instead.',
            },
          ],
        },
        {
          id: 'authz-models',
          title: 'Authorization Models: RBAC, ABAC, ReBAC',
          summary: 'Start with RBAC for simple role-shaped systems, reach for ABAC when access depends on dynamic context, and reach for ReBAC when the domain has natural hierarchical/social sharing.',
          keyPoints: [
            'RBAC: users get roles, roles get permissions — simple, but can\'t express "edit their own documents" as a static role.',
            'ABAC: policies evaluated against attributes of user/resource/action/environment — expressive, harder to audit exhaustively.',
            'ReBAC: access determined by traversing relationships in a graph (Google Zanzibar model) — the right fit for nested folder/team sharing.',
            'Real systems often combine them: RBAC for coarse admin roles, ReBAC for resource-level sharing.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n    subgraph RBAC\n        UserA[User] -->|assigned| RoleEditor[Role: Editor]\n        RoleEditor -->|grants| PermEdit[Permission: edit_document]\n    end\n    subgraph ReBAC\n        UserB[User] -->|member of| GroupEng[Group: Engineering]\n        GroupEng -->|viewer of| FolderX[Folder: Q3 Docs]\n        FolderX -->|contains| DocY[Document: Roadmap.pdf]\n        UserB -.can view via inherited relationship.-> DocY\n    end',
            },
            {
              type: 'p',
              text: '**Choosing between them in an interview**: start with RBAC for straightforward "roles map cleanly to permissions" systems; reach for ABAC when access depends on dynamic context/attributes; reach for ReBAC when the domain has natural hierarchical/social sharing (documents, folders, org charts) — and note that real systems often combine them.',
            },
          ],
        },
        {
          id: 'distributed-authz',
          title: 'Fine-Grained & Distributed AuthZ Patterns',
          summary: 'Policy Decision Points, policy-as-code, and the tradeoff between embedding claims in a token versus checking permissions in real time.',
          keyPoints: [
            'A centralized Policy Decision Point (e.g. OPA) gives consistent, auditable policy — at the cost of a network hop on the critical path.',
            'Policy as code (e.g. Rego) makes authorization rules testable and versionable independent of application deploys.',
            'Embed coarse/slow-changing claims in the token; check fine-grained or high-stakes permissions in real time.',
            'mTLS authenticates service identity for every internal call — the modern replacement for "the internal network is the trust boundary."',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Centralized Policy Decision Point (PDP)**: services ask a central authorization service "can user X do action Y on resource Z?" instead of reimplementing permission logic. Usually mitigated with aggressive caching or a PDP sidecar.',
                '**Policy as code**: authorization rules in a dedicated policy language (e.g. Rego for OPA), testable and auditable independent of application deploys.',
                '**Token-embedded claims vs. real-time lookup**: embed coarse/slow-changing claims (org membership, base role) in the token; do a real-time check only for fine-grained or frequently-changing permissions.',
                '**Zero Trust / mTLS**: both client and server present certificates for every internal service call — don\'t assume traffic inside your network is trusted just because it\'s internal.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n    Service[Application Service] -->|can user X do<br/>action Y on resource Z?| PDP[Policy Decision Point<br/>e.g. OPA]\n    PDP --> Policy[(Policy as Code<br/>Rego rules, versioned)]\n    PDP --> RelGraph[(Relationship Graph<br/>ReBAC data)]\n    PDP -->|allow / deny| Service\n    Service -. cache decision briefly to<br/>avoid hop on every request .-> Service',
            },
          ],
        },
        {
          id: 'case-study-saas',
          title: 'Case Study: Auth for a Multi-Tenant B2B SaaS Platform',
          summary: 'Tenant isolation, enterprise SSO, and machine-to-machine API keys — the design decisions interviewers specifically probe for in a multi-tenant system.',
          keyPoints: [
            'tenant_id must be a mandatory token claim, derived server-side — never trusted from anything the client supplies.',
            'Enterprise SSO federates the customer\'s own IdP (SAML or OIDC); access revokes the instant the employee is deactivated there.',
            'A user\'s identity is global, but role/permissions are tenant-scoped — merging permissions across tenants in one token is a leak risk.',
            'API keys for integrations are a separate credential type, independently scoped and revocable — not "whatever the creating user can do".',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n    User[User] --> IdP{Which login?}\n    IdP -->|Enterprise SSO| SAMLOIDC[Customer\'s IdP<br/>SAML or OIDC]\n    IdP -->|Standard| AuthServer[Internal Auth Server]\n    SAMLOIDC --> AuthServer\n    AuthServer --> TokenIssue[Issue access token<br/>claims: sub, tenant_id, roles]\n    TokenIssue --> Client[Client App]\n    Client -->|Bearer token| APIGW[API Gateway<br/>validates signature + exp]\n    APIGW --> Service[Application Service]\n    Service --> PDP[Policy Decision Point<br/>tenant + resource-level rules]\n    PDP --> RelationshipDB[(Relationship Graph:<br/>tenant, team, resource-sharing)]\n    Service --> TenantDB[(Tenant-scoped Data Store)]',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'tenant_id must be embedded as a mandatory claim in every access token, and every downstream data query must be scoped by it at the data-access layer — never trust a client-supplied tenant ID. This is the single most important guardrail against cross-tenant data leaks, and the realistic failure mode is simply a developer forgetting a `WHERE tenant_id = ?` clause.',
            },
          ],
        },
      ],
    },
    {
      id: 'auth-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: '26 authentication/authorization interview questions with full-depth answers.',
          qa: [
            {
              question: "What's the difference between authentication and authorization, precisely, and what HTTP status codes map to each failure?",
              answer:
                'Authentication establishes identity ("who are you") — its failure is 401 Unauthorized (despite the confusing name, it really means "not authenticated"). Authorization decides what an already-identified party can do — its failure is 403 Forbidden ("I know who you are, but you can\'t do this"). Returning 403 to someone with no/invalid credentials, or 401 to an authenticated-but-insufficiently-privileged user, is a common and testable API design mistake.',
            },
            {
              question: "Why shouldn't you use SHA-256 to hash passwords, even though it's cryptographically secure?",
              answer:
                'SHA-256 is designed to be fast — desirable for data-integrity checksums but actively harmful for password storage, because it lets an attacker with a leaked hash database brute-force billions of guesses per second on commodity GPUs. Password hashing needs the opposite property: deliberately slow and memory-hard (bcrypt, scrypt, Argon2) so brute-forcing even a single password is computationally expensive, combined with unique per-password salts (handled internally by these algorithms) to defeat precomputed rainbow tables.',
            },
            {
              question: 'Explain why JWTs are hard to revoke, and how production systems solve it in practice.',
              answer:
                'A JWT is self-contained and cryptographically verifiable without a database lookup — that statelessness is its main advantage for scalability, but it also means a server has no built-in way to say "this specific token is now invalid" short of checking every request against a blocklist, which reintroduces the server-side state JWTs were meant to avoid. The standard solution: issue short-lived access tokens (5-15 minutes) that simply expire naturally, paired with a long-lived refresh token that *is* checked against server-side state on every use — capping the "can\'t revoke" window to the access token\'s short lifetime.',
            },
            {
              question: 'What does OAuth 2.0 actually secure, and why is "OAuth is an authentication protocol" a common misconception?',
              answer:
                'OAuth 2.0 secures delegated access to resources — it lets a user grant a third-party app scoped access to their data on another service, without sharing their password with that app. It says nothing, by itself, about the third party actually verifying who the user is; a client could obtain an access token and call an API without ever confirming the user\'s identity. OpenID Connect layers an authentication mechanism (the signed ID Token) on top of OAuth 2.0\'s flows specifically to close this gap.',
            },
            {
              question: 'Walk through the OAuth 2.0 Authorization Code flow and explain why the token exchange happens in a second, back-channel request instead of returning the token directly in the redirect.',
              answer:
                'The user is redirected to the authorization server, authenticates and consents, and is redirected back to the client with a short-lived, single-use authorization code in the URL. The client then exchanges that code for tokens via a direct server-to-server (or PKCE-protected) POST request, not visible in browser history/logs/Referer headers the way the initial redirect is. An attacker who intercepts the redirect only gets a code that\'s useless without also possessing the client\'s secret or the original PKCE code verifier — versus the deprecated Implicit flow, which returned the access token directly in the redirect fragment, fully exposed.',
            },
            {
              question: 'What problem does PKCE solve, and why is it now recommended even for confidential (server-side) clients, not just public ones like SPAs?',
              answer:
                'PKCE binds the authorization code exchange to the specific client instance that initiated the flow: the client generates a random code_verifier, sends its SHA-256 hash (code_challenge) with the initial authorization request, and must present the original verifier when exchanging the code — so even if the code is intercepted, an attacker can\'t complete the exchange without the verifier. It was originally designed for public clients that can\'t safely hold a client_secret, but current best practice (OAuth 2.1) recommends it universally because it adds meaningful protection at essentially zero cost, even for clients that also have a secret.',
            },
            {
              question: 'How would you decide between RBAC, ABAC, and ReBAC for a new authorization system?',
              answer:
                'Start with the shape of the actual access rules: if permissions map cleanly onto a small, fairly static set of roles, RBAC is simplest to build and audit. If access depends on dynamic attributes/context that don\'t reduce to a fixed role, you need ABAC\'s policy-evaluation model. If the domain has natural hierarchical or social sharing — folders containing documents, teams containing users, "share with this person or group, optionally inherited" — ReBAC\'s relationship-graph model is the only one that expresses this cleanly without combinatorial role explosion. Most real systems combine them.',
            },
            {
              question: "In a multi-tenant SaaS system, what's the single most important guardrail against one tenant accessing another tenant's data, and where should it be enforced?",
              answer:
                'The tenant ID must be derived exclusively from the verified access token, never trusted from anything the client supplies in the request itself — and every data-access-layer query must be scoped by that server-derived tenant ID, ideally enforced at a layer that\'s hard to bypass by mistake (a query-building layer that structurally requires a tenant filter, or row-level security at the database). This is the check interviewers specifically probe for, because the realistic failure mode is a developer forgetting a `WHERE tenant_id = ?` clause in one of hundreds of queries.',
            },
            {
              question: "Why is HttpOnly on a session cookie not sufficient protection on its own, and what else do you need?",
              answer:
                'HttpOnly prevents JavaScript from reading the cookie\'s value, blocking the most direct form of session-token theft via XSS — but it does nothing to stop the browser from automatically sending that cookie along with a cross-site request that a malicious page tricks the user\'s browser into making (CSRF), since the cookie is attached regardless of which site initiated the request. You need SameSite=Strict/Lax and/or an explicit CSRF token as a complementary defense — HttpOnly and CSRF protection address two different attack vectors and neither substitutes for the other.',
            },
            {
              question: "What's the difference between a Policy Decision Point (PDP) architecture and embedding authorization checks directly in each service's code, and what's the tradeoff?",
              answer:
                'A centralized PDP (e.g. OPA) means every service calls out to a shared authorization service/library with the request context and gets back an allow/deny decision, with the policy logic defined once, versioned, and auditable independently of any single service. Embedding checks directly in each service is simpler with no extra network hop, but the same logical rule gets reimplemented — and can subtly diverge — across every service that needs it. The tradeoff is architectural coupling and latency versus consistency and auditability; production systems usually mitigate the latency cost with local caching or a PDP sidecar.',
            },
            {
              question: 'Why do access tokens typically embed coarse permissions as claims, while fine-grained/frequently-changing permissions are checked in real time against a service instead?',
              answer:
                'A claim embedded in a signed token is only as current as the token\'s issuance time — it can\'t reflect a permission change during the token\'s lifetime without either a short lifetime or explicit revocation, so embedding something that changes often (e.g. "can view this document, which might get unshared any second") risks granting access based on stale information. Coarse, slowly-changing attributes are safe to embed because staleness for a few minutes is acceptable and saves a round-trip; fine-grained or high-stakes permissions justify the extra latency of a real-time check.',
            },
            {
              question: 'What is mutual TLS (mTLS) and why is it used for service-to-service authentication instead of just trusting traffic inside the internal network?',
              answer:
                'In mTLS, both the client and server present X.509 certificates and each verifies the other\'s identity before the connection proceeds — as opposed to standard TLS, where only the server proves its identity. It\'s used internally because "internal network = trusted" breaks down once you account for compromised nodes or a foothold on any single host — mTLS cryptographically authenticates the calling service\'s identity regardless of network position, the foundation of Zero Trust. A service mesh (Istio/Linkerd) typically automates certificate issuance and rotation.',
            },
            {
              question: 'Explain why the OAuth 2.0 Resource Owner Password Credentials (ROPC) grant is deprecated, and what it was originally meant for.',
              answer:
                'ROPC has the client application collect the user\'s actual username and password directly and send them to the authorization server for a token — defeating OAuth\'s foundational purpose of letting a user grant scoped access without handing their credentials to the requesting application. It was originally intended for "highly trusted" first-party clients, but even there it\'s discouraged because it trains users to enter credentials into arbitrary app UIs and provides no natural path to MFA or SSO. OAuth 2.1 removes it entirely in favor of the Authorization Code flow with PKCE.',
            },
            {
              question: 'How would you design "step-up authentication" — requiring a fresh re-authentication before a sensitive action — in a system that normally uses long-lived sessions?',
              answer:
                'Track an auth_time (a "freshness" timestamp) representing when the user last actively authenticated, separate from the session\'s general validity. Sensitive endpoints check that auth_time is within an acceptable recency window and, if not, respond with a specific challenge requiring fresh password entry or MFA before proceeding — without invalidating the user\'s broader, longer-lived session. OIDC has a standardized mechanism for this via the max_age parameter and auth_time claim.',
            },
            {
              question: "Why is SAML still relevant for enterprise SSO despite OIDC being the more modern protocol, and what's the core mechanical difference between them?",
              answer:
                "Many large enterprises' existing identity infrastructure was built on SAML long before OIDC existed, and migrating an entire federated identity setup is a significant undertaking most enterprises haven't done — so any B2B product targeting enterprise customers needs to support SAML regardless of its own technical preference. Mechanically, SAML exchanges XML-based assertions via browser redirects with signed XML documents, whereas OIDC exchanges JSON-based tokens (JWTs) via a more modern, mobile/SPA-friendly flow — OIDC is generally simpler to implement, but SAML's entrenchment keeps it relevant.",
            },
            {
              question: 'A user reports they were logged out of every device except one after a password change — walk through how you\'d implement "log out everywhere except this session."',
              answer:
                "Maintain a per-user \"token generation\"/session-epoch counter (or a per-session revocation list) in server-side state. On password change, increment the user's global counter but record the current session as exempt — or invalidate all refresh tokens/sessions except the one servicing the current request. Every access-token validation (or refresh) checks the token's embedded generation number against the user's current counter; a mismatch forces re-authentication. This again relies on the refresh-token/session layer holding server-side state, since stateless access tokens alone can't support selective, immediate revocation.",
            },
            {
              question: "What's the security reasoning behind never accepting a client-specified alg header value blindly when verifying a JWT?",
              answer:
                'If verification code trusts whatever algorithm the token claims to use, an attacker can craft a token with alg: none (some libraries historically treated this as "no signature to check"), or take a service\'s known RS256 *public* key and craft an HS256 token using that public key\'s contents as the HMAC secret — if the verifier is told (by the attacker-controlled header) to treat it as HS256, it will "verify" a forged token using a key the attacker actually knows. The fix: hardcode/pin which algorithm(s) a given key expects, ignoring the token\'s own alg claim as an instruction, and reject anything else.',
            },
            {
              question: 'What are the three classic categories of authentication factors, and which category does a TOTP code belong to versus a fingerprint?',
              answer:
                'The three classic categories are: something you know (a password or PIN — a "knowledge" factor), something you have (a phone, hardware key, or smart card — a "possession" factor), and something you are (a fingerprint or face scan — an "inherence" factor). A TOTP code is a possession factor: it proves the user has the specific device holding the shared secret at enrollment time, not that they memorized anything. True MFA requires factors from at least two different categories — two passwords, or a password plus a memorized security-question answer, are both "knowledge" and do not count as MFA despite being two separate secrets.',
            },
            {
              question: 'Why is SMS-based one-time-password MFA considered materially weaker than an authenticator app, even though both send a 6-digit code?',
              answer:
                "SMS is interceptable via SIM-swapping (a social-engineering attack against the phone carrier, not the device itself) and via weaknesses in the SS7 telecom signaling protocol that carriers still support — neither requires physical possession of the phone at all. An authenticator app's TOTP code, by contrast, is derived from a secret that never left the original device at enrollment and never travels over any telecom network — the attack surface is fundamentally the device itself, not a decades-old signaling protocol never designed with modern security in mind. NIST no longer recommends SMS OTP as a primary MFA method for this reason, though it remains far better than no second factor at all.",
            },
            {
              question: 'What makes WebAuthn/passkey authentication "phishing-resistant" in a way that a password or even a TOTP code is not?',
              answer:
                'A password or TOTP code is a secret the user manually enters, so it can be typed into a convincing fake login page and immediately replayed against the real site — phishing works precisely because the user is fooled, and the credential itself carries no awareness of which site it is being used on. A WebAuthn assertion is generated and signed by the browser/OS using a private key cryptographically bound to the exact origin it was registered for — the browser will simply not produce a valid signature for a lookalike domain, so a phishing page gets nothing usable even if it perfectly fools the human. The origin-binding is enforced by the platform itself, not by user vigilance, which is what makes it structurally phishing-resistant rather than merely "harder to phish."',
            },
            {
              question: 'Walk through what actually happens, mechanically, during a WebAuthn passkey registration ceremony.',
              answer:
                'The browser requests registration from the server, which responds with a random challenge and its relying-party ID (its origin). The browser hands this to the device\'s authenticator (a secure enclave, TPM, or hardware key), which generates a brand-new asymmetric key pair scoped specifically to that origin, signs the challenge with the new private key, and returns the public key plus the signed challenge and attestation data. The private key never leaves the device\'s secure hardware; the server stores only the public key against the user\'s account. On every future login, the server issues a fresh challenge and the device signs it again with the same origin-bound private key — the server verifies the signature with the stored public key and never needs to store, transmit, or compare anything resembling a shared secret.',
            },
            {
              question: "What's the difference between SP-initiated and IdP-initiated SSO, and why do security teams generally prefer SP-initiated?",
              answer:
                'In SP-initiated SSO, the user starts at the service provider (the application), which redirects them to the identity provider with a specific authentication request and later validates the resulting assertion against that exact outstanding request. In IdP-initiated SSO, the user starts by clicking a tile inside the identity provider\'s own dashboard, and the SP receives an assertion it never explicitly requested, with no request to correlate it against. SP-initiated is generally preferred because that correlation closes a class of replay and assertion-confusion attacks that IdP-initiated flows are historically more exposed to — though IdP-initiated remains common in practice for the dashboard-launcher convenience it offers end users.',
            },
            {
              question: 'Architecturally, how does an API key differ from an OAuth 2.0 Client Credentials access token, and when would you choose one over the other?',
              answer:
                'An API key is typically a single long-lived static secret identifying an entire integration or account, checked by simple string comparison, with no built-in expiry or standardized scoping — revocation and rotation are manual, key-by-key operations. An OAuth Client Credentials token is issued dynamically by an authorization server after the calling service authenticates with its own client_id/client_secret (or a signed assertion), is short-lived by design, and can be scoped narrowly to exactly the permissions that specific request needs — the blast radius of a leak is capped by the token\'s short expiry. Reach for a plain API key for simple third-party integrations where standing up full OAuth infrastructure is overkill; reach for Client Credentials when you already have an OAuth-based architecture and want short-lived, individually scoped, centrally auditable machine-to-machine tokens.',
            },
            {
              question: 'Why is credential stuffing a distinct threat from classic brute-forcing, and what defenses specifically target it that a simple per-account rate limit does not?',
              answer:
                'Brute-forcing guesses many passwords against one known account and is naturally slowed by a per-account rate limit. Credential stuffing instead takes username/password pairs leaked from an unrelated breach and replays them, largely unchanged, against many different accounts at once, betting purely on password reuse — a per-account limit does little because each individual account might only see one or two attempts. The defenses that specifically target it operate at a different layer: per-IP/per-device and bot-behavior rate limiting (since the traffic pattern looks like automation hitting many accounts, not one account being hammered), CAPTCHAs that specifically challenge suspicious traffic patterns, and — most directly — rejecting passwords that already appear in known-breach lists at registration/change time, so a stuffed credential simply never becomes valid on your system in the first place.',
            },
            {
              question: 'Why can locking an account after N failed login attempts itself become a security vulnerability, and how do production systems avoid it?',
              answer:
                'An attacker who has no realistic chance of guessing the password can still submit N deliberately wrong attempts to trigger a hard lockout, denying the legitimate account owner access to their own account — turning a defensive mechanism into an attack vector against availability. Production systems avoid this by preferring increasing delays (exponential backoff) over an outright lock, requiring a CAPTCHA or step-up challenge rather than a full lock once attempts look suspicious, scoping any hard lock to be time-boxed rather than indefinite, and notifying the account owner when lockout-triggering activity occurs so they are aware even if the attack itself fails.',
            },
            {
              question: 'For a browser-based SPA, would you store a JWT in localStorage or in a cookie, and how does that choice change which attack (XSS or CSRF) you need to defend against?',
              answer:
                'Storing the JWT in localStorage means any successful XSS on the page can read and exfiltrate it directly (JavaScript has full read access to localStorage), so the primary defense burden shifts almost entirely onto preventing XSS in the first place — output encoding and a strict Content-Security-Policy. Storing it in an HttpOnly cookie instead means JavaScript, and therefore a successful XSS payload, cannot read the token directly — but the browser will now attach that cookie automatically to any request to your domain regardless of which site triggered it, reintroducing CSRF as the attack to defend against via SameSite and/or an explicit CSRF token. Neither storage location is a free lunch; the choice trades which specific attack class you must actively mitigate, and the answer that demonstrates real understanding is naming that tradeoff explicitly rather than picking one option as universally "safer."',
            },
          ],
        },
      ],
    },
  ],
}
