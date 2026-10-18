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
            'Never store plaintext passwords; hash with a slow, password-specific algorithm — Argon2id by default, scrypt or bcrypt as acceptable alternatives, PBKDF2 only when FIPS compliance demands it.',
            'Modern policy (NIST SP 800-63B-4): favor length over composition rules, never force periodic rotation, screen against breached-password lists, and allow paste/password managers.',
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
            {
              type: 'heading',
              text: 'Choosing and tuning the algorithm',
            },
            {
              type: 'p',
              text: 'The whole point of a password hash is to make *each guess* expensive for an attacker who has stolen your database. "Memory-hard" matters because GPUs and ASICs have enormous parallel compute but comparatively little fast memory per core — forcing every guess to touch tens of megabytes of RAM collapses the attacker\'s parallelism advantage. The parameters below are the minimums the [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) recommends; tune upward until a single hash takes a few hundred milliseconds on your production hardware, then re-benchmark every year or two.',
            },
            {
              type: 'table',
              headers: ['Algorithm', 'Baseline parameters (OWASP)', 'When to use', 'Gotchas'],
              rows: [
                ['Argon2id', 'm = 19 MiB, t = 2, p = 1 (or higher memory with lower t)', 'Default choice for new systems', 'Memory cost multiplies by concurrent logins — size your auth pods for login spikes'],
                ['scrypt', 'N = 2^17, r = 8, p = 1', 'When Argon2 bindings are unavailable', 'Parameters are less intuitive; easy to under-tune'],
                ['bcrypt', 'cost (work factor) >= 10', 'Legacy systems; still acceptable', 'Silently truncates input at 72 bytes; not memory-hard'],
                ['PBKDF2-HMAC-SHA256', '600,000 iterations', 'Only when FIPS-140 compliance forces it', 'Not memory-hard, so GPU-friendly — needs very high iteration counts'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Argon2id hashing with transparent rehash-on-login (Node.js, argon2 package)',
              code: `import argon2 from 'argon2';

const HASH_OPTS = {
  type: argon2.argon2id,
  memoryCost: 19456, // KiB = 19 MiB
  timeCost: 2,
  parallelism: 1,
} as const;

export async function hashPassword(plain: string): Promise<string> {
  // Output is a self-describing PHC string:
  // $argon2id$v=19$m=19456,t=2,p=1$<salt>$<hash>
  // Salt and parameters travel WITH the hash — no separate salt column needed.
  return argon2.hash(plain, HASH_OPTS);
}

export async function verifyAndUpgrade(user: { id: string; passwordHash: string }, plain: string) {
  const ok = await argon2.verify(user.passwordHash, plain); // constant-time internally
  if (!ok) return false;

  // Parameters only ever go up. Because the PHC string records the params used,
  // you can upgrade old hashes the next time the user logs in successfully.
  if (argon2.needsRehash(user.passwordHash, HASH_OPTS)) {
    await db.users.update(user.id, { passwordHash: await hashPassword(plain) });
  }
  return true;
}`,
            },
            {
              type: 'heading',
              text: 'Modern password policy (NIST SP 800-63B-4)',
            },
            {
              type: 'p',
              text: 'NIST\'s current Digital Identity Guidelines (revision 4, finalized in 2025) codify what usability research has shown for years: composition rules and forced rotation make passwords *weaker*, because users respond with predictable patterns (`Summer2026!` becomes `Autumn2026!`).',
            },
            {
              type: 'list',
              items: [
                '**Length over complexity**: at least 15 characters when a password is the *only* factor, at least 8 when it is one factor of MFA; accept at least 64 characters, spaces, and Unicode.',
                '**No composition rules** (no mandatory "one uppercase, one symbol") and **no periodic forced rotation** — require a change only on evidence of compromise.',
                '**Blocklist check**: compare new passwords against breached-password corpora, dictionary words, and context-specific words (the service name, the username).',
                '**No password hints or knowledge-based "security questions"** for recovery — they are guessable and often publicly researchable.',
                '**Allow paste and password managers** — blocking paste actively discourages long, random, manager-generated passwords.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'bcrypt only hashes the first 72 bytes of input. If you "pepper" by concatenating a long secret *before* the password, or a user enters a long passphrase in multi-byte UTF-8, everything past byte 72 is ignored — at worst every password hashes identically. If you must pre-hash for bcrypt, HMAC the password with the pepper and base64-encode the result (raw binary digests can contain NUL bytes that some bcrypt implementations treat as a terminator). Better: use Argon2id and apply the pepper as an HMAC or by encrypting the stored hash with a key held in a KMS, which also makes pepper rotation possible.',
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
                ['Per-request cost', 'One fast key-value lookup (sub-millisecond in Redis)', 'Signature verification (CPU only) — plus key fetch/caching via JWKS'],
                ['Stale authorization data', 'Never stale — read fresh state each request', 'Claims frozen at issuance until the token expires'],
              ],
            },
            {
              type: 'p',
              text: 'The framing "sessions vs JWTs" hides a third, very common option: an **opaque access token** (a random string, like a session ID) that resource servers validate by calling the authorization server\'s **token introspection** endpoint (RFC 7662), usually with a short cache. You get instant revocation and no claims leakage to the client, at the price of a network hop. Many large providers issue opaque tokens to third-party clients and use JWTs only internally.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'For a classic server-rendered web app or a single-origin SPA served by your own backend, a server-side session cookie is still the simplest and often most secure choice in 2026. Stateless tokens earn their complexity when many independent services or third parties must verify identity without sharing a session store — not merely because the frontend is written in React.',
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
              code: 'flowchart LR\n    subgraph Issue["Signing (Auth Server)"]\n        Claims[Claims: sub, exp, roles] --> Sign[Sign with private/shared key]\n        Sign --> Token[header.payload.signature]\n    end\n    subgraph Verify["Verification (Any Resource Server)"]\n        Token2[Incoming JWT] --> Check["Verify signature with issuer key<br/>(algorithm pinned in advance)"]\n        Check -->|valid| Trust[Trust claims, no DB lookup]\n        Check -->|invalid| Reject[Reject request]\n    end\n    Token -.sent as Authorization: Bearer.-> Token2',
            },
            {
              type: 'p',
              text: '**HS256 vs RS256** — a frequently tested distinction: HS256 uses one shared secret for both signing and verification, fine when only one party (a single backend) ever needs to verify tokens. RS256 uses a private key to sign and a public key to verify — the public key can be distributed to any number of services that need to verify tokens without ever holding the ability to *create* valid ones, which is why RS256 (or ES256) is the correct choice whenever multiple services or third parties verify tokens issued by a central auth server.',
            },
            {
              type: 'table',
              headers: ['alg', 'Type', 'Key / signature size', 'Notes'],
              rows: [
                ['HS256', 'HMAC (symmetric)', '>= 256-bit secret / 32 bytes', 'Every verifier can also mint tokens; only for a single trust domain'],
                ['RS256 / PS256', 'RSA (asymmetric)', '2048+ bit key / 256 bytes', 'Most widely supported; PS256 uses the more robust PSS padding'],
                ['ES256', 'ECDSA P-256', '256-bit key / 64 bytes', 'Compact and fast to sign; common default in modern IdPs'],
                ['EdDSA (Ed25519)', 'Edwards curve', '256-bit key / 64 bytes', 'Deterministic, fast, hard to misuse; check library and IdP support'],
              ],
            },
            {
              type: 'heading',
              text: 'Key distribution and rotation with JWKS',
            },
            {
              type: 'p',
              text: 'Asymmetric issuers publish their public keys as a **JSON Web Key Set** at a well-known URL (for OIDC, the `jwks_uri` advertised in `/.well-known/openid-configuration`). Each token header carries a `kid` (key ID) telling the verifier which key in the set to use. Rotation is then a zero-downtime dance: publish the new key in the JWKS, wait for verifier caches to pick it up, start signing with it, and remove the old key only after every token signed by it has expired.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Verifying an access token correctly (jose library)',
              code: `import { createRemoteJWKSet, jwtVerify } from 'jose';

// Cached, rate-limited fetch of the issuer's public keys; refetches on unknown kid.
const JWKS = createRemoteJWKSet(new URL('https://auth.example.com/.well-known/jwks.json'));

export async function authenticate(authHeader: string | undefined) {
  if (!authHeader?.startsWith('Bearer ')) throw new HttpError(401, 'missing token');
  const token = authHeader.slice('Bearer '.length);

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: 'https://auth.example.com',      // iss must match exactly
    audience: 'https://api.example.com',     // reject tokens minted for other APIs
    algorithms: ['ES256'],                   // pin — never trust the header's alg
    clockTolerance: 30,                      // seconds of skew for exp/nbf
    typ: 'at+jwt',                           // RFC 9068 access tokens; blocks ID-token substitution
  });

  return { userId: payload.sub!, scopes: String(payload.scope ?? '').split(' ') };
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'JWS (signed) is what people usually mean by "JWT". JWE (encrypted) also exists and hides claims from the client, but adds key-management complexity. If you need confidentiality, an opaque reference token is usually simpler than JWE.',
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
                '**Storing JWTs in `localStorage`** exposes them to any XSS on the page. Prefer keeping tokens out of JavaScript entirely — a Backend-for-Frontend holding tokens server-side behind an `HttpOnly`, `Secure`, `SameSite=Lax` session cookie (which then requires CSRF protection instead — see Session Security and the BFF topic).',
                '**Putting sensitive data in the payload** — it\'s base64, not encryption; never put a password, SSN, or other secret in a claim.',
                '**No revocation plan** — always pair short-lived access tokens with a revocable refresh mechanism.',
                '**Skipping `aud` and `iss` checks** — a perfectly valid token issued for *another* API (or another tenant\'s IdP) is accepted. This "confused deputy" bug is far more common in practice than signature forgery.',
                '**Trusting `kid`, `jku`, or `x5u` headers blindly** — `kid` has been abused for path traversal and SQL injection when used to look up keys from files or databases; `jku`/`x5u` let an attacker point the verifier at *their own* key set. Only resolve keys from a JWKS URL you configured.',
                '**Token-type confusion** — accepting an OIDC ID token as an API access token (or vice versa). Check `typ` (e.g. `at+jwt`) and use distinct audiences.',
                '**Weak HMAC secrets** — an HS256 token signed with a guessable secret can be brute-forced offline from a single captured token; use at least 256 bits of randomness.',
              ],
            },
            {
              type: 'p',
              text: 'The consolidated guidance lives in **RFC 8725, JSON Web Token Best Current Practices**: pin algorithms, validate every relevant claim (`iss`, `aud`, `exp`, `nbf`), use explicit typing, and never let input from the token itself decide how the token is verified. Use a maintained library (jose, PyJWT, Nimbus, java-jwt) with its strict options turned on, rather than hand-rolling verification.',
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
          id: 'token-lifecycle-refresh-rotation',
          title: 'Token Lifecycle: Refresh Rotation, Reuse Detection & Revocation',
          summary:
            'Short-lived access tokens are only half the design — the refresh token is a long-lived, high-value credential, and how you rotate, bind, and revoke it decides whether a stolen token is a five-minute nuisance or a month-long account takeover.',
          keyPoints: [
            'Access tokens: short-lived (minutes), verified locally. Refresh tokens: long-lived, always checked against server-side state.',
            'Refresh token rotation: every refresh returns a new refresh token and invalidates the old one.',
            'Reuse detection: if a retired refresh token is ever presented again, assume theft and revoke the whole token family.',
            'Public clients (SPAs, mobile) must use rotation or sender-constrained refresh tokens — RFC 9700 requires one or the other.',
            'Pair absolute lifetimes (e.g. 30 days) with idle timeouts (e.g. 7 days) so abandoned sessions die on their own.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A refresh token is effectively a long-lived password for one client. If it leaks from a mobile device backup, a log file, or browser storage, the attacker can mint access tokens silently for as long as it remains valid. **Rotation** limits that: each use returns a brand-new refresh token, and the server remembers the old one as "spent". **Reuse detection** turns rotation into an alarm: legitimate clients never present a spent token, so seeing one means two parties hold copies — the server cannot tell which is the attacker, so it revokes the entire family and forces re-authentication.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client as Legit Client\n    participant Attacker\n    participant AS as Authorization Server\n\n    Client->>AS: refresh with RT1\n    AS-->>Client: AT2 + RT2 (RT1 marked spent)\n    Note over Attacker: Attacker stole RT1 earlier\n    Attacker->>AS: refresh with RT1\n    AS->>AS: RT1 already spent - reuse detected\n    AS->>AS: revoke whole family (RT2 included)\n    AS-->>Attacker: 400 invalid_grant\n    Client->>AS: refresh with RT2\n    AS-->>Client: 400 invalid_grant - user must log in again',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Rotation with reuse detection (server side, simplified)',
              code: `async function refresh(presented: string, clientId: string) {
  const hash = sha256(presented);               // store only hashes of refresh tokens
  const rt = await db.refreshTokens.findByHash(hash);
  if (!rt || rt.clientId !== clientId) throw invalidGrant();

  if (rt.revokedAt || rt.familyRevokedAt) throw invalidGrant();

  if (rt.usedAt) {
    // A spent token came back: two holders exist. Kill the family.
    await db.refreshTokens.revokeFamily(rt.familyId, 'reuse_detected');
    await securityEvents.emit('refresh_token_reuse', { userId: rt.userId, familyId: rt.familyId });
    throw invalidGrant();
  }

  if (rt.absoluteExpiry < now() || rt.lastUsedAt + IDLE_TIMEOUT < now()) throw invalidGrant();

  // Atomic: mark used + insert successor in one transaction (guards double-submit races)
  const next = randomToken(32);
  await db.tx(async (tx) => {
    const updated = await tx.refreshTokens.markUsedIfUnused(rt.id);
    if (!updated) throw invalidGrant();          // lost a race with a concurrent refresh
    await tx.refreshTokens.insert({
      hash: sha256(next), familyId: rt.familyId, userId: rt.userId, clientId,
      absoluteExpiry: rt.absoluteExpiry,          // rotation never extends the absolute lifetime
    });
  });

  return { access_token: await mintAccessToken(rt.userId, clientId), refresh_token: next };
}`,
            },
            {
              type: 'table',
              headers: ['Mechanism', 'What it gives you', 'Cost'],
              rows: [
                ['Short access-token TTL (5-15 min)', 'Caps the window of an un-revocable stolen access token', 'More refresh traffic'],
                ['Refresh rotation + reuse detection', 'Detects theft of refresh tokens from public clients', 'Race handling; spurious logouts on flaky networks'],
                ['Sender-constrained refresh tokens (DPoP/mTLS)', 'Stolen token is useless without the private key', 'Client key management'],
                ['Revocation endpoint (RFC 7009)', 'Logout actually kills the refresh token', 'Must be called by the client'],
                ['Token family / session epoch per user', '"Log out everywhere" and post-password-change revocation', 'Server-side state (which you already have)'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Mobile apps and SPAs frequently fire several API calls at once when the access token expires, each triggering its own refresh with the same refresh token — with strict reuse detection, the second request looks like theft and logs the user out. Fix it on both sides: the client should serialize refreshes behind a single in-flight promise, and the server can allow a very short grace period (a few seconds) in which the just-rotated token returns the same successor instead of tripping the alarm.',
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
                '**SMS/voice OTP** — sends a one-time code to the user\'s phone number. Vulnerable to SIM-swapping (a social-engineering attack against the carrier) and, more fundamentally, to weaknesses in the SS7 telecom signaling protocol — neither requires physical access to the device. NIST SP 800-63B-4 classifies authentication over the phone network as a **restricted** authenticator: agencies may use it only after documenting the risk and must offer users a non-restricted alternative.',
                '**Push approval** (Okta Verify, Duo) — the app shows "approve this login?" as a tap. Convenient, but enables **MFA fatigue / push-bombing**: an attacker who already has the password sends repeated push prompts hoping the user taps "approve" out of habit or annoyance. Number-matching (the user must enter a number shown on the login screen into the app) closes this gap.',
                '**Hardware security keys / WebAuthn** — the strongest common possession factor, and phishing-resistant by design; covered in depth in the next topic.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'MFA fatigue attacks were behind several high-profile real-world breaches (attackers with a leaked password simply spammed push approvals until an exhausted employee tapped "yes"). Number-matching push, or moving to WebAuthn/hardware keys entirely, are the standard mitigations — not just "more prompts."',
            },
            {
              type: 'heading',
              text: 'Phishable vs phishing-resistant factors',
            },
            {
              type: 'p',
              text: 'The most important modern distinction is not "how many factors" but "can the factor be relayed". **Adversary-in-the-middle (AiTM) phishing kits** — reverse proxies such as Evilginx sitting between the victim and the real site — forward the password *and* the TOTP code or push approval in real time, then steal the resulting session cookie. Against these kits, TOTP, SMS, and push all fail equally; only origin-bound authenticators (WebAuthn/passkeys, smart cards with TLS client auth) stop them, which is why NIST SP 800-63B-4 and CISA guidance single out *phishing-resistant* MFA as the target for high-value accounts.',
            },
            {
              type: 'table',
              headers: ['Factor', 'Phishing-resistant?', 'Main weakness', 'Good for'],
              rows: [
                ['SMS / voice OTP', 'No', 'SIM swap, SS7, AiTM relay (NIST classifies it as "restricted")', 'Fallback only, with risk acceptance'],
                ['TOTP app', 'No', 'AiTM relay; shared secret stored server-side', 'Broad consumer baseline'],
                ['Push with number matching', 'No', 'AiTM relay, social engineering', 'Workforce convenience'],
                ['Passkey / FIDO2 key', 'Yes', 'Account recovery becomes the weak link', 'Everyone — the target state'],
                ['Smart card / PIV (mTLS)', 'Yes', 'Hardware logistics', 'Government, regulated industries'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'Verifying TOTP with replay protection (pyotp)',
              code: `from datetime import datetime, timezone
import pyotp

def verify_totp(user, code: str) -> bool:
    totp = pyotp.TOTP(user.totp_secret)          # RFC 6238: 30 s step, 6 digits, HMAC-SHA1 default
    # valid_window=1 accepts the previous/next step to tolerate clock drift
    if not totp.verify(code, valid_window=1):
        return False
    # A code stays valid for its whole window — reject reuse of the same time step,
    # otherwise a shoulder-surfed or relayed code can be replayed seconds later.
    step = totp.timecode(datetime.now(timezone.utc))
    if user.last_totp_step is not None and step <= user.last_totp_step:
        return False
    user.last_totp_step = step
    user.save()
    return True`,
            },
            {
              type: 'list',
              items: [
                '**Encrypt TOTP secrets at rest** (KMS-wrapped) — unlike password hashes, the server must recover the raw secret to compute codes, so a DB leak exposes every user\'s second factor.',
                '**Rate-limit the second-factor step separately**: a 6-digit code has only a million possibilities; without limits, an attacker who already holds the password can brute-force it within the drift window.',
                '**Issue single-use recovery codes** at enrollment, store them hashed, and treat their use as a security event that notifies the user.',
                '**Bind the MFA result to the session** (record `amr`/`acr` and an MFA timestamp) so downstream services can require step-up for sensitive actions.',
              ],
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
            {
              type: 'heading',
              text: 'Client side: autofill sign-in (conditional mediation)',
            },
            {
              type: 'p',
              text: 'The UX breakthrough that made passkeys mainstream is **conditional mediation**: instead of a separate "Sign in with passkey" button, the browser offers saved passkeys inside the username field\'s autofill dropdown, so users who have one just pick it and users who don\'t carry on typing. Modern browsers also expose JSON helpers that remove the old base64url/ArrayBuffer conversion boilerplate.',
            },
            {
              type: 'code',
              language: 'html',
              title: 'Username field that also offers passkeys',
              code: `<input type="text" name="username" autocomplete="username webauthn" />`,
            },
            {
              type: 'code',
              language: 'js',
              title: 'Starting a conditional passkey sign-in on page load',
              code: `async function startPasskeyAutofill() {
  if (!window.PublicKeyCredential?.isConditionalMediationAvailable) return;
  if (!(await PublicKeyCredential.isConditionalMediationAvailable())) return;

  // Server returns options with a fresh, single-use challenge bound to this login attempt
  const optionsJSON = await fetch('/webauthn/login/options', { method: 'POST' }).then((r) => r.json());

  const credential = await navigator.credentials.get({
    mediation: 'conditional',                     // show in autofill, no modal
    publicKey: PublicKeyCredential.parseRequestOptionsFromJSON(optionsJSON),
  });

  // credential.toJSON() serializes the assertion for the server to verify
  const res = await fetch('/webauthn/login/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credential.toJSON()),
  });
  if (res.ok) location.assign('/app');
}`,
            },
            {
              type: 'heading',
              text: 'Server side: what verification actually checks',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'The `challenge` in `clientDataJSON` equals the one you issued, is unexpired, and is consumed (single use).',
                'The `origin` in `clientDataJSON` is one of your expected origins, and `type` is `webauthn.get` (or `webauthn.create`).',
                'The `rpIdHash` in authenticator data equals SHA-256 of your RP ID (e.g. `example.com`).',
                'The user-present flag is set, and the user-verified (UV) flag is set if you require biometric/PIN (you usually should for passwordless).',
                'The signature over `authenticatorData || SHA-256(clientDataJSON)` verifies with the stored public key for that credential ID.',
                'The signature counter, if non-zero, increased — but synced passkeys usually report 0, so treat a counter regression as a signal, not a hard failure.',
              ],
            },
            {
              type: 'table',
              headers: ['Concept', 'What it means', 'Practical guidance'],
              rows: [
                ['RP ID', 'The registrable domain a credential is scoped to', 'Choose carefully (e.g. `example.com` rather than `login.example.com`) — it cannot be changed later without re-enrollment'],
                ['Discoverable credential', 'Authenticator stores the user handle, enabling username-less login', 'Required for passkey autofill; set `residentKey: "required"`'],
                ['User verification', 'Biometric or PIN performed locally', 'Use `required` when the passkey is the only factor'],
                ['Attestation', 'Proof of authenticator make/model', 'Use `none` for consumer apps; use enterprise attestation only when you must restrict to approved hardware'],
                ['Synced vs device-bound', 'Key replicated via a cloud keychain, or locked to one device', 'NIST SP 800-63B-4 accepts syncable authenticators at AAL2; AAL3 still needs device-bound keys'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Plan the passkey rollout as an *upgrade path*, not a big-bang replacement: offer passkey creation right after a successful password login, use conditional mediation on the login page, keep passwords as a fallback for a while, and use the WebAuthn Signal API (where supported) to tell credential managers when a passkey was deleted server-side so users stop seeing dead entries in autofill.',
            },
          ],
        },
        {
          id: 'account-recovery',
          title: 'Account Recovery & Account Lifecycle Security',
          summary:
            'Your authentication is only as strong as the weakest path back into an account — password resets, lost-device recovery, and email changes are where attackers go once the front door is hardened with MFA and passkeys.',
          keyPoints: [
            'Every recovery path is an alternative login flow; threat-model it with the same rigor as the primary login.',
            'Reset tokens must be high-entropy, single-use, short-lived, stored hashed, and bound to one account.',
            'Never let a reset or recovery flow bypass MFA silently — downgrade from passkey to "email link" erases the passkey\'s phishing resistance.',
            'Changes to recovery channels (email, phone, MFA devices) are high-risk events: require step-up, notify the old channel, and add a cooling-off delay.',
            'Help-desk social engineering is a top real-world vector — give support staff strong verification procedures and no unilateral "remove MFA" button.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Attackers follow the path of least resistance. Once an organization rolls out phishing-resistant MFA, the cheapest attack becomes convincing a help-desk agent to reset it, abusing a "forgot password" flow that only asks for an email link, or hijacking the email account that receives reset links. Several widely reported enterprise breaches of the last few years began exactly this way: a phone call to the service desk, not a technical exploit.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n    Start[Forgot password / lost device] --> Req[Request reset<br/>uniform response, rate-limited]\n    Req --> Token["Email single-use token<br/>256-bit, 15-60 min TTL, hashed at rest"]\n    Token --> Click[User opens link]\n    Click --> Check{Has strong factor<br/>e.g. passkey or TOTP?}\n    Check -->|yes| Step[Require that factor too]\n    Check -->|no| Set[Set new password]\n    Step --> Set\n    Set --> Revoke[Revoke all sessions and refresh tokens]\n    Revoke --> Notify[Notify user on all channels]',
            },
            {
              type: 'list',
              items: [
                '**Reset tokens**: generate with a CSPRNG (at least 128, ideally 256 bits), store only a hash, expire in minutes, invalidate on use and when a newer token is issued. Never derive them from user data or timestamps.',
                '**Don\'t leak the token**: the reset page must not load third-party scripts or images that receive the URL via the `Referer` header — set `Referrer-Policy: no-referrer` on it, and move the token out of the URL (e.g. into a form POST) as soon as the page loads.',
                '**Host-header poisoning**: build reset links from a configured base URL, never from the incoming `Host` header, or an attacker can make your mailer send victims a link to their domain.',
                '**After reset**: revoke every existing session and refresh token, and do not auto-log-in on the reset page unless the reset also proved a second factor.',
                '**Recovery for passkey-only accounts**: offer multiple registered passkeys (phone + laptop + hardware key), recovery codes, or a verified identity process — not an SMS fallback that quietly downgrades assurance.',
                '**Recovery-channel changes**: changing the email or phone that receives recovery messages should require step-up authentication, notify the *old* address, and ideally take effect after a delay so the real owner can cancel.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A classic bug: the reset endpoint accepts `{ email, token, newPassword }` and looks up the token without confirming it belongs to that email — or accepts an array of emails and sends the same token to all of them. Bind the token to a single user ID server-side and ignore any identity fields the client sends alongside it.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Help-desk resets are an authentication flow too. Require verification the attacker cannot research or socially engineer (a video-verified identity check, manager approval, or a callback to a number on file), log every MFA reset as a security event, and alert the user out-of-band.',
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
            {
              type: 'heading',
              text: 'A hardened session cookie',
            },
            {
              type: 'code',
              language: 'text',
              title: 'Recommended Set-Cookie for a session',
              code: `Set-Cookie: __Host-session=9f8a...e1; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=28800`,
            },
            {
              type: 'table',
              headers: ['Attribute', 'Defends against', 'Detail'],
              rows: [
                ['`__Host-` prefix', 'Cookie injection from subdomains or plain HTTP', 'Browser rejects it unless `Secure`, `Path=/`, and no `Domain` — so a compromised `blog.example.com` cannot overwrite it'],
                ['`HttpOnly`', 'Direct token theft by XSS', 'XSS can still *use* the session by making requests from the page — it just cannot exfiltrate the cookie'],
                ['`Secure`', 'Network sniffing / downgrade', 'Combine with HSTS so the first request is never plain HTTP'],
                ['`SameSite=Lax`', 'Most CSRF', 'Sent on top-level GET navigations, not on cross-site POSTs, iframes, or fetches; Chromium treats cookies without SameSite as Lax by default'],
                ['`SameSite=Strict`', 'CSRF including top-level GETs', 'Breaks inbound links and OAuth/SSO redirects (user appears logged out) — often used for a second, high-privilege cookie only'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Session fixation**: always issue a *new* session ID on login and on privilege change (e.g. after MFA); otherwise an attacker who planted a known ID before login inherits the authenticated session.',
                '**"Same-site" is not "same-origin"**: `SameSite` treats `evil.example.com` and `app.example.com` as the same site, so a vulnerable sibling subdomain can still mount CSRF. Defense in depth: a CSRF token (synchronizer or signed double-submit) or checking the `Origin` / `Sec-Fetch-Site` headers on state-changing requests.',
                '**Fetch Metadata**: modern browsers send `Sec-Fetch-Site: cross-site` on cross-site requests; a small server middleware that rejects cross-site non-navigational requests to state-changing endpoints blocks CSRF and many cross-site leak attacks cheaply.',
                '**Timeouts**: combine an idle timeout with an absolute lifetime, and require re-authentication (step-up) for sensitive actions regardless of session age.',
                '**Session hijacking via infostealer malware** is now a leading account-takeover vector: malware copies cookies straight off the device, bypassing MFA entirely. Mitigations include binding sessions to device keys (the emerging Device Bound Session Credentials proposal), anomaly detection on IP/ASN/device changes, and short session lifetimes for privileged users.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'XSS defeats every cookie attribute. An injected script cannot read an `HttpOnly` cookie, but it can make any authenticated request the user could make, from the user\'s own browser, with the cookie attached automatically. Treat XSS prevention (contextual output encoding, a nonce- or hash-based Content-Security-Policy, Trusted Types) as part of your auth design, not a separate concern.',
            },
          ],
        },
        {
          id: 'browser-token-storage-bff',
          title: 'Browser Apps: Token Storage & the Backend-for-Frontend (BFF) Pattern',
          summary:
            'Where an SPA keeps its tokens is one of the most argued-about questions in web security — the current IETF guidance for browser-based apps ranks the options, and the Backend-for-Frontend pattern, which keeps tokens out of JavaScript entirely, comes out on top for anything sensitive.',
          keyPoints: [
            'Any token readable by JavaScript is readable by an XSS payload — localStorage, sessionStorage, and in-memory variables all fall to a determined attacker.',
            'BFF: a thin server component on your origin runs the OAuth flow as a confidential client, keeps tokens server-side, and gives the browser only an HttpOnly session cookie.',
            'Token-mediating backend: the backend obtains tokens but hands short-lived access tokens to the SPA — a middle ground.',
            'Pure browser-based OAuth client: Authorization Code + PKCE in the SPA, with refresh rotation or DPoP — acceptable for lower-risk apps.',
            'The Implicit flow is obsolete; never use it for new SPAs.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'The old debate — "localStorage is vulnerable to XSS, cookies are vulnerable to CSRF" — is real but incomplete. Moving a token from localStorage to an in-memory variable does not make it XSS-proof: a malicious script can monkey-patch `fetch` to capture it, or simply run its own Authorization Code flow in a hidden iframe to obtain fresh tokens. The IETF\'s *OAuth 2.0 for Browser-Based Applications* guidance therefore concludes that the only robust way to keep tokens away from XSS is to keep them **out of the browser entirely**.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant SPA as SPA (app.example.com)\n    participant BFF as BFF (same origin, /bff)\n    participant AS as Authorization Server\n    participant API as Resource API\n\n    SPA->>BFF: GET /bff/login\n    BFF-->>SPA: 302 to AS /authorize (PKCE, state)\n    SPA->>AS: user authenticates\n    AS-->>BFF: redirect with code\n    BFF->>AS: POST /token (client auth + code_verifier)\n    AS-->>BFF: access + refresh tokens (stored server-side)\n    BFF-->>SPA: Set-Cookie __Host-sid (HttpOnly, SameSite)\n    SPA->>BFF: GET /bff/api/orders (cookie only)\n    BFF->>API: GET /orders (Authorization: Bearer AT)\n    API-->>BFF: data\n    BFF-->>SPA: data',
            },
            {
              type: 'table',
              headers: ['Architecture', 'Where tokens live', 'XSS impact', 'Complexity'],
              rows: [
                ['BFF', 'Server only; browser holds an HttpOnly session cookie', 'Attacker can act while the page is open, but cannot steal tokens for later use', 'Requires a server component and CSRF defenses'],
                ['Token-mediating backend', 'Backend holds refresh token; SPA gets short-lived access tokens', 'Access tokens can be stolen, refresh token cannot', 'Moderate'],
                ['Browser-based OAuth client', 'SPA memory (refresh token rotated or DPoP-bound)', 'Attacker can obtain and exfiltrate tokens', 'Lowest server footprint'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Minimal BFF proxy route (Express)',
              code: `app.use('/bff/api', requireSameSiteRequest, async (req, res) => {
  const session = await sessions.get(req.cookies['__Host-sid']);
  if (!session) return res.sendStatus(401);

  // Refresh transparently when the access token is about to expire
  if (session.accessTokenExpiresAt - Date.now() < 30_000) {
    Object.assign(session, await oauthClient.refresh(session.refreshToken));
    await sessions.save(session);
  }

  const upstream = await fetch('https://api.example.com' + req.url, {
    method: req.method,
    headers: { authorization: \`Bearer \${session.accessToken}\`, 'content-type': 'application/json' },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
  });
  res.status(upstream.status).send(await upstream.text());
});

// CSRF defense for the cookie-authenticated proxy: reject cross-site requests
function requireSameSiteRequest(req, res, next) {
  const site = req.get('sec-fetch-site');
  if (site && site !== 'same-origin') return res.sendStatus(403);
  next();
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A BFF also simplifies everything else: the SPA no longer needs an OAuth library, token refresh races disappear from the frontend, the client can be confidential (using `private_key_jwt` client authentication), and logout is a single server-side session deletion. Frameworks with a server runtime (Next.js, Nuxt, SvelteKit, Remix-style routers) make the BFF essentially free to add.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'The BFF reintroduces cookie-based auth, so CSRF protections from the Session Security topic apply again. And it does not make XSS harmless — the attacker can still drive the BFF while the victim\'s tab is open. It removes token *exfiltration*, which is what turns a transient XSS into persistent, offline account access.',
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
            'Implicit and ROPC are out: the OAuth 2.0 Security BCP (RFC 9700, 2025) says not to use them, and the OAuth 2.1 draft omits them entirely.',
            'Always send and verify `state` (CSRF on the redirect), require PKCE with `S256`, and register redirect URIs for exact-string matching.',
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
              text: '**PKCE (Proof Key for Code Exchange, RFC 7636)**: the client generates a high-entropy random `code_verifier`, derives `code_challenge = BASE64URL(SHA256(code_verifier))` with `code_challenge_method=S256`, sends the challenge with the initial `/authorize` request, then sends the original verifier when exchanging the code for a token. PKCE is now expected for all clients, not just public ones (SPAs/mobile): RFC 9700 recommends it for confidential clients too, and the OAuth 2.1 draft makes it the default for every Authorization Code flow. The `plain` method exists for legacy reasons only — never use it.',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'Building a PKCE-protected authorization request (Web Crypto)',
              code: `function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}

export async function buildAuthorizeUrl() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));  // 43 chars
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = base64url(new Uint8Array(digest));
  const state = base64url(crypto.getRandomValues(new Uint8Array(16)));

  // Persist verifier + state for the callback (server session in a BFF; sessionStorage in a pure SPA)
  saveTransaction({ verifier, state });

  const url = new URL('https://auth.example.com/authorize');
  url.search = new URLSearchParams({
    response_type: 'code',
    client_id: 'my-client',
    redirect_uri: 'https://app.example.com/callback',   // must exactly match a registered URI
    scope: 'openid profile orders:read',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  return url.toString();
}`,
            },
            {
              type: 'table',
              headers: ['Grant', 'Use it for', 'Status'],
              rows: [
                ['Authorization Code + PKCE', 'Any app acting on behalf of a user (web, SPA, mobile, desktop)', 'The default'],
                ['Client Credentials', 'Machine-to-machine, no user involved', 'Current'],
                ['Refresh Token', 'Getting new access tokens without user interaction', 'Current; rotate or sender-constrain for public clients'],
                ['Device Authorization (RFC 8628)', 'Input-constrained devices (TVs, CLIs)', 'Current; beware device-code phishing — show clear context on the approval page'],
                ['Token Exchange (RFC 8693)', 'Service-to-service delegation, impersonation, agents', 'Current; see the AI agents topic'],
                ['Implicit', 'Formerly SPAs', 'Do not use (RFC 9700); omitted from OAuth 2.1'],
                ['Resource Owner Password Credentials', 'Formerly "trusted" first-party apps', 'Must not be used (RFC 9700); omitted from OAuth 2.1'],
              ],
            },
            {
              type: 'list',
              items: [
                '**`state`** binds the callback to the browser session that started the flow, preventing login CSRF (an attacker injecting *their* authorization code into your session). PKCE also provides this protection when the server enforces it, but `state` remains good practice and carries app state.',
                '**Exact redirect URI matching** — pattern or prefix matching has produced a long line of token-theft bugs via open redirectors and attacker-controlled subpaths.',
                '**Scopes are coarse ceilings, not fine-grained permissions** — `orders:read` says what the client may ask for; the API still has to check whether *this user* may read *this order*.',
                '**Audience-restrict access tokens** (resource indicators, RFC 8707) so a token for API A cannot be replayed against API B.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'OAuth 2.1 is still an IETF Internet-Draft, not an RFC — but it is a consolidation, not a new protocol: OAuth 2.0 plus PKCE everywhere, exact redirect matching, no Implicit/ROPC, no bearer tokens in query strings, and refresh-token protections. The normative security guidance you can cite today is **RFC 9700 (OAuth 2.0 Security Best Current Practice)**, published in January 2025.',
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
              code: 'flowchart LR\n    AuthServer[Authorization Server<br/>acting as Identity Provider] -->|token response| Both{Two tokens,<br/>two purposes}\n    Both --> AccessToken["Access Token<br/>opaque or JWT<br/>(what can this app do)"]\n    Both --> IDToken["ID Token<br/>always a signed JWT<br/>(who just logged in)"]\n    AccessToken -->|sent to| API[Resource Server / API calls]\n    IDToken -->|validated locally by| Client[Client App<br/>checks signature, iss, aud, exp]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The one-sentence distinction that resolves most confusion: OAuth 2.0 answers "what can this app do on my behalf," OIDC (built on OAuth 2.0) answers "who is this user." A login flow that only obtains an access token but never validates an ID token isn\'t actually authenticating the user — it\'s just obtaining delegated API access.',
            },
            {
              type: 'heading',
              text: 'Validating an ID token',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'Verify the signature using the provider\'s JWKS (discovered from `/.well-known/openid-configuration`), with the algorithm pinned.',
                '`iss` exactly equals the expected issuer — critical in multi-tenant IdPs, where every tenant has a different issuer.',
                '`aud` contains your `client_id` (and if there are multiple audiences, `azp` is your client).',
                '`exp` is in the future; `iat` is recent.',
                '`nonce` equals the value you generated for this login attempt — this binds the ID token to your request and stops replay of a token captured elsewhere.',
                'If you required recent authentication or MFA, check `auth_time`, `acr`, and `amr`.',
              ],
            },
            {
              type: 'table',
              headers: ['Concept', 'What it is', 'Why it matters'],
              rows: [
                ['Discovery', '`/.well-known/openid-configuration` JSON listing endpoints, JWKS URI, supported algorithms', 'Configure clients from one issuer URL; enables key rotation without redeploys'],
                ['`sub` + `iss`', 'The stable, unique user identifier pair', 'Key your user records on `(iss, sub)` — never on email, which can change or be reassigned'],
                ['UserInfo endpoint', 'API returning claims for an access token', 'Fetch extra profile data without bloating the ID token'],
                ['`prompt` / `max_age`', 'Force re-login or bound the age of the authentication', 'Used for step-up and account switching'],
                ['Logout (RP-initiated, back-channel)', 'Specs to end the IdP session and notify other apps', 'Back-channel logout lets the IdP tell your server to kill a session directly'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Account takeover via unverified email: if your app links an OIDC login to an existing account purely because the `email` claim matches, an attacker who can register that email at *some* IdP (or one that does not verify emails) logs into the victim\'s account. Link on `(iss, sub)`; only use email for linking when `email_verified` is true *and* you trust that issuer to be authoritative for that domain.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Never send an ID token to your API as an access token. Its audience is the client, not the API; it carries no scopes; and accepting it trains your API to accept tokens minted for other purposes. The API should require an access token with its own audience.',
            },
          ],
        },
        {
          id: 'oauth-hardening',
          title: 'OAuth in Production: RFC 9700, PAR, Mix-Up & FAPI 2.0',
          summary:
            'Most real OAuth breaches are not cryptographic failures — they are redirect-URI mistakes, leaked codes, mixed-up issuers, and tampered authorization requests. The OAuth Security BCP and a handful of newer RFCs close each of these gaps.',
          keyPoints: [
            'RFC 9700 (OAuth 2.0 Security BCP) is the current normative checklist for any OAuth deployment.',
            'PAR (RFC 9126) moves authorization request parameters from the browser URL into an authenticated back-channel POST.',
            'The `iss` authorization response parameter (RFC 9207) defends clients that talk to multiple authorization servers against mix-up attacks.',
            'Sender-constrained tokens (DPoP or mTLS) make stolen access tokens useless on their own.',
            'FAPI 2.0 bundles these into a high-assurance profile used by open banking and other regulated APIs.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'A plain Authorization Code + PKCE flow is solid, but its front-channel leg — parameters travelling through the user\'s browser in a URL — remains the weak point. The browser is an untrusted intermediary: extensions read URLs, `Referer` headers leak them, open redirectors forward them, and an attacker can edit any parameter before it reaches the authorization server. The modern hardening specs all follow one idea: **move anything security-relevant into authenticated back-channel requests, and bind every artifact to the party that requested it.**',
            },
            {
              type: 'table',
              headers: ['Threat', 'Example', 'Countermeasure'],
              rows: [
                ['Authorization code interception', 'Malicious app registers the same custom URL scheme on mobile', 'PKCE (S256); claimed HTTPS redirect URIs (Universal/App Links)'],
                ['Redirect URI manipulation', 'Prefix-matched URI lets attacker use `/callback/../open-redirect`', 'Exact string matching of pre-registered redirect URIs'],
                ['Request tampering', 'Attacker changes `scope` or `redirect_uri` in the URL', 'PAR (RFC 9126) or signed request objects (JAR, RFC 9101)'],
                ['Mix-up attack', 'Client using two ASes sends a code from honest AS to attacker AS', '`iss` in the authorization response (RFC 9207); distinct redirect URIs per AS'],
                ['Login CSRF', 'Attacker injects their own code into victim\'s session', '`state` bound to the user agent, or enforced PKCE'],
                ['Stolen access token replay', 'Token leaked from logs, proxy, or compromised API', 'Sender-constraining: DPoP (RFC 9449) or mTLS (RFC 8705)'],
                ['Token used at wrong API', 'API A replays a token it received against API B', 'Audience restriction / resource indicators (RFC 8707)'],
              ],
            },
            {
              type: 'heading',
              text: 'Pushed Authorization Requests (PAR)',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client\n    participant Browser\n    participant AS as Authorization Server\n\n    Client->>AS: POST /par (client auth + all params:<br/>scope, redirect_uri, code_challenge, state)\n    AS-->>Client: request_uri=urn:ietf:params:oauth:request_uri:abc, expires_in=60\n    Client->>Browser: redirect to /authorize?client_id=c1&request_uri=urn...abc\n    Browser->>AS: GET /authorize (no tamperable params)\n    AS-->>Browser: login + consent, then redirect with code and iss\n    Browser->>Client: callback?code=...&state=...&iss=...',
            },
            {
              type: 'p',
              text: 'With PAR the authorization server has already authenticated the client and validated every parameter *before* the user ever sees a login page, so nothing in the browser URL can be altered, the URL stays short (no length limits from large `authorization_details`), and the request contents are never exposed in browser history.',
            },
            {
              type: 'heading',
              text: 'Client authentication: retire the shared secret',
            },
            {
              type: 'p',
              text: 'A `client_secret` is a static bearer credential that ends up in config files and CI logs. **`private_key_jwt`** (the client signs a short-lived JWT assertion with its private key; the AS holds only the public key) and **mTLS client authentication** (RFC 8705) are stronger, and both are required options in FAPI 2.0. For workloads running in a cloud or CI system, **workload identity federation** — exchanging a platform-issued OIDC token for credentials — removes long-lived secrets altogether.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '**FAPI 2.0 Security Profile** (OpenID Foundation, final in 2025) is a good template even outside finance: Authorization Code + PKCE, PAR mandatory, sender-constrained tokens (DPoP or mTLS), confidential clients with `private_key_jwt` or mTLS, `iss` response parameter, and short-lived codes. If you are designing a new high-value API, "start from FAPI 2.0 and relax deliberately" beats "start from bare OAuth and harden by accident".',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Open dynamic client registration is an attack surface: if anyone can register a client with any redirect URI and any logo/name, attackers can build convincing consent-phishing apps ("Microsoft Office Helper wants access to your mail"). Restrict registration, review consent screens, and let admins block unverified publishers.',
            },
          ],
        },
        {
          id: 'sender-constrained-tokens',
          title: 'Sender-Constrained Tokens: DPoP & mTLS-Bound Tokens',
          summary:
            'A bearer token works for whoever holds it, like cash. Sender-constrained tokens are bound to a key the legitimate client holds, so a token stolen from a log, a proxy, or browser storage is useless without that private key.',
          keyPoints: [
            'Bearer tokens (RFC 6750) carry no proof of possession — theft equals impersonation until expiry.',
            'DPoP (RFC 9449): the client signs a small JWT proof per request with a private key; the token is bound to that key\'s thumbprint via the `cnf.jkt` claim.',
            'mTLS-bound tokens (RFC 8705): the token is bound to the client\'s TLS certificate thumbprint (`cnf.x5t#S256`).',
            'DPoP works at the application layer, so it suits SPAs and mobile apps; mTLS suits server-to-server traffic where you control TLS termination.',
            'Proof-of-possession raises the bar but does not stop malware running inside the client, which can use the key directly.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'With **DPoP (Demonstrating Proof of Possession)**, the client generates an asymmetric key pair (in a browser, a non-extractable Web Crypto key stored in IndexedDB). Every token request and every API call carries a `DPoP` header containing a fresh JWT signed with that key, stating the HTTP method, URL, a timestamp, and a unique ID. The authorization server embeds the public key\'s thumbprint in the access token; the resource server checks that the proof was signed by the matching key and that it covers *this* request.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Client as Client (holds private key)\n    participant AS as Authorization Server\n    participant RS as Resource Server\n\n    Client->>AS: POST /token + DPoP proof (htm=POST, htu=/token, jwk=public key)\n    AS->>AS: verify proof, compute key thumbprint\n    AS-->>Client: access_token (cnf.jkt = thumbprint), token_type=DPoP\n    Client->>RS: GET /orders<br/>Authorization: DPoP token<br/>DPoP: proof (htm=GET, htu=/orders, ath=hash of token)\n    RS->>RS: verify proof signature, htm/htu, iat, jti unused,<br/>ath matches token, key thumbprint == cnf.jkt\n    RS-->>Client: 200 OK\n    Note over RS: A thief with only the token cannot sign a proof',
            },
            {
              type: 'code',
              language: 'json',
              title: 'Decoded DPoP proof JWT (header and payload)',
              code: `{
  "typ": "dpop+jwt",
  "alg": "ES256",
  "jwk": { "kty": "EC", "crv": "P-256", "x": "l8tFrhx-34tV3hRICRDY9zCkDlpBhF42UQUfWVAWBFs", "y": "9VE4jf_Ok_o64zbTTlcuNJajHmt6v9TDVrU0CdvGRDA" }
}
{
  "jti": "e1j3V_bKic8-LAEB",
  "htm": "GET",
  "htu": "https://api.example.com/orders",
  "iat": 1791800000,
  "ath": "fUHyO2r2Z3DZ53EsNrWBb0xWXoaNy59IiKCAqksmQEo"
}`,
            },
            {
              type: 'table',
              headers: ['', 'DPoP (RFC 9449)', 'mTLS-bound (RFC 8705)', 'Bearer'],
              rows: [
                ['Binding', 'App-layer signature per request', 'TLS client certificate', 'None'],
                ['Works in browsers', 'Yes (Web Crypto)', 'Poorly (client cert UX)', 'Yes'],
                ['Works through TLS-terminating proxies', 'Yes', 'Only if the proxy forwards cert info securely', 'Yes'],
                ['Replay protection', '`jti` + `iat` window; optional server nonce', 'Inherent in TLS session', 'None'],
                ['Typical use', 'SPAs, mobile, FAPI 2.0 clients', 'Banking B2B, service meshes', 'Low-risk internal APIs'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'DPoP binding is most valuable for **refresh tokens of public clients**: RFC 9700 requires those to be either rotated or sender-constrained, and a DPoP-bound refresh token cannot be used from an attacker\'s machine even if it is copied out of storage — as long as the private key was created non-extractable.',
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
            {
              type: 'p',
              text: 'This is not historical: in 2024–2025 several widely used SAML libraries (ruby-saml among them) shipped critical fixes for **parser-differential** bugs, where the signature was checked against a document parsed by one XML parser while the application read attributes from a different parser\'s view of the same bytes. Keep SAML libraries patched aggressively, reject assertions with unexpected structure (multiple assertions, comments inside identifiers), and require signatures on the assertion itself, not only the outer response.',
            },
            {
              type: 'table',
              headers: ['', 'SAML 2.0', 'OIDC'],
              rows: [
                ['Format', 'XML assertions, XML-DSig signatures', 'JSON / JWT, JWS signatures'],
                ['Transport', 'Browser POST/redirect bindings', 'Redirects plus back-channel token endpoint'],
                ['Native/mobile and APIs', 'Awkward', 'Designed for it (pairs with OAuth access tokens)'],
                ['Metadata', 'XML metadata documents with certificates', 'Discovery document + JWKS'],
                ['Where you meet it', 'Legacy and enterprise workforce IdPs', 'Consumer login, modern workforce IdPs, mobile'],
              ],
            },
            {
              type: 'heading',
              text: 'Beyond login: provisioning and continuous signals',
            },
            {
              type: 'list',
              items: [
                '**SCIM 2.0 (RFC 7643/7644)** is the standard REST API an IdP uses to create, update, and deactivate users and groups in your app. SSO alone only tells you about users *when they log in*; without SCIM, a terminated employee\'s account and API keys linger until someone notices. Enterprise customers increasingly treat SCIM support as a purchase requirement alongside SSO.',
                '**Just-in-time (JIT) provisioning** creates the account on first SSO login from assertion attributes — simpler, but it never deprovisions, so pair it with SCIM or short session lifetimes.',
                '**Shared Signals Framework (SSF), CAEP and RISC** (OpenID Foundation) let an IdP push security events — session revoked, credential changed, account disabled, device non-compliant — to relying parties in near real time, so your app can kill a session immediately instead of waiting for the next token refresh.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Never let an SSO-provisioned user keep a local password or long-lived API key that bypasses the IdP. Otherwise deprovisioning at the IdP disables only one of their ways in. When an organization enforces SSO, disable password login for its domain and tie API tokens to the user\'s IdP-managed status.',
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
            {
              type: 'heading',
              text: 'Designing API keys well',
            },
            {
              type: 'list',
              items: [
                '**Give keys a recognizable prefix** (e.g. `acme_live_...`) so secret scanners — including GitHub push protection and partner programs — can detect leaked keys and notify you automatically.',
                '**Store only a hash** (a fast SHA-256 is fine here because keys are high-entropy random strings, unlike passwords) and show the full key to the user exactly once.',
                '**Support multiple active keys per integration** so customers can rotate without downtime: create new, deploy, revoke old.',
                '**Attach scopes, expiry, and an owner** to every key, log last-used time, and auto-expire keys unused for months.',
              ],
            },
            {
              type: 'heading',
              text: 'Workload identity: no static secrets at all',
            },
            {
              type: 'p',
              text: 'The modern direction for service-to-service auth is to stop distributing secrets entirely. A workload proves *what it is* using an identity issued by the platform it runs on: Kubernetes service-account tokens, cloud instance identities, CI OIDC tokens (GitHub Actions, GitLab), or **SPIFFE** IDs (`spiffe://example.org/ns/prod/sa/billing`) issued as short-lived X.509 or JWT SVIDs by SPIRE or a service mesh. The workload exchanges that platform token for short-lived credentials at the target (workload identity federation), so there is nothing long-lived to leak or rotate.',
            },
            {
              type: 'code',
              language: 'yaml',
              title: 'GitHub Actions deploying to AWS with OIDC federation (no stored keys)',
              code: `permissions:
  id-token: write   # allow the job to request a GitHub OIDC token
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/deploy-prod
          aws-region: eu-west-1
      # The IAM role's trust policy only accepts tokens whose 'sub' claim is
      # e.g. repo:acme/shop:environment:production — pin it that narrowly.
      - run: aws s3 sync ./dist s3://acme-shop-prod`,
            },
          ],
        },
        {
          id: 'delegation-ai-agents',
          title: 'Delegated Access for Services & AI Agents: Token Exchange and MCP',
          summary:
            'When a request hops through several services — or an AI agent acts for a user across many tools — the question becomes "who is acting, on whose behalf, with what limits?". OAuth Token Exchange and the authorization model used by the Model Context Protocol (MCP) answer it without passing the user\'s original token everywhere.',
          keyPoints: [
            'Forwarding the user\'s original access token to every downstream service creates over-broad, replayable tokens — avoid "token passthrough".',
            'Token Exchange (RFC 8693) swaps an incoming token for a new one scoped to a specific downstream audience, optionally recording the acting party in an `act` claim.',
            'Delegation (agent acts *for* the user, both identities visible) is safer and more auditable than impersonation (agent *becomes* the user).',
            'MCP servers act as OAuth resource servers: they advertise their authorization server via Protected Resource Metadata (RFC 9728) and require audience-bound tokens (RFC 8707).',
            'Agents need least-privilege, short-lived, task-scoped grants and human approval for high-impact actions — an LLM can be manipulated by prompt injection into misusing any permission it holds.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'In a microservice call chain, the tempting shortcut is to forward the user\'s access token from the gateway to service A, then to B, then to C. Every hop now holds a token that is valid for *all* of them, and if any service is compromised or logs headers, the attacker can call everything the user can. **Token Exchange** fixes this: each service asks the authorization server for a new token whose audience is just the next hop, whose scopes are reduced, and which records both the original subject and the actor.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'RFC 8693 token exchange request',
              code: `curl -X POST https://auth.example.com/token \\
  -u orders-service:CLIENT_CREDENTIAL \\
  -d grant_type=urn:ietf:params:oauth:grant-type:token-exchange \\
  -d subject_token="$INCOMING_USER_ACCESS_TOKEN" \\
  -d subject_token_type=urn:ietf:params:oauth:token-type:access_token \\
  -d audience=https://inventory.internal \\
  -d scope=inventory:reserve`,
            },
            {
              type: 'code',
              language: 'json',
              title: 'Resulting token claims — delegation is explicit',
              code: `{
  "iss": "https://auth.example.com",
  "sub": "user_4471",
  "aud": "https://inventory.internal",
  "scope": "inventory:reserve",
  "act": { "sub": "orders-service" },
  "exp": 1791800300
}`,
            },
            {
              type: 'heading',
              text: 'AI agents and MCP',
            },
            {
              type: 'p',
              text: 'An AI agent calling tools on a user\'s behalf is a delegation problem with an unusual twist: the "client" makes decisions based on untrusted text it reads (web pages, emails, tool results), so **prompt injection** can steer it into using its permissions for an attacker. The Model Context Protocol\'s authorization spec builds on OAuth 2.1: an MCP server is a resource server, it publishes Protected Resource Metadata (RFC 9728) pointing at its authorization server, clients use Authorization Code + PKCE, and tokens must be audience-bound to that specific MCP server via resource indicators. The spec explicitly forbids MCP servers from passing a client\'s token through to upstream APIs.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n    participant Agent as Agent / MCP Client\n    participant MCP as MCP Server (resource server)\n    participant AS as Authorization Server\n\n    Agent->>MCP: tool call without token\n    MCP-->>Agent: 401 + WWW-Authenticate (resource_metadata URL)\n    Agent->>MCP: GET /.well-known/oauth-protected-resource\n    MCP-->>Agent: authorization_servers list\n    Agent->>AS: Authorization Code + PKCE, resource=MCP server URL\n    AS-->>Agent: access token (aud = MCP server)\n    Agent->>MCP: tool call + Bearer token\n    MCP->>MCP: validate aud, scopes, expiry\n    MCP-->>Agent: tool result',
            },
            {
              type: 'list',
              items: [
                '**Least privilege per task**: request narrow scopes for the job at hand rather than a broad standing grant; prefer short-lived tokens tied to one session.',
                '**Keep the human in the loop** for irreversible or high-impact actions (payments, deletions, sending messages) using step-up or explicit confirmation — the OpenID CIBA flow is one standard way to ask a user to approve an action out-of-band.',
                '**Make the agent visible** in audit logs and tokens (`act` claim, distinct client ID) so you can tell "Alice did this" from "Alice\'s agent did this" and revoke the agent without locking out Alice.',
                '**Never let the agent hold raw long-lived secrets** (API keys, refresh tokens) in its prompt context — keep credentials in the tool layer, out of reach of the model.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Agent authorization standards are moving quickly — the MCP authorization spec has gone through several revisions, including changes to how clients register (dynamic client registration versus client ID metadata documents). Check the current spec version before implementing, and design around the stable foundations: OAuth 2.1-style flows, audience-bound short-lived tokens, and no token passthrough.',
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
            {
              type: 'table',
              headers: ['', 'RBAC', 'ABAC', 'ReBAC'],
              rows: [
                ['Decision input', 'User\'s roles', 'Attributes of subject, resource, action, environment', 'Relationship graph between subjects and objects'],
                ['Expresses "owner can edit"', 'No (needs per-resource roles)', 'Yes (`resource.owner == user.id`)', 'Yes (`owner` relation)'],
                ['Expresses inherited sharing', 'Poorly (role explosion)', 'Awkward', 'Natively (folder viewer implies document viewer)'],
                ['"Who can access X?" audit', 'Easy', 'Hard (must evaluate policies)', 'Answerable by graph expansion'],
                ['Typical tools', 'Built into most frameworks and IdPs', 'OPA/Rego, AWS Cedar, XACML', 'OpenFGA, SpiceDB, Ory Keto (Zanzibar-style)'],
              ],
            },
            {
              type: 'code',
              language: 'text',
              title: 'Zanzibar-style model (OpenFGA DSL) for folders and documents',
              code: `model
  schema 1.1

type user

type group
  relations
    define member: [user]

type folder
  relations
    define owner: [user]
    define viewer: [user, group#member] or owner

type document
  relations
    define parent: [folder]
    define owner: [user]
    define editor: [user] or owner
    define viewer: [user, group#member] or editor or viewer from parent`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The most common authorization bug in real APIs is not a wrong model — it is a *missing check*. **Broken Object Level Authorization (BOLA/IDOR)** tops the OWASP API Security Top 10: `GET /invoices/1043` returns the invoice because the user is logged in, without checking that invoice 1043 belongs to them. Enforce object-level checks in one central place (a policy function or data-access layer that requires the caller\'s identity), deny by default, and write tests that call every endpoint as the wrong user.',
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
            {
              type: 'p',
              text: 'The standard vocabulary (from XACML) is worth using: the **Policy Enforcement Point (PEP)** is the code in your service or gateway that intercepts a request and enforces the answer; the **Policy Decision Point (PDP)** evaluates policy; the **Policy Information Point (PIP)** supplies extra data (resource owner, user department); the **Policy Administration Point (PAP)** is where policies are authored. The OpenID Foundation\'s AuthZEN work standardizes the PEP-to-PDP API so enforcement code is not locked to one policy engine.',
            },
            {
              type: 'code',
              language: 'text',
              title: 'Policy as code — AWS Cedar example',
              code: `// Members of a tenant may view documents in that tenant
permit (
  principal,
  action == Action::"viewDocument",
  resource
) when {
  principal.tenant == resource.tenant
};

// Nobody may delete a document under legal hold, regardless of other permits
forbid (
  principal,
  action == Action::"deleteDocument",
  resource
) when {
  resource.legalHold == true
};`,
            },
            {
              type: 'list',
              items: [
                '**Deny overrides**: in Cedar and most well-designed engines an explicit `forbid` beats any `permit`, which makes guardrails (legal hold, suspended accounts) safe to add without auditing every allow rule.',
                '**The "new enemy" problem**: in a distributed ReBAC system, a permission revocation and a subsequent content change can race — a user removed from a document might still see the version edited after their removal if a stale replica answers. Zanzibar solves this with consistency tokens (zookies); SpiceDB and OpenFGA expose similar consistency controls.',
                '**Cache carefully**: cache allow decisions for seconds, not minutes, and invalidate on relationship changes; never cache across tenants with keys that omit the tenant.',
                '**Fail closed**: if the PDP is unreachable, deny (with a well-tested degraded mode for read-only paths if the business requires it) — failing open turns an outage into a breach.',
              ],
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
            {
              type: 'p',
              text: 'Defense in depth for that failure mode is to make the database itself enforce tenancy. With PostgreSQL **row-level security**, the application sets the tenant for the transaction from the verified token, and every query on the table is filtered automatically — a forgotten `WHERE` clause returns nothing instead of another customer\'s data.',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'Tenant isolation with PostgreSQL row-level security',
              code: `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;  -- applies to the table owner too

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);

-- Per request, inside a transaction, with tenant_id taken from the verified token:
BEGIN;
SELECT set_config('app.tenant_id', $1, true);   -- true = local to this transaction
SELECT * FROM invoices WHERE id = $2;          -- other tenants' rows are invisible
COMMIT;`,
            },
            {
              type: 'list',
              items: [
                '**Connect as a non-superuser role without `BYPASSRLS`**, and use transaction-local settings so a pooled connection never carries one tenant\'s context into the next request.',
                '**Per-tenant IdP configuration**: route login by email domain or tenant subdomain to the right IdP, and verify domain ownership (DNS TXT record) before letting a tenant claim a domain for SSO enforcement.',
                '**Tenant-scoped roles**: store memberships as `(user_id, tenant_id, role)`; when a user belongs to several tenants, issue a token for the *active* tenant only and require an explicit switch.',
                '**Admin and support access** ("impersonate customer") should be a separate, audited, time-boxed delegation with the support engineer recorded as the actor — never a shared superuser login.',
              ],
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
          summary: '40 authentication/authorization interview questions with full-depth answers, from fundamentals to senior-level design and incident scenarios.',
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
                'PKCE binds the authorization code exchange to the specific client instance that initiated the flow: the client generates a random code_verifier, sends its SHA-256 hash (code_challenge) with the initial authorization request, and must present the original verifier when exchanging the code — so even if the code is intercepted, an attacker can\'t complete the exchange without the verifier. It was originally designed for public clients that can\'t safely hold a client_secret, but current best practice (RFC 9700, and the OAuth 2.1 draft) recommends it universally because it adds meaningful protection at essentially zero cost, even for clients that also have a secret. For confidential clients the key benefit is defeating **authorization code injection**: an attacker who stole a code from a victim cannot paste it into their own session with the legitimate client, because the client will redeem it with the attacker-session\'s verifier, which does not match. Always use the `S256` method; `plain` offers no protection if the authorization request itself is observed.',
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
                'ROPC has the client application collect the user\'s actual username and password directly and send them to the authorization server for a token — defeating OAuth\'s foundational purpose of letting a user grant scoped access without handing their credentials to the requesting application. It was originally intended for "highly trusted" first-party clients, but even there it\'s discouraged because it trains users to enter credentials into arbitrary app UIs and provides no natural path to MFA, passkeys, or SSO (the authorization server never gets to run its own login UI). RFC 9700 (OAuth 2.0 Security BCP) says it must not be used, and the OAuth 2.1 draft omits it entirely in favor of the Authorization Code flow with PKCE — for first-party native apps too, using the system browser.',
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
                "SMS is interceptable via SIM-swapping (a social-engineering attack against the phone carrier, not the device itself) and via weaknesses in the SS7 telecom signaling protocol that carriers still support — neither requires physical possession of the phone at all. An authenticator app's TOTP code, by contrast, is computed locally from a secret shared once at enrollment (the server keeps a copy, encrypted) and the code never travels over a telecom network — the attack surface becomes the device and your server's secret store, not a decades-old signaling protocol never designed with modern security in mind. NIST SP 800-63B-4 classifies phone-network OTP as a *restricted* authenticator that requires documented risk acceptance and an alternative option. The senior caveat: both SMS and TOTP are still phishable by real-time adversary-in-the-middle proxies, so neither is phishing-resistant — only WebAuthn/passkeys or certificate-based auth are. SMS remains far better than no second factor at all.",
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
            {
              question: 'Your team wants to "upgrade" from TOTP to push notifications for MFA. As a security reviewer, what do you say?',
              answer:
                'Push improves usability but not phishing resistance: both TOTP and push are defeated by adversary-in-the-middle phishing proxies that relay credentials and approvals in real time and then steal the session cookie, and plain push adds MFA-fatigue risk. If you adopt push, require number matching and show location/app context, rate-limit prompts, and alert on repeated denials. But the real upgrade is to phishing-resistant factors — passkeys/FIDO2 security keys — which are origin-bound and cannot be relayed. A credible plan offers passkeys first, keeps TOTP/push as fallbacks, mandates phishing-resistant factors for admins and other high-value users, and hardens recovery so the strongest factor cannot be bypassed via a weaker reset path.',
            },
            {
              question: 'Explain refresh token rotation with reuse detection. What problem does it solve, and what operational issue does it create?',
              answer:
                'Each time a client redeems a refresh token, the server issues a new one and marks the old one spent. If a spent token is ever presented again, two parties hold copies of the same token family — the legitimate client and a thief — and the server cannot tell which is which, so it revokes the whole family and forces re-authentication. That turns silent, long-term refresh-token theft (from a backup, log, or compromised device) into a detected, bounded event, and it is one of the two options RFC 9700 requires for public clients (the other is sender-constraining). The operational cost is race conditions: concurrent requests or a lost response on a flaky network can cause a legitimate client to replay a just-rotated token and get logged out. Mitigate with client-side single-flight refresh logic and a short server-side grace window, and do the mark-used-and-issue-successor step atomically.',
            },
            {
              question: 'What is DPoP, and why would you use it instead of — or in addition to — short token lifetimes?',
              answer:
                'DPoP (RFC 9449) sender-constrains tokens: the client holds a private key, the authorization server binds issued tokens to that key\'s thumbprint (`cnf.jkt`), and every request carries a fresh signed proof JWT covering the HTTP method, URL, timestamp, a unique `jti`, and a hash of the access token. A resource server rejects a token without a matching proof, so a token stolen from logs, a proxy, or storage is useless on its own. Short lifetimes only shrink the window of misuse; DPoP removes the value of the stolen artifact altogether, which is especially important for long-lived refresh tokens in SPAs and mobile apps. Limits: it does not stop malware running inside the client (which can call the signing key), it requires replay tracking of `jti` (or server-provided nonces), and the key should be non-extractable. mTLS-bound tokens (RFC 8705) give the same guarantee at the transport layer for server-to-server clients.',
            },
            {
              question: 'An SPA team asks where to keep access tokens. They propose an in-memory variable "because localStorage is vulnerable to XSS". Evaluate this.',
              answer:
                'In-memory storage is better than localStorage — the token does not survive reloads and cannot be read by a script injected on another page — but it is not XSS-proof. Injected script runs in the same context; it can wrap `fetch` to capture tokens as they are used, or, more powerfully, start its own silent Authorization Code + PKCE flow in a hidden iframe and obtain a fresh set of tokens it controls. The IETF browser-based apps guidance concludes that only keeping tokens out of the browser entirely — a Backend-for-Frontend that acts as a confidential OAuth client and gives the browser just an HttpOnly, `__Host-` prefixed session cookie — prevents token exfiltration. XSS can still drive the app while the tab is open, so you also need CSP and output encoding, but you have turned a persistent, offline compromise into a transient, online one. For lower-risk apps, an SPA-only client with rotation or DPoP-bound refresh tokens is an acceptable, documented trade-off.',
            },
            {
              question: 'Walk through every check a resource server must perform when it receives a JWT access token.',
              answer:
                'Parse the header but do not trust it. Look up the key by `kid` only within a JWKS you configured for the expected issuer (never follow `jku`/`x5u`), and verify the signature with an algorithm allow-list pinned per key. Then validate claims: `iss` exactly matches the expected issuer; `aud` includes this API\'s identifier; `exp` is in the future and `nbf`/`iat` are sane within a small clock tolerance; `typ` is `at+jwt` (RFC 9068) so ID tokens or other JWTs are rejected; and if the token is sender-constrained, verify the DPoP proof or mTLS certificate binding. Next, authorize: check scopes for the operation, then do object-level authorization against the actual resource (the token says who the user is, not whether they own invoice 1043). Finally, consider revocation for high-stakes operations — introspection or a deny-list on `jti`/session ID — since a valid signature only proves the token was valid when issued.',
            },
            {
              question: 'Users report being logged into someone else\'s account after signing in with a social login. What are the likely causes?',
              answer:
                'The usual culprit is account linking by email: the app finds an existing user whose email matches the ID token\'s `email` claim and logs in as them. If the IdP does not verify emails, or allows unverified secondary emails, or a multi-tenant IdP lets anyone create an account in any tenant, an attacker can mint a token carrying the victim\'s email. The fix is to key identities on `(iss, sub)`, only auto-link when `email_verified` is true and the issuer is authoritative for that domain, and otherwise require the user to prove control of the existing account first. Other candidates: failing to validate `iss` in a multi-tenant IdP (accepting tokens from any tenant), skipping `aud` validation (accepting tokens issued to a different client), caching responses at a CDN without varying on the session cookie, or a session-fixation bug where the session ID is not regenerated at login.',
            },
            {
              question: 'What is BOLA/IDOR, why does it persist even in systems with solid authentication, and how do you prevent it structurally?',
              answer:
                'Broken Object Level Authorization (also called IDOR) is an API returning or modifying an object identified by a client-supplied ID without checking that the authenticated caller is allowed to access that particular object — `GET /orders/1043` works for any logged-in user. It persists because authentication middleware is applied globally and "feels" like security, while object-level checks must be written in every handler and are easy to forget; unguessable UUIDs only hide the bug. Structural prevention: route every data access through a layer that requires the caller\'s identity and applies ownership/tenancy filters by construction (repository methods that take a principal, row-level security), centralize policy in a function or PDP with deny-by-default, and add automated tests that call every endpoint with a second user\'s credentials. It sits at the top of the OWASP API Security Top 10 precisely because it is a missing check, not a broken one.',
            },
            {
              question: 'How would you roll out passkeys to an existing consumer product with 10 million password users?',
              answer:
                'Treat it as a gradual upgrade, not a replacement. Add passkey creation prompts right after successful password logins and in account settings (and, where browsers support it, automatic passkey creation after a password autofill). Put `autocomplete="username webauthn"` on the login field and start conditional mediation on page load, so users with passkeys see them in autofill and everyone else is unaffected. Use discoverable credentials, require user verification, and use `none` attestation. Keep passwords as a fallback initially and measure adoption, success rate, and fallback usage per platform. The hard part is recovery: encourage multiple passkeys (synced platform passkeys largely solve device loss), provide recovery codes, and make sure the password-reset path does not quietly undercut the passkey — for accounts that have opted into passkey-only, reset should require more than an email link. Finally, plan the credential lifecycle: show users which passkeys exist with device/provider names, allow revocation, and signal deletions to credential managers.',
            },
            {
              question: 'Microservice A receives a user request and must call services B and C on the user\'s behalf. Should it forward the user\'s access token?',
              answer:
                'Forwarding works mechanically but violates least privilege: the token must then be valid for A, B, and C at once (broad audience and scopes), any compromised or header-logging service can replay it everywhere, and downstream services cannot distinguish "the user did this" from "service A did this on the user\'s behalf". Better options: OAuth Token Exchange (RFC 8693), where A trades the incoming token for a new one with audience B, reduced scopes, short expiry, and an `act` claim naming A; or, inside a trusted mesh, authenticate A to B with mTLS/SPIFFE workload identity and pass the user context as a signed, audience-restricted internal token minted by the gateway. Either way, each service validates that the token was meant for it, and authorization decisions consider both the user and the calling service.',
            },
            {
              question: 'An AI agent with access to a user\'s email and calendar via OAuth reads a malicious email instructing it to forward all invoices to an external address. Which auth controls limit the damage?',
              answer:
                'Authentication is working perfectly here — the problem is that the agent, a legitimate delegate, can be manipulated by untrusted content (prompt injection). Controls that help: least-privilege, task-scoped grants (an agent summarizing email should not hold `mail.send`), short-lived tokens tied to the session rather than standing refresh tokens, explicit human confirmation or out-of-band approval (e.g. CIBA-style) for high-impact actions like sending mail to new external recipients, policy at the tool layer (allow-lists of recipients, rate limits, deny forwarding of attachments outside the domain), keeping credentials out of the model\'s context, and distinct client identity plus `act` claims so audit logs show the agent acted and the agent\'s grant can be revoked without locking out the user. For MCP-based tools, audience-bound tokens and no token passthrough ensure a compromised tool server cannot reuse the user\'s token against other services.',
            },
            {
              question: 'Compare introspection of opaque tokens with local validation of JWT access tokens. When would you choose each?',
              answer:
                'Local JWT validation needs only the issuer\'s public keys, so it adds no network hop and scales horizontally, but claims are frozen at issuance and revocation is effective only at expiry (unless you add a deny-list, which reintroduces state). Opaque tokens validated via introspection (RFC 7662) give real-time revocation and keep claims hidden from clients — useful when tokens go to third-party clients who should not parse them — at the cost of latency and a dependency on the authorization server on every (uncached) request. Common hybrids: JWTs for internal high-volume APIs with short lifetimes, opaque tokens at the public edge where the gateway introspects once and forwards an internal JWT, and introspection only for high-risk operations. Caching introspection results for a few seconds to a minute is the usual compromise; the cache TTL is effectively your revocation latency.',
            },
            {
              question: 'What are the differences between session fixation and session hijacking, and how does each get prevented?',
              answer:
                'In **session fixation** the attacker gets the victim to authenticate using a session ID the attacker already knows (planted via a URL parameter, a subdomain-set cookie, or a pre-login session); if the server keeps that same ID after login, the attacker now shares an authenticated session. Prevention: regenerate the session ID on login and every privilege change, never accept session IDs from URLs, and use the `__Host-` cookie prefix so sibling subdomains cannot plant cookies. In **session hijacking** the attacker steals an already-authenticated session ID — via XSS, network sniffing, logs, or increasingly infostealer malware copying cookies off the device. Prevention: `HttpOnly` and `Secure` cookies with HSTS, strong XSS defenses, short idle and absolute timeouts, step-up for sensitive actions, anomaly detection (sudden IP/ASN/device changes), and binding sessions or tokens to device keys (DPoP, device-bound session credentials) so a copied cookie is not enough.',
            },
            {
              question: 'An enterprise customer says: "When we fire someone, they still have access to your product for hours." How do you fix this architecturally?',
              answer:
                'Several layers each contribute latency. First, provisioning: SSO only re-checks the user at login, so support SCIM so the customer\'s IdP deactivates the user in your system immediately — which should revoke all their sessions, refresh tokens, and personal API keys. Second, session lifetime: SSO-created sessions should be shorter-lived and periodically re-validated with the IdP, rather than lasting for weeks. Third, token lifetime: access tokens of 5-15 minutes bound the window after revocation, and refresh must check user status server-side. Fourth, push signals: subscribe to the IdP\'s Shared Signals (CAEP session-revoked, RISC account-disabled) events to kill sessions in near real time, and support OIDC back-channel logout. Finally, close bypasses: SSO-enforced tenants should not allow local password logins, and integration keys should be owned by service accounts rather than individuals or be revoked with their creator.',
            },
            {
              question: 'Why is OAuth Device Authorization (the "enter this code on another device" flow) a phishing risk, and how do you mitigate it?',
              answer:
                'In the device flow (RFC 8628) a device obtains a user code and asks the user to visit a verification URL and enter it; whoever enters the code grants the device access. An attacker can start the flow themselves and send the victim a convincing message ("enter code ABCD-EFGH at the official login page to verify your account"); the victim authenticates on the genuine IdP — with real MFA, even passkeys — and unknowingly authorizes the attacker\'s session. Because the login page is legitimate, origin-bound phishing resistance does not help. Mitigations: only enable the device grant for clients that genuinely need it, show the requesting client name, location, and a clear "you are signing in a device" warning on the approval page, keep user codes short-lived, use conditional access policies to block or restrict device-code flows for most users, and monitor for unusual device-code grants.',
            },
          ],
        },
      ],
    },
  ],
}
