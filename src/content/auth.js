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
                '**Rate limiting and account lockout** on login attempts, with exponential backoff — but lock the *attempt*, not the account indefinitely, to avoid a denial-of-service against a legitimate user via repeated failed logins from an attacker.',
                '**Constant-time comparison** for any secret comparison (modern password-hashing libraries handle this) to avoid timing side-channel attacks.',
              ],
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
              type: 'callout',
              kind: 'tip',
              text: 'The standard production fix for "JWTs are hard to revoke": pair short-lived access tokens (5-15 minutes) with a long-lived, server-side-revocable refresh token — the blast radius of "can\'t revoke instantly" is capped at the access token\'s short lifetime, while the thing that actually needs revocation is checked against server state on every refresh.',
            },
          ],
        },
        {
          id: 'jwt-internals',
          title: 'JWT Internals',
          summary: 'header.payload.signature — and the handful of pitfalls (alg:none, localStorage, sensitive claims) that show up in nearly every real JWT vulnerability report.',
          keyPoints: [
            'Three base64url segments joined by dots: header, payload (claims), signature.',
            'A JWT payload is base64-encoded, not encrypted — anyone can read it; only the signer can produce a valid signature for modified claims.',
            'HS256 = one shared secret for signing and verifying. RS256 = private key signs, public key verifies — correct choice when multiple services verify tokens from a central issuer.',
            'Never trust the alg header to decide how to verify a token — pin the accepted algorithm(s) explicitly.',
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
                '**Payload**: claims — `sub` (subject/user ID), `iss` (issuer), `aud` (audience), `exp` (expiry), `iat` (issued at), `jti` (unique token ID), plus custom claims (roles, tenant ID).',
                '**Signature**: proves the token was not tampered with. Anyone can *read* a JWT (it\'s base64, not encrypted) — only the holder of the signing key can produce a valid signature for modified claims.',
              ],
            },
            {
              type: 'heading',
              text: 'Critical JWT pitfalls to name unprompted',
            },
            {
              type: 'list',
              items: [
                '**`alg: none` attack** — some libraries historically accepted a token with `alg` set to `none` and skipped verification entirely. Always explicitly pin the accepted algorithm(s) when verifying.',
                '**Storing JWTs in `localStorage`** exposes them to any XSS on the page. Prefer an `HttpOnly`, `Secure`, `SameSite=Strict` cookie for browser clients (which then requires CSRF protection instead — see Session Security).',
                '**Putting sensitive data in the payload** — it\'s base64, not encryption; never put a password, SSN, or other secret in a claim.',
                '**No revocation plan** — always pair short-lived access tokens with a revocable refresh mechanism.',
              ],
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
              type: 'callout',
              kind: 'tip',
              text: 'The one-sentence distinction that resolves most confusion: OAuth 2.0 answers "what can this app do on my behalf," OIDC (built on OAuth 2.0) answers "who is this user." A login flow that only obtains an access token but never validates an ID token isn\'t actually authenticating the user — it\'s just obtaining delegated API access.',
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
          summary: '17 authentication/authorization interview questions with full-depth answers.',
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
          ],
        },
      ],
    },
  ],
}
