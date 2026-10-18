export const awsSection = {
  id: 'aws',
  label: 'AWS',
  icon: '☁️',
  groups: [
    {
      id: 'aws-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-cloud-computing-and-aws',
          title: 'What Is Cloud Computing, and What Is AWS?',
          summary:
            'Cloud computing replaces owning physical servers with renting computing resources on demand from a provider; AWS is the largest such provider, offering 200+ services across compute, storage, databases, and networking, billed by actual usage.',
          keyPoints: [
            'Cloud computing is on-demand access to computing resources (servers, storage, databases, networking) over the internet, paid for as you use them, instead of buying and operating physical hardware yourself.',
            'AWS launched in 2006 (starting with S3 and EC2) and remains the largest cloud provider by market share, ahead of Microsoft Azure and Google Cloud Platform.',
            'Three service models worth naming precisely: **IaaS** (raw infrastructure you configure, e.g. EC2), **PaaS** (a managed runtime you deploy code into, e.g. Elastic Beanstalk), **SaaS** (a finished product you just use) — AWS spans all three, though most of AWS\'s own catalog is IaaS/PaaS.',
            'The core value proposition: elasticity (scale resources up or down with actual demand), no large upfront capital expense (`CapEx` becomes `OpEx`), global reach in minutes instead of months, and paying only for what you actually consume.',
            'AWS-focused interviews test whether you know the *right* service for a given access pattern, scale, and cost tradeoff — not just that a service exists by name.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before the cloud, running a web application meant buying physical servers, racking them in a data center (or paying someone to), provisioning network and power, and over- or under-estimating capacity months in advance — because ordering more hardware takes weeks. Cloud computing replaces that entire capital-intensive process with an API call: request a server, a database, or a queue, and it exists within seconds, billed by the hour, second, request, or gigabyte, released just as easily when no longer needed.',
            },
            {
              type: 'heading',
              text: 'IaaS vs PaaS vs SaaS',
            },
            {
              type: 'list',
              items: [
                '**IaaS (Infrastructure as a Service)** — you get raw compute/storage/network building blocks and configure everything above the hardware yourself (OS, runtime, scaling). AWS example: **EC2**. Maximum control, maximum operational responsibility.',
                '**PaaS (Platform as a Service)** — the provider manages the OS/runtime/scaling for you; you just deploy code. AWS examples: **Elastic Beanstalk**, **ECS Express Mode** (container image in, Fargate service + ALB + autoscaling out). Less control, much less operational burden. (App Runner stopped accepting new customers in 2026; AWS points new users to ECS Express Mode.)',
                '**SaaS (Software as a Service)** — a complete, ready-to-use application; you configure it, not the infrastructure underneath. AWS examples: **Amazon Connect** (contact center), **Amazon Quick** (the BI/agentic workspace formerly known as QuickSight). Note that Amazon Chime was retired in 2026 — a reminder that AWS does sunset services, which is itself a vendor-risk consideration.',
              ],
            },
            {
              type: 'heading',
              text: 'The economics underneath: how AWS actually bills you',
            },
            {
              type: 'p',
              text: 'Almost every AWS price is a product of a few dimensions: **time** (instance-seconds, ACU-seconds), **capacity** (GB-month of storage, provisioned IOPS), **requests** (per million API calls, per invocation) and **data transfer** (per GB leaving a Region or crossing AZs). Senior engineers learn to read an architecture diagram as a bill: every arrow that crosses an AZ, Region, or the internet boundary is a metered line item, and every always-on box is paying even at 3 a.m.',
            },
            {
              type: 'table',
              headers: ['Billing dimension', 'Examples', 'Common surprise'],
              rows: [
                ['Time-based compute', 'EC2 per-second, Fargate vCPU/GB-hour, RDS instance-hour', 'Idle dev/test environments running 24/7'],
                ['Request-based', 'Lambda invocations, S3 GET/PUT, API Gateway requests, KMS calls', 'Chatty clients or tiny S3 objects multiplying request charges'],
                ['Storage', 'S3 GB-month, EBS provisioned GB, snapshots', 'Orphaned EBS volumes and forgotten snapshots'],
                ['Data transfer', 'Internet egress, cross-AZ, cross-Region, NAT Gateway processing', 'NAT Gateway per-GB processing for traffic that could use a VPC endpoint'],
                ['Public IPv4', 'Every public IPv4 address, attached or not (since Feb 2024)', 'Many small instances each holding a public IP'],
              ],
            },
            {
              type: 'heading',
              text: 'When the cloud is not automatically the right answer',
            },
            {
              type: 'list',
              items: [
                '**Steady, predictable, very large workloads** (e.g. constant multi-petabyte storage or a fixed GPU fleet at 100% utilization) can be cheaper on owned or colocated hardware — some companies have publicly "repatriated" such workloads. The cloud premium buys elasticity; if you never use elasticity you are paying for an option you never exercise.',
                '**Egress-heavy products** (video delivery, large public datasets) can be dominated by data-transfer cost; model it before committing.',
                '**Hard data-sovereignty or latency constraints** may require on-premises, AWS Outposts, Local Zones, or a sovereign-cloud offering rather than a standard Region.',
                'For most teams, though, the engineering time saved (no hardware procurement, patching hypervisors, replacing failed disks) outweighs the premium by a wide margin — the correct framing is total cost of ownership, not price per vCPU.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'The AWS Free Tier changed in July 2025: accounts created after that date get a credit-based free plan (sign-up credits plus more for completing onboarding activities, valid for a limited period) instead of the old "12 months of 750 t2.micro hours" model. Always set an **AWS Budgets** alert on day one of any new account — runaway cost from a forgotten resource is the most common beginner incident.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph OnPrem["Traditional On-Premises"]\n    direction TB\n    O1[You manage:<br/>Application] --> O2[You manage:<br/>Runtime]\n    O2 --> O3[You manage:<br/>OS]\n    O3 --> O4[You manage:<br/>Virtualization]\n    O4 --> O5[You manage:<br/>Servers, Storage, Network]\n    O5 --> O6[You manage:<br/>Data Center, Power, Cooling]\n  end\n  subgraph Cloud["AWS (IaaS example: EC2)"]\n    direction TB\n    C1[You manage:<br/>Application]\n    C2[You manage:<br/>Runtime]\n    C3[You manage:<br/>OS]\n    C4[AWS manages:<br/>Virtualization]\n    C5[AWS manages:<br/>Servers, Storage, Network]\n    C6[AWS manages:<br/>Data Center, Power, Cooling]\n  end',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When an interviewer asks "why AWS over building it yourself," the strongest answer names the real tradeoff: AWS trades a variable, usage-based `OpEx` cost (and less low-level control) for eliminating undifferentiated heavy lifting — you stop spending engineering time on data centers, hardware failures, and capacity planning, and spend it on the product instead.',
            },
          ],
        },
        {
          id: 'aws-global-infrastructure',
          title: 'AWS Global Infrastructure: Regions, Availability Zones & Edge Locations',
          summary:
            'Every AWS architecture decision about latency, availability, and disaster recovery ultimately rests on this physical hierarchy: geographically separate Regions, each built from multiple independent Availability Zones, plus a much larger network of Edge Locations for content delivery.',
          keyPoints: [
            'A **Region** is a physical geographic area (e.g. `us-east-1`, `eu-west-1`) containing multiple, isolated **Availability Zones** — most services are Region-scoped, and resources in one Region don\'t automatically exist in another.',
            'An **Availability Zone (AZ)** is one or more discrete data centers with independent power, cooling, and networking, physically separated from other AZs in the same Region (typically miles apart) but connected by low-latency, high-bandwidth links.',
            'Deploying across **multiple AZs** within a Region is the standard way to survive a single data-center-level failure without the latency cost of going cross-Region.',
            '**Edge Locations** (part of CloudFront and Route 53) are a much larger, more numerous set of caching/DNS points of presence close to end users, distinct from Regions/AZs and used for content delivery, not for running your compute/database workloads.',
            'Choosing a Region involves four factors: latency to your users, data residency/compliance requirements, service/feature availability (new features launch in some Regions before others), and cost (prices vary by Region).',
            'AZ *names* (`us-east-1a`) are shuffled per account; AZ *IDs* (`use1-az1`) identify the same physical AZ everywhere — use IDs when coordinating placement across accounts (e.g. for PrivateLink or shared subnets).',
            'Beyond Regions: **Local Zones** (compute close to a metro area for single-digit-ms latency), **Wavelength Zones** (inside telco 5G networks), and **Outposts** (AWS-managed racks in your own data center) extend the same APIs to the edge.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Region["Region: us-east-1"]\n    subgraph AZ1["Availability Zone: us-east-1a"]\n      DC1["Data Center(s)"]\n    end\n    subgraph AZ2["Availability Zone: us-east-1b"]\n      DC2["Data Center(s)"]\n    end\n    subgraph AZ3["Availability Zone: us-east-1c"]\n      DC3["Data Center(s)"]\n    end\n    AZ1 <-->|low-latency<br/>private links| AZ2\n    AZ2 <-->|low-latency<br/>private links| AZ3\n    AZ1 <-->|low-latency<br/>private links| AZ3\n  end\n  Edge1[Edge Location] -.->|CloudFront cache,<br/>Route 53 DNS| Region\n  Edge2[Edge Location] -.-> Region\n  Edge3[Edge Location] -.-> Region\n  Users((End Users<br/>worldwide)) --> Edge1\n  Users --> Edge2\n  Users --> Edge3',
            },
            {
              type: 'heading',
              text: 'Why this hierarchy matters for architecture',
            },
            {
              type: 'list',
              items: [
                'Within a Region, spreading resources across at least **two or three AZs** protects against a whole-data-center outage (power failure, fire, networking issue) at minimal latency cost, since AZ-to-AZ links are purpose-built to be fast.',
                'Going **multi-Region** protects against a Region-wide event (rare, but they happen) and reduces latency for geographically distant users, at the cost of significantly more architectural complexity — data replication across Regions is asynchronous by default for most services.',
                'Some services are **global**, not Region-scoped (IAM, Route 53, CloudFront), while most (EC2, RDS, most of DynamoDB\'s primary table) are Region-scoped by default, which is why you configure a Region for most `aws` CLI calls and consoles.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A very common beginner mistake: launching resources (a security group, a key pair, a subnet) in one Region, then being confused why they don\'t appear when the console/CLI is pointed at a different Region. Almost everything except IAM, Route 53, and a handful of other global services is Region-scoped.',
            },
            {
              type: 'heading',
              text: 'Scope of common resources',
            },
            {
              type: 'table',
              headers: ['Scope', 'Examples', 'Design implication'],
              rows: [
                ['Global', 'IAM, Route 53, CloudFront, Organizations', 'Control plane often lives in one Region (us-east-1); design data-plane paths that keep working if that control plane is impaired'],
                ['Regional', 'S3 buckets, DynamoDB tables, Lambda, VPCs, SQS, KMS keys', 'Multi-Region needs explicit replication (S3 CRR, DynamoDB global tables, multi-Region KMS keys)'],
                ['Zonal', 'EC2 instances, EBS volumes, subnets, NAT Gateways (standard)', 'Must be duplicated per AZ for high availability'],
              ],
            },
            {
              type: 'heading',
              text: 'Static stability: the principle behind AWS\'s own architecture',
            },
            {
              type: 'p',
              text: 'AWS designs its services to be **statically stable**: when an AZ fails, the surviving AZs should already have enough capacity to carry the load *without* needing to call a control plane (launch instances, change DNS, create resources) during the event — because control planes are exactly what tends to be impaired during large incidents. Apply the same idea to your own systems: if you run in three AZs and need N instances of capacity, run roughly 1.5N (N/2 per AZ) so that losing one AZ leaves N, rather than relying on Auto Scaling to launch replacements in the middle of an outage.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'mapping AZ names to stable AZ IDs for your account',
              code: `aws ec2 describe-availability-zones --region us-east-1 \\
  --query "AvailabilityZones[].[ZoneName,ZoneId,ZoneType]" --output table
# us-east-1a in YOUR account might be use1-az4, while in a partner's
# account us-east-1a is use1-az1 -- always coordinate on ZoneId`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Cross-AZ traffic inside a Region is billed (per GB, in each direction) and adds roughly a millisecond or less of latency. That is cheap insurance for availability, but chatty microservices that bounce every request across AZs can turn it into a significant line item — topology-aware routing (keep a request in the AZ where it entered when healthy) is a common optimization.',
            },
          ],
        },
        {
          id: 'shared-responsibility-model',
          title: 'The Shared Responsibility Model',
          summary:
            'AWS is responsible for the security **of** the cloud (the underlying infrastructure); the customer is responsible for security **in** the cloud (how they configure and use it) — misreading this split is one of the most common root causes of real cloud security incidents.',
          keyPoints: [
            'AWS secures the physical infrastructure: data centers, hardware, the virtualization layer, and the managed portions of managed services (e.g., patching the underlying OS of RDS).',
            'The customer secures everything they configure on top: IAM policies, security group rules, data encryption choices, patching *unmanaged* OS instances (e.g., an EC2 instance\'s guest OS), and application-level security.',
            'The exact split shifts depending on the service: for **EC2** (IaaS), the customer manages the guest OS, patching, and firewall config; for **RDS** (managed PaaS-like service), AWS manages the underlying OS/DB engine patching, the customer manages access control and data.',
            'The overwhelming majority of real-world cloud security breaches are customer-side misconfigurations (a public S3 bucket, an overly permissive IAM policy, an exposed database) — not a failure of AWS\'s own infrastructure security.',
            'This model is the reason "is AWS secure?" is the wrong question — the right question is "did we configure our part of AWS securely?"',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Customer["Customer responsibility: Security IN the cloud"]\n    direction TB\n    CU1[Customer data]\n    CU2[Platform, applications, IAM]\n    CU3[Operating system, network & firewall config]\n    CU4[Client-side / server-side data encryption]\n  end\n  subgraph AWSResp["AWS responsibility: Security OF the cloud"]\n    direction TB\n    A1["AWS-managed software<br/>(for managed services)"]\n    A2[Compute, storage, database, networking hardware]\n    A3[AWS global infrastructure:<br/>Regions, AZs, edge locations]\n  end\n  Customer --> AWSResp',
            },
            {
              type: 'table',
              headers: ['Layer', 'EC2 (IaaS)', 'RDS (managed)', 'Lambda / DynamoDB (fully managed)'],
              rows: [
                ['Guest OS patching', 'Customer', 'AWS', 'N/A — no guest OS exposed'],
                ['Network/firewall config', 'Customer (security groups)', 'Customer (security groups, VPC placement)', 'Customer (resource policies, VPC config if applicable)'],
                ['Data encryption', 'Customer opts in/configures', 'Customer opts in/configures', 'Customer opts in/configures'],
                ['IAM / access control', 'Customer', 'Customer', 'Customer'],
                ['Underlying hardware/hypervisor', 'AWS', 'AWS', 'AWS'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'In an interview, naming the shared responsibility model correctly when discussing "how would you secure this AWS architecture" signals you understand that AWS is not a magic security guarantee — misconfigured IAM and open security groups are still entirely your problem.',
            },
            {
              type: 'heading',
              text: 'Where real incidents actually come from',
            },
            {
              type: 'list',
              items: [
                '**Leaked long-lived credentials** — access keys committed to Git, baked into container images, or pasted into CI logs. Attackers scan public repos within minutes and typically spin up crypto-mining fleets in every Region.',
                '**Over-permissive identity** — `"Action": "*"` roles attached to a web server, so an SSRF or RCE in the app becomes full-account compromise.',
                '**Instance metadata abuse** — SSRF reaching `169.254.169.254` to steal role credentials; mitigated by enforcing **IMDSv2** (session-token based) on every instance.',
                '**Public data exposure** — S3 buckets, RDS snapshots, or EBS snapshots shared publicly; mitigated by account-level Block Public Access settings and detective controls (Config, Security Hub, Macie).',
                '**Missing detection** — CloudTrail or GuardDuty not enabled in all Regions, so an attacker operating in an unused Region goes unnoticed.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Responsibility shifts with abstraction, but **data classification, identity, and configuration are always yours**, even on the most managed service. Running on Lambda does not make an over-permissive execution role safe, and running on S3 does not make a public bucket private.',
            },
          ],
        },
        {
          id: 'iam-fundamentals',
          title: 'IAM Fundamentals: Users, Groups, Roles & Policies',
          summary:
            'IAM (Identity and Access Management) controls who — or what — can do what, to which AWS resources; it is the single most-tested basic AWS topic because nearly every other service ultimately depends on it for access control.',
          keyPoints: [
            '**Users** are long-lived identities with a password (console access) and/or access keys (programmatic access). Modern best practice is to have almost **no** IAM users: humans sign in through **IAM Identity Center** (federated SSO, short-lived credentials) and workloads use roles.',
            '**Groups** collect users to attach policies once instead of per-user; a group itself cannot be assumed or logged into.',
            '**Roles** are temporary, assumable identities with no long-term credentials — the correct way for EC2/Lambda/ECS workloads (and cross-account access) to get AWS permissions, never hardcoded access keys.',
            '**Policies** are JSON documents listing allowed/denied actions on resources; the evaluation logic is **default deny → any explicit Allow permits → any explicit Deny anywhere always wins**, overriding any Allow.',
            'The **principle of least privilege** — scoping every role/policy to the minimum actions and resources actually needed — is the single most repeated piece of AWS security guidance and a near-guaranteed interview topic.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'IAM answers two questions for every AWS API call: **who (or what) is making this request** (authentication) and **are they allowed to do this specific thing** (authorization). Almost every AWS service checks IAM before doing anything, which is why a surprising number of "why doesn\'t this work" AWS problems trace back to a missing or overly narrow IAM permission.',
            },
            {
              type: 'heading',
              text: 'Users, Groups, and Roles',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Identities\n    U1[IAM User: alice] --> G1[Group: Developers]\n    U2[IAM User: bob] --> G1\n    G1 --> P1[Policy: ReadOnlyAccess]\n    EC2[EC2 Instance] -.->|assumes| R1[IAM Role: AppServerRole]\n    Lambda[Lambda Function] -.->|assumes| R2[IAM Role: LambdaExecutionRole]\n    R1 --> P2[Policy: S3 read/write<br/>on specific bucket]\n    R2 --> P3[Policy: DynamoDB read/write<br/>on specific table]\n  end',
            },
            {
              type: 'heading',
              text: 'Policy Evaluation Logic',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a least-privilege IAM policy example',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadWriteOnOneBucket",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-app-uploads/*"
    },
    {
      "Sid": "DenyDeleteEverywhere",
      "Effect": "Deny",
      "Action": "s3:DeleteObject",
      "Resource": "*"
    }
  ]
}`,
            },
            {
              type: 'list',
              items: [
                'Everything starts with an **implicit deny** — no action is allowed unless something explicitly grants it.',
                'An **explicit `Allow`** in any applicable identity-based or resource-based policy grants the action (assuming nothing else denies it).',
                'An **explicit `Deny`** anywhere — in any applicable policy, including a Service Control Policy at the AWS Organizations level — always wins, overriding any `Allow` no matter how it was granted.',
              ],
            },
            {
              type: 'p',
              text: 'In a real organization there are several *kinds* of policy, and an action is allowed only if every applicable **guardrail** permits it *and* some **grant** allows it. Guardrails (SCPs, RCPs, permission boundaries, session policies) never grant anything on their own — they only cap what grants can achieve. This is the single most misunderstood part of IAM.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Req["API request"] --> D{"Explicit Deny in<br/>any policy?"}\n  D -->|yes| Deny1["DENY"]\n  D -->|no| SCP{"Allowed by SCPs and RCPs<br/>(Organizations)?"}\n  SCP -->|no| Deny2["DENY"]\n  SCP -->|yes| RBP{"Resource-based policy<br/>allows (same account)?"}\n  RBP -->|yes| Allow1["ALLOW"]\n  RBP -->|no| IBP{"Identity-based<br/>policy allows?"}\n  IBP -->|no| Deny3["DENY (implicit)"]\n  IBP -->|yes| PB{"Within permission boundary<br/>and session policy?"}\n  PB -->|no| Deny4["DENY"]\n  PB -->|yes| Allow2["ALLOW"]',
            },
            {
              type: 'table',
              headers: ['Policy type', 'Attached to', 'Grants or limits?', 'Typical use'],
              rows: [
                ['Identity-based', 'User, group, role', 'Grants', 'What this workload/person may do'],
                ['Resource-based', 'S3 bucket, SQS queue, KMS key, Lambda function, role trust policy', 'Grants (incl. cross-account)', 'Who may access this resource'],
                ['Permission boundary', 'User or role', 'Limits', 'Let developers create roles without escalating beyond a ceiling'],
                ['Service Control Policy (SCP)', 'Org root, OU, account', 'Limits principals in member accounts', 'Organization-wide guardrails (Regions, disabling CloudTrail)'],
                ['Resource Control Policy (RCP)', 'Org root, OU, account', 'Limits access to resources in member accounts', 'Data perimeter: "our S3 buckets are never accessible to outside identities"'],
                ['Session policy', 'Passed at AssumeRole time', 'Limits', 'Down-scope a session for one task'],
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Cross-account access needs **both sides** to agree: the target account\'s resource policy or role trust policy must trust the caller, *and* the caller\'s own identity policy must allow the action. One-sided configuration is the classic "AccessDenied even though I added the policy" bug.',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a role trust policy: who may assume this role (with a confused-deputy guard)',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::111122223333:role/ci-deployer" },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": { "sts:ExternalId": "vendor-assigned-unique-id" }
      }
    }
  ]
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Hardcoding long-lived IAM user access keys into application code, environment variables, or committed config is one of the most common real-world AWS security incidents. Workloads running on AWS compute (EC2, Lambda, ECS, EKS) should always use an IAM **role** (instance profile / task role / execution role), which provides short-lived, automatically-rotated credentials with no secret to leak.',
            },
          ],
        },
        {
          id: 'iam-identity-federation-and-workload-identity',
          title: 'Modern Identity: IAM Identity Center, STS Federation & Workload Identity',
          summary:
            'The production-grade answer to "how do people and machines get AWS credentials" is: never with long-lived keys. Humans federate through IAM Identity Center, CI/CD federates through OIDC, and workloads receive short-lived role credentials from the platform they run on.',
          keyPoints: [
            '**AWS STS** (Security Token Service) is the engine underneath everything: `AssumeRole`, `AssumeRoleWithWebIdentity` and `AssumeRoleWithSAML` exchange a trusted identity for temporary credentials (access key, secret, session token) that expire automatically.',
            '**IAM Identity Center** connects your identity provider (Entra ID, Okta, Google Workspace, or its own directory) to every account in the Organization; users pick an account and a **permission set**, and receive short-lived credentials — no IAM users to offboard when someone leaves.',
            '**OIDC federation for CI/CD** (GitHub Actions, GitLab, etc.) lets a pipeline assume a role using a signed token from the CI provider — eliminating the "AWS keys stored as CI secrets" anti-pattern entirely.',
            'Workloads get credentials from their platform: **EC2 instance profiles** (via IMDSv2), **ECS task roles**, **Lambda execution roles**, and on EKS **EKS Pod Identity** (simpler, newer) or **IRSA** (IAM Roles for Service Accounts, OIDC-based).',
            '**IAM Access Analyzer** finds resources shared outside your zone of trust, flags unused roles/permissions, and can generate least-privilege policies from CloudTrail activity — the practical way to *achieve* least privilege rather than just preach it.',
            '**ABAC** (attribute-based access control) uses tags in conditions (`aws:PrincipalTag/team` must equal `aws:ResourceTag/team`) so one policy scales across hundreds of teams instead of one policy per team.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant GH as GitHub Actions job\n  participant OIDC as GitHub OIDC provider\n  participant STS as AWS STS\n  participant AWS as AWS APIs\n  GH->>OIDC: request signed JWT (repo, branch, env claims)\n  OIDC-->>GH: ID token\n  GH->>STS: AssumeRoleWithWebIdentity(token, roleArn)\n  STS->>STS: verify signature, check trust policy conditions on sub/aud\n  STS-->>GH: temporary credentials (e.g. 1 hour)\n  GH->>AWS: deploy using temporary credentials',
            },
            {
              type: 'code',
              language: 'json',
              title: 'trust policy for a GitHub Actions deploy role, pinned to one repo and branch',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:acme/orders-api:ref:refs/heads/main"
        }
      }
    }
  ]
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The most dangerous OIDC misconfiguration is a trust policy without a tight `sub` condition (or using a wildcard like `repo:*`). That lets **any** GitHub repository in the world assume your role. Always pin the organization, repository, and ideally the branch or deployment environment.',
            },
            {
              type: 'code',
              language: 'yaml',
              title: 'the matching GitHub Actions workflow (no stored AWS secrets)',
              code: `permissions:
  id-token: write   # allow the job to request an OIDC token
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/orders-api-deployer
          aws-region: us-east-1
      - run: aws sts get-caller-identity`,
            },
            {
              type: 'heading',
              text: 'Human access vs workload access',
            },
            {
              type: 'table',
              headers: ['Who', 'Recommended mechanism', 'Avoid'],
              rows: [
                ['Employees (console + CLI)', 'IAM Identity Center with your IdP and MFA; `aws sso login` for the CLI', 'Per-person IAM users with access keys'],
                ['CI/CD pipelines', 'OIDC federation to a narrowly scoped deploy role', 'Access keys stored as pipeline secrets'],
                ['EC2 / ECS / Lambda', 'Instance profile / task role / execution role', 'Keys in env vars or config files'],
                ['EKS pods', 'EKS Pod Identity or IRSA, one role per service account', 'Using the node role for every pod'],
                ['On-premises servers', 'IAM Roles Anywhere (X.509 certificates)', 'Shared long-lived keys'],
                ['Root user', 'Lock away with MFA; centrally manage or remove member-account root credentials', 'Any day-to-day use'],
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'ABAC: one policy that lets each team manage only its own tagged resources',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:StartInstances", "ec2:StopInstances", "ec2:RebootInstances"],
      "Resource": "*",
      "Condition": {
        "StringEquals": { "aws:ResourceTag/team": "\${aws:PrincipalTag/team}" }
      }
    }
  ]
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Enforce **IMDSv2** (`HttpTokens=required`) on every EC2 instance and set it as the account default. IMDSv2 requires a PUT to obtain a session token first, which defeats the classic SSRF attack where a vulnerable app is tricked into fetching role credentials from the metadata endpoint.',
            },
          ],
        },
        {
          id: 'ec2-fundamentals',
          title: 'EC2 Fundamentals: Instance Types, AMIs & Pricing Models',
          summary:
            'EC2 (Elastic Compute Cloud) is virtual servers in the cloud — the foundational AWS compute service, and the baseline everything else (Auto Scaling, containers, even some serverless internals) builds on or compares against.',
          keyPoints: [
            'An EC2 **instance** is launched from an **AMI** (Amazon Machine Image — an OS + preinstalled software snapshot); instance **type** determines the vCPU/RAM/network/storage profile.',
            'Instance family letters signal intended workload: **M** (general purpose, balanced), **C** (compute-optimized, CPU-heavy workloads), **R** (memory-optimized, in-memory caches/databases), **T** (burstable, CPU credits), **I/D** (storage-optimized, high-IOPS local disk), **P/G** (GPU, ML/graphics), **Trn/Inf** (AWS\'s custom ML training/inference silicon).',
            'Read a type name like `m8g.xlarge` as family (`m`), generation (`8`), attributes (`g` = AWS **Graviton** Arm CPU, `i` = Intel, `a` = AMD, `d` = local NVMe, `n` = enhanced networking) and size. Graviton instances typically give the best price-performance for workloads that run on Arm (most interpreted languages, JVM, Go, containers built multi-arch).',
            'Pricing models trade commitment for discount: **On-Demand** (pay per second, no commitment, most expensive), **Savings Plans / Reserved Instances** (1-3 year commitment, up to ~72% off, for steady predictable load), **Spot** (spare capacity at a variable market price, up to ~90% off, reclaimable with a 2-minute warning — only for fault-tolerant/interruptible workloads). Spot no longer uses a bidding model; you simply pay the current Spot price, optionally capped.',
            'Choosing when to use EC2 at all vs a managed/serverless alternative: EC2 fits custom OS/runtime control, licensing requirements, or workloads that don\'t cleanly fit a managed abstraction.',
            'Stopping an EC2 instance keeps its EBS root volume (and its data) but releases the underlying host; terminating deletes the instance and, by default, its root EBS volume too (unless "delete on termination" is disabled).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Pricing model', 'Commitment', 'Discount vs On-Demand', 'Best fit'],
              rows: [
                ['On-Demand', 'None', '0% (baseline)', 'Unpredictable, short-term, or first-time workloads'],
                ['Reserved Instances', '1 or 3 years, tied to an instance configuration', 'Up to ~72%', 'Mostly superseded by Savings Plans for EC2; still relevant for RDS, ElastiCache, OpenSearch, Redshift'],
                ['EC2 Instance Savings Plans', '1 or 3 years, $/hr commitment to one family in one Region', 'Up to ~72%', 'Steady load where the family (e.g. m7g) is stable but size/OS may change'],
                ['Compute Savings Plans', '1 or 3 years, $/hr commitment, any family/Region, also Fargate and Lambda', 'Up to ~66%', 'The flexible default for a steady compute baseline'],
                ['Spot Instances', 'None (can be reclaimed anytime with 2-min warning)', 'Up to ~90%', 'Fault-tolerant, interruptible: batch jobs, CI runners, stateless scaled-out fleets'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  AMI[AMI: OS + software<br/>snapshot] -->|launch| Instance[EC2 Instance]\n  Instance --> Type{Instance Type}\n  Type -->|M-series| General[General purpose]\n  Type -->|C-series| Compute[Compute-optimized]\n  Type -->|R-series| Memory[Memory-optimized]\n  Type -->|I/D-series| StorageOpt[Storage-optimized]\n  Type -->|P/G/Trn/Inf| Accel[GPU / ML accelerators]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'launching an instance and checking its state with the AWS CLI',
              code: `# launch a small general-purpose instance in a specific subnet/security group
aws ec2 run-instances \\
  --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64 \\
  --instance-type t4g.small \\
  --iam-instance-profile Name=app-server-profile \\
  --metadata-options "HttpTokens=required,HttpEndpoint=enabled" \\
  --subnet-id subnet-0123456789abcdef0 \\
  --security-group-ids sg-0123456789abcdef0 \\
  --count 1
# notes: the AMI is resolved from a public SSM parameter (always the latest
# Amazon Linux 2023), IMDSv2 is enforced, and there is no SSH key pair --
# shell access goes through SSM Session Manager instead of an open port 22

# check what state it's in (pending -> running)
aws ec2 describe-instances \\
  --instance-ids i-0123456789abcdef0 \\
  --query "Reservations[].Instances[].State.Name"

# stop it (keeps the EBS root volume) vs terminate it (deletes it by default)
aws ec2 stop-instances --instance-ids i-0123456789abcdef0
aws ec2 terminate-instances --instance-ids i-0123456789abcdef0`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Spot Instances can be reclaimed by AWS with only a 2-minute termination warning whenever AWS needs the capacity back. Never use Spot for a stateful, single-instance, hard-to-restart workload (a single primary database) — it is a fit only when the workload is horizontally scaled, stateless, and can gracefully drain or checkpoint within that window.',
            },
            {
              type: 'heading',
              text: 'Under the hood: the Nitro System',
            },
            {
              type: 'p',
              text: 'Modern EC2 instances run on the **AWS Nitro System**: networking, EBS storage and management are offloaded to dedicated Nitro cards, and a minimal hypervisor handles only CPU and memory partitioning. That is why nearly all of the host\'s resources are available to your instance, why EBS and network performance are listed per instance size, and why AWS can make strong isolation claims (no operator shell access to the host). It is also why "the network is slow" on EC2 usually means you hit a per-instance bandwidth or packets-per-second allowance — check the `ethtool -S` ENA allowance counters before blaming AWS.',
            },
            {
              type: 'heading',
              text: 'Production practices for EC2 fleets',
            },
            {
              type: 'list',
              items: [
                '**Immutable instances**: bake AMIs (EC2 Image Builder or Packer), never patch in place; roll the fleet via the ASG instance refresh. Configuration drift between "pet" servers is a major source of 3 a.m. incidents.',
                '**No SSH**: use **SSM Session Manager** for shell access — no inbound port 22, IAM-authorized, fully logged to CloudTrail/S3.',
                '**Spot done right**: diversify across many instance types and AZs, use the `price-capacity-optimized` allocation strategy, and react to both the 2-minute interruption notice and the earlier **rebalance recommendation** signal.',
                '**Burstable (T) instances**: fine for low-average-CPU workloads; in `unlimited` mode sustained high CPU accrues surplus credit charges, in `standard` mode it gets throttled — either can surprise you under real load.',
                '**Placement groups**: *cluster* (low-latency, single AZ, HPC), *spread* (each instance on distinct hardware, max 7 per AZ, for small critical sets), *partition* (large distributed systems like Kafka/HDFS/Cassandra aware of rack failures).',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Before reaching for a bigger instance, ask whether the workload belongs on EC2 at all. If you do not need OS-level control, containers on Fargate or Lambda remove patching, AMI pipelines and capacity planning from your plate. Choose EC2 deliberately — for GPUs, licensing, special kernels, extreme cost optimization, or software that expects a long-lived host.',
            },
          ],
        },
        {
          id: 'auto-scaling-load-balancing',
          title: 'Auto Scaling Groups & Elastic Load Balancing',
          summary:
            'An Auto Scaling Group keeps a fleet of EC2 instances at the right size automatically, and an Elastic Load Balancer spreads incoming traffic across that fleet — together, the standard pattern for a horizontally scalable, self-healing compute tier.',
          keyPoints: [
            'An **Auto Scaling Group (ASG)** maintains a fleet between a minimum and maximum instance count, launching new instances (from a launch template) when needed and terminating them when not, replacing unhealthy instances automatically.',
            'Scaling policies: **target tracking** (keep a metric like average CPU at X%, the simplest and most common), **step scaling** (add/remove specific counts as a metric crosses thresholds), **scheduled scaling** (pre-scale for known traffic patterns, e.g. a daily peak).',
            'An **Elastic Load Balancer** distributes incoming traffic across healthy targets and performs health checks, automatically routing around instances the ASG or the LB itself has flagged unhealthy.',
            'ASG + ELB together give you both **elasticity** (right-sized capacity, cost efficiency) and **self-healing** (an ASG replaces a terminated/unhealthy instance without human intervention).',
            'A **launch template** defines what a new instance looks like (AMI, instance type, security groups, user data script) — the ASG uses it as the blueprint every time it launches a replacement or additional instance.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Users((Users)) --> ALB[Application Load Balancer]\n  ALB -->|health checks +<br/>round-robin/least-outstanding-requests| I1[EC2 Instance 1]\n  ALB --> I2[EC2 Instance 2]\n  ALB --> I3[EC2 Instance 3]\n  subgraph ASG["Auto Scaling Group (min=2, desired=3, max=6)"]\n    I1\n    I2\n    I3\n  end\n  CW[CloudWatch Alarm:<br/>avg CPU > 70%] -->|triggers| ASG\n  ASG -->|launches from| LT[Launch Template:<br/>AMI + instance type +<br/>security groups + user data]\n  I2 -.->|fails health check| ALB\n  ALB -.->|reports unhealthy| ASG\n  ASG -.->|terminates & replaces| I2',
            },
            {
              type: 'heading',
              text: 'A request\'s path through the stack',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant Client\n  participant ALB as Application Load Balancer\n  participant EC2 as EC2 Instance (app tier)\n  participant RDS as RDS (Multi-AZ)\n  Client->>ALB: HTTPS request\n  ALB->>ALB: TLS termination, health-check-aware routing\n  ALB->>EC2: forward to a healthy target\n  EC2->>RDS: query via connection pool\n  RDS-->>EC2: result\n  EC2-->>ALB: response\n  ALB-->>Client: response',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a target-tracking scaling policy with the AWS CLI',
              code: `# an Auto Scaling Group that already exists, given a target-tracking policy:
# "keep average CPU utilization near 60% across the fleet"
aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name my-app-asg \\
  --policy-name cpu-target-tracking \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 60.0
  }'

# AWS now computes add/remove decisions on its own -- no manual thresholds to tune`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Target tracking scaling is almost always the right default — you declare the outcome you want ("keep average CPU near 60%") and AWS computes the add/remove decisions, instead of you hand-tuning step thresholds. Reach for step or scheduled scaling only when target tracking\'s single-metric model genuinely doesn\'t fit (e.g., a known daily traffic spike you want to pre-empt before the metric even rises).',
            },
            {
              type: 'heading',
              text: 'Choosing a load balancer',
            },
            {
              type: 'table',
              headers: ['', 'Application LB (ALB)', 'Network LB (NLB)', 'Gateway LB (GWLB)'],
              rows: [
                ['OSI layer', 'Layer 7 (HTTP/1.1, HTTP/2, gRPC, WebSocket)', 'Layer 4 (TCP, UDP, TLS)', 'Layer 3 (IP packets via GENEVE)'],
                ['Routing', 'Host, path, header, query, method; weighted target groups', 'Port/protocol only', 'Transparent insertion of appliances'],
                ['Static IP', 'No (DNS name only)', 'Yes, one per AZ (Elastic IP optional)', 'N/A'],
                ['Typical use', 'Web apps, REST/gRPC microservices, auth via OIDC/Cognito', 'Non-HTTP protocols, extreme throughput, PrivateLink services, IP allowlisting', 'Third-party firewalls / IDS inspection'],
              ],
            },
            {
              type: 'heading',
              text: 'Scaling mechanics most people get wrong',
            },
            {
              type: 'list',
              items: [
                '**Scaling is not instant**: a new instance needs launch time plus app boot plus health-check passes. If that is 4 minutes, a traffic spike that doubles load in 1 minute will hurt. Mitigate with **predictive scaling** (forecasts from historical patterns), **warm pools** (pre-initialized stopped instances), lower target utilization for headroom, or faster boot (smaller AMIs, pre-baked dependencies).',
                '**Health-check grace period**: too short, and the ASG kills instances that are still booting, creating a launch/terminate loop; too long, and broken instances serve traffic. Use ELB health checks on the ASG (not only EC2 status checks) so app-level failures trigger replacement.',
                '**Deregistration delay (connection draining)**: when an instance is removed, the LB stops sending new requests but lets in-flight ones finish (default 300 s). Tune it to your longest legitimate request, and handle `SIGTERM` gracefully in your app.',
                '**Lifecycle hooks** let you run logic on launch (warm caches, register with service discovery) or terminate (flush logs, finish jobs) before the ASG proceeds.',
                '**Scale-in protection and cooldowns** stop flapping; target tracking scales out aggressively but in conservatively by design — that asymmetry is intentional.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A health check endpoint that calls the database is a classic cascading-failure trap: when the database blips, *every* instance fails its health check at once, the load balancer has no healthy targets, and the ASG starts replacing the whole fleet. Keep the LB health check shallow (is this process able to serve?) and expose dependency health separately for monitoring. Note that ALB "fails open" — if all targets are unhealthy it routes to all of them anyway.',
            },
          ],
        },
        {
          id: 'serverless-lambda',
          title: 'Serverless Compute with Lambda',
          summary:
            'Lambda runs your code in response to events without any server to provision or manage, billed per invocation and execution duration, scaling automatically from zero to thousands of concurrent executions.',
          keyPoints: [
            'Lambda functions run in response to **event sources** — S3 uploads, API Gateway requests, SQS messages, DynamoDB Streams, EventBridge rules, scheduled cron-like triggers, and more.',
            'Billing is per invocation plus execution duration (rounded to the millisecond) times allocated memory — you pay nothing when a function isn\'t running, unlike an always-on EC2 instance.',
            '**Cold starts**: the first invocation (or a new concurrent invocation beyond warm capacity) pays a startup penalty to initialize the execution environment — mitigated with **Provisioned Concurrency** (pre-initialized environments), **SnapStart** (restores from a snapshot of an initialized environment; available for Java, Python and .NET runtimes), smaller deployment packages, and Arm/Graviton.',
            '**Concurrency**: each execution environment handles **one request at a time**, so concurrency is roughly requests-per-second times average duration. **Reserved concurrency** caps (and guarantees) a function\'s share; the **account-level Regional limit** (1,000 by default, raisable) caps the total, and a runaway function can starve everything else in the account.',
            'Best fit: event-driven, short-duration (max 15 minutes per invocation), spiky/unpredictable workloads. Not a fit for long-running, steady, high-throughput compute — the per-invocation cost model crosses over to being more expensive than EC2/Fargate at sustained high volume.',
            'Newer options blur the line: **Lambda durable functions** add checkpoint/resume for multi-step workflows that wait without paying for idle time, and **Lambda Managed Instances** run functions on EC2 capacity in your account (choosing instance types, applying Savings Plans) while keeping the Lambda programming model.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  S3Event[S3: ObjectCreated] --> Lambda[Lambda Function]\n  APIGW[API Gateway: HTTP request] --> Lambda\n  SQSEvent[SQS: message available] --> Lambda\n  DDBStream[DynamoDB Streams:<br/>item changed] --> Lambda\n  EventBridgeRule[EventBridge: scheduled<br/>or pattern-matched event] --> Lambda\n  Lambda --> Result[Writes to S3 / DynamoDB /<br/>publishes to SNS / etc.]',
            },
            {
              type: 'heading',
              text: 'Cold start, visually',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant Event\n  participant LambdaService as Lambda Service\n  participant Env as Execution Environment\n  Note over LambdaService,Env: Cold start (no warm environment available)\n  Event->>LambdaService: invoke\n  LambdaService->>Env: provision new environment<br/>(download code, start runtime)\n  Env->>Env: run init code (outside handler)\n  Env->>Env: run handler\n  Env-->>Event: response (higher latency)\n  Note over LambdaService,Env: Warm start (environment reused)\n  Event->>LambdaService: invoke\n  LambdaService->>Env: reuse existing environment\n  Env->>Env: run handler only\n  Env-->>Event: response (low latency)',
            },
            {
              type: 'code',
              language: 'python',
              title: 'a minimal Lambda handler (Python)',
              code: `import json
import urllib.parse
import boto3

s3 = boto3.client("s3")  # initialized once per cold start, reused across warm invocations

def handler(event, context):
    processed = []
    # an S3 notification can carry several records -- never assume Records[0] only
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        # object keys arrive URL-encoded ("my photo.jpg" -> "my+photo.jpg")
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        obj = s3.get_object(Bucket=bucket, Key=key)
        # ... process obj["Body"] (stream it; don't read huge objects into memory) ...
        processed.append(key)
    return {"processed": processed}`,
            },
            {
              type: 'heading',
              text: 'Three invocation models, three failure semantics',
            },
            {
              type: 'table',
              headers: ['Model', 'Examples', 'Who retries?', 'Where failures go'],
              rows: [
                ['Synchronous', 'API Gateway, ALB, function URLs, SDK `Invoke`', 'The caller (Lambda does not retry)', 'Error returned to the client'],
                ['Asynchronous', 'S3 notifications, SNS, EventBridge', 'Lambda: up to 2 retries with backoff, configurable event age', 'On-failure **destination** (SQS, SNS, EventBridge, Lambda, S3) or DLQ'],
                ['Poll-based (event source mapping)', 'SQS, Kinesis, DynamoDB Streams, Kafka', 'Lambda pollers retry the batch', 'SQS redrive to DLQ; for streams, bisect batch + on-failure destination, or the shard blocks'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'SQS consumer with partial batch failure reporting',
              code: `import json

def handler(event, context):
    failures = []
    for record in event["Records"]:
        try:
            process(json.loads(record["body"]))  # must be idempotent: delivery is at-least-once
        except Exception:
            failures.append({"itemIdentifier": record["messageId"]})
    # requires ReportBatchItemFailures enabled on the event source mapping;
    # only the failed messages become visible again -- the rest are deleted
    return {"batchItemFailures": failures}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Without partial batch responses, one poison message in an SQS batch of 10 makes the whole batch fail and all 10 get reprocessed — repeatedly — until they hit the DLQ. On Kinesis/DynamoDB Streams it is worse: a failing record **blocks the shard** until it expires, so configure `BisectBatchOnFunctionError`, a maximum retry count, and an on-failure destination.',
            },
            {
              type: 'heading',
              text: 'Lambda production checklist',
            },
            {
              type: 'list',
              items: [
                '**Memory is the CPU knob**: CPU scales with configured memory (up to 10,240 MB / 6 vCPU). A CPU-bound function at 128 MB is often both slower *and* more expensive than at 1,024 MB — measure with AWS Lambda Power Tuning.',
                '**Init phase is billed**: since August 2025 the INIT phase is billed for on-demand functions too, so heavy module-level initialization is no longer "free" — keep it lean and lazy-load rarely used clients.',
                '**Timeouts**: set the function timeout below the upstream timeout (API Gateway integrations default to 29 s) and the SQS visibility timeout to at least 6 times the function timeout.',
                '**Databases**: thousands of concurrent environments can exhaust relational connection limits — use **RDS Proxy**, or a database with an HTTP/serverless-friendly connection model.',
                '**Observability**: structured JSON logs, metrics via Embedded Metric Format, tracing via OpenTelemetry — **Powertools for AWS Lambda** (Python, TypeScript, Java, .NET) packages all three plus idempotency and batch utilities.',
                '**Recursive loops**: a function that writes to the same S3 bucket/queue that triggers it can loop forever; Lambda now detects and stops many such loops, but design prefixes/queues so it cannot happen.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Anything expensive to set up (a database connection, an SDK client, loading a config file) belongs **outside** the handler function, at module scope — it runs once per cold start and is reused by every subsequent warm invocation of that same execution environment, instead of paying the cost on every single request.',
            },
          ],
        },
        {
          id: 'api-gateway-serverless-apis',
          title: 'Serverless APIs: API Gateway, Function URLs & AppSync',
          summary:
            'Putting an HTTP front door on serverless compute involves several overlapping products with very different feature sets and prices — choosing between REST APIs, HTTP APIs, WebSocket APIs, Lambda function URLs, ALB and AppSync is a frequent design-review question.',
          keyPoints: [
            '**API Gateway HTTP APIs** are the lean, cheaper, lower-latency option: JWT/OIDC authorizers, Lambda and HTTP proxy integrations, CORS — the default for most new Lambda-backed REST-style APIs.',
            '**API Gateway REST APIs** cost more but add enterprise features: usage plans and API keys, request validation and transformation (VTL mapping templates), caching, AWS WAF integration, private APIs reachable only through a VPC endpoint, and direct AWS service integrations (e.g. put to SQS without a Lambda).',
            '**WebSocket APIs** keep long-lived client connections at the gateway and invoke your backend per message; your code pushes back to clients through a callback (`@connections`) endpoint.',
            '**Lambda function URLs** give a single function a dedicated HTTPS endpoint with IAM or no auth — ideal for webhooks and simple internal endpoints, and they support **response streaming**, but they have no throttling plans, custom authorizers, or request validation.',
            '**AWS AppSync** is managed GraphQL (plus pub/sub Events APIs) with resolvers to DynamoDB, Lambda, RDS and HTTP sources, and built-in real-time subscriptions.',
            'API Gateway has a hard-ish **integration timeout** (29 s by default, raisable for Regional/private REST APIs) and payload limits (around 10 MB) — long jobs should return `202 Accepted` and finish asynchronously.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Front door', 'Strengths', 'Limitations', 'Pick when'],
              rows: [
                ['HTTP API', 'Cheapest per request, low latency, native JWT auth', 'No caching, no usage plans, limited transformations', 'Default for a new Lambda/container-backed REST API'],
                ['REST API', 'Usage plans, caching, WAF, request validation, private endpoints, service integrations', 'Higher price, more configuration', 'Public partner APIs, monetized APIs, strict validation, private APIs'],
                ['Function URL', 'Zero config, response streaming, no extra charge', 'One function only, IAM or no auth, no throttling', 'Webhooks, internal tools, streaming responses'],
                ['ALB + Lambda', 'Mix Lambda and container targets behind one domain', 'Hourly LCU cost even when idle', 'Migrating gradually from containers to Lambda or vice versa'],
                ['AppSync', 'GraphQL, real-time subscriptions, direct data-source resolvers', 'GraphQL learning curve', 'Mobile/web clients that need flexible queries and live updates'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Client((Client)) -->|"HTTPS + JWT"| APIGW["API Gateway HTTP API"]\n  APIGW -->|"JWT authorizer<br/>(Cognito / any OIDC IdP)"| Auth{"Valid token?"}\n  Auth -->|no| R401["401 returned at the edge"]\n  Auth -->|yes| L["Lambda: orders handler"]\n  L --> DDB[("DynamoDB")]\n  APIGW -.->|"long job: 202 Accepted"| SQS["SQS queue"]\n  SQS --> Worker["Lambda worker"]',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'CDK (TypeScript): an HTTP API with a JWT authorizer in front of Lambda',
              code: `import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';

export class OrdersApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, 'OrdersFn', {
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('dist/orders'),
      memorySize: 1024,
    });

    const authorizer = new HttpJwtAuthorizer('Jwt', 'https://auth.example.com/', {
      jwtAudience: ['orders-api'],
    });

    const api = new HttpApi(this, 'OrdersApi');
    api.addRoutes({
      path: '/orders/{id}',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('OrdersInt', fn),
      authorizer,
    });
  }
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Throttle at the front door. API Gateway applies account-level and per-stage/per-route throttles (token bucket: steady rate plus burst). Set explicit per-route limits so one noisy client or endpoint cannot consume your whole Lambda concurrency pool and take down unrelated APIs.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using API Gateway as a synchronous wrapper around slow work (report generation, video processing, LLM chains) runs straight into the integration timeout. Use the async request-reply pattern: accept, enqueue, return a job ID, and let clients poll or subscribe (WebSocket/AppSync) for completion.',
            },
          ],
        },
        {
          id: 'containers-ecs-eks-fargate',
          title: 'Containers on AWS: ECS vs EKS vs Fargate',
          summary:
            'Three separate decisions get conflated under "containers on AWS": which orchestrator (ECS or EKS), and which launch type (EC2 you manage, or Fargate\'s serverless containers) — understanding them as independent axes is the senior-level framing.',
          keyPoints: [
            '**ECS (Elastic Container Service)**: AWS\'s own, simpler container orchestrator — tightly integrated with the rest of AWS, less operational overhead than Kubernetes, no separate control-plane concepts to learn.',
            '**EKS (Elastic Kubernetes Service)**: a managed Kubernetes control plane — the right choice when the org already has Kubernetes expertise/tooling investment, needs multi-cloud portability, or requires the Kubernetes ecosystem specifically.',
            'The **launch type** is a separate axis from the orchestrator: **EC2 launch type** gives you the underlying instances to patch/manage (cheaper at sustained scale, more ops burden); **Fargate** is serverless — no instances to manage, you pay per task\'s vCPU/memory directly.',
            'Fargate works with **both** ECS and EKS — "ECS vs Fargate" is a common but slightly imprecise framing; the real choice is orchestrator (ECS/EKS) × launch type (EC2/Fargate).',
            'Fargate is the default recommendation for "run containers without managing servers"; EC2 launch type still wins when you need very fine-grained instance-level control (custom AMIs, GPU instances, extreme cost optimization via Spot at scale).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'ECS', 'EKS', 'Fargate (launch type, works with either)'],
              rows: [
                ['What it is', 'AWS-native container orchestrator', 'Managed Kubernetes control plane', 'Serverless compute for containers'],
                ['Learning curve', 'Lower — AWS-specific concepts', 'Higher — full Kubernetes API/ecosystem', 'N/A — a launch type, not an orchestrator'],
                ['Best fit', 'AWS-only shops wanting simplicity', 'Existing K8s investment, multi-cloud need', '"I don\'t want to manage any servers"'],
                ['Control', 'Less granular than K8s', 'Full Kubernetes API access', 'Less control over the underlying host (by design)'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Decision{Need containers on AWS} --> Q1{Existing Kubernetes<br/>expertise/tooling, or<br/>multi-cloud requirement?}\n  Q1 -->|Yes| EKS[EKS: managed<br/>Kubernetes control plane]\n  Q1 -->|No| ECS[ECS: AWS-native<br/>orchestrator]\n  EKS --> Q2{Want to manage<br/>underlying EC2 instances?}\n  ECS --> Q2\n  Q2 -->|No, minimize ops| Fargate[Launch type: Fargate<br/>serverless containers]\n  Q2 -->|Yes, need control<br/>or Spot cost savings at scale| EC2LT[Launch type: EC2<br/>you manage instances]',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a minimal ECS task definition on Fargate',
              code: `{
  "family": "orders-api",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "512",
  "memory": "1024",
  "runtimePlatform": { "cpuArchitecture": "ARM64", "operatingSystemFamily": "LINUX" },
  "executionRoleArn": "arn:aws:iam::123456789012:role/orders-api-execution",
  "taskRoleArn": "arn:aws:iam::123456789012:role/orders-api-task",
  "containerDefinitions": [
    {
      "name": "orders-api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/orders-api:2026.10.12-3f9c2ab",
      "portMappings": [{ "containerPort": 8080, "protocol": "tcp" }],
      "secrets": [
        { "name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:prod/orders-db" }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/healthz || exit 1"],
        "interval": 15, "timeout": 5, "retries": 3, "startPeriod": 30
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/orders-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}`,
            },
            {
              type: 'list',
              items: [
                '`"requiresCompatibilities": ["FARGATE"]` runs the task on AWS-managed compute — no EC2 fleet to patch.',
                'The **execution role** is used by the ECS agent to pull the image and fetch secrets/write logs; the **task role** is what *your code* uses to call AWS APIs. Mixing them up either breaks startup or grants your app far too much.',
                'An immutable image tag (version + commit SHA) instead of `:latest` makes deployments reproducible and rollbacks meaningful; enable ECR tag immutability to enforce it.',
                'Secrets are injected from Secrets Manager/Parameter Store at start time, never baked into the image or plain environment variables in the task definition.',
              ],
            },
            {
              type: 'heading',
              text: 'The 2025-2026 landscape: less undifferentiated cluster work',
            },
            {
              type: 'table',
              headers: ['Option', 'What AWS manages', 'Good for'],
              rows: [
                ['ECS Express Mode', 'Service on Fargate plus ALB, autoscaling, networking from one API call', 'Simple web services/APIs; the successor path for App Runner users'],
                ['ECS on Fargate', 'Compute and isolation per task', 'Most containerized services on AWS'],
                ['ECS Managed Instances / EC2 capacity providers', 'Instance provisioning and patching (managed) or nothing (self-managed)', 'GPU, specific instance types, cost optimization at scale'],
                ['EKS Auto Mode', 'Control plane plus node provisioning (Karpenter-based), patching, core add-ons', 'Kubernetes without running node groups yourself'],
                ['EKS with Karpenter / managed node groups', 'Control plane only (you own nodes and add-ons)', 'Teams needing full Kubernetes customization'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Kubernetes is not free even when the control plane is managed: EKS charges per cluster-hour, and the real cost is people — upgrades every few months (each Kubernetes minor version has a limited standard-support window, after which extended support costs extra), add-on compatibility, networking (VPC CNI IP exhaustion), and policy tooling. Choose EKS for a concrete reason, not because it is fashionable.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For service-to-service calls in ECS, **Service Connect** gives you service discovery, client-side load balancing, retries and per-service metrics without running your own mesh. On EKS or across compute types, **VPC Lattice** offers a managed application-networking layer with IAM-based auth between services.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A strong interview answer to "how would you run this containerized service on AWS" states both decisions explicitly: "ECS, because we don\'t have existing Kubernetes tooling and want AWS-native simplicity, on Fargate, because we don\'t want to manage or patch the underlying EC2 fleet" — naming the orchestrator and the launch type as two separate choices.',
            },
          ],
        },
        {
          id: 's3-fundamentals',
          title: 'S3 Fundamentals: Storage Classes, Consistency & Access Patterns',
          summary:
            'S3 (Simple Storage Service) is object storage with eleven nines of durability and effectively unlimited scale, accessed over HTTP rather than mounted as a filesystem — the default answer for unstructured data, backups, static assets, and data lakes on AWS.',
          keyPoints: [
            'S3 stores **objects** (data + metadata + a key) inside **buckets**; there is no true directory structure — key prefixes (e.g. `photos/2024/img.jpg`) simulate folders in the console and APIs.',
            'Durability is "11 nines" (99.999999999%) because every object is redundantly stored across multiple devices in multiple Availability Zones within a Region by design — this is about durability (not losing data), distinct from availability (being reachable right now).',
            'S3 provides **strong read-after-write consistency** for all operations (as of December 2020) — a `GET` immediately after a successful `PUT` of a new object always returns the latest data, no "eventual consistency" caveat to design around.',
            'Storage classes trade retrieval speed/cost for storage cost: **Standard** (frequent access) → **Intelligent-Tiering** (auto-moves objects between tiers based on observed access, the "don\'t want to think about it" default for unpredictable access) → **Standard-IA / One Zone-IA** (infrequent access, cheaper storage + a retrieval fee) → **Glacier Instant/Flexible/Deep Archive** (archival, minutes-to-hours retrieval, dramatically cheaper storage).',
            'Common patterns: static website hosting, a data lake\'s raw storage layer, backup/DR target, and the origin for a CloudFront distribution.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Object[Object uploaded] --> Standard[S3 Standard<br/>frequent access]\n  Standard -->|lifecycle rule:<br/>30 days no access| IA[Standard-IA<br/>infrequent access]\n  IA -->|lifecycle rule:<br/>90 days no access| Glacier[Glacier Flexible Retrieval<br/>archival, minutes-hours]\n  Glacier -->|lifecycle rule:<br/>180 days| DeepArchive[Glacier Deep Archive<br/>cheapest, ~12hr retrieval]\n  Object -.->|unpredictable access<br/>pattern instead| Intelligent[Intelligent-Tiering<br/>auto-moves between tiers]',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a lifecycle rule that ages objects into cheaper storage',
              code: `{
  "Rules": [
    {
      "ID": "Age out old uploads",
      "Status": "Enabled",
      "Filter": { "Prefix": "uploads/" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ],
      "Expiration": { "Days": 2555 }
    }
  ]
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A public S3 bucket serving sensitive data is one of the most common real-world AWS security incidents. S3 buckets are private by default, and **S3 Block Public Access** (account- and bucket-level) is a strong guardrail worth naming explicitly in any "how would you prevent an accidental data leak" answer.',
            },
            {
              type: 'heading',
              text: 'Modern secure defaults (and what they replaced)',
            },
            {
              type: 'list',
              items: [
                '**Encryption at rest is automatic**: since January 2023 every new object is encrypted with SSE-S3 by default. Choose **SSE-KMS** (with an S3 Bucket Key to cut KMS request costs) when you need key-level access control and audit, or DSSE-KMS for dual-layer compliance requirements.',
                '**ACLs are disabled by default**: new buckets use the *Bucket owner enforced* Object Ownership setting, so access is controlled purely by IAM and bucket policies. Legacy ACL-based designs are a code smell.',
                '**Block Public Access is on by default** for new buckets; turn it on at the *account* level too and treat exceptions as reviewed changes.',
                '**Static sites go through CloudFront with Origin Access Control (OAC)**, keeping the bucket private — not through a public "website endpoint" bucket. OAC replaced the older Origin Access Identity (OAI).',
                '**Presigned URLs** let clients upload/download directly to S3 for a limited time using the signer\'s permissions — keeping large files off your application servers.',
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'bucket policy: deny non-TLS access and allow only CloudFront (OAC) to read',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::my-site-assets", "arn:aws:s3:::my-site-assets/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-site-assets/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEF2GHIJK"
        }
      }
    }
  ]
}`,
            },
            {
              type: 'heading',
              text: 'Performance and data-protection mechanics',
            },
            {
              type: 'list',
              items: [
                '**Request rate scales per prefix**: S3 supports at least 3,500 writes and 5,500 reads per second *per partitioned prefix* and partitions automatically as load grows. Spread hot workloads across prefixes, and expect brief `503 Slow Down` responses during sudden ramps — retry with exponential backoff (the SDKs do this).',
                '**Multipart upload** for large objects (recommended above ~100 MB, required above 5 GB, max object size 5 TB) parallelizes transfers and lets you retry individual parts. Add a lifecycle rule to abort incomplete multipart uploads, or you pay for invisible orphaned parts.',
                '**Conditional writes** (`If-None-Match: *` to create only if absent, `If-Match` with an ETag for compare-and-swap) let S3 act as a simple coordination primitive without an external lock service.',
                '**Versioning + Object Lock** protect against accidental deletes and ransomware: versioning keeps prior versions, Object Lock in compliance mode makes them undeletable for a retention period, even by root.',
                '**Replication** (Cross-Region or Same-Region) is asynchronous; **Replication Time Control** adds an SLA-backed 15-minute target for compliance-driven RPOs.',
              ],
            },
            {
              type: 'table',
              headers: ['Newer S3 capability', 'What it is', 'When to use'],
              rows: [
                ['S3 Express One Zone', 'Directory buckets in a single AZ with single-digit-millisecond latency', 'ML training data, analytics scratch space, latency-sensitive hot data you can recreate'],
                ['S3 Tables', 'Managed Apache Iceberg tables with automatic compaction', 'Lakehouse tables queried by Athena, EMR, Redshift, Spark'],
                ['S3 Vectors', 'Native vector storage and similarity search in S3', 'Large, cost-sensitive embedding collections for RAG and semantic search where ms-level latency is acceptable'],
                ['S3 Metadata / Inventory', 'Queryable tables of object metadata', 'Finding objects at scale without LIST calls'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Lifecycle transitions are not free: each transition is a per-object request charge, and IA/Glacier classes have **minimum storage durations** and **minimum billable object sizes** (128 KB for IA). Moving millions of tiny objects into Glacier can cost more than leaving them in Standard. Aggregate small objects first, or let Intelligent-Tiering handle objects above its size threshold.',
            },
          ],
        },
        {
          id: 'storage-comparison-ebs-efs-s3',
          title: 'Storage Comparison: EBS vs EFS vs S3',
          summary:
            'A frequently-tested distinction: three AWS storage services that sound similar but solve fundamentally different access patterns — block storage for one instance, a shared filesystem for many, and object storage accessed over HTTP.',
          keyPoints: [
            '**EBS (Elastic Block Store)**: block storage that attaches to exactly **one** EC2 instance at a time — like a virtual hard drive; persists independently of instance lifecycle, but is AZ-bound (a snapshot is required to move it to another AZ).',
            '**EFS (Elastic File System)**: a managed **NFS** filesystem mountable by **many** EC2 instances/containers **simultaneously** — the fit when multiple compute nodes need a shared, POSIX-compliant filesystem (shared config, shared upload processing across a fleet).',
            '**S3**: object storage accessed via HTTP API, not mountable as a true filesystem, effectively unlimited scale — the fit for unstructured data, backups, static assets, and data lake storage, not for a database\'s own working storage.',
            'EBS types: **gp3** (general-purpose SSD, the default: 3,000 IOPS and 125 MiB/s baseline included, independently provisionable up to 80,000 IOPS, 2,000 MiB/s and 64 TiB since late 2025), **io2 Block Express** (sub-millisecond, highest durability and IOPS, for the most demanding databases), and **st1/sc1** HDD for large sequential throughput. Migrate any remaining gp2 volumes to gp3 — it is usually cheaper with better baseline performance.',
            'The database-storage rule of thumb: a relational database\'s own data volume belongs on EBS (single-attach, low-latency block device); a fleet needing shared files belongs on EFS; anything unstructured/archival/API-accessed belongs on S3.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'EBS', 'EFS', 'S3'],
              rows: [
                ['Type', 'Block storage', 'Shared network file system (NFS)', 'Object storage'],
                ['Attach model', 'One EC2 instance at a time', 'Many instances/containers concurrently', 'Not "attached" — accessed via HTTP API'],
                ['Scope', 'Single Availability Zone', 'Regional (multi-AZ by default)', 'Regional, effectively unlimited'],
                ['Typical use', 'A database\'s own data volume, a boot volume', 'Shared config, shared uploads across a fleet, CMS media', 'Backups, static assets, data lake, logs'],
                ['Access latency', 'Lowest (local block device)', 'Low (network filesystem)', 'Higher (HTTP request per object)'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  EC2a[EC2 Instance A] -->|attached, single-instance| EBSVol[(EBS Volume)]\n  EC2b[EC2 Instance B] -->|mounted, shared| EFSFS[(EFS File System)]\n  EC2c[EC2 Instance C] -->|mounted, shared| EFSFS\n  EC2d[EC2 Instance D] -->|HTTP API calls| S3Bucket[(S3 Bucket)]\n  EC2a -->|HTTP API calls| S3Bucket',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'FSx is worth a brief mention for completeness: **FSx for Windows File Server** and **FSx for Lustre** cover specific managed-filesystem needs (Windows-native SMB shares, and high-performance computing / ML training data respectively) that EFS\'s Linux-native NFS doesn\'t serve. **FSx for NetApp ONTAP** and **FSx for OpenZFS** cover lift-and-shift of enterprise NAS workloads with snapshots, clones and multi-protocol access.',
            },
            {
              type: 'heading',
              text: 'Operational details that bite',
            },
            {
              type: 'list',
              items: [
                '**EBS snapshots** are incremental and stored in S3 behind the scenes; a volume restored from a snapshot lazily loads blocks on first read, so the first pass over a restored database is slow unless you pre-warm it or enable **Fast Snapshot Restore**.',
                '**EBS Multi-Attach** (io1/io2 only) lets several instances in one AZ attach the same volume, but only cluster-aware filesystems can use it safely — it is not a shared filesystem like EFS.',
                '**Instance store** (local NVMe on `d`/`i` instances) is the fastest storage available but is wiped on stop, hibernate or host failure — great for caches, scratch space and replicated databases that tolerate node loss, never for the only copy of data.',
                '**EFS throughput**: use *Elastic* throughput mode for spiky workloads; small-file, metadata-heavy workloads (e.g. `npm install` on EFS) are much slower than on local disk because every operation is a network round trip.',
                '**EBS is AZ-bound**: an Auto Scaling replacement in another AZ cannot reattach the old volume. Stateful services need replication at the application layer or a regional storage service.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Use **AWS Backup** for centralized, policy-driven backups across EBS, RDS, DynamoDB, EFS and S3, with cross-account and cross-Region copies and vault lock. Ransomware recovery requires backups the compromised account itself cannot delete.',
            },
          ],
        },
        {
          id: 'rds-aurora-fundamentals',
          title: 'RDS & Aurora: Managed Relational Databases',
          summary:
            'RDS runs standard relational database engines with AWS handling patching, backups, and failover; Aurora is AWS\'s own MySQL/Postgres-compatible engine with a redesigned, faster storage layer — the usual "better default if budget allows" upgrade.',
          keyPoints: [
            '**RDS** manages Postgres, MySQL, MariaDB, Oracle, and SQL Server — AWS handles OS/engine patching, automated backups, and point-in-time recovery, while you manage schema, queries, and access control.',
            '**Multi-AZ deployment**: a synchronous standby replica in a second AZ, used only for automatic failover during an outage — it does not serve read traffic (in standard Multi-AZ; Multi-AZ with two readable standbys is a separate, newer option).',
            '**Read replicas**: asynchronous, read-only copies used to scale read throughput horizontally, and optionally promotable to a standalone primary — a different tool than Multi-AZ, solving a different problem (read scaling vs high availability).',
            '**Aurora**: AWS\'s MySQL/Postgres-compatible engine with storage decoupled from compute, auto-replicated six ways across three AZs — typically faster crash recovery and higher throughput than standard RDS, wire-compatible so it usually needs no application changes.',
            '**Aurora Serverless v2** scales compute capacity automatically based on load, billed per-ACU-second, and can now scale to **0 ACUs** (auto-pause) when idle — a fit for variable workloads and dev/test databases.',
            'The wider family: **Aurora Global Database** (storage-level cross-Region replication, typically under a second of lag, fast managed failover), **Aurora DSQL** (serverless, distributed SQL with active-active multi-Region writes and PostgreSQL compatibility), and **RDS Proxy** (connection pooling that absorbs connection storms from Lambda or large fleets and shortens failover impact).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  App[Application] -->|writes + reads| Primary[(RDS Primary<br/>AZ-a)]\n  Primary -.->|synchronous replication<br/>for failover only| Standby[(Multi-AZ Standby<br/>AZ-b, not readable)]\n  Primary -->|asynchronous replication| Replica1[(Read Replica 1<br/>AZ-c)]\n  Primary -->|asynchronous replication| Replica2[(Read Replica 2<br/>AZ-a or cross-Region)]\n  App -.->|read-only queries,<br/>scaled out| Replica1\n  App -.-> Replica2\n  Standby -.->|automatic failover<br/>on primary failure| Primary',
            },
            {
              type: 'table',
              headers: ['Mechanism', 'Solves', 'Replication', 'Serves traffic?'],
              rows: [
                ['Multi-AZ standby', 'High availability / automatic failover', 'Synchronous', 'No (standard Multi-AZ) — failover target only'],
                ['Read replica', 'Read throughput scaling', 'Asynchronous', 'Yes — read-only until/unless promoted'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Aurora\'s storage decoupling is the mechanism worth naming, not just the marketing name: because Aurora\'s distributed storage layer itself handles replication and much of crash recovery below the database engine, failover after a crash doesn\'t require replaying a long transaction log the way standard RDS does after a failover — this is the concrete reason Aurora failover is typically much faster.',
            },
            {
              type: 'heading',
              text: 'How Aurora storage actually works',
            },
            {
              type: 'p',
              text: 'Aurora splits the volume into 10 GB segments, each replicated six times across three AZs. A write is durable once **4 of 6** copies acknowledge it, and reads need **3 of 6** — so Aurora tolerates losing an entire AZ plus one more node without losing data, and losing an AZ without losing write availability. Crucially, the database engine ships only **redo log records** to storage, not full data pages; the storage nodes materialize pages themselves. That cuts network I/O dramatically and is why replicas (up to 15) share the same storage volume with typically low replication lag — they do not replay a separate copy of the data.',
            },
            {
              type: 'table',
              headers: ['Option', 'Writes', 'Failover', 'Good for'],
              rows: [
                ['RDS Single-AZ', 'One instance', 'Restore from backup (minutes to hours)', 'Dev/test only'],
                ['RDS Multi-AZ instance', 'One primary + sync standby (not readable)', 'Automatic, typically 60-120 s (DNS flip)', 'Classic production HA'],
                ['RDS Multi-AZ DB cluster', 'Writer + 2 readable standbys (semi-sync)', 'Automatic, typically under 35 s', 'HA plus some read scaling on MySQL/PostgreSQL'],
                ['Aurora (provisioned or Serverless v2)', 'One writer, up to 15 readers on shared storage', 'Automatic, usually around 30 s or less', 'High-throughput MySQL/PostgreSQL'],
                ['Aurora Global Database', 'One writer Region, read-only secondary Regions', 'Managed cross-Region switchover/failover', 'Low-RPO multi-Region DR, global reads'],
                ['Aurora DSQL', 'Active-active, multi-Region', 'No single writer to fail over', 'Globally distributed apps that accept DSQL\'s PostgreSQL subset'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Failover is a DNS change: the cluster endpoint starts pointing at the new primary. Applications that cache DNS forever (older JVM defaults), keep stale pooled connections, or hardcode instance endpoints keep writing to a dead or now-read-only node. Use the cluster endpoint, keep DNS TTLs low in the client, validate connections on borrow, and test failover regularly (`aws rds failover-db-cluster`). RDS Proxy or the AWS Advanced JDBC/Python wrappers shorten this window substantially.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Cost levers: **Aurora I/O-Optimized** removes per-I/O charges for I/O-heavy workloads (worth it when I/O is a large share of the bill); **Graviton** instance classes are cheaper per unit of performance; and **Database Savings Plans** (introduced December 2025) give a spend-based discount across RDS, Aurora, DynamoDB and other managed databases without locking you into one engine or instance family.',
            },
          ],
        },
        {
          id: 'dynamodb-deep-dive',
          title: 'DynamoDB: Partition Keys, Indexes & Scaling Model',
          summary:
            'DynamoDB is a fully managed, serverless key-value/document NoSQL database delivering single-digit-millisecond latency at any scale by automatically partitioning data — but only if the partition key is chosen well.',
          keyPoints: [
            'DynamoDB automatically splits a table into **partitions**, each handling a slice of the table\'s throughput and storage; a well-chosen **partition key** (high cardinality, evenly distributed access) is the single most important DynamoDB design decision.',
            'A **hot partition** — many requests concentrated on one partition key value (e.g., a single popular `user_id`, or a sequential/time-based key) — is DynamoDB\'s classic failure mode, throttling requests to that partition regardless of the table\'s overall provisioned capacity.',
            '**Global Secondary Index (GSI)**: an index with a different partition (and optional sort) key than the base table, letting you query by a non-primary-key attribute, at the cost of eventually-consistent reads and additional write capacity to keep it updated.',
            '**Local Secondary Index (LSI)**: shares the base table\'s partition key but a different sort key — must be created at table creation time, and supports strongly consistent reads (unlike a GSI).',
            '**Capacity modes**: on-demand (pay per request, no capacity planning; after the late-2024 price cut it is the recommended default for most tables) vs provisioned (set read/write capacity units with auto scaling, cheaper only for steady, well-understood load).',
            'Hard per-partition limits drive everything: roughly **3,000 RCU and 1,000 WCU per partition** and a **400 KB item size** limit. Adaptive capacity and split-for-heat help, but a single key value can never exceed one partition\'s throughput.',
            'Design starts from **access patterns**, not entities: list every query the app needs, then choose keys (often generic `PK`/`SK` attributes, sometimes a **single-table design**) so each pattern is a `GetItem` or a `Query` on one partition — never a `Scan`.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Table[DynamoDB Table] --> Hash{Partition key<br/>hashed}\n  Hash -->|hash range A| P1[(Partition 1)]\n  Hash -->|hash range B| P2[(Partition 2)]\n  Hash -->|hash range C| P3[(Partition 3)]\n  Bad[Bad key choice:<br/>few distinct values,<br/>or skewed access] -.->|all traffic funnels<br/>to one partition| Hot[⚠ Hot Partition<br/>throttled, even if table<br/>has capacity overall]\n  Good[Good key choice:<br/>high cardinality,<br/>even access] -->|traffic spreads<br/>evenly| P1\n  Good --> P2\n  Good --> P3',
            },
            {
              type: 'code',
              language: 'json',
              title: 'DynamoDB Streams triggering a Lambda on item changes',
              code: `{
  "TableName": "Orders",
  "StreamSpecification": {
    "StreamEnabled": true,
    "StreamViewType": "NEW_AND_OLD_IMAGES"
  }
}
// A DynamoDB Streams event source maps this table's change log
// to a Lambda function invoked for every insert/update/delete,
// commonly used for change-data-capture pipelines and denormalized
// read-model updates (a DynamoDB-native flavor of CQRS).`,
            },
            {
              type: 'table',
              headers: ['', 'GSI', 'LSI'],
              rows: [
                ['Partition key', 'Can differ from base table', 'Must match base table'],
                ['Sort key', 'Optional, independent', 'Required, different from base table'],
                ['Created', 'Any time', 'Only at table creation'],
                ['Read consistency', 'Eventually consistent only', 'Strongly or eventually consistent'],
                ['Capacity', 'Its own provisioned/on-demand capacity', 'Shares the base table\'s capacity'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Choosing a timestamp or a sequential ID as a partition key is a textbook hot-partition mistake — all "current" writes land on whichever partition owns the latest value. A common fix is a **write-sharding** suffix (e.g., append a random 0-9 digit to the key and fan out reads across all ten) when the natural key is inherently low-cardinality or time-ordered.',
            },
            {
              type: 'heading',
              text: 'Modeling by access pattern: a worked example',
            },
            {
              type: 'table',
              headers: ['Access pattern', 'Key design', 'Operation'],
              rows: [
                ['Get a customer profile', 'PK = `CUST#123`, SK = `PROFILE`', '`GetItem`'],
                ['List a customer\'s orders, newest first', 'PK = `CUST#123`, SK begins_with `ORDER#` (SK = `ORDER#2026-10-12T09:15:00Z#o-789`)', '`Query` with `ScanIndexForward=false`'],
                ['Get an order by ID', 'GSI1: PK = `ORDER#o-789`', '`Query` on GSI1'],
                ['Orders by status for an ops dashboard', 'GSI2: PK = `STATUS#SHIPPED#<shard 0-9>`, SK = date', 'Parallel `Query` on 10 shards'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'conditional write + transaction: idempotent order creation that decrements stock',
              code: `import boto3
from botocore.exceptions import ClientError

ddb = boto3.client("dynamodb")

def place_order(order_id: str, customer_id: str, sku: str, qty: int):
    try:
        ddb.transact_write_items(
            TransactItems=[
                {   # create the order only if it doesn't exist (idempotent retries)
                    "Put": {
                        "TableName": "App",
                        "Item": {
                            "PK": {"S": f"CUST#{customer_id}"},
                            "SK": {"S": f"ORDER#{order_id}"},
                            "sku": {"S": sku},
                            "qty": {"N": str(qty)},
                        },
                        "ConditionExpression": "attribute_not_exists(SK)",
                    }
                },
                {   # decrement stock only if enough remains (no overselling)
                    "Update": {
                        "TableName": "App",
                        "Key": {"PK": {"S": f"SKU#{sku}"}, "SK": {"S": "STOCK"}},
                        "UpdateExpression": "SET available = available - :q",
                        "ConditionExpression": "available >= :q",
                        "ExpressionAttributeValues": {":q": {"N": str(qty)}},
                    }
                },
            ],
            ClientRequestToken=order_id,  # makes the whole transaction idempotent
        )
    except ClientError as e:
        if e.response["Error"]["Code"] == "TransactionCanceledException":
            raise ValueError("duplicate order or insufficient stock") from e
        raise`,
            },
            {
              type: 'heading',
              text: 'Features a senior engineer should know',
            },
            {
              type: 'list',
              items: [
                '**Transactions** (`TransactWriteItems`, up to 100 items) give ACID across items and tables, at roughly twice the capacity cost of normal writes.',
                '**TTL** deletes expired items for free (asynchronously, so filter on expiry in reads); deletions appear in Streams, which makes TTL a handy trigger for "session expired" workflows.',
                '**Global tables** replicate a table across Regions with active-active writes (last-writer-wins by default); a **multi-Region strong consistency** mode is also available for workloads that need zero-RPO reads across Regions, at higher write latency.',
                '**Point-in-time recovery** (continuous backups, restore to any second in the retention window) should be on for every production table — it is cheap insurance against bad deploys.',
                '**Zero-ETL integrations** stream table data into OpenSearch or Redshift for search and analytics, instead of abusing `Scan` for reporting.',
                '**DAX** is an in-memory write-through cache for microsecond reads on hot items; it only helps eventually consistent reads.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'When **not** to use DynamoDB: highly relational domains with evolving, ad-hoc query needs; analytics over the whole dataset; and teams that cannot enumerate their access patterns up front. Adding a new query pattern later often means a new GSI and a backfill — or a data migration. Also note that `FilterExpression` is applied **after** items are read, so you still pay for everything the query touched.',
            },
          ],
        },
        {
          id: 'caching-elasticache',
          title: 'ElastiCache: Valkey, Redis OSS & Memcached',
          summary:
            'ElastiCache is AWS\'s managed in-memory data store. Since Redis changed its license in 2024, AWS has backed **Valkey** — the Linux Foundation fork of Redis — as the default engine, alongside Redis OSS and Memcached. The engine choice is rarely about raw speed and almost always about data structures, durability, and cost.',
          keyPoints: [
            '**Valkey** is API- and protocol-compatible with Redis OSS 7.2, so existing Redis clients and commands work unchanged; on ElastiCache it is priced lower than Redis OSS (and ElastiCache Serverless for Valkey has a lower minimum), making it the default for new clusters.',
            '**Valkey / Redis OSS** support rich data structures beyond simple key-value (sorted sets, hashes, lists, streams, pub/sub), optional persistence (snapshots), replication with automatic Multi-AZ failover, and cluster mode for horizontal sharding.',
            '**ElastiCache Serverless** removes node sizing: it scales memory and throughput automatically and bills per GB-hour stored and per request (ECPU) — good for spiky or unknown workloads; node-based clusters remain cheaper for steady, well-sized load.',
            '**MemoryDB** is the durable sibling: a Valkey/Redis-compatible database with a Multi-AZ transaction log, suitable as a primary datastore rather than a cache.',
            '**Memcached** is a simpler, purely in-memory, multi-threaded cache with no persistence and no replication — the fit for a pure, ephemeral cache where a cache-node restart losing everything is fully acceptable.',
            'Redis\'s **sorted sets** are the standard building block for a real-time leaderboard; its **pub/sub** supports lightweight real-time messaging; neither has an equivalent in Memcached.',
            'Both engines are used in the same architectural role as a cache-aside/read-through layer in front of a primary database (RDS/DynamoDB), covered in more depth as a general pattern in the System Design Patterns guide.',
            'Memcached is natively multi-threaded; Valkey/Redis execute commands on a main thread but offload network I/O to extra threads (and ElastiCache adds enhanced I/O multiplexing), so the old "Memcached uses more cores" argument has largely faded.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Valkey / Redis OSS', 'Memcached'],
              rows: [
                ['Data structures', 'Strings, hashes, lists, sets, sorted sets, streams, geospatial, bitmaps', 'Simple key-value only'],
                ['Persistence', 'Optional snapshots (ElastiCache); durable log in MemoryDB', 'None — purely in-memory'],
                ['Replication / HA', 'Replicas with automatic Multi-AZ failover', 'No native replication'],
                ['Scaling', 'Cluster mode shards keyspace across node groups; online resharding', 'Client-side consistent hashing across nodes'],
                ['Threading', 'Main command thread plus I/O threads', 'Multi-threaded'],
                ['Typical use', 'Leaderboards, session store, rate limiting, queues, pub/sub, general cache', 'Simple, pure caching layer'],
              ],
            },
            {
              type: 'heading',
              text: 'Caching strategies and their failure modes',
            },
            {
              type: 'table',
              headers: ['Strategy', 'How it works', 'Risk', 'Mitigation'],
              rows: [
                ['Cache-aside (lazy loading)', 'App reads cache, on miss reads DB and populates', 'Stale data; cold cache after restart', 'TTLs; delete-on-write'],
                ['Write-through', 'App writes DB and cache together', 'Caches data that is never read', 'TTLs; only write-through hot entities'],
                ['Write-behind', 'App writes cache; DB updated asynchronously', 'Data loss if cache fails before flush', 'Use only with a durable store (MemoryDB) or tolerant data'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'cache-aside with TTL jitter and a short lock to prevent stampedes',
              code: `import json, random
import valkey  # the valkey-py client; redis-py works the same way

cache = valkey.Valkey(host="my-cache.xxxxxx.use1.cache.amazonaws.com", port=6379, ssl=True)

def get_product(product_id: str) -> dict:
    key = f"product:{product_id}"
    if (hit := cache.get(key)) is not None:
        return json.loads(hit)

    # only one caller rebuilds a hot key; others briefly retry the cache
    if cache.set(f"lock:{key}", "1", nx=True, ex=10):
        try:
            product = load_product_from_db(product_id)
            ttl = 300 + random.randint(0, 60)  # jitter: avoid synchronized mass expiry
            cache.set(key, json.dumps(product), ex=ttl)
            return product
        finally:
            cache.delete(f"lock:{key}")
    return load_product_from_db(product_id)  # fallback; or sleep briefly and re-read cache`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'A **cache stampede** (thundering herd) happens when a hot key expires and thousands of requests miss at once, all hammering the database. Combine TTL jitter, request coalescing/locking, and stale-while-revalidate. Also size for the cold-cache case: if your database cannot survive the cache being empty, your cache is part of your availability story, not an optimization.',
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  App[Application] -->|1. check cache| Cache[(ElastiCache Redis)]\n  Cache -->|miss| App\n  App -->|2. on miss, read| DB[(RDS / DynamoDB)]\n  DB --> App\n  App -->|3. populate cache| Cache',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Choosing Valkey "by default" is reasonable for most new projects — its feature set is a strict superset of Memcached\'s for nearly every common use case, it is cheaper than Redis OSS on ElastiCache, and existing Redis clients work unchanged. Reach for Memcached only when the workload is a pure, ephemeral cache and its simplicity is genuinely valued. Always enable in-transit encryption and AUTH/RBAC — an unauthenticated cache inside a VPC is still a lateral-movement target.',
            },
          ],
        },
        {
          id: 'vpc-networking-fundamentals',
          title: 'VPC Fundamentals: Subnets, Route Tables & Gateways',
          summary:
            'A VPC (Virtual Private Cloud) is your own logically isolated network within AWS — subnets, route tables, and gateways together determine exactly which resources can reach the internet, and from which direction.',
          keyPoints: [
            'A **VPC** is a private IP address range (a CIDR block, e.g. `10.0.0.0/16`) you control, spanning one Region and divided into **subnets**, each pinned to a single Availability Zone.',
            'A **public subnet** has a route table entry sending `0.0.0.0/0` traffic to an **Internet Gateway (IGW)**; a **private subnet** has no such route, so nothing inside it is directly reachable from (or can directly reach) the internet.',
            'A **NAT Gateway**, placed in a public subnet, lets resources in a private subnet initiate **outbound** internet connections (patches, third-party API calls) while remaining completely unreachable from the internet inbound.',
            'The standard 3-tier pattern: only the load balancer sits in a public subnet; app servers and databases sit in private subnets with no direct inbound internet exposure, minimizing attack surface while still allowing legitimate outbound traffic via NAT.',
            'A **route table** is the actual mechanism that makes a subnet "public" or "private" — it is the routing rule (a route to an IGW), not a special subnet setting, that defines the distinction.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Internet((Internet)) <--> IGW[Internet Gateway]\n  subgraph VPC["VPC: 10.0.0.0/16"]\n    subgraph PublicSubnet["Public Subnet: 10.0.1.0/24"]\n      IGW\n      ALB[Application Load Balancer]\n      NAT[NAT Gateway]\n    end\n    subgraph PrivateSubnetApp["Private Subnet: 10.0.2.0/24 (app tier)"]\n      ASGInstances[EC2 instances<br/>in Auto Scaling Group]\n    end\n    subgraph PrivateSubnetDB["Private Subnet: 10.0.3.0/24 (data tier)"]\n      RDSPrimary[(RDS Multi-AZ)]\n    end\n  end\n  IGW --> ALB\n  ALB --> ASGInstances\n  ASGInstances -->|outbound only,<br/>e.g. package updates| NAT\n  NAT --> IGW\n  ASGInstances --> RDSPrimary',
            },
            {
              type: 'heading',
              text: 'Route table logic, made explicit',
            },
            {
              type: 'table',
              headers: ['Subnet', 'Route table entry for 0.0.0.0/0', 'Result'],
              rows: [
                ['Public', '→ Internet Gateway', 'Bidirectional internet access (with a public/Elastic IP)'],
                ['Private (with NAT)', '→ NAT Gateway (in a public subnet)', 'Outbound-only internet access; not reachable inbound'],
                ['Private (isolated)', 'No route to 0.0.0.0/0 at all', 'No internet access in either direction'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'building the public/private subnet split with the AWS CLI',
              code: `# a VPC, plus one public and one private subnet inside it
aws ec2 create-vpc --cidr-block 10.0.0.0/16
aws ec2 create-subnet --vpc-id vpc-0123456789abcdef0 --cidr-block 10.0.1.0/24  # public
aws ec2 create-subnet --vpc-id vpc-0123456789abcdef0 --cidr-block 10.0.2.0/24  # private

# an Internet Gateway, attached to the VPC, with a route from the public subnet
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-0123456789abcdef0 --internet-gateway-id igw-0123456789abcdef0
aws ec2 create-route --route-table-id rtb-public \\
  --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0123456789abcdef0

# a NAT Gateway (in the PUBLIC subnet) so the PRIVATE subnet gets outbound-only access
aws ec2 create-nat-gateway --subnet-id subnet-public --allocation-id eipalloc-0123456789abcdef0
aws ec2 create-route --route-table-id rtb-private \\
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-0123456789abcdef0`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A VPC Endpoint (Gateway type for S3/DynamoDB, Interface type via PrivateLink for most other services) lets a private subnet reach AWS services directly over AWS\'s private network, without needing a NAT Gateway or Internet Gateway at all — cheaper and more secure than routing that traffic out to the public internet and back.',
            },
            {
              type: 'heading',
              text: 'Design decisions that are hard to undo',
            },
            {
              type: 'list',
              items: [
                '**CIDR planning**: pick non-overlapping ranges across all VPCs, accounts and on-premises networks from day one (use **VPC IPAM** to allocate them). Overlapping CIDRs make peering, Transit Gateway and VPN connectivity painful or impossible later.',
                '**Size subnets generously**: EKS pods, Lambda in VPC, and interface endpoints all consume IPs; AWS reserves 5 addresses per subnet. A `/24` that looked huge can run dry under a busy Kubernetes cluster.',
                '**One NAT Gateway per AZ**: a single NAT Gateway is a cross-AZ single point of failure and adds cross-AZ data charges. Route each private subnet to the NAT Gateway in its own AZ.',
                '**Public IPv4 costs money**: every public IPv4 address is billed hourly (since February 2024). Prefer private subnets plus load balancers, and consider **IPv6** (dual-stack subnets with an egress-only internet gateway) for outbound-heavy fleets.',
                '**VPC Flow Logs** (to S3 or CloudWatch) are the network audit trail you will want during an incident — enable them before you need them.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'NAT Gateways charge per hour **and per GB processed**. A private-subnet workload pulling container images, S3 objects or DynamoDB data through NAT can generate a surprisingly large bill. Add the free S3 and DynamoDB **gateway endpoints** to every VPC, and interface endpoints for high-volume services like ECR, CloudWatch Logs and STS.',
            },
          ],
        },
        {
          id: 'security-groups-vs-nacls',
          title: 'Security Groups vs Network ACLs',
          summary:
            'Two firewall layers that sound interchangeable but behave completely differently — stateful vs stateless, instance-level vs subnet-level — and mixing them up is one of the most common sources of "why can\'t this connect" confusion.',
          keyPoints: [
            '**Security Groups** operate at the **instance/ENI level**, are **stateful** (return traffic is automatically allowed, regardless of outbound rules), and support **only Allow rules** (no explicit Deny) — the default-deny-everything-else model handles the rest.',
            '**Network ACLs (NACLs)** operate at the **subnet level**, are **stateless** (inbound and outbound rules must both be configured explicitly — allowing inbound traffic does not automatically allow the response back out), and support both **Allow and Deny** rules, evaluated in numbered order.',
            'Security Groups apply to every instance they\'re attached to, regardless of subnet; NACLs apply to every resource in the subnet, regardless of which security groups those resources use — they compose, both are checked.',
            'The most common practical use of a NACL beyond the default (allow-all) is an explicit **Deny** rule — e.g., blocking a specific malicious IP range at the subnet level — something a Security Group cannot do at all.',
            'Most architectures leave NACLs at their default (allow all in/out) and do all fine-grained access control with Security Groups, reaching for a NACL Deny rule only for a specific, broad subnet-wide block.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Security Group', 'Network ACL'],
              rows: [
                ['Scope', 'Instance / ENI level', 'Subnet level'],
                ['State', 'Stateful — return traffic auto-allowed', 'Stateless — must allow both directions explicitly'],
                ['Rule types', 'Allow only', 'Allow and Deny'],
                ['Rule evaluation', 'All rules evaluated, most permissive wins', 'Numbered rules evaluated in order, first match wins'],
                ['Default', 'Deny all inbound, allow all outbound', 'Allow all inbound and outbound'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Internet((Internet)) --> NACL{NACL<br/>subnet-level,<br/>stateless,<br/>Allow + Deny}\n  NACL --> SG{Security Group<br/>instance-level,<br/>stateful,<br/>Allow only}\n  SG --> Instance[EC2 Instance]\n  Instance -.->|response traffic:<br/>auto-allowed by SG state,<br/>must be explicitly allowed by NACL| NACL',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Because NACLs are stateless, a common mistake is allowing inbound traffic on a port (e.g. 443) but forgetting the corresponding outbound rule for ephemeral response ports (typically 1024-65535) — the connection appears to hang because the *response* is silently dropped by the NACL, even though the security group and the request itself were fine.',
            },
          ],
        },
        {
          id: 'networking-at-scale-transit-gateway-privatelink',
          title: 'Networking at Scale: Peering, Transit Gateway, PrivateLink, VPC Lattice & Hybrid',
          summary:
            'Once you have dozens of VPCs across many accounts plus an on-premises data center, point-to-point connections stop scaling. This topic covers the hub-and-spoke and service-oriented building blocks AWS provides and when each is the right tool.',
          keyPoints: [
            '**VPC peering** is a one-to-one, non-transitive private connection — simple and with no hourly charge, but a full mesh of N VPCs needs N(N-1)/2 peerings and every route table must be updated.',
            '**Transit Gateway (TGW)** is a regional cloud router: VPCs, VPNs and Direct Connect attach once to the hub; route tables on the TGW control segmentation (e.g. prod cannot reach dev). It charges per attachment-hour and per GB processed.',
            '**PrivateLink** exposes a single service (behind an NLB, or an AWS service via interface endpoints) into consumer VPCs as private ENIs — no routing between networks, overlapping CIDRs allowed, consumers reach only that service.',
            '**VPC Lattice** is application-layer service networking: service discovery, path-based routing, and IAM auth policies between services across VPCs and accounts, without managing load balancers or meshes per service.',
            '**Hybrid connectivity**: **Site-to-Site VPN** (IPsec over the internet, quick to set up, throughput limited per tunnel) vs **Direct Connect** (dedicated private circuit, consistent latency and high bandwidth, weeks to provision). Production often uses Direct Connect with VPN as backup.',
            '**Centralized egress and inspection**: route internet-bound traffic from all spokes through an inspection VPC with **AWS Network Firewall** or a Gateway Load Balancer appliance — and **Route 53 Resolver** endpoints and rules for hybrid DNS.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  OnPrem["On-premises data center"] -->|"Direct Connect<br/>(VPN backup)"| TGW["Transit Gateway<br/>(regional hub)"]\n  TGW --> Prod["Prod VPCs"]\n  TGW --> Dev["Dev VPCs"]\n  TGW --> Shared["Shared services VPC<br/>(DNS, CI, tooling)"]\n  TGW --> Insp["Inspection / egress VPC<br/>Network Firewall + NAT"]\n  Insp --> Internet((Internet))\n  SaaS["Provider VPC: payments service<br/>behind NLB"] -.->|"PrivateLink endpoint<br/>(service only, no routing)"| Prod',
            },
            {
              type: 'table',
              headers: ['Need', 'Best fit', 'Why'],
              rows: [
                ['Connect 2-3 VPCs simply', 'VPC peering', 'No hourly cost, lowest latency, simple'],
                ['Connect many VPCs + on-prem with segmentation', 'Transit Gateway', 'Hub-and-spoke, transitive routing, central route control'],
                ['Expose one service to many VPCs/customers', 'PrivateLink', 'Service-level access, overlapping CIDRs OK, strong isolation'],
                ['Service-to-service across accounts with auth', 'VPC Lattice', 'L7 routing + IAM auth without per-service LBs'],
                ['Private access to AWS APIs', 'Gateway/interface VPC endpoints', 'Avoid NAT and the public internet'],
                ['Dedicated, predictable bandwidth to on-prem', 'Direct Connect', 'Consistent latency, lower egress rates'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Transit Gateway makes connectivity easy, which makes it easy to connect everything to everything. Without separate TGW route tables per environment, a compromised dev workload can reach production databases over the hub. Segment by default and allow specific flows deliberately; then enforce with security groups as a second layer.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Data processing charges compound: traffic from a spoke through TGW, then through an inspection firewall, then through NAT pays several per-GB fees. For high-volume flows to AWS services, VPC endpoints in each spoke (or shared centrally via Route 53 private hosted zones) are often far cheaper than central egress.',
            },
          ],
        },
        {
          id: 'route53-cloudfront-cdn',
          title: 'Route 53 & CloudFront: DNS and Content Delivery',
          summary:
            'Route 53 answers "where do I send this request" at the DNS level with routing policies beyond simple lookup; CloudFront answers "how do I get this content close to the user fast" by caching at edge locations worldwide.',
          keyPoints: [
            'Route 53 is AWS\'s DNS service, with routing policies beyond a plain A record: **latency-based** (route to the Region with lowest latency for the requester), **geolocation** (route by requester\'s location), **weighted** (split traffic by percentage — canary releases, blue-green cutover), and **failover** (route to a backup endpoint if the primary\'s health check fails).',
            'CloudFront is AWS\'s CDN — it caches content at edge locations close to users, integrating natively with S3 (static assets/media) and with ALB/API Gateway (accelerating and DDoS-absorbing dynamic content at the edge, not just static files).',
            'A CloudFront distribution in front of an ALB still benefits dynamic, non-cacheable APIs: AWS\'s optimized global network backbone between edge and origin is typically faster than the raw public internet path a client would otherwise take.',
            'Route 53 health checks feed failover routing and can also gate Auto Scaling / notify via CloudWatch alarms — the same health-check mechanism used for load balancer target health, applied at the DNS layer instead.',
            'CloudFront + WAF (Web Application Firewall) at the edge is a standard pattern for absorbing Layer 7 attacks (SQL injection, XSS, rate-based abuse) before traffic ever reaches your origin infrastructure.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  User((User)) --> R53[Route 53]\n  R53 -->|latency-based:<br/>nearest Region| CF[CloudFront<br/>Edge Location]\n  CF -->|cache hit| User\n  CF -->|cache miss,<br/>fetch from origin| S3Origin[(S3: static assets)]\n  CF -->|cache miss,<br/>dynamic content| ALBOrigin[ALB: dynamic API]\n  R53 -.->|health check fails on<br/>primary Region| Failover[Route to<br/>secondary Region]',
            },
            {
              type: 'table',
              headers: ['Route 53 policy', 'Behavior'],
              rows: [
                ['Simple', 'One record, no logic — a plain DNS answer'],
                ['Weighted', 'Split traffic by percentage across multiple targets — canary/blue-green rollouts'],
                ['Latency-based', 'Route to the Region with the lowest latency for that requester'],
                ['Geolocation', 'Route based on the requester\'s geographic location (compliance, localized content)'],
                ['Failover', 'Route to a primary; switch to a secondary automatically if the primary\'s health check fails'],
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'a weighted Route 53 record set: 5% canary traffic to v2',
              code: `{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.example.com",
        "Type": "A",
        "SetIdentifier": "v1-stable",
        "Weight": 95,
        "TTL": 60,
        "ResourceRecords": [{ "Value": "203.0.113.10" }]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.example.com",
        "Type": "A",
        "SetIdentifier": "v2-canary",
        "Weight": 5,
        "TTL": 60,
        "ResourceRecords": [{ "Value": "203.0.113.20" }]
      }
    }
  ]
}
// applied with: aws route53 change-resource-record-sets --hosted-zone-id Z123... --change-batch file://this.json
// raise "v2-canary"'s Weight gradually as CloudWatch metrics confirm it's healthy`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A **weighted** routing policy is the standard way to implement a canary release at the DNS layer: send 5% of traffic to a new version\'s endpoint, watch CloudWatch metrics/error rates, and ramp the weight up gradually — no application-level feature-flagging required.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'DNS-based traffic shifting is only as fast as resolver caching allows: clients and intermediate resolvers may ignore low TTLs, and long-lived connections never re-resolve. Use **alias records** (free queries, auto-tracking of ALB/CloudFront IPs) and keep TTLs short on records you may need to move, but for fine-grained canaries prefer weighted target groups on the ALB or CodeDeploy traffic shifting, which act per request.',
            },
            {
              type: 'heading',
              text: 'CloudFront mechanics that decide your hit ratio',
            },
            {
              type: 'list',
              items: [
                '**Cache key** = what makes two requests "the same object". Every header, cookie or query string you add to the cache key (via a **cache policy**) fragments the cache. Forward extra values to the origin with an **origin request policy** instead, without keying on them.',
                '**Origin Shield** adds a regional caching layer in front of the origin, collapsing duplicate misses from many edge locations — valuable for expensive origins or live video.',
                '**Versioned asset names** (`app.3f9c2a.js`) with long TTLs beat invalidations: invalidations are eventually propagated, are rate-limited and cost money beyond a free monthly allowance.',
                '**Edge compute**: **CloudFront Functions** (lightweight JavaScript, sub-millisecond, for header rewrites, redirects, simple auth) vs **Lambda@Edge** (Node.js/Python, network access, longer runtime, for origin selection or heavier logic). Start with Functions.',
                '**Security at the edge**: OAC for private S3 origins, a custom header or VPC origins to keep ALBs from being hit directly, AWS WAF managed rules plus rate-based rules, and Shield Standard included by default.',
              ],
            },
            {
              type: 'code',
              language: 'js',
              title: 'CloudFront Function: normalize requests to improve cache hit ratio',
              code: `// viewer-request event, cloudfront-js-2.0 runtime
function handler(event) {
  var request = event.request;

  // SPA routing: /orders/42 -> /index.html (static assets keep their path)
  if (!request.uri.includes('.')) {
    request.uri = '/index.html';
  }

  // drop tracking params so ?utm_source=x doesn't create a new cache entry
  var qs = request.querystring;
  Object.keys(qs).forEach(function (k) {
    if (k.indexOf('utm_') === 0) delete qs[k];
  });

  return request;
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For multi-Region failover that must work even when a Region\'s control plane is degraded, use **Route 53 Application Recovery Controller** routing controls or health checks on data-plane endpoints. Route 53\'s DNS answering (data plane) is designed for very high availability, while making record changes (control plane) depends on us-east-1 — so pre-configure failover rather than planning to edit records during an outage.',
            },
          ],
        },
        {
          id: 'messaging-event-driven-services',
          title: 'Messaging & Event-Driven Services: SQS, SNS, EventBridge, Kinesis & Step Functions',
          summary:
            'AWS\'s messaging services map directly onto the event-driven architecture patterns any distributed system needs — decoupling producers from consumers, fanning out one event to many subscribers, and orchestrating multi-step workflows.',
          keyPoints: [
            '**SQS**: a managed message queue. **Standard** queues give at-least-once delivery with best-effort ordering and near-unlimited throughput; **FIFO** queues give exactly-once processing and strict ordering, at capped throughput — use FIFO only when order/dedup genuinely matters.',
            '**SNS**: pub/sub — one published message fans out to many subscribers (SQS queues, Lambda, HTTP endpoints, email/SMS). The classic pattern is **SNS fan-out to multiple SQS queues**, giving each independent downstream consumer its own durable, independently-scalable copy of every event.',
            '**EventBridge**: an event bus with content-based routing rules (route by event attributes, not just topic) and native integrations across 100+ AWS services and SaaS partners — the modern default for building event-driven architectures on AWS.',
            '**Streaming**: **Kinesis Data Streams** for ordered (per shard/partition key), replayable streams with on-demand or provisioned capacity; **Amazon Data Firehose** (formerly Kinesis Data Firehose) for loading streams into S3, Redshift, OpenSearch or Iceberg tables with minimal code; **Amazon Managed Service for Apache Flink** (formerly Kinesis Data Analytics) for stateful stream processing; and **Amazon MSK** when you want Kafka APIs and ecosystem.',
            '**Step Functions**: a managed state machine for orchestrating multi-step workflows across Lambda/services with built-in retries, error handling, and parallel branches — the AWS-native implementation of the orchestration-style Saga pattern for distributed transactions.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Producer[Order Service] -->|publish OrderPlaced| SNS[SNS Topic]\n  SNS -->|fan out| SQS1[SQS: Notification Queue]\n  SNS -->|fan out| SQS2[SQS: Analytics Queue]\n  SNS -->|fan out| SQS3[SQS: Fulfillment Queue]\n  SQS1 --> LambdaNotify[Lambda: send email]\n  SQS2 --> LambdaAnalytics[Lambda: update dashboard]\n  SQS3 --> LambdaFulfill[Lambda: start fulfillment]',
            },
            {
              type: 'heading',
              text: 'Step Functions orchestrating a multi-step Saga',
            },
            {
              type: 'mermaid',
              code: 'stateDiagram-v2\n  [*] --> ReserveInventory\n  ReserveInventory --> ChargePayment : success\n  ReserveInventory --> Failed : error\n  ChargePayment --> ShipOrder : success\n  ChargePayment --> CompensateInventory : error\n  CompensateInventory --> Failed\n  ShipOrder --> [*] : success\n  Failed --> [*]',
            },
            {
              type: 'table',
              headers: ['Service', 'Model', 'Best fit'],
              rows: [
                ['SQS', 'Queue (pull-based, one consumer per message)', 'Decoupling a producer from worker(s) doing the same job, load leveling'],
                ['SNS', 'Pub/sub (push-based fan-out)', 'One event, many independent downstream consumers'],
                ['EventBridge', 'Event bus with content-based routing rules', 'Complex routing logic, SaaS integrations, schema registry'],
                ['Kinesis Data Streams', 'Ordered, replayable stream, consumer-managed position', 'Custom real-time stream processing, multiple independent readers replaying history'],
                ['Step Functions', 'Explicit state machine / workflow', 'Multi-step orchestration with retries, branching, compensations'],
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'the Saga above as a Step Functions state machine (Amazon States Language)',
              code: `{
  "StartAt": "ReserveInventory",
  "States": {
    "ReserveInventory": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:reserveInventory",
      "Retry": [{ "ErrorEquals": ["States.TaskFailed"], "MaxAttempts": 2 }],
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "Failed" }],
      "Next": "ChargePayment"
    },
    "ChargePayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:chargePayment",
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "CompensateInventory" }],
      "Next": "ShipOrder"
    },
    "CompensateInventory": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:releaseInventory",
      "Next": "Failed"
    },
    "ShipOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:shipOrder",
      "End": true
    },
    "Failed": { "Type": "Fail" }
  }
}`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'SQS and Kinesis are often confused: SQS is a **queue** — once a standard consumer processes and deletes a message, it is gone. Kinesis is a **stream** — data stays for a retention window (default 24 hours, configurable up to a year), and multiple independent consumer applications can each read the full stream from their own tracked position, including replaying from earlier in the stream.',
            },
            {
              type: 'heading',
              text: 'SQS mechanics you must understand',
            },
            {
              type: 'list',
              items: [
                '**Visibility timeout**: a received message is hidden, not deleted. If the consumer does not delete it before the timeout, it reappears and is processed again. Set the timeout comfortably above your worst-case processing time, or extend it with `ChangeMessageVisibility` heartbeats.',
                '**Redrive to a DLQ** after `maxReceiveCount` attempts isolates poison messages; alarm on DLQ depth, and use DLQ redrive to replay after fixing the bug.',
                '**Long polling** (`WaitTimeSeconds` up to 20) cuts empty receives and cost.',
                '**At-least-once means duplicates**: every consumer must be **idempotent** — store a processed-message key (e.g. a DynamoDB conditional put) or make the side effect naturally idempotent.',
                '**FIFO** ordering is per **message group ID**; choose group IDs (e.g. per customer) so you get ordering where it matters and parallelism everywhere else. High-throughput FIFO mode raises the limits substantially.',
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'EventBridge rule: content-based routing of only high-value EU orders',
              code: `{
  "source": ["com.acme.orders"],
  "detail-type": ["OrderPlaced"],
  "detail": {
    "region": ["eu-west-1", "eu-central-1"],
    "total": [{ "numeric": [">=", 1000] }],
    "customer": { "tier": [{ "anything-but": "internal" }] }
  }
}`,
            },
            {
              type: 'list',
              items: [
                '**EventBridge Pipes** connect a source (SQS, Kinesis, DynamoDB Streams, MSK) to a target with optional filtering and enrichment — replacing glue Lambdas that only move data.',
                '**EventBridge Scheduler** runs millions of one-time or recurring schedules (cron, rate, at a specific time) with retries and DLQs — the modern replacement for scheduled rules and for DIY "cron table in a database" designs.',
                '**Archive and replay** on an event bus lets you re-drive past events into a fixed consumer — invaluable after a bug.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The **dual-write problem**: writing to your database and then publishing an event are two separate operations; if the process crashes between them, the system becomes inconsistent. Use the **transactional outbox** pattern (write the event to an outbox table in the same transaction, then relay it) or derive events from the database\'s change stream (DynamoDB Streams, Aurora/RDS CDC via DMS or zero-ETL) instead of publishing from application code.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Step Functions has two workflow types: **Standard** (exactly-once step execution, up to a year long, priced per state transition, full execution history) and **Express** (at-least-once, up to 5 minutes, priced by duration, for high-volume event processing). Use direct **SDK service integrations** (call DynamoDB, SQS, Bedrock and 200+ services directly from a state) instead of wrapping every call in a Lambda.',
            },
          ],
        },
        {
          id: 'well-architected-framework',
          title: 'The AWS Well-Architected Framework',
          summary:
            'A structured set of six pillars for evaluating any AWS architecture — a favorite interview framing device, and a genuinely useful checklist for "how would you architect this" answers that otherwise ramble.',
          keyPoints: [
            '**Operational Excellence** — run and monitor systems to deliver business value, and continuously improve supporting processes (infrastructure as code, small frequent deployments, learning from operational failures).',
            '**Security** — protect data, systems, and assets through risk assessments and mitigation strategies (least privilege, defense in depth, encryption everywhere it matters, traceability via CloudTrail).',
            '**Reliability** — a system\'s ability to recover from infrastructure/service failures and dynamically acquire resources to meet demand (multi-AZ, auto-scaling, tested backups, graceful degradation).',
            '**Performance Efficiency** — use computing resources efficiently and maintain that efficiency as demand and technology evolve (right-sizing, choosing the right database/compute type for the access pattern, not just the popular one).',
            '**Cost Optimization** — avoid unnecessary spend and understand where money goes (right-sizing, Reserved/Spot pricing, storage tiering, eliminating idle resources).',
            '**Sustainability** — minimize environmental impact (the newest, sixth pillar — favoring managed/shared services and efficient resource utilization over always-on over-provisioned infrastructure).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  WAF[AWS Well-Architected<br/>Framework] --> P1[Operational<br/>Excellence]\n  WAF --> P2[Security]\n  WAF --> P3[Reliability]\n  WAF --> P4[Performance<br/>Efficiency]\n  WAF --> P5[Cost<br/>Optimization]\n  WAF --> P6[Sustainability]',
            },
            {
              type: 'p',
              text: 'The Framework is less about memorizing pillar names and more about having a **structure** to reach for when a question is broad ("how would you improve this architecture?", "what would you review before this goes to production?"). Walking through even three or four pillars explicitly — "for reliability I\'d check multi-AZ coverage and backup testing; for cost I\'d check for idle Reserved capacity vs actual usage; for security I\'d review the IAM policies for least privilege" — reads as far more senior than a single ad-hoc list of concerns.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'AWS also publishes **Well-Architected Lenses** — pillar-style guidance specialized for a domain (Serverless, Machine Learning, SaaS, Data Analytics) — worth a one-line mention if the system under discussion clearly fits one of them.',
            },
          ],
        },
        {
          id: 'high-availability-disaster-recovery',
          title: 'High Availability & Disaster Recovery Strategies',
          summary:
            'Multi-AZ protects against a data-center-level failure; multi-Region disaster recovery protects against a much rarer Region-wide event — and the DR strategy chosen (pilot light, warm standby, or active-active) is fundamentally a tradeoff between recovery speed and ongoing cost.',
          keyPoints: [
            'Two related but distinct goals: **RTO (Recovery Time Objective)** — how long can we be down before recovering — and **RPO (Recovery Point Objective)** — how much data can we afford to lose, measured in time since the last durable copy.',
            '**Backup & Restore**: the cheapest, slowest DR strategy — regular backups, restored on demand in a DR Region; hours-to-days RTO, minutes-to-hours RPO depending on backup frequency.',
            '**Pilot Light**: only the most critical core infrastructure (typically a replicated database) runs continuously in the DR Region; the rest of the stack is defined as infrastructure-as-code but not running — spin it up on failover. Tens-of-minutes RTO, low ongoing cost.',
            '**Warm Standby**: a smaller-scale but fully functional copy of the entire stack runs continuously in the DR Region — failover is mostly a traffic-routing change. Single-digit-minutes RTO, meaningfully higher ongoing cost (paying for always-on, if downsized, duplicate infrastructure).',
            '**Active-Active (Multi-Region)**: both Regions serve production traffic simultaneously, with data replicated bidirectionally — near-zero RTO, at the highest cost and the highest architectural complexity (conflict resolution for concurrent writes in two Regions).',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  BR[Backup & Restore<br/>RTO: hours-days<br/>Cost: $] --> PL[Pilot Light<br/>RTO: tens of minutes<br/>Cost: $$]\n  PL --> WS[Warm Standby<br/>RTO: single-digit minutes<br/>Cost: $$$]\n  WS --> AA[Active-Active<br/>RTO: near-zero<br/>Cost: $$$$]',
            },
            {
              type: 'table',
              headers: ['Strategy', 'What runs in DR Region', 'RTO', 'Relative cost'],
              rows: [
                ['Backup & Restore', 'Nothing — just stored backups', 'Hours to days', 'Lowest'],
                ['Pilot Light', 'Core data store only (e.g. a replicated DB)', 'Tens of minutes', 'Low'],
                ['Warm Standby', 'Full stack, at reduced scale', 'Single-digit minutes', 'Higher'],
                ['Active-Active', 'Full stack, at full scale, serving live traffic', 'Near-zero', 'Highest'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'RPO is largely a function of **replication frequency**, independent of which of these four strategies you pick — all four typically pair with continuous database replication to keep RPO low. The real differentiator between them is RTO and ongoing cost, which is the crux of nearly every "pilot light vs warm standby" interview question.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Within a single Region, Multi-AZ deployment already covers the much more common failure mode (one data center, not the whole Region, going down) — reach for a full multi-Region DR strategy only once Multi-AZ\'s protection genuinely isn\'t enough for the business\'s actual availability requirements, given the real cost and complexity jump.',
            },
            {
              type: 'heading',
              text: 'Making DR real: tooling and the part everyone skips',
            },
            {
              type: 'list',
              items: [
                '**AWS Elastic Disaster Recovery (DRS)** continuously replicates servers (including on-premises) into a low-cost staging area, giving a pilot-light style RPO of seconds and RTO of minutes without running duplicate fleets.',
                '**Data replication by service**: S3 Cross-Region Replication, DynamoDB global tables, Aurora Global Database, RDS cross-Region read replicas, EBS/AWS Backup cross-Region copies, and multi-Region KMS keys so replicated ciphertext is readable.',
                '**Failover control**: Route 53 health checks and **Application Recovery Controller** routing controls give a reliable, data-plane-driven failover switch; avoid depending on editing resources in the failing Region during the event.',
                '**Backup is not DR, and untested backup is not backup**: schedule restore tests and measure real RTO. Use AWS Backup vault lock and cross-account copies so ransomware or a compromised admin cannot delete recovery points.',
                '**Regional dependencies hide**: global-looking designs often depend on one Region for IAM sign-in, a CI/CD pipeline, a container registry, secrets, or a single DNS zone. Map them; your DR Region must be able to deploy and start without the primary.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Active-active across Regions means conflict resolution is now your problem: DynamoDB global tables default to last-writer-wins, so concurrent updates to the same item in two Regions silently drop one. Design writes to be commutative (counters, append-only events) or route each customer to a single "home" Region and use the second as failover.',
            },
          ],
        },
        {
          id: 'infrastructure-as-code',
          title: 'Infrastructure as Code: CloudFormation, CDK & Terraform',
          summary:
            'Defining infrastructure in versioned, reviewable code instead of clicking through a console turns infrastructure changes into the same disciplined process as application code changes — with the same benefits: review, repeatability, and rollback.',
          keyPoints: [
            '**CloudFormation** is AWS\'s native IaC service — you declare desired-state infrastructure in a JSON/YAML template, and CloudFormation figures out the create/update/delete operations needed to reach that state, tracking everything as a **stack**.',
            '**AWS CDK (Cloud Development Kit)** lets you define that same infrastructure using a real programming language (TypeScript, Python, Java) instead of raw YAML/JSON, then synthesizes it down to a CloudFormation template — useful for reusing loops/conditionals/abstractions that templating YAML makes awkward.',
            '**Terraform** (HashiCorp) is a popular third-party, multi-cloud alternative to CloudFormation, using its own declarative language (HCL) and its own state file to track what it manages — the standard choice when a team needs a single IaC tool spanning AWS and other providers.',
            '**Drift** occurs when the actual infrastructure diverges from what the IaC template says it should be (a manual console change bypassing the tool) — a genuine operational risk, since the next IaC deployment may revert or conflict with the manual change unexpectedly.',
            'A CloudFormation/Terraform apply is meant to be **idempotent**: running the same template against infrastructure already in the desired state should be a no-op, not a re-creation — the same idempotency principle that makes safe retries possible elsewhere in distributed systems.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'json',
              title: 'a minimal CloudFormation template (an S3 bucket)',
              code: `{
  "AWSTemplateFormatVersion": "2010-09-09",
  "Resources": {
    "UploadsBucket": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "BucketName": "my-app-uploads-prod",
        "VersioningConfiguration": { "Status": "Enabled" }
      }
    }
  },
  "Outputs": {
    "BucketArn": {
      "Value": { "Fn::GetAtt": ["UploadsBucket", "Arn"] }
    }
  }
}`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Template[IaC Template<br/>YAML/JSON/HCL/TypeScript] -->|apply / deploy| Engine{CloudFormation<br/>or Terraform}\n  Engine -->|diff desired vs actual| State[(Tracked State:<br/>CloudFormation Stack<br/>or Terraform State File)]\n  Engine -->|create/update/delete<br/>only what changed| Resources[Real AWS Resources]\n  Resources -.->|manual console change:<br/>DRIFT| State',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A manual change made directly in the AWS console to a resource managed by CloudFormation/Terraform causes **drift** — the tracked state no longer matches reality. The next deployment can silently revert the manual change (surprising whoever made it) or, worse, fail outright. Treat IaC-managed resources as read-only in the console once adopted; make changes through the template.',
            },
            {
              type: 'heading',
              text: 'CDK in practice, and how to deploy IaC safely',
            },
            {
              type: 'code',
              language: 'ts',
              title: 'CDK (TypeScript): a versioned, encrypted, private bucket with a lifecycle rule',
              code: `import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class StorageStack extends Stack {
  public readonly uploads: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.uploads = new s3.Bucket(this, 'Uploads', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.RETAIN,   // never delete data because a stack was deleted
      lifecycleRules: [
        { abortIncompleteMultipartUploadAfter: Duration.days(7) },
        { noncurrentVersionExpiration: Duration.days(90) },
      ],
    });
  }
}
// cdk synth    -> generates the CloudFormation template
// cdk diff     -> shows exactly what would change (review this in the pull request)
// cdk deploy   -> creates a change set and applies it`,
            },
            {
              type: 'list',
              items: [
                '**Review the plan, not just the code**: \`cdk diff\`, CloudFormation change sets and \`terraform plan\` show replacements and deletions. A property change that forces **replacement** of a database is invisible in a code diff but obvious in a plan.',
                '**Protect stateful resources**: \`DeletionPolicy: Retain\`/\`RemovalPolicy.RETAIN\`, termination protection, and stack policies for databases, buckets and KMS keys.',
                '**Small, layered stacks**: separate stateful (network, data) from stateless (compute, apps) stacks so frequent deploys cannot endanger data, and to stay below CloudFormation\'s per-stack resource limit.',
                '**Pipelines, not laptops**: deploy via CI with OIDC-assumed roles (see the identity topic); use CDK Pipelines or CodePipeline/GitHub Actions with a manual approval before production.',
                '**Terraform state** needs a remote backend with locking (S3 with native lockfile support, or DynamoDB locking in older setups), encryption and tight access — state files often contain secrets. OpenTofu is a compatible open-source fork some teams prefer for licensing reasons.',
                '**Detect drift** on a schedule (CloudFormation drift detection, \`terraform plan\` in CI) and guard with AWS Config rules and SCPs so console changes to critical resources are prevented, not just detected.',
              ],
            },
          ],
        },
        {
          id: 'cost-optimization-strategies',
          title: 'Cost Optimization Strategies',
          summary:
            'A frequently tested, frequently skipped interview topic — real AWS bills are dominated by a small number of specific, well-known levers, and naming them concretely (not just "use the cloud efficiently") is what separates a strong answer.',
          keyPoints: [
            '**Right-sizing** is the single most common real-world cost-saving action — most workloads are over-provisioned relative to actual utilization; CloudWatch metrics and AWS Compute Optimizer surface this directly with concrete recommendations.',
            '**Reserved Instances / Savings Plans** for steady, predictable baseline load (up to ~72% off On-Demand); **Spot Instances** for fault-tolerant, interruptible workloads (up to ~90% off) — see the EC2 Fundamentals topic for the full breakdown.',
            '**S3 storage class selection and lifecycle policies** automatically transition aging objects to cheaper tiers (e.g., move to Glacier after 90 days of no access) instead of paying Standard-tier pricing indefinitely for data nobody reads.',
            '**Data transfer costs** are a frequently-missed driver — cross-AZ and cross-Region transfer is not free, and a chatty multi-AZ microservices architecture can accumulate meaningful transfer costs that a same-AZ-affinity design (accepting some availability tradeoff) would avoid.',
            'Serverless/managed services (Lambda, Fargate, DynamoDB on-demand, Aurora Serverless) shift cost from "always paying for provisioned capacity" to "paying per actual use" — a real lever for spiky or low-traffic workloads, though it can cross over to being *more* expensive than provisioned capacity at sustained high, steady volume.',
          ],
          blocks: [
            {
              type: 'list',
              items: [
                '**Right-size compute**: use CloudWatch/Compute Optimizer data, not guesswork, to match instance size to actual CPU/memory utilization.',
                '**Commit where load is predictable**: Reserved Instances or Savings Plans for baseline capacity you\'re confident about.',
                '**Use Spot for interruptible work**: batch jobs, CI runners, horizontally-scaled stateless fleets that can tolerate a 2-minute termination warning.',
                '**Tier storage by access pattern**: S3 lifecycle policies, EBS gp3 over over-provisioned io2 where IOPS demands don\'t require it.',
                '**Watch data transfer**: minimize unnecessary cross-AZ/cross-Region chatter; use VPC endpoints instead of routing AWS-service traffic out to the public internet and back.',
                '**Eliminate idle resources**: unattached EBS volumes, unused Elastic IPs, forgotten dev/test environments left running — a routine audit target.',
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Bill[AWS Bill<br/>too high?] --> Q1{Predictable<br/>steady load?}\n  Q1 -->|Yes| RI[Reserved Instances /<br/>Savings Plans]\n  Q1 -->|No, spiky/unpredictable| Q2{Fault-tolerant,<br/>interruptible?}\n  Q2 -->|Yes| Spot[Spot Instances]\n  Q2 -->|No| OnDemand[On-Demand, but right-sized]\n  Bill --> Q3{Storage aging,<br/>rarely accessed?}\n  Q3 -->|Yes| Lifecycle[S3 lifecycle policies<br/>to cheaper tiers]\n  Bill --> Q4{Cross-AZ/Region<br/>chatty traffic?}\n  Q4 -->|Yes| Endpoints[VPC endpoints,<br/>same-AZ affinity]',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A cost question in an interview is really testing whether you think about **total cost of ownership**, not just sticker price — naming a specific lever ("we\'d right-size using Compute Optimizer data, and move batch processing to Spot") lands far better than a generic "we\'d monitor costs."',
            },
            {
              type: 'heading',
              text: 'FinOps: making cost visible and owned',
            },
            {
              type: 'list',
              items: [
                '**Tag and allocate**: enforce cost-allocation tags (team, service, environment) with tag policies and SCPs, then activate them in Billing. Untagged spend is unowned spend.',
                '**Budgets and anomaly detection**: AWS Budgets alerts at forecast thresholds and **Cost Anomaly Detection** catch a runaway resource within a day instead of at month-end invoice time.',
                '**Cost Explorer, CUR / Data Exports and Cost Optimization Hub** for analysis and consolidated recommendations (right-sizing, idle resources, commitment purchases).',
                '**Commitments, current options**: Compute Savings Plans cover EC2, Fargate and Lambda; EC2 Instance Savings Plans give deeper discounts for one family; **Database Savings Plans** (December 2025) cover managed databases with up to roughly 35% off for serverless and about 20% for provisioned usage. Cover the steady baseline (often 60-80% of usage), not the peak.',
                '**Graviton** (Arm) instances, **gp3 over gp2**, and **S3 Intelligent-Tiering** are among the lowest-effort savings available.',
                '**Unit economics**: track cost per order or per active user, not just the total. Rising spend with rising revenue can be healthy; rising cost per unit is the real alarm.',
              ],
            },
            {
              type: 'table',
              headers: ['Common hidden cost', 'Why it surprises', 'Fix'],
              rows: [
                ['NAT Gateway data processing', 'Billed per GB for all private-subnet egress, including to AWS services', 'Gateway/interface VPC endpoints'],
                ['Cross-AZ and cross-Region transfer', 'Invisible in diagrams; chatty services multiply it', 'AZ-aware routing, batch calls, replicate less'],
                ['CloudWatch Logs ingestion', 'Verbose debug logs billed per GB, retained forever by default', 'Retention policies, sampling, log classes'],
                ['Public IPv4 addresses', 'Hourly charge per address, attached or not', 'Private subnets, load balancers, IPv6'],
                ['Idle load balancers and NAT Gateways', 'Hourly charges even with zero traffic', 'Tear down dev environments on a schedule'],
                ['Provisioned IOPS and over-sized volumes', 'Paid whether used or not', 'gp3, right-size with Compute Optimizer'],
              ],
            },
          ],
        },
        {
          id: 'security-encryption-kms-secrets',
          title: 'Encryption & Secrets: KMS, Secrets Manager & Parameter Store',
          summary:
            'AWS\'s encryption-at-rest story across nearly every service runs through KMS and a two-layer key design called envelope encryption, while credential management splits between two purpose-built, frequently-confused services.',
          keyPoints: [
            '**KMS (Key Management Service)** manages encryption keys; most AWS at-rest encryption (S3, EBS, RDS) uses it under the hood via **envelope encryption** — a locally-generated data key encrypts the actual data, and KMS\'s master key only encrypts/decrypts that small data key.',
            'Envelope encryption avoids sending large volumes of data to KMS for every operation (KMS master keys never leave AWS\'s HSMs and aren\'t designed for bulk throughput) and keeps expensive/rate-limited KMS API calls to one per data key, not one per byte of data.',
            '**AWS-managed keys** (simplest, AWS controls rotation, no extra cost for most use) vs **customer-managed keys** (you control rotation schedule, key policy, and access — needed for stricter compliance and cross-account key sharing scenarios).',
            '**Secrets Manager** offers automatic rotation (e.g., rotating a database password on a schedule via a built-in Lambda rotation function) and is purpose-built for credentials; **Parameter Store (SSM)** is cheaper and simpler for general config values and non-rotating secrets.',
            'Encryption in transit (TLS everywhere — ALB/CloudFront termination, VPC traffic) is a separate concern from encryption at rest (KMS-backed) — a complete answer to "how is data protected" names both.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Data[Application data] -->|encrypted by| DataKey[Locally-generated<br/>Data Key]\n  DataKey -->|encrypted by| MasterKey[KMS Master Key<br/>never leaves AWS HSMs]\n  DataKey -.->|used to encrypt/decrypt<br/>actual data, no per-byte<br/>KMS call needed| Data\n  MasterKey -.->|one API call<br/>per data key, not<br/>per byte| KMSService[KMS Service]',
            },
            {
              type: 'table',
              headers: ['', 'Secrets Manager', 'Parameter Store (SSM)'],
              rows: [
                ['Automatic rotation', 'Yes, built-in (e.g. RDS password rotation)', 'No — manual/custom only'],
                ['Cost', 'Per secret, per API call', 'Free tier for Standard parameters'],
                ['Best fit', 'Database credentials, API keys needing rotation', 'General config values, feature flags, non-rotating secrets'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'KMS envelope encryption and Secrets Manager, from the CLI',
              code: `# ask KMS to generate a data key: a PLAINTEXT copy to use locally, and an
# ENCRYPTED copy (safe to store) that only KMS can decrypt back
aws kms generate-data-key \\
  --key-id alias/my-app-key \\
  --key-spec AES_256
# -> { "Plaintext": "<base64, use then discard>", "CiphertextBlob": "<base64, store this>" }

# store a rotating database credential in Secrets Manager
aws secretsmanager create-secret \\
  --name prod/orders-db/password \\
  --secret-string '{"username":"admin","password":"<generated>"}'

# an application fetches it at runtime -- never hardcoded, never in source control
aws secretsmanager get-secret-value --secret-id prod/orders-db/password \\
  --query SecretString --output text`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: '"Why not just use one service for everything" is a common follow-up — the honest answer is cost and purpose-fit: Secrets Manager\'s automatic rotation is genuinely valuable for credentials but is overkill (and more expensive) for a hundred simple config values that never rotate, which is exactly Parameter Store\'s niche.',
            },
            {
              type: 'heading',
              text: 'Key policies, grants and rotation: where KMS surprises people',
            },
            {
              type: 'list',
              items: [
                '**The key policy is the root of trust**: unlike most IAM resources, a KMS key is unusable unless its key policy allows it (directly, or by delegating to IAM via the account root principal). "AccessDenied despite an IAM Allow" on KMS is usually a missing key-policy statement.',
                '**Cross-account use** needs both the key policy (trust the other account) and an IAM policy in that account. Encrypted-snapshot sharing and cross-account S3 replication fail without a customer-managed key shared this way.',
                '**Grants** give AWS services temporary, scoped permission to use a key on your behalf (how EBS attaches an encrypted volume) and can be revoked.',
                '**Rotation**: customer-managed symmetric keys can rotate automatically (default every 365 days, configurable); rotation changes backing key material but keeps the key ID and ARN, and old material remains to decrypt old data. Asymmetric and imported keys do not auto-rotate.',
                '**Multi-Region keys** share key material across Regions so ciphertext can be decrypted in the DR Region without re-encryption — essential for DynamoDB global tables, Aurora Global and S3 replication with SSE-KMS.',
                '**Throttling**: KMS has per-key request quotas; high-volume SSE-KMS on S3 should use S3 Bucket Keys, and applications should cache data keys (the AWS Encryption SDK does this).',
                '**Deletion is a 7-30 day scheduled wait**; disabling a key first is the safe way to find out what still depends on it. Deleting a key makes all data encrypted under it permanently unrecoverable.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Secrets Manager and Parameter Store values read at deploy time still end up in plain text in CloudFormation templates, task definitions, or CI logs if you pass them as literal parameters. Pass the **reference** (ARN or dynamic reference) and let the runtime fetch the value, and cache it in the application with a TTL so each request does not call the API.',
            },
          ],
        },
        {
          id: 'observability-cloudwatch-cloudtrail-xray',
          title: 'Observability: CloudWatch, CloudTrail & X-Ray',
          summary:
            'Three AWS observability services answer three different questions — what is happening operationally (CloudWatch), who did what (CloudTrail), and how did one request flow across many services (X-Ray) — and conflating them is a common mistake.',
          keyPoints: [
            '**CloudWatch** is the baseline observability service: metrics (CPU, request count, custom application metrics), logs (via CloudWatch Logs), and alarms that can trigger Auto Scaling actions or SNS notifications.',
            '**CloudWatch Logs Insights** lets you query log data with a purpose-built query language, without exporting logs to a separate analytics system for common investigations.',
            '**CloudTrail** is an audit log of every API call made in the account — who did what, when, from where — a compliance and security-forensics fundamental, distinct from CloudWatch\'s operational metrics/logs.',
            '**X-Ray** provides distributed tracing across microservices/Lambda functions — the AWS-native trace store and service map that answers "how do you trace one request across 10 services." Important change: the **X-Ray SDKs and Daemon entered maintenance mode on 25 February 2026 (end of support 25 February 2027)**; instrument new code with **OpenTelemetry** (AWS Distro for OpenTelemetry or the CloudWatch OTel endpoint), and X-Ray/CloudWatch Application Signals remain the place the traces are viewed.',
            '**CloudWatch Application Signals** layers service-level objectives (SLOs), golden-signal dashboards and dependency maps on top of OpenTelemetry data; **Container Insights**, **Lambda Insights** and **Contributor Insights** cover the common specialized views.',
            'A complete observability answer names all three: CloudWatch for "is the system healthy right now," CloudTrail for "who changed this configuration," and X-Ray for "why was this specific request slow."',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Question1[Is the system healthy?<br/>What is CPU/error rate?] --> CW[CloudWatch<br/>metrics, logs, alarms]\n  Question2[Who made this API call<br/>or changed this config?] --> CT[CloudTrail<br/>audit log of every API call]\n  Question3[Why was this one<br/>request slow, across services?] --> XR[X-Ray<br/>distributed tracing]\n  CW --> Action1[Auto Scaling trigger,<br/>SNS alert]\n  CT --> Action2[Security investigation,<br/>compliance audit]\n  XR --> Action3[Pinpoint the slow<br/>service in a request chain]',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant Client\n  participant APIGW as API Gateway\n  participant Lambda1 as Lambda: Order Service\n  participant Lambda2 as Lambda: Inventory Service\n  participant DDB as DynamoDB\n  Client->>APIGW: request (X-Ray trace started)\n  APIGW->>Lambda1: invoke (trace segment)\n  Lambda1->>Lambda2: invoke (subsegment)\n  Lambda2->>DDB: query (subsegment)\n  DDB-->>Lambda2: result\n  Lambda2-->>Lambda1: result\n  Lambda1-->>APIGW: response\n  APIGW-->>Client: response\n  Note over Client,DDB: X-Ray assembles all segments into<br/>one trace, showing latency per hop',
            },
            {
              type: 'code',
              language: 'text',
              title: 'a CloudWatch Logs Insights query: p95 latency by endpoint, last 24h',
              code: `fields @timestamp, @message
| filter @message like /duration_ms/
| stats pct(duration_ms, 95) as p95_duration by endpoint
| sort p95_duration desc
| limit 10`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'CloudTrail logs are themselves a security-sensitive asset — a common attacker move after gaining access is to disable or tamper with logging to cover tracks. Storing CloudTrail logs in a separate, restricted-access S3 bucket (ideally in a different account) with log file integrity validation enabled is a standard hardening step worth naming.',
            },
            {
              type: 'heading',
              text: 'Instrumenting with OpenTelemetry, and alerting that humans can live with',
            },
            {
              type: 'code',
              language: 'yaml',
              title: 'OpenTelemetry Collector config: receive OTLP, export traces to X-Ray and metrics to CloudWatch',
              code: `receivers:
  otlp:
    protocols:
      grpc: { endpoint: 0.0.0.0:4317 }
      http: { endpoint: 0.0.0.0:4318 }

processors:
  batch: {}
  memory_limiter:
    check_interval: 1s
    limit_percentage: 75

exporters:
  awsxray: {}
  awsemf:
    region: us-east-1
    namespace: Orders/App

service:
  pipelines:
    traces:  { receivers: [otlp], processors: [memory_limiter, batch], exporters: [awsxray] }
    metrics: { receivers: [otlp], processors: [memory_limiter, batch], exporters: [awsemf] }`,
            },
            {
              type: 'list',
              items: [
                '**Alert on symptoms, not causes**: page on user-visible SLO burn (error rate, p99 latency), and keep CPU/disk alarms as non-paging tickets.',
                '**Composite alarms** combine several alarms (e.g. high errors AND elevated latency) to cut noise; **anomaly detection** alarms learn seasonality for traffic-shaped metrics.',
                '**Log cost control**: CloudWatch Logs is billed on ingestion, so set retention on every log group (the default is never expire), use the Infrequent Access log class for rarely queried logs, and sample debug logging.',
                '**High-cardinality metrics** (a custom metric dimension per user ID) explode cost; put such detail in logs (Embedded Metric Format) and query with Logs Insights.',
                '**Security detection** is a separate toolchain: **GuardDuty** (threat detection from CloudTrail, VPC flow, DNS and runtime signals), **Security Hub** (aggregated findings and posture checks), **AWS Config** (resource configuration history and compliance rules), **Inspector** (vulnerability scanning), **Macie** (sensitive data in S3).',
              ],
            },
          ],
        },
        {
          id: 'multi-account-organizations',
          title: 'AWS Organizations & Multi-Account Strategy',
          summary:
            'As an org grows past a single team, a single AWS account becomes a liability — Organizations lets multiple accounts be managed centrally with consolidated billing and account-wide guardrails, the standard structure for any non-trivial company on AWS.',
          keyPoints: [
            '**AWS Organizations** groups multiple AWS accounts under one management structure, with **consolidated billing** (one bill, and often better volume-pricing tiers across all accounts combined) and centralized policy management.',
            '**Service Control Policies (SCPs)** set the maximum available permissions for every account/user/role under an Organizational Unit — even an account administrator with a full-access IAM policy cannot exceed what an SCP allows, making SCPs the right tool for hard organization-wide guardrails.',
            'A common multi-account pattern: separate accounts per environment (dev/staging/prod) and/or per team/business unit, isolating blast radius — a misconfiguration or compromised credential in one account cannot directly reach resources in another.',
            '**AWS Control Tower** automates setting up a multi-account "landing zone" with recommended guardrails, account structure, and centralized logging out of the box, instead of assembling Organizations + SCPs + CloudTrail manually from scratch.',
            'Cross-account access uses IAM roles (an account grants another account\'s principal permission to assume a specific role) rather than sharing credentials — the same "role over long-lived keys" principle from IAM Fundamentals, applied across account boundaries.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Mgmt[Management Account<br/>consolidated billing] --> OU1[OU: Production]\n  Mgmt --> OU2[OU: Non-Production]\n  Mgmt --> OU3[OU: Security/Audit]\n  OU1 --> ProdApp[Account: prod-app]\n  OU1 --> ProdData[Account: prod-data]\n  OU2 --> Dev[Account: dev]\n  OU2 --> Staging[Account: staging]\n  OU3 --> LogArchive[Account: log-archive<br/>centralized CloudTrail]\n  SCP[Service Control Policy:<br/>Deny leaving certain Regions,<br/>Deny disabling CloudTrail] -.->|applies to| OU1\n  SCP -.-> OU2',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a Service Control Policy: deny leaving approved Regions, deny disabling CloudTrail',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyOutsideApprovedRegions",
      "Effect": "Deny",
      "NotAction": ["iam:*", "organizations:*", "route53:*", "support:*"],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": { "aws:RequestedRegion": ["us-east-1", "eu-west-1"] }
      }
    },
    {
      "Sid": "DenyDisablingCloudTrail",
      "Effect": "Deny",
      "Action": ["cloudtrail:StopLogging", "cloudtrail:DeleteTrail"],
      "Resource": "*"
    }
  ]
}
// attached at an OU: no account (or its admin) underneath can exceed this,
// even with a full-access IAM policy of their own`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'The reason SCPs matter beyond "just write good IAM policies": IAM policies are set per-account and can, in principle, be loosened by anyone with sufficient permissions in that account. An SCP applied at the Organization/OU level is a **ceiling** no IAM policy in that account can exceed — the right tool for guardrails that must hold even against a mistake or malicious action inside an individual account.',
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'Isolating environments (dev/staging/prod) into separate accounts, not just separate VPCs in one account, is the stronger isolation boundary — an IAM misconfiguration or an overly broad wildcard resource policy in a dev account cannot accidentally touch production resources at all, since they simply don\'t exist in that account.',
            },
            {
              type: 'heading',
              text: 'Guardrails that scale: SCPs, RCPs and the data perimeter',
            },
            {
              type: 'p',
              text: 'SCPs restrict what *principals in your accounts* can do. **Resource Control Policies (RCPs)** are their counterpart: they restrict what can be done *to resources in your accounts*, regardless of who is calling and whatever the resource policy says. Together they build a **data perimeter** — only trusted identities, accessing from expected networks, touching only your resources. Since September 2025, SCPs also support the full IAM policy language (conditions, `NotResource`, wildcards in the middle of actions), making narrower guardrails practical.',
            },
            {
              type: 'code',
              language: 'json',
              title: 'RCP: S3 objects in our accounts are only reachable by principals from our Organization',
              code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceOrgIdentities",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": "*",
      "Condition": {
        "StringNotEqualsIfExists": { "aws:PrincipalOrgID": "o-exampleorgid" },
        "BoolIfExists": { "aws:PrincipalIsAWSService": "false" }
      }
    }
  ]
}`,
            },
            {
              type: 'list',
              items: [
                '**Management account hygiene**: keep workloads out of it. Only billing, Organizations and a few org-level services should live there, because SCPs do not apply to the management account.',
                '**Delegated administrators** let a security or tooling account run GuardDuty, Security Hub, IAM Access Analyzer, Config and Backup org-wide without using the management account.',
                '**Account factory + IaC**: create accounts from a pipeline (Control Tower Account Factory, or Account Factory for Terraform) with baseline VPC, logging, roles and budgets — accounts should be cheap, boring, and disposable.',
                '**Centralized logging**: org-wide CloudTrail and Config aggregation into a log-archive account that workload account admins cannot modify.',
                '**Test SCPs carefully**: an overly broad deny can lock out your own pipelines. Attach to a sandbox OU first, use the IAM policy simulator and CloudTrail to see what would break, and keep a break-glass role exempted by condition.',
              ],
            },
          ],
        },
        {
          id: 'security-detection-and-incident-response',
          title: 'Detection & Incident Response: GuardDuty, Security Hub, Config & Access Analyzer',
          summary:
            'Prevention (IAM, SCPs, encryption) will eventually miss something. Mature AWS security adds layered detection and a rehearsed response so that a leaked key or an exposed bucket is found in minutes, scoped quickly, and contained without improvising.',
          keyPoints: [
            '**GuardDuty** analyzes CloudTrail, VPC flow logs, DNS logs and optional runtime/S3/EKS/RDS signals for threats (credential exfiltration, crypto-mining, unusual API calls). Enable it in every Region and account via the Organization.',
            '**Security Hub** aggregates findings from GuardDuty, Inspector, Macie, Config and partners, normalizes them, and scores posture against standards such as the AWS Foundational Security Best Practices.',
            '**AWS Config** records resource configuration history and evaluates **rules** (e.g. "no security group allows 0.0.0.0/0 on port 22") with optional auto-remediation through Systems Manager Automation.',
            '**IAM Access Analyzer** reports external access to buckets, roles, KMS keys and more, finds unused access, and validates policies before deployment.',
            '**Inspector** continuously scans EC2, container images in ECR and Lambda for known vulnerabilities; **Macie** finds sensitive data in S3.',
            'Response relies on **preparation**: pre-created forensic roles, immutable logs in a separate account, runbooks, and automation (EventBridge → Step Functions/Lambda) to isolate a resource while preserving evidence.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  GD["GuardDuty<br/>finding"] --> SH["Security Hub<br/>(aggregation)"]\n  Cfg["Config rule<br/>non-compliant"] --> SH\n  AA["Access Analyzer<br/>external access"] --> SH\n  SH --> EB["EventBridge rule"]\n  EB --> SF["Step Functions<br/>runbook"]\n  SF --> Iso["Isolate: swap security group,<br/>snapshot disks, disable keys"]\n  SF --> Notify["Page on-call +<br/>open ticket"]',
            },
            {
              type: 'heading',
              text: 'Runbook: a leaked access key',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                '**Contain**: make the key inactive (do not delete yet — you need its ID for forensics) and attach an explicit deny-all policy or revoke active sessions for the role.',
                '**Scope**: query CloudTrail (Athena or CloudTrail Lake) for everything that key did across *all* Regions, including IAM changes, new access keys, new roles, and launched instances.',
                '**Eradicate**: remove attacker-created identities and resources, rotate any secrets the principal could read, and check for persistence (new trust policies, Lambda functions, EventBridge rules).',
                '**Recover**: restore from known-good state through IaC, then re-enable access with short-lived credentials.',
                '**Learn**: fix the root cause (why was a long-lived key possible?), add a detection, and update the runbook.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'first-response commands during a suspected key compromise',
              code: `# 1. neutralize the key without deleting evidence
aws iam update-access-key --user-name build-bot \\
  --access-key-id AKIAEXAMPLEKEYID123 --status Inactive

# 2. see what the key did in the last day (CloudTrail event history covers 90 days of management events)
aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=AccessKeyId,AttributeValue=AKIAEXAMPLEKEYID123 \\
  --start-time "$(date -u -d '1 day ago' +%Y-%m-%dT%H:%M:%SZ)" \\
  --query "Events[].[EventTime,EventName,EventSource]" --output table

# 3. quarantine a compromised EC2 instance: swap to an empty security group, keep it running for forensics
aws ec2 modify-instance-attribute --instance-id i-0123456789abcdef0 \\
  --groups sg-0quarantine00000000`,
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Revoking an IAM **role\'s** sessions does not delete the role; attackers who can modify trust policies or create new roles may retain access. Always diff IAM state against your IaC baseline. Also note that CloudTrail **data events** (S3 object reads, Lambda invokes) are not on by default — if you never enabled them, you cannot reconstruct who read which object.',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Run game days: inject a harmless fake finding (GuardDuty can generate sample findings) and time how long it takes your team to notice, contain and communicate. The first rehearsal always finds missing permissions and unclear ownership.',
            },
          ],
        },
        {
          id: 'aws-ai-ml-services',
          title: 'AWS AI/ML Services: Bedrock, SageMaker & the Amazon Q Family',
          summary:
            'AWS\'s generative-AI stack splits into two very different products — Bedrock for calling someone else\'s foundation model via a managed API, and SageMaker for training/hosting your own — plus a long-standing set of narrow, purpose-built AI services still worth knowing.',
          keyPoints: [
            '**Amazon Bedrock**: serverless API access to multiple foundation model providers (Anthropic Claude, Meta Llama, Amazon Nova/Titan, Mistral, Cohere, Stability AI) through one unified API, with no GPU infrastructure to manage — the default starting point for most new generative-AI features.',
            'Bedrock sub-features worth naming individually: **Knowledge Bases** (a fully managed RAG pipeline — chunking, embedding, vector storage, and retrieval, assembled for you), **Agents** (managed agentic orchestration — the model plans and calls tools/APIs/Lambda functions autonomously), and **Guardrails** (configurable content filtering, PII redaction, denied-topic enforcement applied consistently across any model).',
            '**Amazon SageMaker**: the full ML lifecycle platform for training, fine-tuning, and hosting *your own* custom models — notebooks, managed distributed training jobs, SageMaker Pipelines for ML CI/CD, and auto-scaling real-time or batch inference endpoints.',
            '**The assistant family keeps evolving**: **Amazon Q Developer** (coding assistant, code transformation/upgrades) and the workforce-assistant products have been reorganized — QuickSight was rebranded as **Amazon Quick** (an agentic BI/workspace product), and Q Business stopped accepting new customers in mid-2026 with Quick as the successor path. Check the current product page before recommending one; product names in this area change faster than the underlying patterns.',
            '**Bedrock AgentCore** provides the runtime pieces for production agents — a serverless agent runtime, memory, identity, a tool gateway and observability — so you can host agents built with any framework (including open-source ones) instead of hand-building session isolation and auth.',
            'The older, narrow "AI services" generation (**Rekognition** for image/video analysis, **Transcribe** for speech-to-text, **Polly** for text-to-speech, **Textract** for structured document extraction, **Comprehend** for NLP/sentiment/PII detection) remains the right choice for well-defined, narrow tasks where a general-purpose LLM call would be slower, costlier, or less accurate than a specialized model.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  App[Application] --> Bedrock[Amazon Bedrock]\n  Bedrock --> KB[Bedrock Knowledge Bases<br/>managed RAG pipeline]\n  KB --> VectorStore[(OpenSearch Vector Engine<br/>or Bedrock-managed store)]\n  KB --> S3Docs[(S3: source documents)]\n  Bedrock --> Guardrails[Bedrock Guardrails<br/>content filtering, PII redaction]\n  Bedrock --> FM{Foundation Model<br/>Claude / Llama / Nova}\n  Bedrock --> Agents[Bedrock Agents]\n  Agents --> Lambda[Lambda: tool execution]\n  Agents --> APIs[External APIs / internal services]\n  FM --> Response[Response to user]',
            },
            {
              type: 'table',
              headers: ['', 'Bedrock', 'SageMaker'],
              rows: [
                ['Model source', 'Call an existing foundation model via API', 'Train / fine-tune / host your own model'],
                ['Infrastructure', 'Fully serverless, none to manage', 'You configure training/inference infrastructure'],
                ['Best fit', 'Building a feature on a capable existing LLM quickly', 'Proprietary architecture, fine-grained control, custom fine-tuning at scale'],
                ['Typical starting point', 'Most new generative-AI product features', 'Only once Bedrock genuinely can\'t satisfy a specific requirement'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A well-calibrated answer to "which AI service would you use" names the narrow-vs-general-purpose tradeoff explicitly: reach for a purpose-built service (Rekognition, Textract) when the task is narrow and well-solved by an existing mature model, and reach for a foundation model via Bedrock when the task needs flexible reasoning, open-ended generation, or combining multiple pieces of context in ways a narrow model can\'t.',
            },
            {
              type: 'heading',
              text: 'Calling a model: the Converse API and production concerns',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Bedrock Converse API with a system prompt and basic error handling',
              code: `import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

# adaptive retries absorb throttling (ThrottlingException) from account/model quotas
client = boto3.client(
    "bedrock-runtime",
    region_name="us-east-1",
    config=Config(retries={"max_attempts": 8, "mode": "adaptive"}, read_timeout=120),
)

def ask(question: str) -> str:
    try:
        resp = client.converse(
            # use an inference profile ID (cross-Region) for capacity; check the console
            # for the model/profile IDs currently available in your Region
            modelId="us.anthropic.claude-sonnet-5-5-v1:0",
            system=[{"text": "You answer concisely and cite the document you used."}],
            messages=[{"role": "user", "content": [{"text": question}]}],
            inferenceConfig={"maxTokens": 512, "temperature": 0.2},
        )
    except ClientError as e:
        raise RuntimeError(f"Bedrock call failed: {e.response['Error']['Code']}") from e
    return resp["output"]["message"]["content"][0]["text"]`,
            },
            {
              type: 'list',
              items: [
                '**One API, many models**: Converse (and ConverseStream) normalizes request/response shapes across providers, so swapping a model is mostly a model ID change. Model IDs and versions change often — treat them as configuration, not constants, and have an evaluation set to validate a swap.',
                '**Capacity and quotas**: on-demand throughput is limited per model per Region (requests and tokens per minute). **Cross-Region inference profiles** pool capacity across Regions; **Provisioned Throughput** reserves model units for steady high volume; **batch inference** runs large offline jobs at a discount.',
                '**Cost levers**: prompt caching for repeated long prefixes, smaller models for simple steps, routing between models, and limiting output tokens. Token cost, not hosting, dominates a Bedrock bill.',
                '**RAG vs fine-tuning**: use retrieval for knowledge that changes or must be cited; fine-tune/distill for style, format or latency/cost reduction on a stable task. Vector storage options include OpenSearch, Aurora pgvector, and S3 Vectors for large, cost-sensitive collections.',
                '**Governance**: Guardrails for content/PII policy, IAM conditions restricting which model IDs a role may invoke, VPC endpoints (PrivateLink) so prompts never traverse the internet, and model invocation logging for audit. Bedrock does not use your prompts to train the underlying provider models.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Agents with tool access turn prompt injection into an authorization problem: a malicious document retrieved by RAG can instruct the model to call tools. Give each agent a narrowly scoped IAM role, require human approval for destructive actions, validate tool arguments server-side, and never put secrets in prompts.',
            },
          ],
        },
        {
          id: 'data-lake-analytics-athena-glue-redshift',
          title: 'Data & Analytics on AWS: S3 Data Lake, Athena, Glue & Redshift',
          summary:
            'Analytics on AWS is built around S3 as the durable, cheap storage layer with decoupled compute engines on top. Knowing which engine fits which query pattern, and how to lay data out so queries are fast and cheap, is the heart of a modern lakehouse.',
          keyPoints: [
            '**S3 + open table formats**: store data as columnar **Parquet** (or Apache **Iceberg** tables, which add ACID transactions, schema evolution and time travel) so many engines can read the same data without copies.',
            '**Glue Data Catalog** is the shared metastore (databases, tables, partitions) used by Athena, EMR, Redshift Spectrum and others; **Glue ETL** (Spark) and crawlers populate and transform; **Lake Formation** adds fine-grained, centrally managed permissions on top.',
            '**Athena** runs serverless SQL directly on S3, billed per data scanned — so columnar formats, compression and partitioning cut cost and latency by 10-100x.',
            '**Redshift** is the managed MPP data warehouse (provisioned or Serverless) for high-concurrency BI and complex joins; it can also query lake data via Spectrum and ingest from Aurora/DynamoDB through zero-ETL integrations.',
            '**EMR** (managed Spark/Hive/Trino/Flink) fits large custom processing; **OpenSearch** fits full-text search and log analytics; **Kinesis/MSK + Flink** fits real-time pipelines.',
            'Rule of thumb: OLTP databases serve the application; analytics queries run elsewhere (replica, warehouse or lake) so a heavy report cannot take production down.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Src1["App DBs<br/>(Aurora, DynamoDB)"] -->|"zero-ETL / CDC"| Raw[("S3 raw zone")]\n  Src2["Events<br/>(Kinesis / MSK)"] -->|"Firehose"| Raw\n  Raw -->|"Glue ETL / Spark"| Curated[("S3 curated zone<br/>Parquet / Iceberg")]\n  Curated --> Cat["Glue Data Catalog<br/>+ Lake Formation"]\n  Cat --> Ath["Athena<br/>ad-hoc SQL"]\n  Cat --> RS["Redshift<br/>BI warehouse"]\n  Cat --> EMR["EMR / Spark<br/>ML features"]\n  RS --> Quick["Dashboards<br/>(Amazon Quick)"]',
            },
            {
              type: 'code',
              language: 'sql',
              title: 'Athena: convert raw JSON to partitioned, compressed Parquet with one CTAS statement',
              code: `CREATE TABLE analytics.orders_curated
WITH (
  format = 'PARQUET',
  parquet_compression = 'ZSTD',
  partitioned_by = ARRAY['order_date'],
  external_location = 's3://acme-lake/curated/orders/'
) AS
SELECT order_id, customer_id, total_cents, status, CAST(created_at AS date) AS order_date
FROM analytics.orders_raw
WHERE created_at >= DATE '2026-01-01';

-- partition pruning: scans only one day of Parquet, reading only the 2 columns it needs
SELECT status, SUM(total_cents) / 100.0 AS revenue
FROM analytics.orders_curated
WHERE order_date = DATE '2026-10-12'
GROUP BY status;`,
            },
            {
              type: 'table',
              headers: ['Need', 'Best fit', 'Why not the alternative'],
              rows: [
                ['Occasional ad-hoc SQL over S3', 'Athena', 'Redshift cluster would sit idle between queries'],
                ['Hundreds of concurrent BI users, complex joins', 'Redshift (Serverless or provisioned)', 'Athena per-query latency and concurrency are less predictable'],
                ['Heavy custom Spark / ML feature pipelines', 'EMR or Glue Spark', 'SQL engines are awkward for arbitrary code'],
                ['Full-text search, log analytics', 'OpenSearch', 'Columnar SQL engines are not built for relevance search'],
                ['Real-time aggregation on streams', 'Managed Service for Apache Flink', 'Batch engines add minutes of latency'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The small-files problem: streaming ingestion that writes thousands of tiny objects makes every query slow and expensive (per-object overhead dominates). Compact into 128 MB-1 GB Parquet files — Firehose buffering, Iceberg compaction (automatic in S3 Tables) or scheduled Glue jobs. Also avoid over-partitioning: partitions with a few KB each hurt more than they help.',
            },
          ],
        },
        {
          id: 'case-study-three-tier-web-app',
          title: 'Case Study: A Highly Available Three-Tier Web App on AWS',
          summary:
            'Tying the whole guide together end to end — a concrete, defensible architecture for "design a highly available web application on AWS," the single most common AWS system-design prompt.',
          keyPoints: [
            'Three tiers, three trust levels: **presentation** (public, behind CloudFront + WAF), **application** (private subnets, only reachable from the load balancer), **data** (private subnets, only reachable from the app tier).',
            'High availability comes from spreading every tier across at least two Availability Zones, with Auto Scaling replacing unhealthy app-tier instances and RDS Multi-AZ handling database failover automatically.',
            'Defense in depth stacks multiple independent layers: WAF (Layer 7 filtering) → security groups (stateful, instance-level) → NACLs (stateless, subnet-level) → IAM (least-privilege access to every AWS API call) — no single layer\'s failure exposes the whole system.',
            'Caching (CloudFront at the edge, ElastiCache in front of the database) exists at multiple layers so a hit at any layer short-circuits everything behind it, directly reducing both latency and database load.',
            'Observability (CloudWatch, CloudTrail, X-Ray) and cost controls (right-sized instances, Reserved capacity for the steady baseline, S3 lifecycle policies) are part of the design from day one, not an afterthought bolted on later.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  User((User)) --> R53[Route 53]\n  R53 --> CF[CloudFront + WAF]\n  CF -->|static assets| S3Static[(S3: static assets)]\n  CF -->|dynamic requests| ALB[Application Load Balancer<br/>public subnets, multi-AZ]\n  subgraph VPC["VPC"]\n    subgraph Public["Public Subnets (2+ AZs)"]\n      ALB\n      NAT[NAT Gateway]\n    end\n    subgraph AppTier["Private Subnets: App Tier (2+ AZs)"]\n      ASG[Auto Scaling Group<br/>EC2 or Fargate tasks]\n    end\n    subgraph DataTier["Private Subnets: Data Tier (2+ AZs)"]\n      RDSPrimary[(RDS Primary)]\n      RDSStandby[(Multi-AZ Standby)]\n      Cache[(ElastiCache Redis)]\n    end\n  end\n  ALB --> ASG\n  ASG --> Cache\n  ASG --> RDSPrimary\n  RDSPrimary -.->|sync replication| RDSStandby\n  ASG -->|outbound only| NAT\n  ASG --> S3Static\n  CW[CloudWatch Alarms] -.-> ASG\n  CT[CloudTrail] -.->|audits every API call| VPC',
            },
            {
              type: 'heading',
              text: 'A single request, end to end',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant Client\n  participant CF as CloudFront + WAF\n  participant ALB as Application Load Balancer\n  participant App as App Tier (ASG)\n  participant Cache as ElastiCache\n  participant DB as RDS Multi-AZ\n  Client->>CF: HTTPS request\n  CF->>CF: WAF rules, edge cache check\n  CF->>ALB: cache miss, forward (private AWS backbone)\n  ALB->>App: route to healthy target\n  App->>Cache: check cache\n  Cache-->>App: miss\n  App->>DB: query\n  DB-->>App: result\n  App->>Cache: populate cache\n  App-->>ALB: response\n  ALB-->>CF: response\n  CF-->>Client: response (edge-cached if cacheable)',
            },
            {
              type: 'heading',
              text: 'Why this shape',
            },
            {
              type: 'list',
              items: [
                '**CloudFront + WAF at the edge** absorbs static traffic and common Layer 7 attacks before they ever reach the origin, and accelerates dynamic requests over AWS\'s private backbone.',
                '**Only the ALB sits in a public subnet** — the app and data tiers are unreachable directly from the internet, minimizing attack surface (the VPC Fundamentals pattern, applied concretely).',
                '**Auto Scaling across 2+ AZs** means losing an entire AZ doesn\'t take down the app tier — the ASG simply has fewer healthy instances until it launches replacements elsewhere.',
                '**RDS Multi-AZ** gives automatic database failover without application changes; **ElastiCache** in front of it absorbs read-heavy traffic so the database isn\'t the first thing to fall over under load.',
                '**IAM roles, not access keys**, grant the app tier exactly the permissions it needs (its own S3 bucket, its own DynamoDB table if used) — nothing more.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When asked to design this live, narrate the tiers and the *reasoning* behind each choice as you draw — "the data tier has no route to the internet at all, only the app tier can reach it, and only over the specific port the database needs" reads as far more senior than silently drawing boxes and arrows.',
            },
          ],
        },
      ],
    },
    {
      id: 'aws-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Common AWS interview questions, spanning core services to architecture and cost tradeoffs, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'How does IAM decide whether to allow or deny an action when multiple policies apply to a request?',
              answer:
                'The evaluation logic starts with an implicit deny — nothing is allowed by default. If any applicable policy contains an explicit `Deny` for the action/resource, the request is denied immediately regardless of any `Allow` elsewhere. Otherwise, if any applicable policy contains an explicit `Allow`, the request is permitted; if no policy explicitly allows it, the implicit deny stands. The practical implication: an explicit `Deny` is the strongest statement in the system, and is the right tool for hard guardrails (e.g., a Service Control Policy denying resource deletion in production accounts) that must override any permission a well-meaning but overly broad IAM role might otherwise grant.',
            },
            {
              question: 'When would you choose DynamoDB over RDS/Aurora for a new AWS-hosted service?',
              answer:
                'Choose DynamoDB when the access pattern is predominantly key-based lookups (get/put by a well-known key) at a scale where you need guaranteed single-digit-millisecond latency regardless of table size, and you can design around its constraints (limited query flexibility, no native joins, careful partition-key design to avoid hot partitions). Choose RDS/Aurora when the domain has genuine relational structure requiring multi-table transactions, complex ad-hoc queries/joins, or when the team\'s existing tooling/ORM/reporting stack assumes SQL. The decision should follow from the actual access pattern, not from "NoSQL is more scalable" as a blanket assumption — Aurora scales to very significant throughput too.',
            },
            {
              question: 'Explain the difference between a NAT Gateway and an Internet Gateway, and why a typical 3-tier architecture uses both.',
              answer:
                'An Internet Gateway allows bidirectional internet traffic for resources in a public subnet (which has a route to it, and typically a public IP). A NAT Gateway sits in a public subnet and allows resources in a *private* subnet to initiate outbound internet connections (downloading OS patches, calling a third-party API) while remaining unreachable from the internet inbound — the private subnet\'s route table points outbound traffic to the NAT Gateway, which itself uses the Internet Gateway to actually reach the internet. A typical 3-tier design puts only the load balancer in a public subnet behind an Internet Gateway, keeps app servers and databases in private subnets with no direct inbound internet exposure, and gives the app tier a NAT Gateway for necessary outbound calls — minimizing the attack surface while still allowing legitimate outbound traffic.',
            },
            {
              question: 'What\'s the practical difference between an ALB and an NLB, and when would you choose the Network Load Balancer specifically?',
              answer:
                'An ALB operates at Layer 7 (HTTP/HTTPS), understands paths/headers/hosts, and can do content-based routing to different target groups — the default choice for HTTP microservices and container-based apps. An NLB operates at Layer 4 (TCP/UDP), has no visibility into request content, but offers ultra-low latency, can handle extreme throughput (millions of requests per second), supports static IP addresses (useful when a client needs to allowlist a fixed IP), and preserves the client\'s source IP more transparently. Choose NLB specifically for non-HTTP protocols, extreme performance/throughput requirements, or when static IPs are a hard requirement — otherwise ALB\'s Layer 7 features make it the more useful default for typical web/API workloads.',
            },
            {
              question: 'What is the difference between a Security Group and a Network ACL, and why can mixing them up cause a connection to silently fail?',
              answer:
                'A Security Group is stateful and instance-level: it supports only Allow rules, and once inbound traffic is allowed, the corresponding return traffic is automatically permitted regardless of outbound rules. A Network ACL is stateless and subnet-level: it supports both Allow and Deny rules, evaluated in numbered order, and inbound and outbound traffic must each be explicitly allowed — allowing a request in does not automatically allow the response back out. A common failure mode: someone allows inbound traffic on a port at the NACL level but forgets the outbound rule for ephemeral response ports (typically 1024-65535), so the connection appears to simply hang — the request got in, but the NACL silently dropped the response, even though the security group and the application were both configured correctly.',
            },
            {
              question: 'What is envelope encryption, and why does AWS use it instead of encrypting data directly with a KMS master key?',
              answer:
                'Envelope encryption uses a two-layer key structure: a locally-generated "data key" actually encrypts the data (fast, done entirely by the application/service, no network call needed per encryption operation), while KMS\'s master key is only used to encrypt (and later decrypt) that small data key itself. This avoids sending potentially large volumes of actual data to KMS for every encryption operation (KMS master keys never leave AWS\'s HSMs and aren\'t designed for bulk data throughput), keeps the expensive/rate-limited KMS API calls to a minimum (one call per data key, not per byte of data), and still lets AWS centrally control and audit access to the master key that ultimately gates all decryption.',
            },
            {
              question: 'Explain the RTO/RPO tradeoffs between a "pilot light" and a "warm standby" multi-Region disaster recovery strategy.',
              answer:
                'Pilot light keeps only the most critical core infrastructure (typically just a replicated database) running in the DR Region, with the rest of the stack defined as infrastructure-as-code but not actively running — recovery means spinning up that additional infrastructure on failover, giving a longer Recovery Time Objective (RTO, e.g. tens of minutes) but very low ongoing cost since most resources aren\'t running. Warm standby keeps a smaller-scale but fully functional copy of the entire stack running in the DR Region continuously, so failover is mostly a traffic-routing change (much lower RTO, often single-digit minutes) at a meaningfully higher ongoing cost since you\'re paying for always-on, if downsized, duplicate infrastructure. Both typically achieve a low Recovery Point Objective (RPO, minimal data loss) via continuous database replication — the key differentiator between the two strategies is RTO and cost, not RPO.',
            },
            {
              question: 'Why would you choose SNS fan-out to multiple SQS queues instead of having each consumer poll a single shared queue?',
              answer:
                'A single shared queue delivers each message to exactly one consumer that dequeues it (standard queue semantics) — fine when you have multiple worker instances doing the *same* job for load distribution, but wrong when you have multiple different downstream systems that each independently need to see *every* event for entirely different purposes (e.g., one consumer sends a notification, another updates analytics, a third triggers search indexing). SNS fan-out publishes each message once to SNS, which delivers a full copy to every subscribed SQS queue — giving each downstream system its own independently-scalable, independently-failing queue, without the publisher needing to know how many consumers exist or coordinate delivery to each of them itself.',
            },
            {
              question: 'What\'s the difference between Amazon Bedrock and Amazon SageMaker, and how would you decide which to use for a new generative AI feature?',
              answer:
                'Bedrock provides serverless, pay-per-token API access to third-party and Amazon foundation models (Claude, Llama, Nova, etc.) without managing any hosting infrastructure — the right choice when you want to build a feature on top of an existing, capable foundation model quickly (chat, summarization, RAG via Bedrock Knowledge Bases, agentic tool use via Bedrock Agents). SageMaker is the full ML platform for training, fine-tuning, and hosting your *own* models — the right choice when you need a custom model trained on proprietary data/architecture that no foundation model API can provide, when you need fine-grained control over the hosting infrastructure/latency/cost profile of inference, or when you\'re fine-tuning an open-source model and need to manage that lifecycle yourself. Most new generative-AI product features start with Bedrock and only move toward SageMaker-hosted custom models if there\'s a specific requirement Bedrock\'s managed API can\'t satisfy.',
            },
            {
              question: 'Why does AWS recommend IAM roles over long-lived access keys for workloads running on EC2/Lambda/ECS?',
              answer:
                'Access keys are long-lived, static credentials that must be securely stored, rotated manually, and — if leaked (committed to a repo, exposed in a log) — remain valid and exploitable until someone notices and revokes them. IAM roles provide temporary, automatically-rotated credentials injected into the compute environment (via the EC2 instance metadata service, Lambda\'s execution environment, or ECS task roles) that expire on their own within hours, with no secret ever needing to be stored by the developer or embedded in code/config — eliminating an entire class of credential-leak risk while also simplifying operations, since there\'s no manual rotation process to maintain.',
            },
            {
              question: 'What\'s the practical reason to use Aurora over standard RDS for a MySQL/Postgres-compatible workload, beyond "it\'s AWS\'s own engine"?',
              answer:
                'Aurora decouples compute from a distributed, self-healing storage layer that\'s automatically replicated six ways across three Availability Zones, which gives it meaningfully faster crash recovery (no need to replay a long transaction log the way a standard RDS instance does after failover — Aurora\'s storage layer handles this at a lower level) and higher baseline throughput for many workloads, typically without any application-level changes since it stays wire-compatible with MySQL/Postgres. The tradeoffs worth naming: Aurora costs more than equivalent standard RDS instance types, and it\'s only available for MySQL/PostgreSQL compatibility — not a fit if you specifically need Oracle, SQL Server, or MariaDB.',
            },
            {
              question: 'A colleague proposes using Lambda for a workload that runs continuously at high, steady throughput 24/7. What would you push back on?',
              answer:
                'Lambda\'s per-invocation/per-duration pricing model is optimized for spiky, intermittent, or unpredictable workloads where paying only for actual execution time (and scaling to zero when idle) is the main value proposition. At sustained high, steady throughput, the per-invocation cost model typically becomes more expensive than provisioning EC2/Fargate capacity sized for that known, constant load, and you also lose useful capabilities like long-running processes, larger local storage/memory ceilings, and avoiding the (mitigable but real) cold-start latency Lambda introduces. The right question to ask back: is the load actually steady and predictable, or does it just look that way in aggregate while being genuinely spiky per-customer/per-Region — the latter might still favor Lambda\'s elasticity even at high aggregate volume.',
            },
            {
              question: 'What does it mean that S3 provides strong read-after-write consistency, and why did that matter as a change from S3\'s earlier behavior?',
              answer:
                'Strong read-after-write consistency (introduced December 2020) means a `GET` request immediately after a successful `PUT` of a new object always returns the latest data — no window where a read might return stale or missing data, and no "eventual consistency" caveat to design defensively around. Before this change, S3 offered only eventual consistency for overwrite `PUT`s and `DELETE`s in most Regions, meaning an application had to be written to tolerate briefly reading stale data after a write — a real source of subtle bugs (e.g., a process that writes an object and immediately reads it back to verify, occasionally seeing the old version). Modern S3 applications no longer need that defensive design for consistency, though the durability (11 nines) versus availability (S3\'s SLA, not literally 100%) distinction still matters separately.',
            },
            {
              question: 'What Auto Scaling policy type should you use by default, and when would you reach for something else?',
              answer:
                'Target tracking scaling is the right default — you declare the outcome you want (e.g., "keep average CPU near 60%") and AWS computes the add/remove decisions automatically, rather than you hand-tuning specific thresholds. Step scaling is worth reaching for when you need different scaling magnitudes at different severity levels (e.g., add 1 instance if CPU crosses 60%, add 5 if it crosses 90%) that a single target-tracking metric can\'t express. Scheduled scaling fits a known, predictable pattern (a daily 9am traffic ramp) where you want to pre-scale ahead of the metric even rising, rather than reactively scaling after load has already increased.',
            },
            {
              question: 'What is the difference between RDS Multi-AZ and a read replica, and why are they not interchangeable?',
              answer:
                'Multi-AZ maintains a synchronous standby replica in a second Availability Zone used exclusively as an automatic failover target during an outage — it does not serve read traffic in the standard configuration, and its job is high availability, not read scaling. A read replica is an asynchronous, read-only copy used specifically to scale read throughput horizontally by offloading queries from the primary, and can optionally be promoted to a standalone primary — its job is read scaling, not automatic failover (promoting a read replica is a manual, deliberate action, not an automatic response to a primary failure). A production system needing both high availability and read scaling typically uses Multi-AZ for the former and one or more read replicas for the latter, simultaneously, since they solve different problems.',
            },
            {
              question: 'What happens to a Spot Instance when AWS needs the capacity back, and what architectural pattern makes that safe to build on?',
              answer:
                'AWS reclaims a Spot Instance with a 2-minute termination warning (delivered via the instance metadata service and, optionally, an EventBridge event) whenever it needs that spare capacity back for On-Demand or Reserved customers — there is no way to prevent this, only to react to the warning by draining connections, checkpointing work, or shifting load elsewhere within that window. The pattern that makes this safe: run Spot only for workloads that are horizontally scaled and stateless (or checkpoint their own state externally), fault-tolerant to an individual node disappearing, and ideally spread across multiple instance types/AZs via a Spot Fleet or an Auto Scaling Group\'s mixed-instance-policy, so losing any single Spot Instance is a routine, absorbed event rather than an incident.',
            },
            {
              question: 'Summarize the six pillars of the AWS Well-Architected Framework in one sentence each.',
              answer:
                'Operational Excellence: run and monitor systems to deliver business value, continuously improving supporting processes. Security: protect data, systems, and assets through risk assessment and mitigation, especially least privilege and defense in depth. Reliability: recover from infrastructure/service failures and dynamically meet demand, typically via multi-AZ and tested backups. Performance Efficiency: use computing resources efficiently and keep that efficiency as demand and technology evolve, via right-sizing and choosing the right tool for the access pattern. Cost Optimization: avoid unnecessary spend and understand where money goes, via right-sizing, commitment discounts, and storage tiering. Sustainability: minimize environmental impact by favoring efficient, well-utilized infrastructure over always-on over-provisioning.',
            },
            {
              question: 'What is VPC Peering, and why might PrivateLink be a better choice for exposing a service to another VPC or account?',
              answer:
                'VPC Peering directly connects two VPCs\' networks so resources in either can communicate as if on the same network, using private IPs — it is a full network-level merge (subject to CIDR non-overlap requirements) and doesn\'t transitively connect a third VPC peered to one of them. PrivateLink instead exposes one specific service (via an endpoint) privately to another VPC without merging the networks at all — the consumer only reaches the specific exposed service, not the provider\'s entire network, which is both a stronger security boundary and avoids CIDR-overlap and transitive-routing limitations entirely. PrivateLink is the standard mechanism for a SaaS provider to expose a service securely to many customer VPCs (each customer only gets access to the specific service, never the provider\'s internal network), and is also how VPC endpoints let a private subnet reach AWS services like S3/DynamoDB without an Internet Gateway.',
            },
            {
              question: 'Why is choosing a good DynamoDB partition key described as the single most important DynamoDB design decision?',
              answer:
                'DynamoDB automatically splits a table across partitions, and each partition has its own share of the table\'s overall throughput — if the partition key has low cardinality or access is skewed toward a small number of key values (a popular user ID, a sequential/time-based key where all "current" writes land on the same value), requests to that one partition get throttled regardless of how much capacity the table has overall, since the other partitions\' unused capacity can\'t help. A well-chosen key — high cardinality, with access spread evenly across values — lets DynamoDB\'s automatic partitioning actually deliver its promised single-digit-millisecond latency at scale; a poorly chosen one silently caps throughput on a hot partition no matter how the table\'s provisioned or on-demand capacity is configured. A common fix for an inherently low-cardinality or time-ordered key is write-sharding: appending a random suffix to spread writes, then fanning out reads across all shard values.',
            },
            {
              question: 'What is the practical difference between CloudWatch, CloudTrail, and X-Ray, and when would you reach for each?',
              answer:
                'CloudWatch answers "is the system healthy right now" — metrics, logs, and alarms for operational monitoring, feeding Auto Scaling triggers and SNS notifications. CloudTrail answers "who did what, when" — an audit log of every API call made in the account, the fundamental tool for security forensics and compliance, entirely separate from CloudWatch\'s operational data. X-Ray answers "why was this one specific request slow across many services" — distributed tracing that stitches together timing from every hop a request takes (API Gateway → Lambda → another Lambda → DynamoDB), pinpointing exactly where latency accumulated. A mature observability answer to "how would you debug this" names the right one for the actual question being asked, rather than reaching for CloudWatch logs for everything.',
            },
            {
              question: 'Compare Reserved Instances, Savings Plans, and Spot Instances as EC2 cost-optimization levers.',
              answer:
                'Reserved Instances commit to a specific instance family/size/Region for 1 or 3 years in exchange for up to ~72% off On-Demand pricing — the discount is tied to that specific instance configuration, so it\'s best when you\'re confident about both the workload\'s steadiness and its exact instance shape long-term. Savings Plans offer a similar discount tier for a similar commitment length, but the commitment is a dollar-per-hour spend target rather than a specific instance type, giving flexibility to change instance families/sizes (even across EC2, Fargate, and Lambda for Compute Savings Plans) while keeping the discount — generally the more flexible, and now more commonly recommended, choice over Reserved Instances. Spot Instances have no commitment at all and offer the deepest discount (up to ~90%) in exchange for AWS being able to reclaim the capacity with only a 2-minute warning — appropriate only for fault-tolerant, interruptible workloads, never for steady baseline capacity or stateful single-instance workloads.',
            },
            {
              question: 'Why does a load-balanced, horizontally-scaled application typically need to be designed as stateless, and how does AWS support the exception when session stickiness is genuinely required?',
              answer:
                'A load balancer distributes requests across a fleet of backend instances with no guarantee that the same client\'s consecutive requests hit the same instance — if a server holds session state only in its own local memory, a request routed to a different instance simply won\'t have access to that state, producing inconsistent or broken behavior. The standard fix is designing the app tier to be stateless, pushing session state into a shared store (ElastiCache, DynamoDB) that any instance can read regardless of which one handled a previous request. For cases where true stickiness is required (e.g., a stateful WebSocket connection, or an app that can\'t be quickly refactored), an ALB supports **sticky sessions** (via a cookie) that route a given client\'s requests back to the same target for the duration of the cookie — a pragmatic escape hatch, not the default design goal, since it reduces the load balancer\'s ability to distribute load evenly and complicates scaling events.',
            },
            {
              question: 'Explain eventual consistency in the context of DynamoDB reads, and when an application should pay for strongly consistent reads instead.',
              answer:
                'DynamoDB replicates each item across multiple Availability Zones for durability; by default, a `GetItem`/`Query` performs an **eventually consistent read**, which might briefly return stale data if it happens to hit a replica that hasn\'t yet received the most recent write (usually resolved within a second) — but it costs half the read capacity of a strongly consistent read and has lower latency. A **strongly consistent read** (an explicit request parameter) guarantees the response reflects all writes that received a successful response prior to it, at roughly double the read-capacity cost and typically somewhat higher latency, and is unavailable on Global Secondary Indexes at all (GSIs are eventually consistent only). The practical rule: default to eventually consistent reads for the large majority of access patterns where a sub-second staleness window is harmless, and pay for strongly consistent reads only on the specific paths where an application would actually behave incorrectly seeing slightly stale data (e.g., reading back a value immediately after writing it to confirm success within the same request).',
            },
            {
              question: 'What are the main ways AWS lets you protect data both in transit and at rest, and why does a complete security answer need to name both?',
              answer:
                'Data in transit is protected primarily via TLS — terminated at the edge (CloudFront), at the load balancer (ALB/NLB listener), or end-to-end all the way to the origin for the most sensitive paths, plus AWS\'s own private backbone network for traffic between AWS services/Regions rather than the public internet. Data at rest is protected via KMS-backed encryption, available (often as a simple checkbox) across S3, EBS, RDS, DynamoDB, and most other storage services, using envelope encryption under the hood. These are genuinely separate concerns with separate failure modes: encrypting data at rest does nothing to protect it while it\'s being transmitted between a client and a server, and TLS in transit does nothing to protect data sitting on a compromised or improperly-decommissioned disk. An interviewer asking "how is data protected" is listening for both halves named explicitly, not just one.',
            },
            {
              question: 'Why would a team choose a multi-account AWS Organizations structure instead of using a single account with separate VPCs for dev/staging/prod?',
              answer:
                'A single account with separate VPCs still shares the same IAM identity space, the same account-level service quotas, and the same blast radius for account-level mistakes or compromises — an overly broad IAM policy, a leaked credential, or a runaway process affecting account-wide limits in a dev VPC can still reach or degrade production resources if a policy is misconfigured, because they\'re fundamentally in the same trust boundary. Separate accounts per environment (or per team) under AWS Organizations give a much stronger isolation boundary: resources in one account simply don\'t exist from the perspective of another account\'s IAM policies, so a mistake in dev cannot touch prod no matter how a dev-account policy is written, and Service Control Policies at the Organization/OU level can enforce guardrails (e.g., deny disabling CloudTrail, restrict allowed Regions) that hold even against a compromised or careless account administrator.',
            },
            {
              question: 'In the classic serverless image-processing pipeline (S3 upload → thumbnail → moderation → notify), why is DynamoDB the natural choice for metadata storage instead of RDS?',
              answer:
                'The access pattern is a pure key lookup by image ID (write metadata once when processing completes, read it back by ID later) with no relational joins, multi-table transactions, or complex ad-hoc queries needed — exactly the access pattern DynamoDB is built for, and it also fits the pipeline\'s fully serverless, scale-to-zero design goal (no idle database capacity to provision or manage, matching Lambda\'s own scale-to-zero behavior). RDS would work functionally, but it would reintroduce exactly the operational overhead (instance sizing, connection pool management, Multi-AZ configuration for availability) the rest of the pipeline was specifically designed to avoid by going serverless end-to-end, for a workload that never actually needed relational structure in the first place.',
            },
            {
              question: 'How would you give a GitHub Actions pipeline permission to deploy to AWS without storing access keys?',
              answer:
                'Use OIDC federation. Register GitHub\'s OIDC provider in IAM, create a deploy role whose trust policy allows `sts:AssumeRoleWithWebIdentity` from that provider, and pin the `sub` claim to the exact organization, repository and branch or environment (for example `repo:acme/orders-api:ref:refs/heads/main`) plus `aud` = `sts.amazonaws.com`. The workflow sets `permissions: id-token: write` and uses `aws-actions/configure-aws-credentials` to exchange the job\'s signed token for temporary credentials. There is no secret to leak or rotate, credentials expire in about an hour, and CloudTrail shows exactly which workflow assumed the role. The classic mistake is a loose `sub` condition (or wildcard) that lets any repository on GitHub assume the role; the second is giving the role broad admin rights instead of scoping it to the stacks it deploys.',
            },
            {
              question: 'A Lambda function behind SQS keeps reprocessing the same messages and the queue backs up. How do you diagnose and fix it?',
              answer:
                'Start with the three usual causes. First, the visibility timeout is shorter than the function\'s processing time (AWS recommends at least six times the function timeout), so messages reappear while still being processed. Second, a poison message fails the whole batch because the function throws instead of reporting partial failures — enable `ReportBatchItemFailures` and return only the failed `itemIdentifier`s. Third, there is no DLQ or `maxReceiveCount`, so bad messages cycle forever. Then check concurrency: the event source mapping scales pollers up to the function\'s reserved concurrency or the account limit, and throttles cause retries that count against `maxReceiveCount`, so a throttled-but-healthy message can end in the DLQ. Finally, remember delivery is at-least-once, so the handler must be idempotent regardless. Alarm on `ApproximateAgeOfOldestMessage` and DLQ depth rather than just queue length.',
            },
            {
              question: 'Why did a new AWS account\'s NAT Gateway bill surprise the team, and how would you reduce it?',
              answer:
                'NAT Gateways charge an hourly fee plus a per-GB data processing fee on every byte that passes through, including traffic to AWS services like S3, DynamoDB, ECR and CloudWatch that never needed to leave the AWS network. Container image pulls, S3 data processing and log shipping from private subnets quickly add up. Fixes: add free S3 and DynamoDB gateway endpoints, interface endpoints (PrivateLink) for high-volume services like ECR, STS and CloudWatch Logs, deploy one NAT per AZ to avoid cross-AZ charges, use VPC Flow Logs to find the top talkers, and consider IPv6 with an egress-only internet gateway for outbound-heavy workloads. Also cut the traffic itself with caching of images and packages. Verify the result in Cost Explorer filtered by usage type `NatGateway-Bytes`.',
            },
            {
              question: 'When would you choose Aurora Global Database over DynamoDB global tables or cross-Region read replicas for multi-Region?',
              answer:
                'Choose by data model and write topology. Aurora Global Database keeps a relational model with a single writer Region and read-only secondary Regions, using storage-level replication with typically sub-second lag; failover promotes a secondary with an RPO of seconds and an RTO of about a minute or so — right for SQL workloads that need joins and transactions, with write locality in one Region. DynamoDB global tables are active-active: every Region accepts writes, with last-writer-wins conflict resolution (or multi-Region strong consistency in the newer mode), so they suit key-value access patterns that need local writes everywhere but demand careful conflict-safe data design. Cross-Region RDS read replicas are the cheaper, lower-capability option: asynchronous, with a manual promotion and often larger lag. Always pair the choice with multi-Region KMS keys and a failover runbook that has been tested.',
            },
            {
              question: 'Explain how a Service Control Policy differs from an IAM permission boundary and from a Resource Control Policy.',
              answer:
                'All three are guardrails that never grant permissions on their own; they only cap what grants can allow. An SCP is attached at the Organization root, OU or account and caps the maximum permissions of IAM principals in member accounts (not the management account, and not service-linked roles). A permission boundary is attached to a single IAM user or role and caps that identity; it is typically used to let delegated admins create roles safely, because any role they create must carry the boundary. An RCP, introduced in late 2024, is attached the same way as an SCP but caps what can be done to supported resources in member accounts (S3, STS, KMS, SQS, Secrets Manager and others) by anyone, including external principals, regardless of the resource policy — the tool for a data perimeter. Effective access is the intersection of all guardrails and at least one grant.',
            },
            {
              question: 'Design the storage and caching for a product catalog read-heavy API at 50,000 requests per second. What are the failure modes?',
              answer:
                'Put the authoritative data in DynamoDB (key lookups by product ID, on-demand or auto-scaled capacity) or Aurora if catalog queries need relational filtering. Layer CloudFront in front for cacheable GET responses with a cache key limited to the path and the few query parameters that matter, then an application cache (ElastiCache Valkey, or DAX for DynamoDB) for hot items. Most traffic should never reach the database. Failure modes: a cache stampede when a hot key expires (use TTL jitter, locking or stale-while-revalidate); a cold cache after restart overwhelming the database (warm up, size the database to survive a degraded hit ratio, rate-limit misses); hot partitions in DynamoDB for viral products (cache them and spread keys); stale data after updates (delete or version keys on write, short TTLs); and an overly fragmented CloudFront cache key that silently tanks the hit ratio. Monitor hit ratio and database consumed capacity as first-class SLIs.',
            },
            {
              question: 'What is the difference between ECS task roles and execution roles, and what goes wrong if you confuse them?',
              answer:
                'The task **execution role** is assumed by the ECS agent/Fargate infrastructure to do setup work on your behalf: pull the image from ECR, write logs to CloudWatch, and fetch secrets from Secrets Manager or Parameter Store to inject as environment variables. The **task role** is what your application code assumes at runtime through the container credentials endpoint to call AWS APIs such as S3 or DynamoDB. If you put application permissions on the execution role, they are not available to your code (or, worse, you add them to both and over-grant); if you forget execution-role permissions, the task fails to start with errors pulling the image or reading a secret. The same split exists conceptually in Lambda (execution role is the function\'s runtime identity) and on EKS (Pod Identity or IRSA gives each service account its own role instead of using the node role). Scope each role to one service.',
            },
            {
              question: 'How do you make a distributed workflow reliable when a step needs to wait days for a human approval?',
              answer:
                'Do not hold a compute process open. Use a workflow engine that persists state: Step Functions Standard workflows (up to a year) with a `.waitForTaskToken` callback integration, where the task token is sent to the approver (for example via SNS or an API) and the workflow resumes when `SendTaskSuccess` or `SendTaskFailure` is called. You pay per state transition, not for waiting time. Lambda durable functions offer a similar checkpoint-and-resume model in code. Add a timeout and a Catch path so abandoned approvals escalate or cancel, make each step idempotent because retries happen, and keep the token and workflow ID in a database so duplicate callbacks are ignored. Avoid a polling loop in a long-running container or a cron table in a database unless you have a specific reason.',
            },
            {
              question: 'What causes the "AccessDenied" error when a role in account A reads an encrypted S3 object in account B, even though bucket policy and IAM allow it?',
              answer:
                'Almost always KMS. If the object is encrypted with a customer-managed key in account B, reading it requires `kms:Decrypt`, and that needs both a key-policy statement trusting account A (or the role) and an IAM policy in account A allowing the KMS action. AWS-managed keys (`aws/s3`) cannot be shared cross-account at all, so the fix is to re-encrypt with a customer-managed key. Other usual suspects: an SCP or RCP denying the action, a VPC endpoint policy restricting buckets, S3 Block Public Access or an Object Ownership issue for objects uploaded by another account, and a bucket policy `Condition` on `aws:PrincipalOrgID` or source IP. Use the IAM policy simulator, CloudTrail `errorMessage` fields and Access Analyzer\'s policy validation to find which layer denied.',
            },
            {
              question: 'Your DynamoDB table is throttling even though consumed capacity is well below provisioned. What do you check?',
              answer:
                'Throttling below table-level capacity means a partition or index limit. Check for a hot key (CloudWatch Contributor Insights for DynamoDB shows the most accessed and throttled keys), because each partition serves roughly 3,000 reads and 1,000 writes per second regardless of table capacity. Check GSIs: a throttled GSI back-pressures writes to the base table, and an under-provisioned GSI is a common hidden cause. Check burst behavior and whether on-demand tables were just created or recently switched, which can limit initial peak throughput until scaling catches up. Look for large items or large scans consuming capacity in bursts, retried requests amplifying load without backoff, and batch writes with a skewed key distribution. Fixes include better key design or write sharding, caching hot items (DAX or ElastiCache), raising GSI capacity, and exponential backoff with jitter in clients.',
            },
            {
              question: 'What is the transactional outbox pattern and why is it needed when publishing events to SNS, SQS or EventBridge?',
              answer:
                'Saving state in a database and publishing an event are two separate systems, so a crash between them either loses the event (state saved, event not sent) or emits an event for state that never committed. The outbox pattern writes the event into an `outbox` table in the same local transaction as the business change, so both commit or neither does. A separate relay then reads the outbox and publishes to the bus, marking rows sent; consumers deduplicate because the relay is at-least-once. On AWS you can implement the relay with a polling Lambda, or avoid it by deriving events from the database\'s change stream: DynamoDB Streams to EventBridge Pipes, or CDC from Aurora/RDS. DynamoDB transactions can write the item and the outbox record atomically. Either way the guarantees are atomic state change plus at-least-once event delivery, which idempotent consumers turn into effectively-once processing.',
            },
          ],
        },
      ],
    },
  ],
}
