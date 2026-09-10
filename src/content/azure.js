export const azureSection = {
  id: 'azure',
  label: 'Azure',
  icon: '🔷',
  groups: [
    {
      id: 'azure-guide',
      label: 'Guide',
      topics: [
        {
          id: 'what-is-azure',
          title: 'What Is Azure, and How Is It Organized?',
          summary:
            'Microsoft Azure is a global public cloud platform offering compute, storage, networking, databases, and hundreds of higher-level managed services across a worldwide network of datacenters, billed on a pay-as-you-go model.',
          keyPoints: [
            'Azure is one of the three dominant hyperscale public clouds (alongside AWS and Google Cloud), with 300+ services spanning IaaS, PaaS, and SaaS.',
            'The core value proposition: rent compute/storage/networking elastically instead of buying and operating physical datacenters — trading capital expenditure (CapEx) for operating expenditure (OpEx).',
            "Azure integrates deeply with Microsoft's enterprise ecosystem (Active Directory, Windows Server, SQL Server, Microsoft 365), a major reason large enterprises standardize on it.",
            'Every Azure resource — a VM, a database, a storage account — is ultimately an ARM (Azure Resource Manager) object: a JSON-described item with a type, a location, and properties, managed through one consistent API and control plane.',
          ],
          blocks: [
            {
              type: 'p',
              text: "Cloud computing shifts infrastructure from something you buy and maintain to something you rent and consume on demand. Azure is Microsoft's entry in this space: a global network of datacenters (organized into **regions**) offering everything from raw virtual machines to fully managed AI services, all provisioned through a single control plane (the Azure Resource Manager) and billed per second/minute/GB actually consumed.",
            },
            {
              type: 'heading',
              text: 'The Service Model Spectrum: IaaS, PaaS, SaaS',
            },
            {
              type: 'table',
              headers: ['Model', 'You manage', 'Azure manages', 'Example'],
              rows: [
                ['On-premises', 'Everything — hardware, OS, runtime, data, app', 'Nothing', 'Your own datacenter'],
                ['IaaS', 'OS, runtime, data, app', 'Physical hardware, virtualization, networking', 'Azure Virtual Machines'],
                ['PaaS', 'Data, application code', 'OS, runtime, patching, scaling infrastructure', 'Azure App Service, Azure SQL Database'],
                ['SaaS', 'Just your data/config', 'The entire application stack', 'Microsoft 365, Dynamics 365'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph IaaS["IaaS — Virtual Machines"]\n    direction TB\n    I1["You: OS patches, runtime, app, data"]\n    I2["Azure: physical servers, hypervisor, network, power/cooling"]\n  end\n  subgraph PaaS["PaaS — App Service / Azure SQL"]\n    direction TB\n    P1["You: app code, data"]\n    P2["Azure: OS, runtime, patching, scaling, HA"]\n  end\n  subgraph SaaS["SaaS — Microsoft 365"]\n    direction TB\n    S1["You: your documents/config"]\n    S2["Azure/Microsoft: the entire stack"]\n  end',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: "Moving right along IaaS → PaaS → SaaS trades control for less operational burden. A strong interview answer names this explicitly: **prefer the highest abstraction level that still meets the requirement** — e.g., choose App Service over a raw VM unless you specifically need OS-level control, custom kernel modules, or a legacy install that PaaS cannot host.",
            },
            {
              type: 'p',
              text: "Azure's global footprint is organized into **geographies** (e.g., United States, Europe, India) containing **regions** (e.g., East US, West Europe), each a set of physically separate datacenters. Every resource you create lives in exactly one region (with some global exceptions like Entra ID and Front Door) and is described, deployed, and managed through **Azure Resource Manager (ARM)** — the consistent control-plane API underneath the Azure Portal, CLI, PowerShell, SDKs, and Infrastructure-as-Code tools alike.",
            },
          ],
        },
        {
          id: 'azure-resource-model',
          title: 'The Azure Resource Model: Management Groups, Subscriptions, Resource Groups',
          summary:
            'Every resource in Azure sits inside a strict four-level hierarchy that determines billing boundaries, access control scope, and policy inheritance — the single most foundational concept for organizing anything in Azure.',
          keyPoints: [
            'The hierarchy, top to bottom: **management groups** → **subscriptions** → **resource groups** → **resources**.',
            'A **subscription** is the billing and quota boundary — a container tied to one Azure account/agreement, with its own spending limits and service quotas.',
            'A **resource group** is a logical container for resources that share a lifecycle — typically deployed, updated, and deleted together (e.g., all resources for one application environment).',
            'RBAC role assignments and Azure Policy both flow down the hierarchy — a role granted at a management group applies to every subscription, resource group, and resource beneath it.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Nearly every organizational question in Azure — "who can access this?", "how do we bill this to the right cost center?", "how do we delete an entire environment cleanly?" — is answered by where a resource sits in this hierarchy.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Root["Tenant Root Management Group"] --> MG1["Management Group: Production"]\n  Root --> MG2["Management Group: Non-Production"]\n  MG1 --> Sub1["Subscription: Prod-App-A"]\n  MG1 --> Sub2["Subscription: Prod-App-B"]\n  MG2 --> Sub3["Subscription: Dev-Test"]\n  Sub1 --> RG1["Resource Group: rg-app-a-web"]\n  Sub1 --> RG2["Resource Group: rg-app-a-data"]\n  RG1 --> R1["App Service"]\n  RG1 --> R2["App Service Plan"]\n  RG2 --> R3["Azure SQL Database"]\n  RG2 --> R4["Storage Account"]',
            },
            {
              type: 'list',
              items: [
                '**Management group** — an optional top layer for organizing multiple subscriptions (e.g., by department, environment, or compliance boundary); RBAC and Policy assigned here cascade to every subscription and resource underneath.',
                '**Subscription** — the billing boundary and the scope for most service quotas (e.g., max VM cores per region). Large orgs commonly use separate subscriptions per environment (prod/dev/test) or per business unit, both for billing clarity and as a hard isolation boundary.',
                '**Resource group** — a logical, region-agnostic container (it has a location for its own metadata, but the resources inside can live in different regions). Deleting a resource group deletes everything inside it — the standard way to tear down an entire environment cleanly.',
                '**Resource** — the actual deployable thing: a VM, a storage account, a virtual network. Every resource has exactly one resource group as its parent.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: "Group resources by **lifecycle**, not just by type. A common mistake is one resource group for \"all storage accounts\" and another for \"all VMs\" — that makes it impossible to delete one application's environment in one action. Instead, group everything that belongs to one app/environment (its VM, database, storage account, VNet) into one resource group.",
            },
            {
              type: 'code',
              language: 'bash',
              title: 'exploring the hierarchy with the Azure CLI',
              code: `az account list --output table                      # subscriptions you can access
az account set --subscription "Prod-App-A"           # switch active subscription
az group create --name rg-app-a-web --location eastus
az group list --output table
az resource list --resource-group rg-app-a-web --output table
az group delete --name rg-app-a-web --yes             # deletes EVERYTHING inside it`,
            },
          ],
        },
        {
          id: 'regions-availability-zones',
          title: 'Regions, Availability Zones & Paired Regions',
          summary:
            "Azure's physical infrastructure is organized so that failures are contained at increasingly large blast radii — a single datacenter, a whole region, or an entire geography — and choosing the right combination is how you design for a target availability SLA.",
          keyPoints: [
            'A **region** is a set of datacenters within a defined perimeter, connected via a low-latency regional network.',
            'An **availability zone (AZ)** is one or more discrete datacenters within a region, each with independent power, cooling, and networking — protects against a single datacenter failure.',
            'An **availability set** protects against failure within one datacenter (rack/power/network fault domains) but not a whole-datacenter outage — AZs supersede it wherever the region supports zones.',
            'A **paired region** is a specific partner region (usually 300+ miles away, same geography) used for platform-level disaster recovery and staged platform updates.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Region["Region: East US"]\n    subgraph AZ1["Availability Zone 1"]\n      DC1a["Datacenter"]\n    end\n    subgraph AZ2["Availability Zone 2"]\n      DC2a["Datacenter"]\n    end\n    subgraph AZ3["Availability Zone 3"]\n      DC3a["Datacenter"]\n    end\n  end\n  Region -.->|"paired region\\n(disaster recovery)"| Region2["Region: West US\\n(paired with East US)"]',
            },
            {
              type: 'table',
              headers: ['Concept', 'Protects against', 'Typical SLA impact'],
              rows: [
                ['Fault domain (within availability set)', 'Rack-level power/network failure', 'VM SLA ~99.95% with 2+ VMs in an availability set'],
                ['Availability Zone', 'Entire datacenter failure (power, cooling, network)', 'VM SLA ~99.99% with VMs spread across 3 zones'],
                ['Paired region', 'Entire region-wide outage/disaster', 'No automatic failover — you architect and trigger it (or use a service that does, like geo-redundant storage)'],
              ],
            },
            {
              type: 'list',
              items: [
                'Not every region has availability zones — check regional availability before designing a zone-redundant architecture around it.',
                'Paired regions historically received platform updates one at a time (never both simultaneously) and were prioritized together for recovery during a broad outage — newer regions increasingly use independent, non-paired recovery instead, so check current docs per region.',
                'Paired regions are also where **geo-redundant storage (GRS)** replicates your data by default, and where Azure metadata for some services is kept for compliance/data-residency reasons.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'checking zone support and spreading VMs across zones',
              code: `# not every region has availability zones -- check before designing around them
az vm list-skus --location eastus --size Standard_D2s_v5 --zone --output table

# create three VMs, each explicitly pinned to a different zone
az vm create --resource-group rg-app-a-web --name web-vm-1 \\
  --image Ubuntu2204 --size Standard_D2s_v5 --zone 1 --generate-ssh-keys
az vm create --resource-group rg-app-a-web --name web-vm-2 \\
  --image Ubuntu2204 --size Standard_D2s_v5 --zone 2 --generate-ssh-keys
az vm create --resource-group rg-app-a-web --name web-vm-3 \\
  --image Ubuntu2204 --size Standard_D2s_v5 --zone 3 --generate-ssh-keys`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Putting all VMs of a highly-available app in one availability set but a single availability zone still leaves you exposed to a full datacenter/zone outage. For the strongest single-region resilience, spread critical resources across **multiple availability zones**, not just fault domains within one.",
            },
          ],
        },
        {
          id: 'azure-resource-manager',
          title: 'Azure Resource Manager (ARM): The Control Plane',
          summary:
            'ARM is the deployment and management layer every Azure interface goes through — the Portal, CLI, PowerShell, SDKs, and Terraform all ultimately submit the same declarative resource operations to the same API.',
          keyPoints: [
            'ARM provides one consistent management layer: authentication, RBAC enforcement, resource organization, tagging, and the actual create/read/update/delete (CRUD) operations for every resource type.',
            'ARM templates (and Bicep, which compiles to ARM JSON) describe **desired state** declaratively — you say what you want, and ARM figures out the sequence of API calls to get there, including dependency ordering.',
            'ARM operations are largely **idempotent**: redeploying the same template against a resource that already matches it is a safe no-op, which is what makes "redeploy to converge" a reliable strategy.',
            'Every ARM API call goes through Azure RBAC, so access control is centralized and consistent no matter which tool (Portal, CLI, SDK) issued the request.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Before ARM (in the older "Azure Service Management" / classic deployment model), each service had its own inconsistent management API. ARM unified this: every resource provider (`Microsoft.Compute`, `Microsoft.Storage`, `Microsoft.Sql`, …) exposes a consistent REST API surface, and every management tool — the Portal, `az` CLI, `Az` PowerShell module, SDKs, Terraform\'s `azurerm` provider — is just a client of that same API.',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Portal["Azure Portal"] --> ARM["Azure Resource Manager (ARM)\\nauthentication, RBAC, tagging, resource CRUD"]\n  CLI["Azure CLI / PowerShell"] --> ARM\n  SDK["Language SDKs"] --> ARM\n  IaC["Bicep / ARM templates / Terraform"] --> ARM\n  ARM --> RP1["Resource Provider:\\nMicrosoft.Compute"]\n  ARM --> RP2["Resource Provider:\\nMicrosoft.Storage"]\n  ARM --> RP3["Resource Provider:\\nMicrosoft.Sql"]\n  RP1 --> VM[(Virtual Machines)]\n  RP2 --> ST[(Storage Accounts)]\n  RP3 --> DB[(SQL Databases)]',
            },
            {
              type: 'heading',
              text: 'Declarative vs Imperative Deployment',
            },
            {
              type: 'list',
              items: [
                '**Imperative** (`az vm create`, clicking through the Portal) — you specify the exact steps to take, one command at a time; simple for one-off changes, harder to keep reliably reproducible.',
                '**Declarative** (ARM/Bicep/Terraform templates) — you specify the end state; the tool computes and executes whatever operations are needed to converge, including figuring out dependency order between resources.',
                'ARM template deployments support two modes: **Incremental** (default — adds/updates resources in the template, leaves unrelated existing resources untouched) and **Complete** (deletes any resource in the resource group not present in the template — powerful and dangerous).',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '`Complete` mode deployments delete anything in the target resource group that is not defined in the template — including resources someone created manually for a legitimate reason. Default to `Incremental` mode unless you specifically want the resource group to exactly match the template, and always review a Complete-mode "what-if" deployment first.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'previewing changes before deploying (what-if)',
              code: `az deployment group what-if \\
  --resource-group rg-app-a-web \\
  --template-file main.bicep \\
  --parameters main.parameters.json

# shows exactly what would be Created / Modified / Deleted, without applying it`,
            },
          ],
        },
        {
          id: 'entra-id-fundamentals',
          title: 'Microsoft Entra ID (Azure AD): Identity Fundamentals',
          summary:
            "Microsoft Entra ID (formerly Azure Active Directory) is Azure's cloud identity provider — it is the single most-tested basic Azure identity topic, and nearly every other security concept in Azure builds on it.",
          keyPoints: [
            'Entra ID is a separate product from "Azure RBAC" — Entra ID answers **who you are** (authentication, users, groups, apps), Azure RBAC answers **what you can do on which resource** (authorization).',
            'A **tenant** is a dedicated, isolated instance of Entra ID representing one organization; a single tenant can be associated with multiple Azure subscriptions.',
            'Core object types: **users**, **groups** (for assigning access to many users at once), **service principals** (the identity an application uses), and **managed identities** (an auto-managed service principal tied to an Azure resource, eliminating stored credentials).',
            'Entra ID supports modern protocols (OAuth 2.0, OpenID Connect, SAML) plus enterprise features like Conditional Access, Multi-Factor Authentication (MFA), and Single Sign-On (SSO) across thousands of pre-integrated SaaS apps.',
          ],
          blocks: [
            {
              type: 'p',
              text: "Entra ID is Microsoft's cloud-based identity and access management service. It is the identity backbone not just for Azure resource access, but also for Microsoft 365, and for any custom application that integrates with it via OAuth2/OIDC/SAML. A **tenant** is the isolation boundary — think of it as \"one organization's identity directory,\" distinct from any specific Azure subscription (a tenant can back many subscriptions; a subscription trusts exactly one tenant for authentication).",
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Tenant["Entra ID Tenant\\n(contoso.onmicrosoft.com)"]\n  Tenant --> Users["Users"]\n  Tenant --> Groups["Groups"]\n  Tenant --> Apps["App Registrations /\\nService Principals"]\n  Tenant --> MI["Managed Identities\\n(tied to Azure resources)"]\n  Tenant -.trusts.-> Sub1["Subscription A"]\n  Tenant -.trusts.-> Sub2["Subscription B"]\n  Users --> Groups\n  Groups -->|RBAC role assignment| Sub1',
            },
            {
              type: 'heading',
              text: 'Managed Identities: the Modern Answer to "Where Do I Store This Credential?"',
            },
            {
              type: 'p',
              text: 'A recurring problem: an app running in Azure (say, an App Service) needs to call another Azure service (say, Key Vault) — where does it store the credential to authenticate? Historically: a connection string or client secret, often hardcoded or dropped in config, and rotated manually (or never). A **managed identity** solves this by having Azure AD itself issue and automatically rotate a credential tied to the resource\'s identity — no secret to store, ever.',
            },
            {
              type: 'list',
              items: [
                '**System-assigned managed identity** — created and destroyed along with the resource it is attached to (e.g., one App Service); a 1:1 lifecycle.',
                '**User-assigned managed identity** — created as a standalone resource, then attached to one or more other resources; useful when several resources need to share one identity or an identity must outlive any single resource.',
                'Once assigned, the app calls other Azure services using a token acquired automatically via the Azure Instance Metadata Service — no client ID/secret in code or config at all.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'granting a Web App a managed identity and Key Vault access',
              code: `# enable a system-assigned managed identity on an App Service
az webapp identity assign --name my-web-app --resource-group rg-app-a-web

# grant that identity permission to read secrets from a Key Vault
az keyvault set-policy --name my-keyvault \\
  --object-id <principal-id-from-previous-command> \\
  --secret-permissions get list`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: "Entra ID **Free/Premium P1/P2** tiers gate features like Conditional Access and Identity Protection (risk-based sign-in blocking). This licensing distinction shows up often in real enterprise Azure work, even though it rarely appears explicitly in interview questions.",
            },
          ],
        },
        {
          id: 'rbac-vs-entra-identity',
          title: 'Azure RBAC vs Entra ID: Authorization vs Authentication',
          summary:
            "A frequently confused distinction worth stating precisely: Entra ID controls who can prove they are who they say they are, while Azure RBAC controls what an authenticated identity is allowed to do on a specific resource.",
          keyPoints: [
            'Authentication (**AuthN**, handled by Entra ID) proves identity; authorization (**AuthZ**, handled by Azure RBAC) decides what that identity can do, and where.',
            'An Azure RBAC **role assignment** = a security principal (user, group, service principal, managed identity) + a **role definition** (a set of permitted actions) + a **scope** (management group, subscription, resource group, or single resource).',
            'Built-in roles like **Owner**, **Contributor**, and **Reader** apply broadly across resource types; built-in resource-specific roles (e.g., **Storage Blob Data Contributor**) grant narrower, data-plane access.',
            'RBAC is **additive only** — there is no explicit "deny" role assignment in the base model (deny assignments exist, but only via Azure Blueprints/Policy, not as something you author directly).',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Interviewers often ask this precisely because the names sound related but answer different questions. **Entra ID** authenticates: it verifies a username/password (plus MFA), issues a token, and maintains the directory of users/groups/apps. **Azure RBAC** authorizes: given an already-authenticated identity, RBAC decides which management-plane actions (`Microsoft.Compute/virtualMachines/start/action`, etc.) that identity may perform, and at which scope.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant U as User\n  participant Entra as Entra ID\n  participant ARM as Azure Resource Manager\n  U->>Entra: 1. Sign in (username/password + MFA)\n  Entra-->>U: 2. Issue access token ("who you are")\n  U->>ARM: 3. Request: restart VM X (token attached)\n  ARM->>ARM: 4. Check RBAC role assignments\\nat VM X and its parent scopes\n  ARM-->>U: 5. Allow or Deny ("what you can do")',
            },
            {
              type: 'table',
              headers: ['Built-in role', 'Grants'],
              rows: [
                ['Owner', 'Full access, including managing access for others'],
                ['Contributor', 'Full access to manage resources, but cannot grant/change access for others'],
                ['Reader', 'View everything, change nothing'],
                ['User Access Administrator', 'Manage user access to resources, without managing the resources themselves'],
                ['Storage Blob Data Contributor', 'Read/write/delete blob **data** — narrower than Contributor, which only covers the storage account\'s management-plane settings, not the data inside it'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Granting **Contributor** on a storage account does **not** grant access to the blobs/queues/tables inside it by default (unless the account still allows legacy key-based access) — that is **data-plane** access, governed by separate roles like Storage Blob Data Contributor/Reader. Confusing management-plane roles (can I resize/delete the account?) with data-plane roles (can I read the blobs?) is a very common real-world and interview mistake.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'assigning an RBAC role at a specific scope',
              code: `az role assignment create \\
  --assignee "user@contoso.com" \\
  --role "Contributor" \\
  --scope "/subscriptions/<sub-id>/resourceGroups/rg-app-a-web"

az role assignment list --assignee "user@contoso.com" --output table`,
            },
          ],
        },
        {
          id: 'azure-vms',
          title: 'Azure Virtual Machines: Sizing, Availability Sets vs Availability Zones',
          summary:
            'Virtual Machines are the IaaS foundation of Azure compute — full control over the OS, at the cost of being fully responsible for patching, scaling, and high availability yourself.',
          keyPoints: [
            'A VM size (e.g., `Standard_D4s_v5`) determines vCPU count, RAM, temp storage, and max data disks/network throughput — series letters signal purpose (D = general purpose, F = compute-optimized, E = memory-optimized, B = burstable, N = GPU).',
            'An **availability set** groups VMs across fault domains (separate power/network) and update domains (patched at different times) within one datacenter.',
            'An **availability zone** deployment spreads VMs across physically separate datacenters within a region — a strictly stronger guarantee, used instead of (not alongside) availability sets whenever the region supports zones.',
            '**Virtual Machine Scale Sets (VMSS)** manage a group of identical, autoscaling VMs behind a load balancer — the standard way to run a horizontally scalable VM-based tier.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['VM series prefix', 'Optimized for', 'Example use case'],
              rows: [
                ['B', 'Burstable, low baseline CPU with credit-based bursts', 'Dev/test boxes, low-traffic web servers'],
                ['D', 'General purpose, balanced CPU/memory', 'Most application servers'],
                ['E', 'Memory-optimized (high RAM:vCPU ratio)', 'In-memory caches, large databases'],
                ['F', 'Compute-optimized (high vCPU:RAM ratio)', 'Batch processing, gaming servers'],
                ['N', 'GPU-accelerated', 'ML training/inference, rendering'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph AvailSet["Availability Set (one datacenter)"]\n    direction LR\n    subgraph FD0["Fault Domain 0"]\n      VM1["VM 1"]\n    end\n    subgraph FD1["Fault Domain 1"]\n      VM2["VM 2"]\n    end\n  end\n  subgraph AvailZones["Availability Zones (whole region)"]\n    direction LR\n    subgraph Z1["Zone 1"]\n      VM3["VM 3"]\n    end\n    subgraph Z2["Zone 2"]\n      VM4["VM 4"]\n    end\n    subgraph Z3["Zone 3"]\n      VM5["VM 5"]\n    end\n  end',
            },
            {
              type: 'list',
              items: [
                'An availability set protects against rack/power/network failure **inside one datacenter** but nothing if the whole datacenter goes down — availability zones supersede it and should be preferred whenever the region offers zones.',
                '**Virtual Machine Scale Sets (VMSS)** are the standard way to run a horizontally scaled, autoscaling fleet of identical VMs — new instances are created from a shared configuration/image, spread automatically across fault domains or zones, and sit behind a Load Balancer or Application Gateway.',
                'Managed Disks (as opposed to legacy unmanaged disks backed by a storage account you manage yourself) are the default today — Azure handles the underlying storage account placement, and managed disks are required for availability-zone-pinned VMs.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a zone-pinned VM and a scale set',
              code: `az vm create \\
  --resource-group rg-app-a-web \\
  --name web-vm-1 \\
  --image Ubuntu2204 \\
  --size Standard_D2s_v5 \\
  --zone 1 \\
  --admin-username azureuser \\
  --generate-ssh-keys

az vmss create \\
  --resource-group rg-app-a-web \\
  --name web-vmss \\
  --image Ubuntu2204 \\
  --instance-count 3 \\
  --zones 1 2 3 \\
  --vm-sku Standard_D2s_v5 \\
  --upgrade-policy-mode automatic`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For a VM SLA of 99.99%, Azure requires at least two VMs across two or more availability zones. A single VM on premium SSD storage gets 99.9%; two VMs in an availability set (no zones) gets 99.95%. These exact numbers are a common interview detail.',
            },
          ],
        },
        {
          id: 'app-service',
          title: 'Azure App Service: Deployment Slots & Scaling',
          summary:
            'App Service is the flagship PaaS for hosting web apps, REST APIs, and mobile backends — you deploy code (or a container), and Azure handles the OS, runtime patching, load balancing, and scaling.',
          keyPoints: [
            'An **App Service Plan** defines the underlying compute (VM size/tier, e.g., Basic/Standard/Premium) and is billed regardless of how many apps run on it — multiple apps can share one plan.',
            '**Deployment slots** (Standard tier and above) let you deploy to a separate, fully live environment (e.g., "staging") with its own URL, then **swap** it into production with zero downtime.',
            'A slot swap is a warm-up-then-swap operation: Azure warms up the target slot before redirecting traffic, and (unlike a redeploy) it is instantly reversible by swapping back.',
            'App Service supports both manual scaling (fixed instance count) and **autoscale** (rule-based, on metrics like CPU% or queue length, or scheduled) — scaling **out** (more instances) is generally preferred over scaling **up** (bigger instance) for availability.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Prod["Production slot\\n(100% live traffic)"] <-->|swap| Staging["Staging slot\\n(new version, warmed up,\\nown URL for testing)"]\n  Users["Users"] --> Prod',
            },
            {
              type: 'p',
              text: 'The typical safe-deployment pattern: deploy the new version to the **staging** slot, run smoke tests against its dedicated URL while production keeps serving live traffic unaffected, then **swap**. Azure warms up the staging slot\'s app (so the first real users never hit a cold start) before the swap completes, and app settings marked "slot sticky" (e.g., a slot-specific connection string) stay pinned to their slot across swaps rather than following the code.',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'deployment slots and a zero-downtime swap',
              code: `az webapp deployment slot create \\
  --name my-web-app --resource-group rg-app-a-web --slot staging

az webapp deployment source config-zip \\
  --name my-web-app --resource-group rg-app-a-web --slot staging \\
  --src release.zip

# run smoke tests against my-web-app-staging.azurewebsites.net, then:
az webapp deployment slot swap \\
  --name my-web-app --resource-group rg-app-a-web \\
  --slot staging --target-slot production`,
            },
            {
              type: 'heading',
              text: 'Scaling: Up vs Out',
            },
            {
              type: 'list',
              items: [
                '**Scale up/down** — change the App Service Plan\'s pricing tier/VM size (e.g., Standard S1 → Premium P2v3) for more CPU/RAM per instance. Requires a brief reconfiguration; does not add redundancy.',
                '**Scale out/in** — add/remove instances of the *same* size running behind the built-in load balancer. This is what actually improves availability, and what autoscale rules act on.',
                '**Autoscale rules** trigger on metrics (CPU % > 70 for 10 minutes → add 2 instances) or on a schedule (add capacity before a known traffic spike) — always pair scale-out and scale-in rules, or you scale up and never back down.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Forgetting to set a **scale-in** rule alongside a scale-out rule is a common cost mistake — instances added during a spike stay running (and billing) indefinitely if nothing tells Azure when to remove them.',
            },
          ],
        },
        {
          id: 'azure-functions',
          title: 'Azure Functions: Triggers, Bindings & Hosting Plans',
          summary:
            'Azure Functions is the serverless compute service — code runs in response to an event (a trigger), with no server to provision or manage, and (on the Consumption plan) billed only for actual execution time.',
          keyPoints: [
            'A **trigger** is what invokes a function (HTTP request, a message landing in a Queue/Service Bus, a Blob upload, a Timer/cron schedule) — every function has exactly one trigger.',
            '**Bindings** are declarative input/output connections to other services (e.g., automatically write the function\'s return value to a Cosmos DB document) that remove a lot of boilerplate SDK code.',
            'The **Consumption plan** scales to zero and bills per execution/GB-second, but has cold starts and a max execution timeout; the **Premium plan** keeps warm instances (no cold start) and allows longer execution and VNet integration; the **Dedicated (App Service) plan** runs on VMs you already pay for, with no execution time limit.',
            'Durable Functions extend the model with stateful orchestration (fan-out/fan-in, sequential workflows, human-interaction waits) on top of the same underlying trigger/binding model.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  T1["HTTP request"] --> F["Azure Function"]\n  T2["Message in Queue"] --> F\n  T3["Blob uploaded"] --> F\n  T4["Timer (cron schedule)"] --> F\n  F -->|output binding| O1[("Cosmos DB")]\n  F -->|output binding| O2[("Service Bus")]',
            },
            {
              type: 'table',
              headers: ['Plan', 'Scales to zero?', 'Cold start?', 'Max timeout', 'VNet integration'],
              rows: [
                ['Consumption', 'Yes', 'Yes', '~10 min (configurable, default 5)', 'Limited'],
                ['Premium', 'No (min instances) — can scale to zero with newer flex options', 'No', 'Unbounded (default 30 min)', 'Yes'],
                ['Dedicated (App Service Plan)', 'No', 'No', 'Unbounded', 'Yes'],
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'a queue-triggered function with a Cosmos DB output binding (function.json)',
              code: `{
  "bindings": [
    {
      "name": "order",
      "type": "queueTrigger",
      "direction": "in",
      "queueName": "orders-queue",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "outputDocument",
      "type": "cosmosDB",
      "direction": "out",
      "databaseName": "OrdersDb",
      "collectionName": "Orders",
      "connectionStringSetting": "CosmosDBConnection"
    }
  ]
}`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Choosing the Consumption plan for a latency-sensitive, always-busy API is a common mistake — cold starts (the runtime spinning up an instance from zero) add noticeable p99 latency. If traffic is steady and latency-sensitive, the Premium (or Dedicated) plan avoids this at the cost of not scaling fully to zero.",
            },
          ],
        },
        {
          id: 'containers-on-azure',
          title: 'Containers on Azure: ACI vs Container Apps vs AKS',
          summary:
            'Azure offers three distinct ways to run containers, trading operational simplicity for control — picking correctly between them is a genuinely common real-world and interview decision.',
          keyPoints: [
            '**Azure Container Instances (ACI)** — the simplest option: run a single container (or container group) with no orchestrator at all, billed per second; best for short-lived, isolated, or burst workloads.',
            '**Azure Container Apps (ACA)** — a managed **Kubernetes-based** serverless container platform (built on KEDA, Dapr, Envoy under the hood) that hides Kubernetes entirely; supports autoscaling (including to zero), revisions, and traffic splitting without you ever touching a Kubernetes API.',
            '**Azure Kubernetes Service (AKS)** — a fully managed Kubernetes control plane where you still manage node pools, networking, and the full Kubernetes API surface; the right choice when you need Kubernetes itself (existing K8s manifests/operators, fine-grained cluster control, a specific CNCF ecosystem tool).',
            'The decision axis is almost always **how much Kubernetes do you actually need to touch** — ACI for a single job, Container Apps for microservices without cluster ops overhead, AKS when Kubernetes-native control is a real requirement.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Q{"What do you need?"}\n  Q -->|"Run one container,\\nno orchestration,\\nshort-lived/batch"| ACI["Azure Container Instances"]\n  Q -->|"Microservices,\\nautoscale-to-zero,\\nno cluster ops"| ACA["Azure Container Apps"]\n  Q -->|"Need Kubernetes itself:\\nCRDs, operators, Helm,\\nfull API control"| AKS["Azure Kubernetes Service"]',
            },
            {
              type: 'table',
              headers: ['', 'ACI', 'Container Apps', 'AKS'],
              rows: [
                ['Orchestration exposed to you', 'None', 'Hidden (Kubernetes under the hood)', 'Full Kubernetes API'],
                ['Scale to zero', 'N/A (you start/stop)', 'Yes', 'No (nodes always run; KEDA can scale pods to zero, not nodes without extra config)'],
                ['Operational overhead', 'Minimal', 'Low', 'Highest — you own node pools, upgrades, networking'],
                ['Best fit', 'Batch jobs, CI agents, burst tasks', 'Microservices, event-driven APIs', 'Complex multi-team platforms, existing K8s workloads'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'the three, side by side',
              code: `# ACI: run one container, pay per second
az container create --resource-group rg-app-a-web --name quick-job \\
  --image myregistry.azurecr.io/report-generator:latest --cpu 1 --memory 1

# Container Apps: deploy a scale-to-zero microservice, no cluster to manage
az containerapp create --name orders-api --resource-group rg-app-a-web \\
  --image myregistry.azurecr.io/orders-api:latest \\
  --min-replicas 0 --max-replicas 10 --target-port 8080 --ingress external

# AKS: provision a real Kubernetes cluster you administer
az aks create --resource-group rg-app-a-web --name my-cluster \\
  --node-count 3 --enable-managed-identity --generate-ssh-keys`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A strong interview answer names the actual differentiator: it is not "which is more powerful" (AKS always wins on raw power) but "how much orchestration surface area do you want to own." Defaulting to AKS for a handful of simple microservices is over-engineering; Container Apps exists specifically to fill that gap.',
            },
          ],
        },
        {
          id: 'azure-storage-fundamentals',
          title: 'Azure Storage: Blob, Table, Queue, File & Redundancy Options',
          summary:
            'A Storage Account is a shared namespace for four distinct data services — object storage, NoSQL key-value tables, messaging queues, and managed file shares — each with its own redundancy and access tier choices.',
          keyPoints: [
            '**Blob storage** — object storage for unstructured data (images, backups, logs, data lake files), with **Hot/Cool/Cold/Archive** access tiers trading storage cost against retrieval cost/latency.',
            '**Table storage** — a schemaless NoSQL key-value store (partition key + row key), cheap and fast for simple lookups; largely superseded by Cosmos DB\'s Table API for new work needing global distribution.',
            '**Queue storage** — simple, cheap message queuing (distinct from Service Bus, which adds sessions, dead-lettering, and transactions).',
            '**File storage** — fully managed SMB/NFS file shares, mountable from on-prem or cloud VMs — the lift-and-shift answer for apps that expect a traditional file share.',
          ],
          blocks: [
            {
              type: 'heading',
              text: 'Redundancy Options',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph LRS["LRS — 3 copies, 1 datacenter"]\n    L1["Copy 1"] ~~~ L2["Copy 2"] ~~~ L3["Copy 3"]\n  end\n  subgraph ZRS["ZRS — 3 copies, 3 zones, 1 region"]\n    direction LR\n    Z1["Zone 1"] ~~~ Z2["Zone 2"] ~~~ Z3["Zone 3"]\n  end\n  subgraph GRS["GRS — LRS in primary region + async copy in paired region"]\n    direction LR\n    G1["Primary region\\n(3 copies, LRS)"] -.async replication.-> G2["Paired region\\n(3 copies, LRS)"]\n  end',
            },
            {
              type: 'table',
              headers: ['Option', 'Copies', 'Protects against', 'Notes'],
              rows: [
                ['LRS (Locally Redundant Storage)', '3, one datacenter', 'Disk/node failure', 'Cheapest; no protection if the datacenter is lost'],
                ['ZRS (Zone Redundant Storage)', '3, across availability zones', 'Datacenter/zone failure', 'Data stays in-region; higher cost than LRS'],
                ['GRS (Geo Redundant Storage)', '6 total (3 LRS + 3 LRS in paired region)', 'Region-wide disaster', 'Secondary copy is not readable unless you fail over (or use RA-GRS)'],
                ['RA-GRS (Read-Access GRS)', '6 total', 'Region-wide disaster + read availability', 'Adds a read-only endpoint against the secondary region at all times'],
                ['GZRS / RA-GZRS', '6 total, primary is zone-redundant', 'Zone failure **and** region disaster', 'The strongest (and most expensive) option'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a storage account with GRS and a blob lifecycle policy toward Archive',
              code: `az storage account create \\
  --name mystorageacct001 --resource-group rg-app-a-data \\
  --sku Standard_GRS --kind StorageV2 --access-tier Hot

# lifecycle policies auto-transition/expire blobs by age — Hot -> Cool -> Archive -> delete
az storage account management-policy create \\
  --account-name mystorageacct001 --resource-group rg-app-a-data \\
  --policy @lifecycle-policy.json`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Archive tier data cannot be read directly — it must first be **rehydrated** (which can take hours), and there is an early-deletion penalty if you delete/move a blob before its minimum retention period. Archive is for data you almost never need and can tolerate a multi-hour wait for, not a cheaper Cool tier.",
            },
          ],
        },
        {
          id: 'azure-sql-database',
          title: 'Azure SQL Database: DTU vs vCore & Elastic Pools',
          summary:
            'Azure SQL Database is a fully managed PaaS relational database (the SQL Server engine, without you managing the OS, patching, or backups) with two different purchasing models and a pooling option for many variably-loaded databases.',
          keyPoints: [
            'The **DTU (Database Transaction Unit)** model bundles CPU/memory/IO into simple tiers (Basic/Standard/Premium) — simpler to reason about, less granular control.',
            'The **vCore** model lets you choose compute and storage independently, choose Provisioned or Serverless compute, and apply Azure Hybrid Benefit (existing SQL Server licenses) for savings — the model Microsoft recommends for new deployments.',
            '**Elastic pools** share a set compute/storage budget across many databases with unpredictable, non-simultaneous peak usage (e.g., one database per tenant in a SaaS app) — far cheaper than provisioning each database for its own peak.',
            'Built-in **automatic backups**, **point-in-time restore**, and (for Business Critical/Premium tiers) **always-on high availability with automatic failover** are included without any manual configuration.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Pool["Elastic Pool (shared eDTU/vCore budget)"]\n    direction LR\n    DBA["Tenant A DB\\n(busy 9am-11am)"]\n    DBB["Tenant B DB\\n(busy 2pm-4pm)"]\n    DBC["Tenant C DB\\n(rarely busy)"]\n  end\n  Pool -.->|shares capacity, so total\\nprovisioned < sum of peaks| Capacity[("Fixed pool compute/storage")]',
            },
            {
              type: 'table',
              headers: ['Model', 'Unit', 'Best for'],
              rows: [
                ['DTU', 'Bundled Basic/Standard/Premium tiers', 'Simple workloads, quick provisioning, less tuning'],
                ['vCore — Provisioned', 'Explicit vCores + storage GB, billed whether idle or busy', 'Steady, predictable workloads; Hybrid Benefit eligible'],
                ['vCore — Serverless', 'Auto-scales vCores within min/max, auto-pauses when idle', 'Intermittent/unpredictable workloads (e.g., dev/test)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: "**Azure Hybrid Benefit** for SQL lets an organization apply SQL Server licenses it already owns (with Software Assurance) toward the vCore compute cost — a substantial saving specific to the vCore model, and a real reason enterprises pick vCore over DTU even when DTU would otherwise suffice.",
            },
            {
              type: 'code',
              language: 'bash',
              title: 'provisioning a vCore database and an elastic pool',
              code: `az sql server create --name sql-app-a --resource-group rg-app-a-data \\
  --admin-user sqladmin --admin-password "<strong-password>"

az sql db create --resource-group rg-app-a-data --server sql-app-a \\
  --name orders-db --edition GeneralPurpose --family Gen5 --capacity 2

az sql elastic-pool create --resource-group rg-app-a-data --server sql-app-a \\
  --name tenants-pool --edition GeneralPurpose --capacity 8`,
            },
          ],
        },
        {
          id: 'cosmos-db-fundamentals',
          title: 'Cosmos DB: Consistency Levels & Partitioning',
          summary:
            "Cosmos DB is Azure's globally distributed, multi-model NoSQL database — its defining, genuinely distinctive feature is a five-point tunable consistency spectrum, not just the usual strong-vs-eventual binary choice.",
          keyPoints: [
            'Cosmos DB offers **five** consistency levels, not the usual two: Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual — a spectrum trading consistency for latency/availability/throughput.',
            '**Session** consistency (the default) guarantees a single client always sees its own writes ("read-your-writes") without paying the full latency/throughput cost of Strong — the level most applications should start with.',
            'Every item requires a **partition key**; Cosmos DB distributes data (and request-unit throughput) across physical partitions by hashing that key, so a well-chosen key is central to both performance and cost.',
            'Multi-region writes ("multi-master") are only meaningful in combination with a consistency level — Strong consistency is not available with multi-region writes, since it would require synchronous cross-region coordination on every write.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Strong["Strong\\n(linearizable,\\nhighest latency)"] --- BS["Bounded\\nStaleness"] --- Session["Session\\n(default —\\nread-your-own-writes)"] --- CP["Consistent\\nPrefix"] --- Eventual["Eventual\\n(lowest latency,\\nno ordering guarantee)"]',
            },
            {
              type: 'table',
              headers: ['Level', 'Guarantee', 'Typical use'],
              rows: [
                ['Strong', 'Every read sees the most recent committed write, globally', 'Financial ledgers, inventory counts needing exact accuracy'],
                ['Bounded Staleness', 'Reads lag writes by at most K versions or T time', 'Leaderboards, near-real-time dashboards'],
                ['Session (default)', 'Within one client session, always read your own writes', 'The large majority of application code'],
                ['Consistent Prefix', 'Reads never see out-of-order writes (but can be stale)', 'Order-sensitive event feeds'],
                ['Eventual', 'No ordering guarantee at all; eventually consistent', 'Like counts, view counts — pure eventual-OK metrics'],
              ],
            },
            {
              type: 'heading',
              text: 'Partitioning: Why the Partition Key Choice Matters So Much',
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Container[("Cosmos DB Container")] --> PK{"Partition key:\\nhash(tenantId)"}\n  PK --> P1["Physical Partition 1\\n(tenants A, D, G...)"]\n  PK --> P2["Physical Partition 2\\n(tenants B, E, H...)"]\n  PK --> P3["Physical Partition 3\\n(tenants C, F, I...)"]',
            },
            {
              type: 'list',
              items: [
                'A **logical partition** is all items sharing one partition-key value; Cosmos DB co-locates a logical partition\'s data and enforces a size limit per logical partition (20 GB).',
                'A **physical partition** holds many logical partitions and owns a slice of the container\'s total provisioned throughput (RU/s) — a skewed partition key (e.g., a `status` field with only 3 values) creates a **hot partition** that throttles long before the container\'s total RU/s budget is exhausted.',
                'A good partition key has high cardinality and spreads both storage and request volume evenly — `tenantId` or `userId` are common good choices; a low-cardinality field like `country` or `orderStatus` usually is not.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'provisioning a container with a well-chosen partition key',
              code: `az cosmosdb create --name cosmos-app-a --resource-group rg-app-a-data \\
  --default-consistency-level Session --locations regionName=eastus failoverPriority=0

az cosmosdb sql database create --account-name cosmos-app-a \\
  --resource-group rg-app-a-data --name OrdersDb

# GOOD: high-cardinality key, spreads both storage and RU/s evenly
az cosmosdb sql container create --account-name cosmos-app-a \\
  --resource-group rg-app-a-data --database-name OrdersDb \\
  --name Orders --partition-key-path /tenantId --throughput 400

# BAD (don't do this): "/orderStatus" has only a handful of distinct values --
# nearly all "pending" orders would hash to the same physical partition and
# throttle with HTTP 429, no matter how much RU/s the container has overall`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Choosing a low-cardinality partition key is the single most common Cosmos DB design mistake — it creates a hot physical partition that gets throttled (HTTP 429 "Request rate too large") long before the container\'s aggregate throughput is actually used up, since RU/s is allocated per physical partition, not shared freely across all of them.',
            },
          ],
        },
        {
          id: 'virtual-network-fundamentals',
          title: 'Virtual Network (VNet) Fundamentals: Subnets, NSGs & Peering',
          summary:
            'A Virtual Network is an isolated, private network in Azure — the foundation every other networking concept (load balancers, private endpoints, hybrid connectivity) builds on top of.',
          keyPoints: [
            'A **VNet** is a private IP address space (CIDR block, e.g., `10.0.0.0/16`) scoped to one region; **subnets** divide it into smaller ranges, and resources (VMs, App Service via VNet integration, etc.) get a private IP from a subnet.',
            'A **Network Security Group (NSG)** is a stateful, priority-ordered allow/deny rule list applied at the subnet or NIC level — the basic firewall of Azure networking.',
            '**VNet peering** privately connects two VNets (even across regions with global peering) at the network fabric level — traffic never traverses the public internet, and by default it is non-transitive (peering A↔B and B↔C does not let A reach C).',
            'Special subnets exist for specific services — e.g., **AzureFirewallSubnet**, **GatewaySubnet** for VPN/ExpressRoute gateways — with naming and sizing requirements Azure enforces.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph VNet1["VNet: 10.0.0.0/16 (East US)"]\n    Subnet1["Subnet: web\\n10.0.1.0/24"]\n    Subnet2["Subnet: app\\n10.0.2.0/24"]\n    Subnet3["Subnet: data\\n10.0.3.0/24"]\n    NSG1["NSG: allow 443 in\\ndeny all else"] -.-> Subnet1\n    NSG2["NSG: allow from\\nweb subnet only"] -.-> Subnet2\n  end\n  subgraph VNet2["VNet: 10.1.0.0/16 (West US)"]\n    Subnet4["Subnet: shared-services\\n10.1.1.0/24"]\n  end\n  VNet1 <-.->|"VNet Peering\\n(private, non-transitive)"| VNet2\n  Internet(("Internet")) -->|HTTPS| Subnet1',
            },
            {
              type: 'list',
              items: [
                'NSG rules are evaluated by **priority number** (lower = evaluated first), and the first matching rule wins — a common mistake is placing a broad allow rule at a lower priority number than the specific deny rule that was meant to take precedence.',
                'NSGs are **stateful**: an inbound rule allowing traffic in automatically allows the corresponding return traffic out, without needing a matching outbound rule.',
                'A subnet can be **delegated** to a specific PaaS service (e.g., delegating a subnet to `Microsoft.Web/serverFarms` for App Service VNet integration), which lets that service inject itself into your private network.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a VNet, subnets, and an NSG rule',
              code: `az network vnet create --resource-group rg-app-a-web --name vnet-app-a \\
  --address-prefix 10.0.0.0/16 \\
  --subnet-name web --subnet-prefix 10.0.1.0/24

az network vnet subnet create --resource-group rg-app-a-web \\
  --vnet-name vnet-app-a --name app --address-prefix 10.0.2.0/24

az network nsg create --resource-group rg-app-a-web --name nsg-web

az network nsg rule create --resource-group rg-app-a-web --nsg-name nsg-web \\
  --name allow-https --priority 100 --direction Inbound --access Allow \\
  --protocol Tcp --destination-port-ranges 443`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'VNet peering is non-transitive by default: if VNet A peers with VNet B, and VNet B peers with VNet C, A cannot reach C through B unless you explicitly add A↔C peering (or route through a hub with **Use Remote Gateways** / a hub-and-spoke topology using a central firewall/NVA as the transit point).',
            },
          ],
        },
        {
          id: 'load-balancing-comparison',
          title: 'Load Balancer vs Application Gateway vs Front Door',
          summary:
            'Three different Azure load-balancing services are commonly confused because they all "distribute traffic" — but they operate at different network layers and different geographic scopes, which is exactly what determines the right choice.',
          keyPoints: [
            '**Azure Load Balancer** — Layer 4 (TCP/UDP), regional, distributes traffic across VMs/VMSS instances within a region based on IP/port; no awareness of HTTP content.',
            '**Application Gateway** — Layer 7 (HTTP/HTTPS), regional, understands URL paths/headers for routing, and includes a built-in **Web Application Firewall (WAF)**; the choice when you need path-based routing or SSL offload within one region.',
            '**Azure Front Door** — Layer 7, **global**, a CDN-integrated entry point that routes to the closest/healthiest backend across multiple regions, with global WAF and caching at the edge.',
            'A common production pattern layers them: **Front Door** (global entry, edge caching, WAF) → **Application Gateway** (regional Layer-7 routing, WAF) → **Load Balancer** (regional Layer-4 distribution to VM instances).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Azure Load Balancer', 'Application Gateway', 'Front Door'],
              rows: [
                ['OSI Layer', 'Layer 4 (TCP/UDP)', 'Layer 7 (HTTP/HTTPS)', 'Layer 7 (HTTP/HTTPS)'],
                ['Scope', 'Regional', 'Regional', 'Global'],
                ['Routing basis', 'IP + port', 'URL path, host header, headers', 'Latency/priority/weighted, global backend health'],
                ['WAF built in', 'No', 'Yes (optional SKU)', 'Yes (optional)'],
                ['Typical use', 'Distribute traffic to VMs/VMSS in one region', 'Path-based routing + WAF for one region\'s web tier', 'Global entry point, multi-region failover, edge caching'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Users(("Global Users")) --> FD["Azure Front Door\\n(global, L7, edge cache + WAF)"]\n  FD --> AGW1["Application Gateway\\n(East US, L7, WAF)"]\n  FD --> AGW2["Application Gateway\\n(West Europe, L7, WAF)"]\n  AGW1 --> LB1["Load Balancer\\n(East US, L4)"]\n  AGW2 --> LB2["Load Balancer\\n(West Europe, L4)"]\n  LB1 --> VM1["VM instances"]\n  LB2 --> VM2["VM instances"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using a plain Load Balancer when the actual requirement is "route `/api/*` to one backend pool and `/images/*` to another" will not work — Layer 4 has no visibility into the URL path at all. That is specifically an Application Gateway (or Front Door) capability, since it requires Layer-7 inspection.',
            },
          ],
        },
        {
          id: 'dns-cdn',
          title: 'Azure DNS & Content Delivery Network (CDN)',
          summary:
            'Azure DNS hosts and resolves domain names on Azure\'s global anycast network, while Azure CDN (and Front Door) caches content at edge locations close to users to cut latency and origin load.',
          keyPoints: [
            'Azure DNS hosts your domain\'s DNS zone on Microsoft\'s global anycast name server network — fast resolution worldwide, and integrates with Azure RBAC/ARM like any other resource.',
            'An **alias record** in Azure DNS can point directly at an Azure resource (a Public IP, Front Door, Traffic Manager) and automatically updates if that resource\'s underlying IP changes — a plain CNAME cannot do this at the zone apex.',
            'A CDN caches static/cacheable content at edge Points of Presence (PoPs) near end users, reducing latency and origin load; cache behavior is controlled via cache-control headers and CDN rules.',
            'Azure offers CDN through partnered providers (and Front Door increasingly consolidates CDN + global load balancing + WAF into one product) — for new designs, Front Door\'s standard/premium tiers are generally the recommended path over the older standalone CDN product.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant User\n  participant DNS as Azure DNS\n  participant Edge as CDN Edge PoP (nearest to user)\n  participant Origin as Origin (App Service / Storage)\n  User->>DNS: Resolve www.contoso.com\n  DNS-->>User: CDN edge IP\n  User->>Edge: GET /logo.png\n  alt cached at edge\n    Edge-->>User: 200 (served from cache, fast)\n  else cache miss\n    Edge->>Origin: GET /logo.png\n    Origin-->>Edge: 200 + Cache-Control headers\n    Edge-->>User: 200 (cached for next time)\n  end',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a DNS zone and an alias record pointing at a Public IP',
              code: `az network dns zone create --resource-group rg-app-a-web --name contoso.com

az network dns record-set a create --resource-group rg-app-a-web \\
  --zone-name contoso.com --name "@" --target-resource "<public-ip-resource-id>"
  # alias records auto-track the target resource's IP if it ever changes`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: "A CNAME record cannot legally be used at a zone's apex/root (`contoso.com` itself, as opposed to `www.contoso.com`) per the DNS spec. Azure DNS **alias records** exist specifically to work around this for Azure resources, letting the root domain point at, say, a Front Door endpoint.",
            },
          ],
        },
        {
          id: 'well-architected-framework',
          title: 'The Azure Well-Architected Framework: Five Pillars',
          summary:
            "Microsoft's structured checklist for evaluating any architecture across five dimensions — the framework interviewers expect you to reach for when asked to critique or design a system, not just list Azure services.",
          keyPoints: [
            '**Reliability** — the system recovers from failures and continues functioning (redundancy, health checks, tested failover, chaos/fault injection).',
            '**Security** — protect applications and data via defense in depth, least privilege, and the assumption of breach (Zero Trust).',
            '**Cost Optimization** — deliver business value at the lowest reasonable cost, avoiding both overprovisioning and under-provisioning that causes reliability problems.',
            '**Operational Excellence** — keep the system running in production reliably through good DevOps practices: observability, automation, safe deployment.',
            '**Performance Efficiency** — the system scales to meet demand efficiently, without over- or under-provisioning, via right-sizing and load testing.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  WAF["Well-Architected\\nFramework"] --> R["Reliability"]\n  WAF --> S["Security"]\n  WAF --> C["Cost Optimization"]\n  WAF --> O["Operational Excellence"]\n  WAF --> P["Performance Efficiency"]\n  R --- R1["Redundancy, tested failover,\\nhealth probes"]\n  S --- S1["Least privilege,\\ndefense in depth, Zero Trust"]\n  C --- C1["Right-sizing, reservations,\\neliminate waste"]\n  O --- O1["IaC, CI/CD, monitoring,\\npostmortems"]\n  P --- P1["Load testing, caching,\\nautoscaling, right-sizing"]',
            },
            {
              type: 'p',
              text: 'The pillars deliberately conflict with each other, which is the point: maximizing Reliability alone (every component triple-redundant across three regions) directly fights Cost Optimization; maximizing Performance alone (biggest possible SKUs everywhere) fights Cost too. A senior answer explicitly names the tradeoff being made and why, rather than pretending one pillar can be maximized in isolation.',
            },
            {
              type: 'list',
              items: [
                'The **Azure Well-Architected Review** is a free, structured self-assessment (a questionnaire tool) that scores an existing or planned architecture against all five pillars and flags gaps.',
                'This framework is the natural structure for answering "how would you improve this design?" interview questions — walk each pillar in turn rather than free-associating improvements.',
                'Azure Advisor (a built-in Portal feature) generates automated recommendations mapped to these same five pillars based on your actual deployed resources.',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'When asked to critique an architecture in an interview, explicitly working through Reliability → Security → Cost → Operations → Performance (even briefly for each) reads as far more senior than an unstructured list of "things I would improve."',
            },
          ],
        },
        {
          id: 'high-availability-design',
          title: 'Designing for High Availability: Zones, Traffic Manager & Geo-Redundancy',
          summary:
            'Combining availability zones (intra-region), Traffic Manager or Front Door (inter-region), and geo-redundant data services is how a real production architecture survives everything from a single VM crash to a full region outage.',
          keyPoints: [
            'HA design is layered by blast radius: **within a datacenter** (multiple instances), **within a region** (availability zones), and **across regions** (active-active or active-passive with automated/manual failover).',
            '**Azure Traffic Manager** is DNS-based global traffic routing (no data path — it just returns different IPs based on routing method) with methods like Priority (active-passive failover), Weighted, Performance, and Geographic.',
            'Active-passive (a warm/cold standby region) trades cost for simplicity; active-active (both regions serving live traffic) is more expensive and complex but has near-zero failover time and no wasted capacity.',
            'Recovery Time Objective (**RTO** — how long can it be down) and Recovery Point Objective (**RPO** — how much data can be lost) are the two numbers that should drive every one of these decisions, not a default "make it as available as possible."',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  DNS["Azure Traffic Manager\\n(DNS-based, Priority routing)"] -->|healthy: 100% traffic| Primary["Region: East US\\n(active)"]\n  DNS -.->|failover only\\nif primary unhealthy| Secondary["Region: West US\\n(passive standby)"]\n  Primary --> PrimaryDB[("Primary DB\\nread/write")]\n  PrimaryDB -.async geo-replication.-> SecondaryDB[("Secondary DB\\nread-only replica")]\n  Secondary -.-> SecondaryDB',
            },
            {
              type: 'table',
              headers: ['Pattern', 'RTO', 'RPO', 'Cost', 'Complexity'],
              rows: [
                ['Single region, multi-zone', 'Low (seconds-minutes, automatic)', 'Near zero', 'Low', 'Low'],
                ['Active-passive (cold standby)', 'Hours (provisioning on failover)', 'Depends on last backup', 'Lowest DR cost', 'Medium'],
                ['Active-passive (warm/pilot light)', 'Minutes (already provisioned, scaled down)', 'Minutes (continuous replication)', 'Medium', 'Medium'],
                ['Active-active (multi-region)', 'Near zero (already serving traffic)', 'Near zero to zero (sync or near-sync)', 'Highest', 'High (data conflict resolution)'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Traffic Manager is pure DNS — it never sees or proxies actual traffic, it just answers DNS queries with the IP of a healthy endpoint. That means failover speed is bounded by DNS TTL and client-side caching, which is why Front Door (an actual proxy at the edge) fails over faster and is generally preferred for HTTP(S) workloads today; Traffic Manager remains useful for non-HTTP protocols Front Door cannot proxy.',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Designing an elaborate multi-region active-active architecture without first agreeing on RTO/RPO targets with the business is a classic over-engineering trap — the cost and complexity are only justified if the actual business impact of downtime demands it. Always start from the RTO/RPO number, not from \"more redundancy is always better.\"",
            },
          ],
        },
        {
          id: 'bicep-arm-iac',
          title: 'Infrastructure as Code: Bicep & ARM Templates',
          summary:
            'Bicep is a domain-specific language that compiles down to ARM JSON templates, giving Azure infrastructure the same version control, review, and repeatability benefits as application code.',
          keyPoints: [
            'Bicep is a thin, readable DSL over ARM — every Bicep file compiles deterministically to the equivalent ARM JSON template; there is no functionality Bicep has that ARM JSON lacks, only far less boilerplate.',
            'Modules let you compose reusable, parameterized Bicep files (e.g., a "standard storage account" module) the way functions compose code.',
            'Deployments are typically idempotent and support a **what-if** preview to see exactly what would change before applying — critical for safe CI/CD pipelines.',
            'Terraform is a common alternative (multi-cloud, larger ecosystem, explicit state file); Bicep has no state file of its own — ARM itself tracks the deployed state per resource group.',
          ],
          blocks: [
            {
              type: 'code',
              language: 'text',
              title: 'a minimal Bicep template: storage account + App Service',
              code: `param location string = resourceGroup().location
param appName string
param storageSkuName string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '\${appName}storage'
  location: location
  sku: { name: storageSkuName }
  kind: 'StorageV2'
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '\${appName}-plan'
  location: location
  sku: { name: 'B1', tier: 'Basic' }
}

resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        { name: 'STORAGE_CONNECTION', value: storageAccount.listKeys().keys[0].value }
      ]
    }
  }
}

output webAppUrl string = 'https://\${webApp.properties.defaultHostName}'`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Bicep["main.bicep\\n(human-authored, concise)"] -->|az bicep build| ARMJson["ARM JSON template\\n(what actually gets submitted)"]\n  ARMJson --> Deploy["az deployment group create"]\n  Deploy --> ARM["Azure Resource Manager"]\n  ARM --> Resources["Actual Azure resources"]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'deploying and previewing a Bicep template',
              code: `az deployment group what-if \\
  --resource-group rg-app-a-web --template-file main.bicep \\
  --parameters appName=myapp001

az deployment group create \\
  --resource-group rg-app-a-web --template-file main.bicep \\
  --parameters appName=myapp001`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Notice `storageAccount.listKeys().keys[0].value` referenced directly inside `webApp` — Bicep automatically infers the dependency (the storage account must be created first) from that reference, without an explicit `dependsOn`. Explicit `dependsOn` is only needed when there is no direct symbolic reference between two resources.',
            },
          ],
        },
        {
          id: 'cost-management',
          title: 'Cost Management: Reservations, Hybrid Benefit & Cost Governance',
          summary:
            'Azure billing is consumption-based by default, which is powerful but easy to lose control of — a set of specific tools and pricing models exist to bring predictability and meaningful savings to that spend.',
          keyPoints: [
            '**Azure Cost Management + Billing** provides cost analysis, budgets with alerts, and exportable cost data, scoped at any level of the resource hierarchy (management group, subscription, resource group).',
            '**Reserved Instances (Reservations)** commit to 1 or 3 years of usage for a specific resource type/region in exchange for up to ~72% savings versus pay-as-you-go — the right lever for steady-state, predictable baseline capacity.',
            '**Azure Hybrid Benefit** lets you apply existing on-premises Windows Server/SQL Server licenses (with Software Assurance) toward Azure compute, since you already own the license.',
            '**Azure Spot VMs** offer deep discounts (up to ~90%) on unused Azure capacity, at the cost that Azure can evict the VM with short notice — appropriate only for interruptible/fault-tolerant workloads (batch jobs, stateless workers, CI runners).',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Lever', 'Savings', 'Commitment / risk', 'Best for'],
              rows: [
                ['Pay-as-you-go', 'Baseline (no discount)', 'None', 'Unpredictable, short-lived, or new workloads'],
                ['Reserved Instances (1–3 yr)', 'Up to ~72%', 'Locked-in term commitment', 'Steady-state baseline capacity you are confident about'],
                ['Azure Hybrid Benefit', 'Up to ~85% combined with Reservations', 'Requires existing eligible on-prem licenses', 'Enterprises with Software Assurance-covered Windows/SQL licenses'],
                ['Azure Spot VMs', 'Up to ~90%', 'Can be evicted with ~30s notice', 'Batch/interruptible workloads, dev/test'],
                ['Savings Plans for compute', 'Up to ~65%', 'Hourly $ commitment, flexible across VM families/regions', 'Steady spend where the exact SKU may change over time'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Spend["Total compute spend"] --> Base["Reserved baseline\\n(steady, known load)"]\n  Spend --> Elastic["Pay-as-you-go\\n(variable, unpredictable spikes)"]\n  Spend --> SpotWork["Spot VMs\\n(interruption-tolerant batch work)"]',
            },
            {
              type: 'list',
              items: [
                '**Budgets and alerts** in Cost Management notify (or, via automation, act) when spend crosses a threshold — a basic guardrail every subscription should have.',
                '**Azure Advisor** cost recommendations flag idle/underutilized resources (e.g., a VM at 2% average CPU) directly from telemetry, a fast first pass at savings.',
                'Tagging resources consistently (e.g., `costCenter`, `environment`, `owner`) is what makes cost analysis actually actionable at scale — without it, cost data is a single undifferentiated total.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'a budget with an alert at 80% of the monthly threshold',
              code: `az consumption budget create --budget-name monthly-app-a-budget \\
  --amount 5000 --time-grain Monthly \\
  --start-date 2026-01-01 --end-date 2026-12-31 \\
  --category cost --scope "/subscriptions/<sub-id>/resourceGroups/rg-app-a-web" \\
  --notifications '{
    "Alert80Pct": {
      "enabled": true,
      "operator": "GreaterThan",
      "threshold": 80,
      "contactEmails": ["team-lead@contoso.com"]
    }
  }'`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Buying a 3-year Reservation for a workload whose future is genuinely uncertain locks in cost even if that workload is decommissioned early (reservation exchanges/cancellations exist but have restrictions and fees). Reserve capacity you are confident is steady-state; leave genuinely uncertain or fast-changing workloads on pay-as-you-go or Savings Plans instead.',
            },
          ],
        },
        {
          id: 'key-vault',
          title: 'Azure Key Vault: Secrets, Keys & Certificates',
          summary:
            'Key Vault is the managed, centralized store for the three kinds of sensitive material every application eventually needs — secrets, encryption keys, and certificates — with fine-grained access control and full audit logging.',
          keyPoints: [
            'Key Vault stores three distinct object types: **secrets** (arbitrary strings — connection strings, API keys), **keys** (cryptographic keys for encrypt/decrypt/sign operations, optionally backed by an HSM), and **certificates** (with automated renewal support).',
            'Access is governed by either the legacy **access policies** model or (recommended) **Azure RBAC** applied directly to the vault, plus network controls (private endpoint, firewall) to restrict which networks can reach it at all.',
            'Applications should authenticate to Key Vault using a **managed identity**, not a stored credential — eliminating the exact "where do I store the secret to fetch my secrets" bootstrapping problem.',
            'Every access to a secret/key/certificate is logged (via diagnostic settings to Log Analytics/Storage) — a critical audit trail for compliance and incident investigation.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  App["App Service\\n(managed identity)"] -->|1. request token\\nfor Key Vault| Entra["Entra ID"]\n  Entra -->|2. token| App\n  App -->|"3. GET secret\\n(token attached)"| KV["Key Vault"]\n  KV -->|4. RBAC check| KV\n  KV -->|5. secret value| App\n  KV -.audit log.-> LA[("Log Analytics")]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a vault, a secret, and referencing it from App Service',
              code: `az keyvault create --name kv-app-a --resource-group rg-app-a-web \\
  --location eastus --enable-rbac-authorization true

az keyvault secret set --vault-name kv-app-a \\
  --name "SqlConnectionString" --value "Server=...;Password=...;"

# reference the secret directly in an App Service app setting — never store it in code
az webapp config appsettings set --name my-web-app --resource-group rg-app-a-web \\
  --settings SqlConnectionString="@Microsoft.KeyVault(SecretUri=https://kv-app-a.vault.azure.net/secrets/SqlConnectionString/)"`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Key Vault References in App Service (the `@Microsoft.KeyVault(...)` syntax above) let application settings resolve secrets at runtime via the app\'s managed identity, so a secret value is never checked into config files, ARM templates, or source control at all.',
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Soft-delete and purge protection should always be enabled on production vaults — without them, a deleted vault or secret can be permanently, unrecoverably gone immediately, whether from a mistake or a malicious actor with sufficient access.',
            },
          ],
        },
        {
          id: 'monitoring-observability',
          title: 'Azure Monitor, Log Analytics & Application Insights',
          summary:
            "Azure's observability stack has three layers that are frequently confused: Azure Monitor is the umbrella platform, Log Analytics is where logs/metrics are queried, and Application Insights is the application-performance-monitoring layer built on top of both.",
          keyPoints: [
            '**Azure Monitor** is the umbrella platform collecting metrics and logs from every Azure resource, plus custom application telemetry — everything else in this topic is a feature or a data plane of Azure Monitor.',
            '**Metrics** are lightweight, numeric, time-series data (CPU%, request count) optimized for near-real-time alerting; **Logs** are structured/unstructured event records queried via **Kusto Query Language (KQL)** in a **Log Analytics workspace**.',
            '**Application Insights** is Azure Monitor\'s APM feature: auto-instruments requests, dependencies, exceptions, and traces, and builds distributed traces across microservices via correlation IDs.',
            '**Alert rules** fire on a metric threshold or a scheduled log query, and route to an **Action Group** (email, SMS, webhook, Azure Function, ITSM, auto-scale trigger) — the mechanism that turns observability into actual operational response.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Resources["Azure resources\\n(VMs, App Service, SQL, ...)"] -->|metrics| Metrics["Azure Monitor Metrics\\n(near-real-time, numeric)"]\n  Resources -->|diagnostic logs| LA["Log Analytics Workspace\\n(KQL queryable)"]\n  App["Application code"] -->|SDK/auto-instrumentation| AI["Application Insights\\n(requests, dependencies,\\nexceptions, traces)"]\n  AI --> LA\n  Metrics --> Alerts["Alert Rules"]\n  LA --> Alerts\n  Alerts --> AG["Action Group:\\nemail / SMS / webhook / Function / autoscale"]',
            },
            {
              type: 'code',
              language: 'text',
              title: 'a KQL query: p95 request latency by endpoint, last 24h',
              code: `requests
| where timestamp > ago(24h)
| summarize p95_duration_ms = percentile(duration, 95) by name
| order by p95_duration_ms desc
| take 10`,
            },
            {
              type: 'list',
              items: [
                '**Distributed tracing**: Application Insights automatically correlates a request across service boundaries (e.g., App Service → Function → SQL) using a shared **operation ID**, letting you see one end-to-end trace instead of separate disconnected logs per service.',
                '**Live Metrics Stream** shows near-instant (1-second latency) telemetry, useful for watching the immediate impact of a deployment.',
                '**Availability tests** (URL ping tests, or multi-step web tests) proactively probe an endpoint from multiple global locations, catching outages independent of real user traffic.',
              ],
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A common point of confusion: **metrics** are cheap, fast, and good for dashboards/alerting thresholds, but cannot answer arbitrary ad-hoc questions. **Logs** (queried via KQL) can answer almost anything but cost more to ingest/store and query with slightly higher latency. Production systems use both — metrics for the "is something wrong right now" alert, logs for the "why" investigation afterward.',
            },
          ],
        },
        {
          id: 'governance-policy-landing-zones',
          title: 'Governance at Scale: Azure Policy, Management Groups & Landing Zones',
          summary:
            'Once an organization has more than a handful of subscriptions, ad-hoc RBAC assignments stop being enough — Azure Policy enforces standards proactively, and a landing zone is the standardized environment every new subscription is born into.',
          keyPoints: [
            '**Azure Policy** evaluates resources against rules (e.g., "no public IP allowed", "only these regions permitted", "storage accounts must require HTTPS") and can **Audit**, **Deny**, **Modify**, or **DeployIfNotExists** — enforcement, not just detection like RBAC access control.',
            'Policies are grouped into **initiatives** (a set of related policies, e.g., a full regulatory-compliance bundle) and assigned at a management group, subscription, or resource group scope, cascading down like RBAC.',
            'A **landing zone** is a pre-provisioned, pre-governed environment (networking, identity, policy, monitoring already wired up) that a new subscription/workload is deployed into — the **Azure Landing Zone** reference architecture is Microsoft\'s standard pattern for this.',
            'Governance and RBAC solve different problems: RBAC controls **who can act**; Policy controls **what is allowed to exist**, regardless of who created it — both are needed for real organizational control.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Root["Tenant Root Management Group"] --> Platform["Management Group: Platform"]\n  Root --> LZ["Management Group: Landing Zones"]\n  Platform --> Identity["Subscription: Identity"]\n  Platform --> Connectivity["Subscription: Connectivity\\n(hub VNet, firewall, DNS)"]\n  Platform --> Mgmt["Subscription: Management\\n(Log Analytics, Automation)"]\n  LZ --> Corp["Management Group: Corp"]\n  LZ --> Online["Management Group: Online"]\n  Corp --> SubA["Subscription: App Team A"]\n  Online --> SubB["Subscription: App Team B"]\n  Platform -.policy + RBAC inherited by.-> LZ',
            },
            {
              type: 'table',
              headers: ['Policy effect', 'What it does'],
              rows: [
                ['Audit', 'Flags non-compliant resources; does not block creation'],
                ['Deny', 'Blocks the create/update request outright at deployment time'],
                ['Append / Modify', 'Adds or changes a property automatically (e.g., force-add a required tag)'],
                ['DeployIfNotExists', 'Automatically deploys a companion resource if missing (e.g., auto-enable diagnostic logging on every new storage account)'],
              ],
            },
            {
              type: 'code',
              language: 'json',
              title: 'a simple Azure Policy definition: deny public IP creation',
              code: `{
  "properties": {
    "displayName": "Deny public IP addresses",
    "policyType": "Custom",
    "mode": "All",
    "policyRule": {
      "if": {
        "field": "type",
        "equals": "Microsoft.Network/publicIPAddresses"
      },
      "then": { "effect": "deny" }
    }
  }
}`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: "A hub-and-spoke **landing zone** design (a central \"platform\" management group for identity/connectivity/management shared services, feeding into \"landing zone\" management groups that individual application teams' subscriptions land into) is the pattern most large enterprises converge on, and is exactly what the Cloud Adoption Framework's Azure Landing Zone reference architecture formalizes.",
            },
          ],
        },
        {
          id: 'case-study-three-tier-app',
          title: 'Case Study: A Three-Tier Web App, End to End',
          summary:
            'Bringing every prior topic together into one coherent, production-grade architecture: a global entry point, a regional web/app tier, and a resilient data tier, governed and observed throughout.',
          keyPoints: [
            'Global edge: **Front Door** (WAF + edge caching + global routing) as the single public entry point across regions.',
            'Web/app tier: **App Service** (with deployment slots) inside a VNet-integrated subnet, scaling out via autoscale rules, calling downstream services using managed identities.',
            'Data tier: **Azure SQL Database** (zone-redundant, geo-replicated) for transactional data, **Cosmos DB** for globally distributed low-latency reads, **Blob Storage** for static assets/uploads, all reached over **private endpoints** rather than public internet.',
            'Cross-cutting: **Entra ID** for user auth, **Key Vault** for secrets, **Azure Monitor/Application Insights** for observability, **Azure Policy** and tagging for governance — none of these are optional extras, they are part of the architecture from day one.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Users(("Users")) --> FD["Azure Front Door\\n(WAF, edge cache, global routing)"]\n  FD --> AGW["Application Gateway\\n(regional, per-region WAF)"]\n  AGW --> AppSvc["App Service\\n(VNet-integrated, autoscale,\\nslots for safe deploys)"]\n  AppSvc -->|managed identity| KV["Key Vault\\n(secrets, connection info)"]\n  AppSvc -->|private endpoint| SQL[("Azure SQL Database\\nzone-redundant + geo-replica")]\n  AppSvc -->|private endpoint| Cosmos[("Cosmos DB\\nmulti-region reads")]\n  AppSvc -->|private endpoint| Blob[("Blob Storage\\nstatic assets, uploads")]\n  Users -->|sign in| Entra["Entra ID"]\n  AppSvc -.telemetry.-> AI["Application Insights"]\n  AI --> LA[("Log Analytics")]\n  Policy["Azure Policy"] -.governs.-> AppSvc\n  Policy -.governs.-> SQL',
            },
            {
              type: 'heading',
              text: 'Request Flow: Front Door → App Service → SQL',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant U as User\n  participant FD as Front Door\n  participant AS as App Service\n  participant KV as Key Vault\n  participant DB as Azure SQL Database\n  U->>FD: HTTPS request\n  FD->>FD: WAF rules, check edge cache\n  FD->>AS: Forward to nearest healthy region\n  AS->>KV: Get connection string (managed identity)\n  KV-->>AS: Secret value\n  AS->>DB: Query (over private endpoint)\n  DB-->>AS: Result set\n  AS-->>FD: Response\n  FD-->>U: Response (cached at edge if cacheable)',
            },
            {
              type: 'table',
              headers: ['Concern', 'How this architecture addresses it'],
              rows: [
                ['Availability', 'Front Door across regions + zone-redundant App Service/SQL within each region'],
                ['Security', 'WAF at the edge, private endpoints (no public data-plane exposure), managed identities (no stored credentials), Entra ID for auth'],
                ['Scalability', 'App Service autoscale, Cosmos DB RU/s scaling, Front Door edge caching absorbing read traffic'],
                ['Cost', 'Reserved capacity for the steady-state SQL/App Service baseline, autoscale for the variable portion, Front Door caching cutting origin load'],
                ['Observability', 'Application Insights distributed tracing end to end, alerts wired to an Action Group'],
                ['Governance', 'Azure Policy enforcing private endpoints/tagging/allowed regions, RBAC scoped per resource group'],
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A strong system-design answer for "design a web app on Azure" walks this exact structure: entry point → compute tier → data tier → cross-cutting concerns (identity, secrets, observability, governance) — and explicitly ties each choice back to a Well-Architected pillar, rather than just naming services.',
            },
          ],
        },
      ],
    },
    {
      id: 'azure-qa',
      label: 'Interview Q&A',
      topics: [
        {
          id: 'qa',
          title: 'Questions & Answers',
          summary: 'Common Azure interview questions, from core fundamentals through architecture and cost, with the reasoning interviewers are actually listening for.',
          qa: [
            {
              question: 'What is the Azure resource hierarchy, and why does it matter for access control and billing?',
              answer:
                "The hierarchy, top to bottom, is: management groups → subscriptions → resource groups → resources. A **subscription** is the billing boundary and the scope for most quotas. A **resource group** is a logical container for resources sharing a lifecycle — typically deployed and deleted together. RBAC role assignments and Azure Policy both flow downward through this hierarchy: a role granted at a management group applies to every subscription, resource group, and resource beneath it, which is why organizing subscriptions correctly (e.g., by environment or business unit) is a governance decision, not just an organizational nicety.",
            },
            {
              question: "What is the difference between Microsoft Entra ID (Azure AD) and Azure RBAC?",
              answer:
                'They answer different questions. Entra ID handles **authentication** — proving who you are (users, groups, service principals, managed identities, MFA, conditional access) and issuing tokens. Azure RBAC handles **authorization** — given an already-authenticated identity, what management-plane actions it is allowed to perform, and at which scope (management group, subscription, resource group, or single resource). An RBAC role assignment is always three things together: a security principal, a role definition, and a scope.',
            },
            {
              question: 'What is a managed identity, and what problem does it solve?',
              answer:
                'A managed identity is an identity automatically created and managed by Entra ID for an Azure resource (e.g., an App Service or a VM), used so that resource can authenticate to other Azure services (like Key Vault or Storage) without any credential ever being stored in code or configuration. It solves the classic "where do I store the secret used to fetch my other secrets" bootstrapping problem — Azure handles issuing and rotating the underlying token entirely. **System-assigned** identities share the lifecycle of the one resource they are attached to; **user-assigned** identities are standalone resources that can be attached to multiple resources or outlive any single one.',
            },
            {
              question: 'Explain the difference between an availability set and availability zones.',
              answer:
                "An availability set spreads VMs across fault domains (separate power/network racks) and update domains (patched at different times) **within a single datacenter** — it protects against a rack-level or single-datacenter maintenance event, but not a whole-datacenter outage. Availability zones spread VMs across **physically separate datacenters within a region**, each with independent power, cooling, and networking — a strictly stronger guarantee. Where a region supports zones, zone-redundant deployment (giving roughly 99.99% VM SLA with instances in 3+ zones) is preferred over availability sets (roughly 99.95%).",
            },
            {
              question: 'When would you choose Azure Container Instances, Azure Container Apps, or AKS?',
              answer:
                "The deciding factor is how much orchestration surface area you actually need to own. **ACI** is for running a single container (or container group) with no orchestrator at all, billed per second — ideal for short-lived batch jobs or burst tasks. **Container Apps** is a managed, Kubernetes-based serverless platform that hides Kubernetes entirely, giving you autoscaling (including to zero), revisions, and traffic splitting — the right default for microservices without wanting to operate a cluster. **AKS** is the choice when you genuinely need Kubernetes itself: existing manifests/operators/CRDs, Helm charts, or fine-grained control over the cluster and its networking. Defaulting to AKS for a handful of simple services is generally over-engineering.",
            },
            {
              question: 'What are the redundancy options for Azure Storage, and what does each protect against?',
              answer:
                'LRS (Locally Redundant Storage) keeps 3 copies within one datacenter, protecting against disk/node failure but not a datacenter outage. ZRS (Zone Redundant Storage) keeps 3 copies across availability zones in one region, protecting against a full datacenter/zone failure while data stays in-region. GRS (Geo Redundant Storage) adds an asynchronously replicated copy (3 more LRS copies) in the paired region for region-wide disaster protection — though that secondary copy is not readable unless you fail over, unless you use RA-GRS, which adds a continuously available read-only endpoint against the secondary region. GZRS/RA-GZRS combine zone redundancy in the primary region with geo-replication for the strongest (and most expensive) protection.',
            },
            {
              question: 'Cosmos DB offers five consistency levels instead of the usual strong-vs-eventual choice. Why, and what is the default?',
              answer:
                'Cosmos DB\'s five levels — Strong, Bounded Staleness, Session, Consistent Prefix, and Eventual — form a spectrum because "strong vs eventual" is too coarse for how applications actually behave: most application code does not need global linearizability, it needs to reliably read its own writes, which is a much cheaper guarantee. **Session** consistency (the default) provides exactly that — a single client always sees its own writes ("read-your-writes") — without paying the latency/throughput cost of full Strong consistency. Strong consistency is also unavailable in combination with multi-region writes, since it would require synchronous cross-region coordination on every write.',
            },
            {
              question: 'Why does the choice of partition key matter so much in Cosmos DB?',
              answer:
                "Cosmos DB distributes both data and provisioned throughput (RU/s) across physical partitions by hashing the partition key. A low-cardinality partition key (e.g., a status field with only 3 possible values) concentrates most reads/writes onto one physical partition, creating a hot partition that gets throttled (HTTP 429) long before the container's aggregate RU/s budget is actually exhausted, since RU/s is allocated per physical partition rather than freely shared. A good partition key (like `tenantId` or `userId`) has high cardinality and spreads both storage and request volume evenly across partitions.",
            },
            {
              question: 'What is the difference between Azure Load Balancer, Application Gateway, and Front Door?',
              answer:
                "They operate at different network layers and different geographic scopes. **Load Balancer** is Layer 4 (TCP/UDP), regional, distributing traffic to VMs/VMSS by IP/port with no visibility into HTTP content. **Application Gateway** is Layer 7 (HTTP/HTTPS), regional, and can route by URL path/host header and includes an optional WAF — the choice for path-based routing within one region. **Front Door** is Layer 7 but **global** — a CDN-integrated edge entry point that routes to the closest/healthiest backend across multiple regions, with global WAF and edge caching. A common production pattern layers all three: Front Door (global) → Application Gateway (regional L7) → Load Balancer (regional L4).",
            },
            {
              question: 'What is the difference between DTU-based and vCore-based Azure SQL Database pricing?',
              answer:
                "DTU bundles compute, memory, and IO into simple tiers (Basic/Standard/Premium) — simpler to provision but less granular. vCore lets you choose compute and storage independently, choose between Provisioned (fixed, billed continuously) or Serverless (auto-scales within a range, auto-pauses when idle) compute, and — critically — is the only model eligible for **Azure Hybrid Benefit**, applying existing on-prem SQL Server licenses toward the Azure compute cost. Microsoft recommends vCore for new deployments, largely for that flexibility and licensing benefit.",
            },
            {
              question: 'What is Azure Front Door\'s relationship to a traditional CDN, and why might Front Door be preferred today?',
              answer:
                "A traditional CDN caches static content at edge PoPs to cut latency and origin load, but is otherwise a fairly narrow product. Front Door combines CDN-style edge caching with global Layer-7 load balancing, health-probe-based failover across regions, and a WAF, in one product — and because it is an actual proxy at the edge (not pure DNS like Traffic Manager), it can fail over far faster, since failover does not depend on DNS TTL expiring and being re-resolved by clients.",
            },
            {
              question: 'How does Azure Traffic Manager differ from Front Door, and when would you still use Traffic Manager?',
              answer:
                "Traffic Manager is pure DNS-based routing — it never proxies actual traffic, it just answers DNS queries with the IP of a healthy endpoint based on a routing method (Priority, Weighted, Performance, Geographic). Because it is DNS-only, failover speed is bounded by DNS TTL and client-side/resolver caching, which is slower than Front Door's edge-proxy failover. Traffic Manager remains useful specifically because it works for any protocol (not just HTTP/S) — Front Door, being an HTTP(S) reverse proxy, cannot front non-HTTP traffic like raw TCP game servers or DNS-level routing for other protocols.",
            },
            {
              question: 'What are the five pillars of the Azure Well-Architected Framework, and why do they matter in an interview setting?',
              answer:
                "Reliability, Security, Cost Optimization, Operational Excellence, and Performance Efficiency. They matter because the pillars deliberately trade off against each other — maximizing Reliability alone (triple redundancy everywhere) directly fights Cost Optimization, and maximizing Performance (biggest SKUs everywhere) does too. A strong answer to \"how would you improve this architecture\" walks through the pillars explicitly and names which tradeoff is being made and why, rather than offering an unstructured list of improvements — that structure alone reads as more senior.",
            },
            {
              question: 'What is the difference between scaling up and scaling out in App Service, and why does it matter for availability?',
              answer:
                "Scaling **up/down** changes the App Service Plan's pricing tier or VM size for more CPU/RAM per instance — it does not add redundancy, since there is still exactly one (bigger) instance running. Scaling **out/in** adds or removes instances of the same size behind the built-in load balancer, which is what actually improves both throughput and availability, since a single instance failing no longer takes the whole app down. Autoscale rules act on scale-out/in, typically triggered by a metric threshold (like CPU%) or a schedule.",
            },
            {
              question: "What are Azure App Service deployment slots, and how does a slot swap achieve zero-downtime deployment?",
              answer:
                "A deployment slot is a separate, fully live App Service environment (with its own URL) that can host a new version of the app for testing before it goes live. A **swap** exchanges the staging slot into production: Azure warms up the target slot's app first (so the first real users never hit a cold start), then redirects traffic — and the swap is instantly reversible by swapping back if something is wrong. App settings marked 'slot sticky' stay pinned to their slot across a swap rather than following the code, which matters for slot-specific config like connection strings.",
            },
            {
              question: 'What is the difference between the Consumption, Premium, and Dedicated (App Service) hosting plans for Azure Functions?',
              answer:
                'Consumption scales to zero and bills strictly per execution/GB-second, but has cold starts and a bounded execution timeout — best for spiky, infrequent, latency-tolerant workloads. Premium keeps a configurable number of pre-warmed instances (no cold start), allows unbounded execution time and VNet integration, at a higher baseline cost. Dedicated runs on an App Service Plan you already pay for (VMs you own the capacity of), with no cold start and no execution time limit, but no scale-to-zero either. The choice tracks directly with how latency-sensitive and how bursty the workload actually is.',
            },
            {
              question: 'Explain Bicep\'s relationship to ARM templates, and why Bicep is generally preferred today.',
              answer:
                'Bicep is a domain-specific language that compiles deterministically to the equivalent ARM JSON template — there is no capability ARM JSON has that Bicep lacks, only substantially more boilerplate and verbosity in raw JSON. Bicep adds readable syntax, native modularity (reusable, parameterized modules), and automatic dependency inference from direct resource references (removing most need for explicit `dependsOn`). Both support a `what-if` preview before deployment and rely on ARM itself (not a separate state file, unlike Terraform) to track what is actually deployed.',
            },
            {
              question: 'What is Azure Policy, and how is it different from Azure RBAC?',
              answer:
                'RBAC controls **who can act** — which identities can perform which management-plane operations, at which scope. Azure Policy controls **what is allowed to exist**, regardless of who created it — evaluating resources (existing or being created) against rules like "no public IPs allowed" or "only these regions permitted," with effects ranging from Audit (flag only) to Deny (block outright) to DeployIfNotExists (auto-remediate by deploying a companion resource). Both are needed for real organizational governance: RBAC alone cannot stop an authorized user from creating a non-compliant resource; only Policy can.',
            },
            {
              question: 'What is a landing zone, and why do large organizations use them?',
              answer:
                "A landing zone is a pre-provisioned, pre-governed environment — networking, identity, policy assignment, and monitoring already wired up — that a new subscription or workload is deployed into, rather than starting from a blank subscription each time. The Azure Landing Zone reference architecture (part of the Cloud Adoption Framework) formalizes a hub-and-spoke pattern: a central 'platform' management group hosting shared identity/connectivity/management subscriptions, feeding into 'landing zone' management groups that individual application teams' subscriptions land into, inheriting consistent policy and RBAC automatically.",
            },
            {
              question: 'How would you design a highly available, cost-conscious architecture for a web application on Azure, end to end?',
              answer:
                "Start from RTO/RPO requirements, not from \"maximize everything.\" A typical design: Azure Front Door as the global entry point (WAF, edge caching, multi-region failover) in front of regional Application Gateways and App Service (VNet-integrated, autoscaling, using deployment slots for safe releases). The data tier uses Azure SQL Database (zone-redundant, geo-replicated for DR) and/or Cosmos DB for globally distributed low-latency reads, reached via private endpoints rather than the public internet. Cross-cutting: Entra ID for authentication, Key Vault with managed identities for secrets (no stored credentials anywhere), Application Insights/Azure Monitor for distributed tracing and alerting, and Azure Policy plus consistent tagging for governance and cost visibility. Each choice should be traceable back to a specific Well-Architected pillar and a specific RTO/RPO or cost target, not chosen by default.",
            },
            {
              question: 'What is the difference between Azure Reserved Instances, Savings Plans, and Spot VMs, and when would you use each?',
              answer:
                'Reserved Instances commit to a specific VM size/region for 1 or 3 years in exchange for up to ~72% savings — best for steady-state baseline capacity you are confident will not change. Savings Plans commit to an hourly dollar amount of spend rather than a specific SKU, offering similar discounts (up to ~65%) with more flexibility to shift between VM families or regions over the term. Spot VMs offer the deepest discounts (up to ~90%) on Azure\'s unused capacity, but Azure can evict the VM with short notice (roughly 30 seconds) — appropriate only for interruption-tolerant workloads like batch processing, CI runners, or stateless background workers, never for anything stateful or latency-critical.',
            },
          ],
        },
      ],
    },
  ],
}
