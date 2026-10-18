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
            "Azure integrates deeply with Microsoft's enterprise ecosystem (on-prem Active Directory synced to Microsoft Entra ID, Windows Server, SQL Server, Microsoft 365, GitHub), a major reason large enterprises standardize on it.",
            'Every operation is either **control plane** (manage the resource itself via ARM — create a storage account, resize a VM) or **data plane** (use the resource — read a blob, query a database). The two are secured, throttled, and audited separately, and confusing them is behind many real-world access bugs.',
            'Security is a **shared responsibility**: Microsoft always owns physical security and the hypervisor; you always own your data, identities, and access configuration — the middle layers shift toward Microsoft as you move from IaaS to PaaS to SaaS.',
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
            {
              type: 'heading',
              text: 'Control Plane vs Data Plane',
            },
            {
              type: 'p',
              text: 'Every Azure service exposes two distinct API surfaces. The **control plane** is `https://management.azure.com` — ARM — and handles creating, configuring, and deleting resources. The **data plane** is the service\'s own endpoint (`https://<account>.blob.core.windows.net`, `https://<vault>.vault.azure.net`, your SQL server\'s TDS endpoint) and handles the actual work: reading blobs, fetching secrets, running queries. The distinction matters because permissions, network rules, throttling limits, and logs are all separate per plane: an engineer with **Owner** on a storage account (control plane) may still get `403` reading its blobs (data plane) if shared-key access is disabled and no data role is assigned.',
            },
            {
              type: 'table',
              headers: ['Aspect', 'Control plane', 'Data plane'],
              rows: [
                ['Endpoint', '`management.azure.com` (ARM)', 'Service-specific (blob, vault, SQL, Cosmos endpoints)'],
                ['Typical operations', 'Create/update/delete resources, change SKU, configure networking', 'Read/write data, fetch secrets, run queries, send messages'],
                ['Authorization', 'Azure RBAC roles like Owner / Contributor / Reader', 'Data roles (e.g., Storage Blob Data Reader, Key Vault Secrets User) or service-native auth (keys, SAS, SQL users)'],
                ['Network restriction', 'Mostly public ARM endpoint, governed by Entra Conditional Access', 'Firewalls, private endpoints, service endpoints per resource'],
                ['Audit trail', 'Azure Activity Log (automatic, free, 90 days)', 'Resource logs via diagnostic settings (opt-in, billed on ingestion)'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'The Activity Log only records **control-plane** writes. If you need to know who read a secret or downloaded a blob, you must explicitly enable diagnostic settings for that resource\'s data-plane logs — and you need to do it *before* the incident, not after.',
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
            {
              type: 'heading',
              text: 'Tags, Locks, and Naming: the Metadata That Makes the Hierarchy Usable',
            },
            {
              type: 'list',
              items: [
                '**Tags** are name/value pairs (`env=prod`, `costCenter=4711`, `owner=team-payments`) on resources, resource groups, and subscriptions. They are **not inherited** by default — a tag on a resource group does not appear on its resources unless you use Azure Policy (`Modify` effect, e.g. "Inherit a tag from the resource group") to copy it down. Cost Management can group by tags, which is what makes chargeback possible.',
                '**Resource locks** (`CanNotDelete` or `ReadOnly`) apply to a scope and are inherited by everything below. They block control-plane operations even for Owners until the lock is removed. `ReadOnly` is subtle: it can break things like listing storage keys (a POST) or scaling an App Service plan, so prefer `CanNotDelete` on critical production resources.',
                '**Naming conventions** matter because many names are globally unique DNS labels (storage accounts, Key Vaults, App Service) and most names are immutable — renaming usually means recreating. The Cloud Adoption Framework convention `<type-abbrev>-<workload>-<env>-<region>-<instance>` (e.g., `rg-payments-prod-weu-001`) is a widely used default.',
                '**Subscription limits** are real design inputs: there are caps on things like role assignments per subscription and resource groups per subscription, plus per-region vCPU quotas. Hitting a quota during an incident-driven scale-out is a classic surprise — request quota increases ahead of time.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'tagging and locking a production resource group',
              code: `az group update --name rg-payments-prod-weu-001 \\
  --tags env=prod costCenter=4711 owner=team-payments

# protect against accidental deletion (still allows normal updates)
az lock create --name no-delete --lock-type CanNotDelete \\
  --resource-group rg-payments-prod-weu-001`,
            },
            {
              type: 'callout',
              kind: 'note',
              text: 'A subscription is also a strong **blast-radius** boundary. Modern landing-zone guidance favors "subscription per workload per environment" (subscription vending) over one giant shared subscription, because quotas, RBAC sprawl, and policy exemptions stay contained.',
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
            'A **paired region** is a specific partner region (usually 300+ miles away, same geography) used for platform-level disaster recovery and staged platform updates. Many newer regions have **no pair** at all — they are designed as multi-zone regions and expect you to pick your own DR region.',
            'Services are **zonal** (pinned to one zone you choose, e.g., a VM or a managed disk), **zone-redundant** (the platform spreads replicas across zones for you, e.g., ZRS storage, zone-redundant SQL Database), or **non-regional/global** (Entra ID, Front Door, Traffic Manager). Knowing which category a service falls into tells you who is responsible for zone failover.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Region["Region: East US"]\n    subgraph AZ1["Availability Zone 1"]\n      DC1a["Datacenter"]\n    end\n    subgraph AZ2["Availability Zone 2"]\n      DC2a["Datacenter"]\n    end\n    subgraph AZ3["Availability Zone 3"]\n      DC3a["Datacenter"]\n    end\n  end\n  Region -.->|"paired region<br/>(disaster recovery)"| Region2["Region: West US<br/>(paired with East US)"]',
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
  --image Ubuntu2404 --size Standard_D2s_v5 --zone 1 --generate-ssh-keys
az vm create --resource-group rg-app-a-web --name web-vm-2 \\
  --image Ubuntu2404 --size Standard_D2s_v5 --zone 2 --generate-ssh-keys
az vm create --resource-group rg-app-a-web --name web-vm-3 \\
  --image Ubuntu2404 --size Standard_D2s_v5 --zone 3 --generate-ssh-keys`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Putting all VMs of a highly-available app in one availability set but a single availability zone still leaves you exposed to a full datacenter/zone outage. For the strongest single-region resilience, spread critical resources across **multiple availability zones**, not just fault domains within one.",
            },
            {
              type: 'heading',
              text: 'Logical vs Physical Zones, and Choosing a Region',
            },
            {
              type: 'p',
              text: 'Zone numbers are **logical**, not physical: zone `1` in your subscription may map to a different physical datacenter than zone `1` in a partner team\'s subscription. Azure shuffles the mapping per subscription to spread load. This matters when two subscriptions must co-locate zonal resources for latency (or deliberately separate them for resilience) — use the `availabilityZoneMappings` returned by the subscription locations API to compare, rather than assuming numbers match.',
            },
            {
              type: 'table',
              headers: ['Region selection factor', 'Why it matters'],
              rows: [
                ['Data residency / sovereignty', 'Regulation may require data at rest to stay in a geography (EU Data Boundary, national clouds)'],
                ['Availability zone support', 'Needed for 99.99%-class designs within one region'],
                ['Service and SKU availability', 'New services, GPU SKUs, and AI models roll out region by region — and capacity can be constrained even where a SKU is listed'],
                ['Latency to users and dependencies', 'Cross-region calls add tens of milliseconds per round trip; keep chatty tiers co-located'],
                ['Price', 'The same SKU can cost noticeably different amounts in different regions'],
                ['DR partner', 'Paired region (if any) or a self-chosen secondary with the services you need'],
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'inspecting zones and logical-to-physical mappings for a subscription',
              code: `# which regions support zones, and how this subscription's logical zones map
az rest --method get \\
  --url "https://management.azure.com/subscriptions/<sub-id>/locations?api-version=2022-12-01" \\
  --query "value[?name=='eastus'].availabilityZoneMappings"`,
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
              code: 'flowchart TB\n  Portal["Azure Portal"] --> ARM["Azure Resource Manager (ARM)<br/>authentication, RBAC, tagging, resource CRUD"]\n  CLI["Azure CLI / PowerShell"] --> ARM\n  SDK["Language SDKs"] --> ARM\n  IaC["Bicep / ARM templates / Terraform"] --> ARM\n  ARM --> RP1["Resource Provider:<br/>Microsoft.Compute"]\n  ARM --> RP2["Resource Provider:<br/>Microsoft.Storage"]\n  ARM --> RP3["Resource Provider:<br/>Microsoft.Sql"]\n  RP1 --> VM[(Virtual Machines)]\n  RP2 --> ST[(Storage Accounts)]\n  RP3 --> DB[(SQL Databases)]',
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
            {
              type: 'heading',
              text: 'How ARM Actually Processes a Request',
            },
            {
              type: 'list',
              ordered: true,
              items: [
                'The client sends a REST call (`PUT /subscriptions/.../providers/Microsoft.Storage/storageAccounts/x?api-version=...`) with an Entra ID bearer token.',
                'ARM validates the token, evaluates **RBAC** (including deny assignments) at the target scope, then evaluates **Azure Policy** (a `Deny` policy rejects here, before the resource provider sees the request).',
                'ARM forwards the request to the **resource provider**. Long-running operations return `201`/`202` with an `Azure-AsyncOperation` or `Location` header that clients poll — this is why `az` commands have `--no-wait`.',
                'The resulting operation is written to the **Activity Log**, and locks are checked for write/delete operations.',
              ],
            },
            {
              type: 'list',
              items: [
                '**`api-version` is mandatory** on every call and pins the request/response schema. Resource providers add new API versions over time; IaC should pin a known version and upgrade deliberately, because properties and defaults can change between versions.',
                '**Throttling**: ARM enforces request limits per principal and per subscription/tenant (the platform uses a token-bucket model). Tight polling loops or hundreds of parallel deployments get `429` responses with a `Retry-After` header — respect it, and batch work instead of hammering the API.',
                '**Resource providers must be registered** in a subscription before use (`az provider register --namespace Microsoft.ContainerService`). A fresh subscription failing a deployment with "MissingSubscriptionRegistration" is this.',
                '**Deployment Stacks** (`az stack group create`) are the modern way to manage a set of resources as one unit: the stack tracks what it deployed, can **delete or detach** resources removed from the template, and can apply **deny settings** to protect managed resources from out-of-band changes — a safer replacement for Complete mode and for the deprecated Azure Blueprints locking model.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'a deployment stack that cleans up removed resources and blocks manual edits',
              code: `az stack group create \\
  --name app-a-stack \\
  --resource-group rg-app-a-web \\
  --template-file main.bicep \\
  --action-on-unmanage deleteResources \\
  --deny-settings-mode denyWriteAndDelete \\
  --deny-settings-excluded-principals <pipeline-sp-object-id>`,
            },
          ],
        },
        {
          id: 'entra-id-fundamentals',
          title: 'Microsoft Entra ID (formerly Azure AD): Identity Fundamentals',
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
              code: 'flowchart TB\n  Tenant["Entra ID Tenant<br/>(contoso.onmicrosoft.com)"]\n  Tenant --> Users["Users"]\n  Tenant --> Groups["Groups"]\n  Tenant --> Apps["App Registrations /<br/>Service Principals"]\n  Tenant --> MI["Managed Identities<br/>(tied to Azure resources)"]\n  Tenant -.trusts.-> Sub1["Subscription A"]\n  Tenant -.trusts.-> Sub2["Subscription B"]\n  Users --> Groups\n  Groups -->|RBAC role assignment| Sub1',
            },
            {
              type: 'heading',
              text: 'Managed Identities: the Modern Answer to "Where Do I Store This Credential?"',
            },
            {
              type: 'p',
              text: 'A recurring problem: an app running in Azure (say, an App Service) needs to call another Azure service (say, Key Vault) — where does it store the credential to authenticate? Historically: a connection string or client secret, often hardcoded or dropped in config, and rotated manually (or never). A **managed identity** solves this by having Entra ID itself issue and automatically rotate a credential tied to the resource\'s identity — no secret to store, ever. Under the hood a managed identity *is* a special service principal whose certificate credential is held and rotated by the platform; your code never sees it, only the short-lived access tokens derived from it.',
            },
            {
              type: 'list',
              items: [
                '**System-assigned managed identity** — created and destroyed along with the resource it is attached to (e.g., one App Service); a 1:1 lifecycle.',
                '**User-assigned managed identity** — created as a standalone resource, then attached to one or more other resources; useful when several resources need to share one identity or an identity must outlive any single resource.',
                'Once assigned, the app requests tokens from a local, non-routable endpoint — the Instance Metadata Service (`169.254.169.254`) on VMs, or the `IDENTITY_ENDPOINT` the platform injects on App Service, Functions, and Container Apps — no client ID/secret in code or config at all. The Azure SDKs do this for you via `ManagedIdentityCredential` / `DefaultAzureCredential`.',
                'Prefer **user-assigned** identities for production fleets: you can pre-create them, grant RBAC before the compute exists (no chicken-and-egg in IaC), and avoid a burst of new role assignments every time a resource is recreated.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'granting a Web App a managed identity and Key Vault access (RBAC model)',
              code: `# enable a system-assigned managed identity on an App Service
principalId=$(az webapp identity assign --name my-web-app \\
  --resource-group rg-app-a-web --query principalId -o tsv)

# grant that identity read access to secrets via Azure RBAC (not legacy access policies)
az role assignment create \\
  --assignee-object-id "$principalId" --assignee-principal-type ServicePrincipal \\
  --role "Key Vault Secrets User" \\
  --scope $(az keyvault show --name my-keyvault --query id -o tsv)`,
            },
            {
              type: 'code',
              language: 'python',
              title: 'using the identity from code — no secret anywhere',
              code: `from azure.identity import ManagedIdentityCredential
from azure.keyvault.secrets import SecretClient

# In production, be explicit: ManagedIdentityCredential avoids DefaultAzureCredential
# probing a chain of credential sources (env vars, CLI, etc.) on every cold start.
credential = ManagedIdentityCredential()          # or client_id="<uami-client-id>"
client = SecretClient("https://my-keyvault.vault.azure.net", credential)
print(client.get_secret("SqlConnectionString").name)`,
            },
            {
              type: 'heading',
              text: 'App Registrations vs Service Principals, Conditional Access, and PIM',
            },
            {
              type: 'list',
              items: [
                '**App registration** = the global *definition* of an application (its client ID, redirect URIs, exposed API scopes, credentials), living in its home tenant. **Service principal (enterprise application)** = the *instance* of that app in a specific tenant, which is what actually receives role assignments and consent. A multi-tenant SaaS app has one registration and one service principal per customer tenant.',
                '**Conditional Access** policies evaluate signals at sign-in (user/group, app, device compliance, location, sign-in risk) and enforce controls (require MFA, require compliant device, block). It is the core of Entra\'s Zero Trust story and requires Entra ID P1.',
                '**Privileged Identity Management (PIM)** (Entra ID P2 / Entra ID Governance) makes powerful roles **eligible** rather than permanently assigned: an engineer activates Owner for, say, two hours with justification and optional approval. Standing admin access is one of the most common findings in cloud security reviews.',
                '**Phishing-resistant MFA** (passkeys/FIDO2, Windows Hello for Business, certificate-based auth) is the modern baseline for admins; Microsoft has also been enforcing mandatory MFA for sign-ins to the Azure portal and other management tools.',
              ],
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
            'RBAC is **additive** — effective permissions are the union of every role assignment at the scope and its ancestors. You cannot author a "deny" role assignment directly; **deny assignments** do exist, but are created only by the platform on your behalf — today chiefly by **Deployment Stacks** deny settings and Azure Managed Applications (Azure Blueprints, which also used them, is deprecated in favor of Deployment Stacks). Deny assignments take precedence over role assignments.',
            'Role definitions separate **`actions`/`notActions`** (control plane) from **`dataActions`/`notDataActions`** (data plane). `notActions` is *not* a deny — it just subtracts from that one role; another role can still grant the same action.',
          ],
          blocks: [
            {
              type: 'p',
              text: 'Interviewers often ask this precisely because the names sound related but answer different questions. **Entra ID** authenticates: it verifies a username/password (plus MFA), issues a token, and maintains the directory of users/groups/apps. **Azure RBAC** authorizes: given an already-authenticated identity, RBAC decides which management-plane actions (`Microsoft.Compute/virtualMachines/start/action`, etc.) that identity may perform, and at which scope.',
            },
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant U as User\n  participant Entra as Entra ID\n  participant ARM as Azure Resource Manager\n  U->>Entra: 1. Sign in (username/password + MFA)\n  Entra-->>U: 2. Issue access token ("who you are")\n  U->>ARM: 3. Request: restart VM X (token attached)\n  ARM->>ARM: 4. Check RBAC role assignments<br/>at VM X and its parent scopes\n  ARM-->>U: 5. Allow or Deny ("what you can do")',
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
            {
              type: 'heading',
              text: 'Least Privilege in Practice: Custom Roles, Conditions, and Propagation',
            },
            {
              type: 'code',
              language: 'json',
              title: 'a custom role: operators can restart VMs but not create or delete them',
              code: `{
  "Name": "VM Operator (restart only)",
  "IsCustom": true,
  "Description": "Read VMs and start/restart/deallocate them.",
  "Actions": [
    "Microsoft.Compute/virtualMachines/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Compute/virtualMachines/deallocate/action"
  ],
  "NotActions": [],
  "DataActions": [],
  "NotDataActions": [],
  "AssignableScopes": ["/subscriptions/<sub-id>"]
}`,
            },
            {
              type: 'list',
              items: [
                '**Assign to groups, not individuals.** Per-user assignments explode in number, hit subscription assignment limits, and are never cleaned up when people change teams. Groups (ideally PIM-governed) make access reviews tractable.',
                '**Role assignment conditions (Azure ABAC)** narrow a data role further — e.g., Storage Blob Data Reader only for blobs whose index tag `project` equals `alpha`, or a "Role Based Access Control Administrator" who may only assign a specific allow-list of roles. The latter is the safe way to delegate access management without handing out User Access Administrator.',
                '**Propagation is not instant.** New role assignments can take minutes to take effect (token caching plus replication), which is why freshly deployed pipelines sometimes fail with `403` on their first run and succeed on retry. Build in a retry rather than a sleep.',
                '**Prefer narrow built-in roles** over Contributor. Contributor on a subscription can read most secrets indirectly (e.g., `listKeys` on storage accounts, publishing profiles on web apps) — it is far more powerful than its name suggests.',
              ],
            },
          ],
        },
        {
          id: 'workload-identity-federation',
          title: 'Secretless Automation: Workload Identity Federation & CI/CD',
          summary:
            'Managed identities cover code running inside Azure; workload identity federation extends the same "no secrets" model to GitHub Actions, Azure DevOps, Kubernetes pods, and other clouds by trusting their OIDC tokens instead of storing client secrets.',
          keyPoints: [
            'A **federated identity credential** on an app registration or user-assigned managed identity says: "trust tokens from issuer X with subject Y." The external workload exchanges its own OIDC token for an Entra access token — no client secret or certificate is ever created.',
            'The **subject** claim is the security boundary. For GitHub it encodes repo plus branch, environment, or tag (e.g., `repo:contoso/payments:environment:production`); scoping it loosely lets any branch deploy to production.',
            '**AKS Workload ID** uses the same mechanism: the cluster exposes an OIDC issuer, and a Kubernetes service account is federated to a managed identity, replacing the deprecated pod-managed identity add-on.',
            'Client secrets are the most common leaked Azure credential (committed to repos, pasted in pipeline variables, expiring at 2 a.m.). Federation removes the secret entirely rather than trying to protect it better.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'sequenceDiagram\n  participant GH as GitHub Actions job\n  participant GHO as GitHub OIDC provider\n  participant Entra as Microsoft Entra ID\n  participant ARM as Azure Resource Manager\n  GH->>GHO: Request OIDC token (audience api://AzureADTokenExchange)\n  GHO-->>GH: Signed JWT (iss, sub = repo:org/app:environment:prod)\n  GH->>Entra: Exchange JWT for access token (client assertion)\n  Entra->>Entra: Match iss + sub + aud against federated credential\n  Entra-->>GH: Short-lived Azure access token\n  GH->>ARM: Deploy (RBAC checked as the managed identity)',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a user-assigned identity federated to one GitHub environment',
              code: `az identity create --name id-deploy-payments-prod --resource-group rg-identity

az identity federated-credential create \\
  --name github-prod \\
  --identity-name id-deploy-payments-prod --resource-group rg-identity \\
  --issuer "https://token.actions.githubusercontent.com" \\
  --subject "repo:contoso/payments:environment:production" \\
  --audiences "api://AzureADTokenExchange"

# grant only what the pipeline needs, only where it needs it
az role assignment create --assignee <identity-principal-id> \\
  --assignee-principal-type ServicePrincipal \\
  --role "Contributor" --scope "/subscriptions/<sub-id>/resourceGroups/rg-payments-prod"`,
            },
            {
              type: 'code',
              language: 'yaml',
              title: 'GitHub Actions workflow — note: no AZURE_CLIENT_SECRET anywhere',
              code: `name: deploy
on:
  push:
    branches: [main]
permissions:
  id-token: write      # required to request the OIDC token
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production   # must match the federated credential subject
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: \${{ vars.AZURE_CLIENT_ID }}
          tenant-id: \${{ vars.AZURE_TENANT_ID }}
          subscription-id: \${{ vars.AZURE_SUBSCRIPTION_ID }}
      - run: az deployment group create -g rg-payments-prod -f infra/main.bicep -p infra/prod.bicepparam`,
            },
            {
              type: 'table',
              headers: ['Workload location', 'Recommended credential', 'Avoid'],
              rows: [
                ['Code on Azure compute (VM, App Service, Functions, Container Apps)', 'Managed identity (prefer user-assigned)', 'Connection strings, account keys'],
                ['Pods on AKS', 'Microsoft Entra Workload ID (federated service account)', 'Node-level identity shared by every pod; pod-managed identity (deprecated)'],
                ['GitHub Actions / Azure DevOps / GitLab', 'Workload identity federation (OIDC)', 'Client secrets stored as pipeline secrets'],
                ['On-prem servers', 'Azure Arc-enabled server managed identity, or certificate credential', 'Long-lived client secrets'],
                ['Developer laptop', 'Your own Entra identity via `az login` / `DefaultAzureCredential`', 'Shared service principal secrets in `.env` files'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Federating on `repo:org/app:ref:refs/heads/*`-style broad subjects, or reusing one identity with subscription-wide **Owner** for every pipeline, recreates the blast radius you were trying to remove. Use one identity per environment, bind it to a protected GitHub **environment** (with required reviewers), and scope its RBAC to the resource groups it deploys.',
            },
          ],
        },
        {
          id: 'azure-vms',
          title: 'Azure Virtual Machines: Sizing, Availability Sets vs Availability Zones',
          summary:
            'Virtual Machines are the IaaS foundation of Azure compute — full control over the OS, at the cost of being fully responsible for patching, scaling, and high availability yourself.',
          keyPoints: [
            'A VM size (e.g., `Standard_D4s_v5`, `Standard_D4as_v6`) determines vCPU count, RAM, temp storage, and max data disks/network/disk throughput — series letters signal purpose (D = general purpose, F = compute-optimized, E = memory-optimized, B = burstable, N = GPU), extra letters signal features (`a` = AMD, `p` = Arm-based, `s` = premium storage capable, `d` = local temp disk), and the `vN` suffix is the hardware generation — newer generations are usually faster *and* cheaper per unit of work.',
            'An **availability set** groups VMs across fault domains (separate power/network) and update domains (patched at different times) within one datacenter.',
            'An **availability zone** deployment spreads VMs across physically separate datacenters within a region — a strictly stronger guarantee, used instead of (not alongside) availability sets whenever the region supports zones.',
            '**Virtual Machine Scale Sets (VMSS)** manage a group of VMs that autoscale behind a load balancer — the standard way to run a horizontally scalable VM-based tier. **Flexible orchestration** is the default and recommended mode for new scale sets (it can mix VM sizes and Spot/regular instances and spreads across zones and fault domains); Uniform mode is the legacy model.',
            'Treat VMs as **cattle, not pets**: bake images (Azure Compute Gallery), configure with cloud-init or VM extensions, keep no state on the OS disk, and replace rather than repair.',
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
  --image Ubuntu2404 \\
  --size Standard_D2s_v5 \\
  --zone 1 \\
  --admin-username azureuser \\
  --generate-ssh-keys

az vmss create \\
  --resource-group rg-app-a-web \\
  --name web-vmss \\
  --image Ubuntu2404 \\
  --instance-count 3 \\
  --zones 1 2 3 \\
  --orchestration-mode Flexible \\
  --vm-sku Standard_D2s_v5 \\
  --upgrade-policy-mode Automatic`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'For a VM SLA of 99.99%, Azure requires at least two VMs across two or more availability zones. A single VM with Premium SSD (or better) disks gets 99.9%; two or more VMs in an availability set (no zones) gets 99.95%. These exact numbers are a common interview detail — and note the SLA is about *VM connectivity*, not your application being healthy.',
            },
            {
              type: 'heading',
              text: 'Disks: Where VM Performance Problems Usually Live',
            },
            {
              type: 'table',
              headers: ['Disk type', 'Performance model', 'Use for'],
              rows: [
                ['Standard HDD', 'Low, variable IOPS', 'Backups, rarely accessed data, dev/test'],
                ['Standard SSD', 'Moderate, more consistent than HDD', 'Light web servers, lightly used apps'],
                ['Premium SSD', 'IOPS/throughput tied to disk size tier (bigger disk = more IOPS), bursting on smaller sizes', 'Most production workloads'],
                ['Premium SSD v2', 'IOPS, throughput, and capacity set independently and adjustable live', 'Databases and I/O-heavy workloads where you want to tune perf without overbuying capacity'],
                ['Ultra Disk', 'Highest IOPS / lowest latency, independently tunable', 'Top-tier transactional databases (SAP HANA, heavy SQL Server)'],
              ],
            },
            {
              type: 'list',
              items: [
                'A VM size also has its own **VM-level disk throughput and IOPS cap**. Attaching a fast disk to a small VM will not make it fast — the VM size caps it first. Check both limits when troubleshooting slow I/O.',
                '**Ephemeral OS disks** live on the host\'s local storage: faster reimage, no OS disk cost, but data is lost on deallocation — ideal for stateless scale set instances.',
                '**Trusted Launch** (Secure Boot + vTPM) is the default security type for new Gen2 VMs; keep it on unless an old image genuinely cannot boot with it.',
                'Remove public IPs from VMs: reach them through **Azure Bastion** or just-in-time access, and patch them with **Azure Update Manager** — exposed RDP/SSH on a public IP is one of the most reliably exploited misconfigurations in any cloud.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Stopping a VM from inside the guest OS leaves it **Stopped (allocated)** — you keep paying for compute. Only **Stopped (deallocated)** (`az vm deallocate` or Stop in the portal) releases the hardware. Deallocation can also release a dynamic public IP and the temp disk contents.',
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
              code: 'flowchart LR\n  Prod["Production slot<br/>(100% live traffic)"] <-->|swap| Staging["Staging slot<br/>(new version, warmed up,<br/>own URL for testing)"]\n  Users["Users"] --> Prod',
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
            {
              type: 'heading',
              text: 'Production Settings Senior Engineers Always Check',
            },
            {
              type: 'table',
              headers: ['Setting', 'Why it matters'],
              rows: [
                ['Health check path', 'The front-end load balancer stops routing to instances that fail it and the platform replaces persistently unhealthy ones; without it, a hung instance keeps receiving its share of traffic'],
                ['Always On', 'Prevents the app from idling out after inactivity (cold first request); required for continuous WebJobs'],
                ['ARR affinity (sticky sessions)', 'On by default; turn it **off** for stateless apps so load spreads evenly and scale-in does not strand users'],
                ['Minimum instance count of 2+ and zone redundancy', 'One instance means every platform upgrade or host failure is visible downtime; zone redundancy (Premium v3 and newer tiers) spreads instances across zones'],
                ['HTTPS Only, minimum TLS 1.2+, FTP/basic auth publishing disabled', 'Closes common audit findings; deploy via CI/CD with Entra identities instead of publishing credentials'],
                ['VNet integration (outbound) + private endpoint (inbound)', 'Outbound integration lets the app reach private resources; a private endpoint removes the public inbound surface — they are independent features'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Swap mechanics:** before switching, the platform applies the *target* slot\'s sticky settings to the source slot\'s instances (which restarts them), waits for them to warm up (optionally hitting custom warm-up paths via `applicationInitialization`), then swaps routing rules. **Swap with preview** pauses after the settings are applied so you can validate before completing.',
                '**Slots share the plan\'s compute.** A staging slot running a heavy smoke test competes with production for CPU and memory on the same instances.',
                '**Plan density:** every app on a plan runs on every instance of that plan. Packing many apps onto one plan saves money until one noisy app degrades all its neighbors — separate plans for critical apps.',
                '**Isolation:** App Service Environment v3 gives you single-tenant, VNet-injected App Service for strict compliance or very high scale; for most workloads, multi-tenant App Service with private endpoints is enough and far cheaper.',
                'Containers on App Service (Web App for Containers) are fully supported — but if you are designing a set of containerized microservices with event-driven scaling, Azure Container Apps is usually a better fit.',
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'A swap is not a database migration strategy. Both slots point at the same production data during and after a swap, so schema changes must be **backward compatible** (expand/contract pattern) — otherwise swapping back after a bad release will fail just as badly as the release did.',
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
            'The **Flex Consumption** plan is now the recommended serverless plan: scale to zero, per-execution billing, VNet integration, optional always-ready instances, and configurable instance memory. The legacy **Linux Consumption** plan gets no new features and retires on 30 September 2028; Windows Consumption still exists but lacks VNet integration.',
            'The **Premium (Elastic Premium)** plan keeps pre-warmed instances (no cold start) with long execution and VNet integration; the **Dedicated (App Service) plan** runs on an App Service plan you already pay for; functions can also be hosted on **Azure Container Apps**.',
            'For .NET, the **isolated worker model** is the only forward path — support for the in-process model ends on 10 November 2026. Node.js uses the v4 code-first programming model and Python the v2 decorator model, both of which replace hand-written `function.json` files.',
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
                ['Flex Consumption (recommended serverless)', 'Yes', 'Yes, unless you configure always-ready instances', 'Default 30 min, can be unbounded', 'Yes'],
                ['Consumption (legacy; Linux retiring 2028)', 'Yes', 'Yes', 'Default 5 min, max 10 min', 'No'],
                ['Premium (Elastic Premium)', 'No — at least one always-ready instance', 'No (pre-warmed instances)', 'Default 30 min, can be unbounded', 'Yes'],
                ['Dedicated (App Service plan)', 'No', 'No (with Always On)', 'Unbounded', 'Yes'],
                ['Container Apps', 'Yes', 'Yes, unless min replicas set', 'Governed by Container Apps settings', 'Yes'],
              ],
            },
            {
              type: 'code',
              language: 'ts',
              title: 'queue trigger + Cosmos DB output binding (Node.js v4 programming model)',
              code: `import { app, output, InvocationContext } from '@azure/functions';

// identity-based connection: app settings define
// CosmosDBConnection__accountEndpoint = https://cosmos-app-a.documents.azure.com:443/
// AzureWebJobsStorage__accountName   = mystorageacct001
const ordersOut = output.cosmosDB({
  databaseName: 'OrdersDb',
  containerName: 'Orders',
  connection: 'CosmosDBConnection',
  createIfNotExists: false,
});

interface OrderMessage { orderId: string; tenantId: string; total: number }

app.storageQueue('processOrder', {
  queueName: 'orders-queue',
  connection: 'AzureWebJobsStorage',
  extraOutputs: [ordersOut],
  handler: async (msg: unknown, context: InvocationContext) => {
    const order = msg as OrderMessage;
    // Make the write idempotent: queue delivery is at-least-once,
    // so the same message can be processed twice. Using a deterministic
    // id means a retry upserts the same document instead of duplicating it.
    context.extraOutputs.set(ordersOut, {
      id: order.orderId,
      tenantId: order.tenantId,          // container partition key
      total: order.total,
      processedAt: new Date().toISOString(),
    });
  },
});`,
            },
            {
              type: 'list',
              items: [
                '**Scaling internals:** a scale controller watches trigger sources (queue length, Event Hubs lag, HTTP concurrency) and adds instances; Flex Consumption scales HTTP functions by per-instance concurrency and groups other triggers so they scale independently. Each instance can run many executions concurrently — so shared resources (database connection pools, downstream APIs) see `instances x concurrency` load.',
                '**Reuse clients:** create SDK and HTTP clients once at module scope, not per invocation. Per-invocation clients exhaust outbound SNAT ports and sockets under load — a classic production outage.',
                '**HTTP limit:** regardless of plan timeout, an HTTP-triggered function must respond within about 230 seconds (the front-end load balancer idle timeout). For long work, accept the request, enqueue, return `202`, and let a queue-triggered or Durable function do the work.',
                '**Retries and poison messages:** queue and Service Bus triggers retry failed messages and eventually move them to a poison/dead-letter queue — monitor that queue, or failures silently pile up.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Choosing the Consumption plan for a latency-sensitive, always-busy API is a common mistake — cold starts (the runtime spinning up an instance from zero) add noticeable p99 latency. If traffic is steady and latency-sensitive, configure always-ready instances on Flex Consumption, or use the Premium (or Dedicated) plan, accepting that you pay for some idle capacity instead of scaling fully to zero.",
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
            '**AKS Automatic** (generally available since 2025) sits between the two: real Kubernetes with the full API, but with node provisioning, scaling, upgrades, networking, and security guardrails preconfigured and managed — a sensible default when you need Kubernetes but not a bespoke cluster design.',
            '**Azure Container Registry (ACR)** stores images; pull it with a managed identity (the `AcrPull` role), never with the registry admin user.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  Q{"What do you need?"}\n  Q -->|"Run one container,<br/>no orchestration,<br/>short-lived/batch"| ACI["Azure Container Instances"]\n  Q -->|"Microservices,<br/>autoscale-to-zero,<br/>no cluster ops"| ACA["Azure Container Apps"]\n  Q -->|"Need Kubernetes itself:<br/>CRDs, operators, Helm,<br/>full API control"| AKS["Azure Kubernetes Service"]',
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
  --image myregistry.azurecr.io/report-generator:2.4.1 --cpu 1 --memory 1

# Container Apps: deploy a scale-to-zero microservice, no cluster to manage
az containerapp create --name orders-api --resource-group rg-app-a-web \\
  --image myregistry.azurecr.io/orders-api:1.7.0 --revision-suffix v170 \\
  --min-replicas 0 --max-replicas 10 --target-port 8080 --ingress external

# AKS: provision a real Kubernetes cluster you administer
az aks create --resource-group rg-app-a-web --name my-cluster \\
  --node-count 3 --zones 1 2 3 --enable-workload-identity --enable-oidc-issuer \\
  --generate-ssh-keys

# AKS Automatic: Kubernetes with managed nodes, scaling, and guardrails preconfigured
az aks create --resource-group rg-app-a-web --name my-auto-cluster --sku automatic`,
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'A strong interview answer names the actual differentiator: it is not "which is more powerful" (AKS always wins on raw power) but "how much orchestration surface area do you want to own." Defaulting to AKS for a handful of simple microservices is over-engineering; Container Apps exists specifically to fill that gap.',
            },
            {
              type: 'heading',
              text: 'Container Apps Under the Hood',
            },
            {
              type: 'list',
              items: [
                'An **environment** is the security and networking boundary (one VNet, one Log Analytics workspace); apps in it can call each other by name over internal DNS.',
                'Each deployment creates an immutable **revision**. In multiple-revision mode you split traffic by percentage (e.g., 90/10 canary) and roll back by shifting weight — no redeploy needed.',
                'Scaling is driven by **KEDA** rules: HTTP concurrency, Service Bus queue depth, Event Hubs lag, Kafka, cron, CPU/memory. Scale-to-zero only works with event or HTTP rules; CPU/memory rules need at least one replica.',
                '**Container Apps jobs** run to completion (manual, scheduled, or event-triggered) — the managed answer for batch work that used to need ACI plus custom glue.',
                '**Workload profiles** let one environment mix serverless Consumption capacity with dedicated profiles (larger memory, GPUs) when you need predictable hardware.',
                '**Dapr** integration gives service invocation, pub/sub, and state-store abstractions as sidecars — useful, but it is an extra moving part; adopt it deliberately, not by default.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'canary release with revisions and a queue-depth scale rule',
              code: `az containerapp revision set-mode --name orders-api --resource-group rg-app-a-web --mode multiple

az containerapp update --name orders-api --resource-group rg-app-a-web \\
  --image myregistry.azurecr.io/orders-api:1.8.0 --revision-suffix v180 \\
  --scale-rule-name sb-depth --scale-rule-type azure-servicebus \\
  --scale-rule-metadata queueName=orders messageCount=50 namespace=sb-app-a \\
  --scale-rule-identity system

# send 10% of traffic to the new revision, keep 90% on the current one
az containerapp ingress traffic set --name orders-api --resource-group rg-app-a-web \\
  --revision-weight orders-api--v170=90 orders-api--v180=10`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Deploying `:latest` tags makes rollbacks and audits guesswork — a revision should reference an immutable tag (a version or the git SHA), ideally pinned by digest. Also remember scale-to-zero means the first request after idle pays a container cold start (image pull plus app startup), so keep images small and set `min-replicas 1` for latency-critical APIs.',
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
              code: 'flowchart TB\n  subgraph LRS["LRS — 3 copies, 1 datacenter"]\n    L1["Copy 1"] ~~~ L2["Copy 2"] ~~~ L3["Copy 3"]\n  end\n  subgraph ZRS["ZRS — 3 copies, 3 zones, 1 region"]\n    direction LR\n    Z1["Zone 1"] ~~~ Z2["Zone 2"] ~~~ Z3["Zone 3"]\n  end\n  subgraph GRS["GRS — LRS in primary region + async copy in paired region"]\n    direction LR\n    G1["Primary region<br/>(3 copies, LRS)"] -.async replication.-> G2["Paired region<br/>(3 copies, LRS)"]\n  end',
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
  --sku Standard_GZRS --kind StorageV2 --access-tier Hot \\
  --min-tls-version TLS1_2 --allow-blob-public-access false \\
  --allow-shared-key-access false          # force Entra ID (RBAC) for data access

# lifecycle policies auto-transition/expire blobs by age — Hot -> Cool -> Archive -> delete
az storage account management-policy create \\
  --account-name mystorageacct001 --resource-group rg-app-a-data \\
  --policy @lifecycle-policy.json`,
            },
            {
              type: 'code',
              language: 'json',
              title: 'lifecycle-policy.json — tier logs down by age, delete after a year',
              code: `{
  "rules": [
    {
      "enabled": true,
      "name": "age-out-logs",
      "type": "Lifecycle",
      "definition": {
        "filters": { "blobTypes": ["blockBlob"], "prefixMatch": ["logs/"] },
        "actions": {
          "baseBlob": {
            "tierToCool":    { "daysAfterModificationGreaterThan": 30 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 180 },
            "delete":        { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}`,
            },
            {
              type: 'heading',
              text: 'Access Tiers: Storage Cost vs Access Cost',
            },
            {
              type: 'table',
              headers: ['Tier', 'Storage price', 'Read/access price', 'Minimum retention (early-deletion charge)', 'Latency'],
              rows: [
                ['Hot', 'Highest', 'Lowest', 'None', 'Milliseconds'],
                ['Cool', 'Lower', 'Higher', '30 days', 'Milliseconds'],
                ['Cold', 'Lower still', 'Higher still', '90 days', 'Milliseconds'],
                ['Archive', 'Lowest', 'Highest, plus rehydration', '180 days', 'Hours (offline until rehydrated; high-priority rehydration is faster for small objects)'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: "Archive tier data cannot be read directly — it must first be **rehydrated** (which can take hours), and there is an early-deletion penalty if you delete/move a blob before its minimum retention period. Archive is for data you almost never need and can tolerate a multi-hour wait for, not a cheaper Cool tier.",
            },
            {
              type: 'heading',
              text: 'Securing Data-Plane Access',
            },
            {
              type: 'table',
              headers: ['Method', 'How it works', 'Verdict'],
              rows: [
                ['Microsoft Entra ID + RBAC', 'Token-based, per-identity, auditable, revocable by removing a role', 'Default choice for apps and people'],
                ['User delegation SAS', 'Time-limited URL signed with an Entra-derived key; scoped to container/blob and permissions', 'Best way to hand a browser or partner temporary access'],
                ['Service/account SAS', 'Signed with the account key; revocable only by rotating the key (or via stored access policy)', 'Avoid for new designs'],
                ['Account keys / connection strings', 'Two master keys granting full access to everything in the account', 'Disable shared-key access where possible'],
                ['Anonymous public read', 'Container-level public access', 'Off by default; use Front Door/CDN in front of a private origin instead'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Data Lake Storage (hierarchical namespace)** turns blob storage into a real file system with atomic directory renames and POSIX-style ACLs — essential for Spark/analytics engines (Microsoft Fabric, Databricks, Synapse). It must be chosen at account creation time (or via a one-way upgrade).',
                '**Data protection features** — blob soft delete, container soft delete, versioning, point-in-time restore, and immutable (WORM) storage with time-based retention or legal holds — protect against accidental deletion and ransomware. Redundancy replicates a bad delete just as faithfully as a good write; it is not a backup.',
                '**Scalability targets** apply per account and per partition: a single storage account has request-rate and throughput limits, and a single blob or hot key-range has much lower limits. Extremely hot workloads spread across multiple accounts or use well-distributed blob name prefixes.',
                '**Azure Files** supports identity-based SMB auth (AD DS / Entra Kerberos) and **Azure File Sync** to cache shares on Windows servers on-prem; for high-performance NFS or SAP-class workloads, Azure NetApp Files is the premium alternative.',
              ],
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
            'Built-in **high availability with automatic failover** is included in *every* service tier — the tiers differ in *how*: General Purpose separates compute from remote storage (failover means starting compute elsewhere), Business Critical runs an Always On availability group of local-SSD replicas (with a free readable secondary), and **Hyperscale** uses a log service plus page servers for fast scaling and databases up to 128 TB.',
            '**Automated backups** (full, differential, log) support **point-in-time restore** within a configurable retention window, with optional long-term retention for compliance.',
            'Use **Microsoft Entra-only authentication** and managed identities instead of SQL logins and passwords; connect over a **private endpoint**.',
            'Choose **Azure SQL Managed Instance** when you need near-100% SQL Server instance compatibility (SQL Agent, cross-database queries, CLR, Service Broker) for lift-and-shift; choose SQL Database for new cloud-native apps.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Pool["Elastic Pool (shared eDTU/vCore budget)"]\n    direction LR\n    DBA["Tenant A DB<br/>(busy 9am-11am)"]\n    DBB["Tenant B DB<br/>(busy 2pm-4pm)"]\n    DBC["Tenant C DB<br/>(rarely busy)"]\n  end\n  Pool -.->|"shares capacity, so total<br/>provisioned is less than sum of peaks"| Capacity[("Fixed pool compute/storage")]',
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
              code: `# Entra-only auth: no SQL admin password exists to leak or rotate
az sql server create --name sql-app-a --resource-group rg-app-a-data \\
  --enable-ad-only-auth \\
  --external-admin-principal-type Group \\
  --external-admin-name "sql-admins" --external-admin-sid <group-object-id>

az sql db create --resource-group rg-app-a-data --server sql-app-a \\
  --name orders-db --edition GeneralPurpose --family Gen5 --capacity 2 \\
  --zone-redundant true --backup-storage-redundancy Zone

az sql elastic-pool create --resource-group rg-app-a-data --server sql-app-a \\
  --name tenants-pool --edition GeneralPurpose --capacity 8`,
            },
            {
              type: 'heading',
              text: 'Service Tiers and Business Continuity',
            },
            {
              type: 'table',
              headers: ['Tier', 'Architecture', 'Strengths', 'Watch out for'],
              rows: [
                ['General Purpose', 'Stateless compute + remote premium storage', 'Cheapest vCore tier; fine for most OLTP', 'Higher I/O latency than local SSD; failover takes longer'],
                ['Business Critical', 'Always On AG, 4 replicas on local SSD', 'Lowest latency, fastest failover, free read replica', 'Roughly 2-3x the cost of General Purpose'],
                ['Hyperscale', 'Compute nodes + page servers + log service on remote storage', 'Very large DBs, fast scale up/out, near-instant backups and fast restores, named read replicas', 'Different performance profile for some log-heavy workloads; test before migrating'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Active geo-replication** creates readable secondaries in other regions (per database). **Failover groups** wrap one or more databases with a stable read-write listener DNS name (`<fog-name>.database.windows.net`) that follows the primary on failover — so connection strings never change. Prefer failover groups for app-level DR.',
                'Geo-replication is **asynchronous**: a forced failover can lose the last few seconds of committed transactions (non-zero RPO). Planned failover synchronizes first and loses nothing.',
                '**Serverless** auto-pause saves money but the first connection after a pause waits for resume (often up to a minute) — fine for dev/test, painful for user-facing apps.',
                'Connection resilience: transient errors during reconfiguration and failover are normal in PaaS. Every client must implement **retry with backoff** (built into EF Core\'s `EnableRetryOnFailure`, `Microsoft.Data.SqlClient` configurable retry logic, and similar).',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Elastic pools save money only when tenants peak at *different* times. If every tenant runs the same nightly batch at 02:00, the pool must be sized for the sum of peaks anyway — and a single noisy tenant can starve the rest unless you set per-database min/max limits.',
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
              code: 'flowchart LR\n  Strong["Strong<br/>(linearizable,<br/>highest latency)"] --- BS["Bounded<br/>Staleness"] --- Session["Session<br/>(default —<br/>read-your-own-writes)"] --- CP["Consistent<br/>Prefix"] --- Eventual["Eventual<br/>(lowest latency,<br/>no ordering guarantee)"]',
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
              code: 'flowchart TB\n  Container[("Cosmos DB Container")] --> PK{"Partition key:<br/>hash(tenantId)"}\n  PK --> P1["Physical Partition 1<br/>(tenants A, D, G...)"]\n  PK --> P2["Physical Partition 2<br/>(tenants B, E, H...)"]\n  PK --> P3["Physical Partition 3<br/>(tenants C, F, I...)"]',
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
            {
              type: 'heading',
              text: 'Request Units and Throughput Modes',
            },
            {
              type: 'p',
              text: 'Every operation costs **Request Units (RUs)** — a normalized blend of CPU, IOPS, and memory. A point read of a 1 KB item by `id` + partition key costs about 1 RU; a write of the same item costs several RUs (more with many indexed properties); a cross-partition query with filters and sorting can cost hundreds. Each response returns its charge in the `x-ms-request-charge` header — measure it rather than guessing, and design hot paths around point reads.',
            },
            {
              type: 'table',
              headers: ['Mode', 'Billing', 'Best for', 'Caveat'],
              rows: [
                ['Provisioned (manual)', 'Fixed RU/s per hour', 'Steady, predictable traffic', 'Over-provision for peaks or get 429s'],
                ['Autoscale', 'Scales between 10% and 100% of a max RU/s; billed on the highest RU/s reached each hour', 'Variable traffic with known ceiling', 'Costs more per RU than manual at constant full load'],
                ['Serverless', 'Per RU consumed', 'Dev/test, spiky low-volume apps', 'Single-region only and lower per-container limits; no SLA-backed throughput'],
              ],
            },
            {
              type: 'code',
              language: 'python',
              title: 'point reads, RU charge, and keyless (Entra ID) auth with the Python SDK',
              code: `from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

# data-plane RBAC role required: "Cosmos DB Built-in Data Contributor"
client = CosmosClient("https://cosmos-app-a.documents.azure.com:443/",
                      credential=DefaultAzureCredential())
orders = client.get_database_client("OrdersDb").get_container_client("Orders")

# point read: id + partition key -> cheapest possible operation (~1 RU per KB)
item = orders.read_item(item="order-123", partition_key="tenant-42")
print(orders.client_connection.last_response_headers["x-ms-request-charge"])

# single-partition query: scoped to one logical partition, avoids fan-out
for o in orders.query_items(
        query="SELECT * FROM c WHERE c.status = @s",
        parameters=[{"name": "@s", "value": "pending"}],
        partition_key="tenant-42"):
    print(o["id"])`,
            },
            {
              type: 'list',
              items: [
                '**Hierarchical partition keys** (e.g., `/tenantId` then `/userId`) let one huge tenant span many physical partitions while queries filtered on the first level still route efficiently — the modern fix for the "one giant tenant breaks the 20 GB logical partition limit" problem.',
                '**Change feed** exposes an ordered (per partition key) log of inserts and updates, consumed by Functions triggers or the change feed processor — the backbone for event sourcing, materialized views, and syncing to search indexes. Deletes are not captured by the default mode; use soft-delete flags with TTL, or all-versions-and-deletes mode where available.',
                '**Indexing policy**: by default every property is indexed, which makes writes more expensive. Exclude large or never-queried paths to cut write RUs, and add composite indexes for multi-property `ORDER BY`.',
                '**Vector search** is built into Cosmos DB for NoSQL (vector indexes alongside your operational data), making it a common store for RAG and agent memory in Azure AI applications.',
                'Use the **SDK as a singleton** and direct connectivity mode (in .NET/Java) — creating a client per request is the Cosmos equivalent of opening a new database connection for every query.',
              ],
            },
          ],
        },
        {
          id: 'messaging-eventing',
          title: 'Messaging & Eventing: Service Bus vs Event Grid vs Event Hubs',
          summary:
            'Azure has several asynchronous messaging services that look interchangeable on a slide but have fundamentally different semantics — commands vs discrete events vs high-volume streams — and picking the wrong one is a long-lived architectural mistake.',
          keyPoints: [
            '**Service Bus** is an enterprise **message broker**: queues and topics/subscriptions, at-least-once delivery with peek-lock, dead-lettering, sessions (FIFO per key), duplicate detection, scheduled messages, and transactions. Use it for *commands* and business workflows where every message matters.',
            '**Event Grid** is a push-based **event router**: lightweight notifications ("blob created", "resource deleted", custom domain events) fanned out to handlers via filters, with retry and dead-lettering. Use it for reactive, discrete events — "something happened."',
            '**Event Hubs** is a partitioned, append-only **event streaming** log (Kafka-compatible endpoint) for millions of events per second — telemetry, clickstreams, logs. Consumers track their own offsets and can replay within the retention window.',
            '**Storage Queues** are the simplest and cheapest option — huge backlogs and basic at-least-once queuing, but no topics, sessions, or ordering guarantees.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['', 'Service Bus', 'Event Grid', 'Event Hubs', 'Storage Queue'],
              rows: [
                ['Model', 'Broker (queues, pub/sub topics)', 'Push event routing (also pull delivery in namespaces)', 'Partitioned stream / log', 'Simple queue'],
                ['Consumption', 'Pull with lock, complete/abandon', 'Pushed to webhook, Function, queue, Event Hub', 'Pull by partition with offsets/checkpoints', 'Pull with visibility timeout'],
                ['Ordering', 'FIFO per session', 'Not guaranteed', 'Per partition', 'Not guaranteed'],
                ['Replay', 'No (consumed = gone)', 'No', 'Yes, within retention', 'No'],
                ['Typical payload', 'Order commands, workflow steps', 'Resource/state-change notifications', 'Telemetry, logs, IoT, clickstream', 'Background jobs, simple work items'],
                ['Signature features', 'DLQ, sessions, duplicate detection, transactions', 'Advanced filtering, CloudEvents schema, Azure system topics', 'Kafka protocol, Capture to storage, consumer groups', 'Cheap, very large backlogs'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Q{"What are you sending?"}\n  Q -->|"A command that must be<br/>processed exactly once-ish"| SB["Service Bus queue/topic"]\n  Q -->|"A notification that<br/>something changed"| EG["Event Grid"]\n  Q -->|"A firehose of telemetry<br/>to analyze or replay"| EH["Event Hubs"]\n  Q -->|"Simple background work,<br/>lowest cost"| SQ["Storage Queue"]',
            },
            {
              type: 'code',
              language: 'python',
              title: 'Service Bus: peek-lock processing with explicit settle and dead-lettering',
              code: `from azure.identity import DefaultAzureCredential
from azure.servicebus import ServiceBusClient

with ServiceBusClient("sb-app-a.servicebus.windows.net", DefaultAzureCredential()) as client:
    with client.get_queue_receiver("orders", max_wait_time=5) as receiver:
        for msg in receiver:
            try:
                process_order(str(msg))          # must be idempotent!
                receiver.complete_message(msg)   # delete only after success
            except ValidationError as err:
                # poison message: retrying will never help
                receiver.dead_letter_message(msg, reason="validation", error_description=str(err))
            except Exception:
                receiver.abandon_message(msg)    # release the lock; redelivered later
                                                 # after MaxDeliveryCount it auto-dead-letters`,
            },
            {
              type: 'list',
              items: [
                '**At-least-once is the norm.** Lock expiry, crashes after processing but before `complete`, and retries all cause redelivery. Make handlers idempotent (dedupe by message ID or business key) — duplicate detection on the broker only covers duplicate *sends* inside a time window.',
                '**Transactional outbox:** writing to your database and publishing a message are two separate systems. Write the event to an outbox table in the same DB transaction, then relay it to Service Bus — otherwise a crash between the two leaves them inconsistent.',
                '**Event Hubs partitions** cap consumer parallelism (one active reader per partition per consumer group) and fix ordering scope. Choose the partition count for peak parallelism up front; changing it later is restricted by tier and breaks key-to-partition mapping.',
                'Event Grid delivers to your handler with retries and an exponential backoff schedule; an unhealthy endpoint gets events dead-lettered (if configured) or dropped after the retry policy expires — always configure a dead-letter destination.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using Event Hubs as a work queue (or Service Bus as a telemetry firehose) is a common mismatch. Event Hubs has no per-message acknowledgment or dead-letter queue — a poison event blocks or must be skipped by your own checkpoint logic — while pushing millions of tiny telemetry events through Service Bus is expensive and throttles. Match the service to the semantics.',
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
              code: 'flowchart TB\n  subgraph VNet1["VNet: 10.0.0.0/16 (East US)"]\n    Subnet1["Subnet: web<br/>10.0.1.0/24"]\n    Subnet2["Subnet: app<br/>10.0.2.0/24"]\n    Subnet3["Subnet: data<br/>10.0.3.0/24"]\n    NSG1["NSG: allow 443 in<br/>deny all else"] -.-> Subnet1\n    NSG2["NSG: allow from<br/>web subnet only"] -.-> Subnet2\n  end\n  subgraph VNet2["VNet: 10.1.0.0/16 (West US)"]\n    Subnet4["Subnet: shared-services<br/>10.1.1.0/24"]\n  end\n  VNet1 <-.->|"VNet Peering<br/>(private, non-transitive)"| VNet2\n  Internet(("Internet")) -->|HTTPS| Subnet1',
            },
            {
              type: 'list',
              items: [
                'NSG rules are evaluated by **priority number** (lower = evaluated first), and the first matching rule wins — a common mistake is placing a broad allow rule at a lower priority number than the specific deny rule that was meant to take precedence.',
                'NSGs are **stateful**: an inbound rule allowing traffic in automatically allows the corresponding return traffic out, without needing a matching outbound rule.',
                'A subnet can be **delegated** to a specific PaaS service (e.g., delegating a subnet to `Microsoft.Web/serverFarms` for App Service VNet integration), which lets that service inject itself into your private network.',
                'Azure reserves **5 IP addresses** in every subnet (network, gateway, two for Azure DNS, broadcast). A `/29` gives only 3 usable addresses — and services like AKS, App Service integration, and Container Apps consume many IPs as they scale, so size subnets generously; resizing a subnet in use is painful.',
                '**Application Security Groups (ASGs)** let NSG rules reference workloads by role (`asg-web` may talk to `asg-api` on 443) instead of brittle IP ranges.',
                '**User-defined routes (UDRs)** in a route table override system routes — e.g., `0.0.0.0/0 -> Azure Firewall private IP` to force all egress through inspection.',
              ],
            },
            {
              type: 'heading',
              text: 'Outbound Connectivity: No More Implicit Internet Access',
            },
            {
              type: 'p',
              text: 'Historically, a VM without a public IP still reached the internet through an implicit, Microsoft-owned "default outbound access" IP. That behavior was retired for new virtual networks: from 31 March 2026, newly created VNets (with newer API versions) default to **private subnets**, and VMs need an explicit egress method. Existing VNets keep working, but the explicit approach is best practice everywhere because the implicit IP was unpredictable, could not be allow-listed by partners, and was not owned by you.',
            },
            {
              type: 'table',
              headers: ['Explicit egress option', 'When to use'],
              rows: [
                ['NAT Gateway', 'Default choice: static, predictable outbound IPs for a subnet, large SNAT port pool'],
                ['Azure Firewall / NVA (via UDR)', 'When egress must be inspected, filtered by FQDN, and logged — usually in a hub VNet'],
                ['Standard Load Balancer outbound rules', 'When VMs are already behind a Standard LB and you want explicit SNAT allocation'],
                ['Instance-level public IP', 'Rarely — only for workloads that genuinely need a dedicated public address'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: '**SNAT port exhaustion** is a classic production mystery: intermittent outbound timeouts under load from App Service, Functions, or VMs calling the same external endpoint. The fixes are connection reuse (pooled HTTP clients), private endpoints for Azure services (traffic no longer needs SNAT), and a NAT Gateway for a much larger port pool.',
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
          id: 'private-link-hybrid-connectivity',
          title: 'Private Endpoints, Private DNS & Hybrid Connectivity',
          summary:
            'Private endpoints pull PaaS services like Storage, SQL, and Key Vault into your VNet on a private IP, while VPN Gateway and ExpressRoute connect that network to on-premises — together they are how enterprises remove public data-plane exposure.',
          keyPoints: [
            'A **private endpoint** is a NIC in your subnet with a private IP that maps to one specific resource (e.g., one storage account\'s blob sub-resource). Traffic stays on the Microsoft backbone, and you can then disable the resource\'s public network access entirely.',
            '**Service endpoints** are the older, simpler alternative: they extend your subnet\'s identity to a service so its firewall can allow that subnet, but the service keeps its **public** IP and the feature does not work from on-prem. Private endpoints are the default for new designs.',
            '**DNS is the hard part.** Clients must resolve `myacct.blob.core.windows.net` to the private IP via a CNAME to `myacct.privatelink.blob.core.windows.net` held in a **Private DNS zone** linked to the VNet. Most private-endpoint "outages" are DNS misconfigurations.',
            '**Site-to-site VPN** runs encrypted IPsec tunnels over the internet — quick and cheap. **ExpressRoute** is a private circuit through a connectivity provider with predictable latency and higher bandwidth — the enterprise backbone choice, often with VPN as a backup path.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart LR\n  subgraph OnPrem["On-premises"]\n    Client["App server"]\n    OnDNS["Corporate DNS<br/>conditional forwarder"]\n  end\n  subgraph Hub["Hub VNet"]\n    GW["ExpressRoute / VPN Gateway"]\n    Resolver["Azure DNS Private Resolver<br/>inbound endpoint"]\n  end\n  subgraph Spoke["Spoke VNet"]\n    PE["Private endpoint<br/>10.1.2.5"]\n  end\n  Zone[("Private DNS zone<br/>privatelink.blob.core.windows.net")]\n  Storage[("Storage account<br/>public access disabled")]\n  Client -->|"1. resolve myacct.blob.core.windows.net"| OnDNS\n  OnDNS -->|"2. forward"| Resolver\n  Resolver -->|"3. lookup"| Zone\n  Client -->|"4. connect to 10.1.2.5"| GW\n  GW --> PE\n  PE --> Storage',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'private endpoint for blob storage with its DNS zone wired up',
              code: `stId=$(az storage account show -n mystorageacct001 -g rg-app-a-data --query id -o tsv)

az network private-endpoint create --name pe-st-blob \\
  --resource-group rg-app-a-data --vnet-name vnet-app-a --subnet private-endpoints \\
  --private-connection-resource-id "$stId" --group-id blob \\
  --connection-name st-blob-conn

az network private-dns zone create -g rg-dns --name privatelink.blob.core.windows.net
az network private-dns link vnet create -g rg-dns \\
  --zone-name privatelink.blob.core.windows.net --name link-vnet-app-a \\
  --virtual-network <vnet-app-a-resource-id> --registration-enabled false

# auto-create/maintain the A record for the endpoint in the zone
az network private-endpoint dns-zone-group create -g rg-app-a-data \\
  --endpoint-name pe-st-blob --name default \\
  --private-dns-zone <zone-resource-id> --zone-name blob

# finally, close the public door
az storage account update -n mystorageacct001 -g rg-app-a-data --public-network-access Disabled`,
            },
            {
              type: 'table',
              headers: ['', 'Service endpoint', 'Private endpoint'],
              rows: [
                ['Destination IP', 'Service public IP', 'Private IP in your subnet'],
                ['Reachable from on-prem / peered VNets', 'No', 'Yes'],
                ['Granularity', 'Whole service type in region (narrow with policies)', 'One specific resource (data-exfiltration resistant)'],
                ['DNS changes needed', 'None', 'Private DNS zone + resolution path'],
                ['Cost', 'Free', 'Per endpoint-hour plus per GB processed'],
              ],
            },
            {
              type: 'heading',
              text: 'Hybrid Connectivity Options',
            },
            {
              type: 'table',
              headers: ['Option', 'Path', 'Bandwidth / latency', 'Typical use'],
              rows: [
                ['Point-to-site VPN', 'Individual clients over internet (IKEv2/OpenVPN, Entra auth)', 'Low', 'Remote admins and developers'],
                ['Site-to-site VPN', 'IPsec over internet between gateways', 'Moderate, variable latency', 'Branch offices, quick start, ExpressRoute backup'],
                ['ExpressRoute', 'Private circuit via provider, BGP peering', 'High, predictable', 'Enterprise datacenter connectivity, large data transfer, compliance'],
                ['Virtual WAN', 'Microsoft-managed hub-and-spoke with integrated VPN/ExpressRoute/firewall', 'Scales globally', 'Many branches and regions, any-to-any transit'],
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'ExpressRoute is private but **not encrypted** by default — add MACsec (ExpressRoute Direct) or IPsec over the circuit if your compliance rules require encryption in transit. And plan resilience explicitly: one circuit terminates in one peering location, so critical sites use two circuits in different locations (or a VPN fallback).',
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Centralize private DNS zones in the connectivity (hub) subscription and use Azure Policy (`DeployIfNotExists`) to register every new private endpoint in them automatically. Letting each team create its own copy of `privatelink.database.windows.net` leads to split-brain DNS where some VNets resolve the private IP and others resolve nothing.',
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
              code: 'flowchart TB\n  Users(("Global Users")) --> FD["Azure Front Door<br/>(global, L7, edge cache + WAF)"]\n  FD --> AGW1["Application Gateway<br/>(East US, L7, WAF)"]\n  FD --> AGW2["Application Gateway<br/>(West Europe, L7, WAF)"]\n  AGW1 --> LB1["Load Balancer<br/>(East US, L4)"]\n  AGW2 --> LB2["Load Balancer<br/>(West Europe, L4)"]\n  LB1 --> VM1["VM instances"]\n  LB2 --> VM2["VM instances"]',
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Using a plain Load Balancer when the actual requirement is "route `/api/*` to one backend pool and `/images/*` to another" will not work — Layer 4 has no visibility into the URL path at all. That is specifically an Application Gateway (or Front Door) capability, since it requires Layer-7 inspection.',
            },
            {
              type: 'heading',
              text: 'Details That Decide Real Designs',
            },
            {
              type: 'list',
              items: [
                '**Use Standard Load Balancer**, not Basic — Basic has been retired. Standard is secure by default (closed to inbound traffic until an NSG allows it), supports availability zones (zone-redundant frontends), and has an SLA.',
                '**Gateway Load Balancer** chains third-party network virtual appliances (firewalls, IDS) transparently in front of a Standard LB, without UDR gymnastics.',
                '**Application Gateway v2** (Standard_v2 / WAF_v2) adds autoscaling and zone redundancy; the v1 SKU has been retired, so any remaining v1 gateway needs migration. WAF policies use the OWASP Core Rule Set plus bot protection; start in **Detection** mode, tune false positives, then switch to **Prevention**.',
                '**Application Gateway for Containers** is the newer Layer-7 option for AKS (Gateway API / Ingress native), succeeding the Application Gateway Ingress Controller for new clusters.',
                '**Front Door Standard/Premium** replaces Front Door (classic) and Azure CDN Standard from Microsoft (classic) — Front Door classic retires on 31 March 2027 and the classic CDN tier on 30 September 2027. Premium adds Private Link origins (reach origins with no public endpoint) and more advanced WAF/bot rules.',
                '**Lock the origin to Front Door**: a WAF at the edge is pointless if attackers can hit the origin IP directly. Restrict origins by the `AzureFrontDoor.Backend` service tag **and** validate the `X-Azure-FDID` header, or better, use Private Link origins.',
                '**Azure Traffic Manager** and **Cross-region Load Balancer** cover non-HTTP global distribution; a regional LB, App Gateway, and Front Door are not mutually exclusive — pick the layers your traffic actually needs rather than stacking all three by default.',
              ],
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
            'Azure offers CDN through partnered providers (and Front Door increasingly consolidates CDN + global load balancing + WAF into one product) — for new designs, Front Door Standard/Premium is the recommended path. Azure CDN Standard from Microsoft (classic) and Front Door (classic) have announced retirement dates (30 September 2027 and 31 March 2027 respectively), so existing profiles should migrate.',
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
              code: 'flowchart TB\n  WAF["Well-Architected<br/>Framework"] --> R["Reliability"]\n  WAF --> S["Security"]\n  WAF --> C["Cost Optimization"]\n  WAF --> O["Operational Excellence"]\n  WAF --> P["Performance Efficiency"]\n  R --- R1["Redundancy, tested failover,<br/>health probes"]\n  S --- S1["Least privilege,<br/>defense in depth, Zero Trust"]\n  C --- C1["Right-sizing, reservations,<br/>eliminate waste"]\n  O --- O1["IaC, CI/CD, monitoring,<br/>postmortems"]\n  P --- P1["Load testing, caching,<br/>autoscaling, right-sizing"]',
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
              code: 'flowchart TB\n  DNS["Azure Traffic Manager<br/>(DNS-based, Priority routing)"] -->|healthy: 100% traffic| Primary["Region: East US<br/>(active)"]\n  DNS -.->|"failover only<br/>if primary unhealthy"| Secondary["Region: West US<br/>(passive standby)"]\n  Primary --> PrimaryDB[("Primary DB<br/>read/write")]\n  PrimaryDB -.async geo-replication.-> SecondaryDB[("Secondary DB<br/>read-only replica")]\n  Secondary -.-> SecondaryDB',
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
            {
              type: 'heading',
              text: 'Composite SLAs, Backup vs DR, and Testing',
            },
            {
              type: 'p',
              text: 'A chain of dependent services multiplies availability. A web tier at 99.95% in front of a database at 99.99% and a cache at 99.9% has a composite SLA of roughly 0.9995 x 0.9999 x 0.999 = 99.84% — worse than any single component. Redundant (parallel) paths improve it: two independent regions each at 99.9% yield roughly 1 - (0.001 x 0.001) = 99.9999% *in theory*, but only if failover itself works, which is why the practical ceiling is set by your failover automation and testing, not by the arithmetic. SLAs also only promise service credits, not that your app is up.',
            },
            {
              type: 'table',
              headers: ['Tool', 'What it does', 'Notes'],
              rows: [
                ['Azure Backup', 'Policy-based, point-in-time backups for VMs, SQL in VMs, Files, Blobs, disks, and more, into a Recovery Services or Backup vault', 'Protects against deletion, corruption, ransomware (enable immutability and soft delete); not a fast failover mechanism'],
                ['Azure Site Recovery (ASR)', 'Continuous replication of VMs to another region/zone with orchestrated failover plans', 'Typical RPO of seconds to minutes; plan recovery groups and test failover in an isolated network'],
                ['Native geo-replication (SQL failover groups, Cosmos multi-region, GZRS)', 'Service-level replication managed by the PaaS service', 'Preferred over ASR whenever the service offers it'],
                ['Azure Chaos Studio', 'Fault injection (zone down, latency, CPU pressure, service faults) against real resources', 'The honest way to learn whether your redundancy works before an outage does'],
              ],
            },
            {
              type: 'callout',
              kind: 'warning',
              text: 'Replication is not backup. A dropped table, an application bug writing bad data, or ransomware encryption is faithfully replicated to every geo-redundant copy within seconds. Keep immutable, versioned backups with tested restores in addition to HA/DR replication — and rehearse the restore; an untested backup is a hope, not a control.',
            },
            {
              type: 'list',
              items: [
                '**Health modeling:** define what "healthy" means per user-facing flow (not just "VM is up"), and have Front Door / load balancer probes hit a deep health endpoint that checks critical dependencies — carefully, to avoid cascading failures where a slow database marks every instance unhealthy at once.',
                '**Graceful degradation** (serve cached data, queue writes, disable non-critical features) often buys more availability than another region does.',
                '**Failback** is its own plan: after failing over, data written in the secondary must be reconciled back. Practice it, not just the forward failover.',
              ],
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
              code: `@description('Globally unique-ish app name; also used as a naming prefix')
param appName string
param location string = resourceGroup().location
@allowed(['Standard_LRS', 'Standard_ZRS', 'Standard_GZRS'])
param storageSkuName string = 'Standard_ZRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: toLower(replace('st\${appName}', '-', ''))
  location: location
  sku: { name: storageSkuName }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false   // data access only via Entra ID + RBAC
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '\${appName}-plan'
  location: location
  sku: { name: 'P1v3' }
}

resource webApp 'Microsoft.Web/sites@2023-12-01' = {
  name: appName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        // identity-based access: no key, no connection string
        { name: 'STORAGE_ACCOUNT_NAME', value: storageAccount.name }
      ]
    }
  }
}

// built-in role: Storage Blob Data Contributor
var blobContributorRoleId = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'

resource blobAccess 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(storageAccount.id, webApp.id, blobContributorRoleId)
  properties: {
    principalId: webApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', blobContributorRoleId)
  }
}

output webAppUrl string = 'https://\${webApp.properties.defaultHostName}'`,
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  Bicep["main.bicep<br/>(human-authored, concise)"] -->|az bicep build| ARMJson["ARM JSON template<br/>(what actually gets submitted)"]\n  ARMJson --> Deploy["az deployment group create"]\n  Deploy --> ARM["Azure Resource Manager"]\n  ARM --> Resources["Actual Azure resources"]',
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
              text: 'Notice `webApp.identity.principalId` and `storageAccount.name` referenced directly — Bicep automatically infers the dependency order (web app before role assignment) from those symbolic references, without an explicit `dependsOn`. Explicit `dependsOn` is only needed when there is no direct reference. Also notice what is *absent*: no `listKeys()` and no secret in app settings. Putting account keys into app settings (a common older sample) leaks them into deployment history and the portal.',
            },
            {
              type: 'heading',
              text: 'Modules, Parameter Files, and Registries',
            },
            {
              type: 'code',
              language: 'text',
              title: 'main.bicep composing a reusable module, with a typed .bicepparam file',
              code: `targetScope = 'subscription'

param env string
param location string = 'westeurope'

resource rg 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-payments-\${env}-weu-001'
  location: location
}

// module from a private Bicep registry (an Azure Container Registry), pinned to a version
module app 'br:contosoregistry.azurecr.io/bicep/modules/web-app:1.4.0' = {
  scope: rg
  name: 'app-\${env}'
  params: {
    appName: 'payments-\${env}'
    location: location
  }
}

// --- prod.bicepparam ---
// using './main.bicep'
// param env = 'prod'`,
            },
            {
              type: 'list',
              items: [
                '**Parameter files** (`.bicepparam`) are type-checked against the template, unlike loose JSON parameter files, and can read environment values and Key Vault references.',
                '**Registries and template specs:** publish vetted modules to a private Bicep registry (an ACR) and consume them with a pinned version — **Azure Verified Modules (AVM)** provide Microsoft-maintained, well-architected modules for Bicep and Terraform so you rarely write storage or VNet modules from scratch.',
                '**Pipeline shape:** `az bicep build`/linter (`bicepconfig.json` rules) on pull request, `what-if` posted as a PR comment, then deployment from a federated identity on merge — the same code-review discipline as application code.',
                '**Terraform vs Bicep:** Bicep gets day-zero support for every new Azure feature and needs no state storage; Terraform shines for multi-cloud and non-Azure providers (GitHub, Datadog, Entra via the `azuread` provider). Many shops use Terraform with the `azurerm`/`azapi` providers; both are valid, and the *wrong* choice is mixing tools on the same resources.',
                '**Drift:** console changes diverge from code. Detect with `what-if` or Terraform plan on a schedule, prevent with Azure Policy and Deployment Stacks deny settings, and treat the portal as read-only in production.',
              ],
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
              code: 'flowchart LR\n  Spend["Total compute spend"] --> Base["Reserved baseline<br/>(steady, known load)"]\n  Spend --> Elastic["Pay-as-you-go<br/>(variable, unpredictable spikes)"]\n  Spend --> SpotWork["Spot VMs<br/>(interruption-tolerant batch work)"]',
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
            {
              type: 'heading',
              text: 'FinOps in Practice',
            },
            {
              type: 'list',
              items: [
                '**Inform, Optimize, Operate** is the FinOps loop: make cost visible per team (tags, subscriptions, showback), act on the biggest levers, then build recurring reviews. Treat cost as an engineering metric next to latency and error rate.',
                '**Rightsize before you reserve.** Buying a reservation for an oversized VM locks in waste. Fix size first (Advisor / metrics), then commit — reservations and Savings Plans apply automatically to matching usage, so there is nothing to attach.',
                '**Savings Plan vs Reservation:** Savings Plans (hourly commitment) are flexible across VM families, regions, and some other compute services; reservations give slightly deeper discounts for a very specific SKU and also cover non-compute resources like SQL, Cosmos DB, and storage capacity.',
                '**Turn things off:** auto-shutdown or schedules for dev/test VMs, scale-to-zero for non-production Container Apps/Functions, serverless SQL auto-pause, and deleting orphaned disks, public IPs, and unattached NICs that keep billing silently.',
                '**Data egress and cross-zone/region traffic** is a recurring surprise line item; keep chatty tiers co-located, use private endpoints and CDN caching, and check inter-zone transfer for high-volume designs.',
                '**Log ingestion is often the largest hidden cost.** Verbose Application Insights sampling off, debug logs in production, and duplicate diagnostic settings can dominate a bill; use sampling, table plans (Basic/Auxiliary logs for high-volume low-value data), daily caps, and retention tiers.',
                '**Anomaly detection and budgets** in Cost Management alert on unusual daily spend, and budgets can trigger action groups (e.g., a runbook that deallocates sandbox VMs).',
              ],
            },
            {
              type: 'callout',
              kind: 'tip',
              text: 'Exact discount percentages vary by service, term, and region and change over time. Treat figures such as "up to 72%" as marketing ceilings, and compute savings with the Azure Pricing Calculator and your own Cost Management data before committing.',
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
              code: 'flowchart LR\n  App["App Service<br/>(managed identity)"] -->|"1. request token<br/>for Key Vault"| Entra["Entra ID"]\n  Entra -->|2. token| App\n  App -->|"3. GET secret<br/>(token attached)"| KV["Key Vault"]\n  KV -->|4. RBAC check| KV\n  KV -->|5. secret value| App\n  KV -.audit log.-> LA[("Log Analytics")]',
            },
            {
              type: 'code',
              language: 'bash',
              title: 'creating a vault, a secret, and referencing it from App Service',
              code: `az keyvault create --name kv-app-a --resource-group rg-app-a-web \\
  --location eastus --enable-rbac-authorization true \\
  --enable-purge-protection true --retention-days 90 \\
  --public-network-access Disabled

# soft-delete is always on for new vaults; purge protection is what stops a purge
az keyvault secret set --vault-name kv-app-a \\
  --name "SqlConnectionString" --value "<connection-string>"

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
              text: 'Soft-delete is now always on for new vaults, but **purge protection** is opt-in and should be enabled on every production vault — without it, anyone with purge permission can permanently destroy deleted secrets or the whole vault immediately, whether by mistake or malice. Note that purge protection is irreversible once enabled, and any customer-managed-key (CMK) encryption for Storage/SQL/disks requires it.',
            },
            {
              type: 'heading',
              text: 'Key Vault Design Decisions',
            },
            {
              type: 'table',
              headers: ['Decision', 'Guidance'],
              rows: [
                ['Vault per what?', 'One vault per application per environment per region. A single shared vault concentrates blast radius and throttling; per-vault RBAC keeps teams out of each other\'s secrets'],
                ['Standard vs Premium vs Managed HSM', 'Standard: software-protected keys. Premium: HSM-backed keys (FIPS 140 validated). Managed HSM: single-tenant, dedicated HSM pool for strict compliance and customer-controlled security domain'],
                ['Access model', 'Azure RBAC (e.g., Key Vault Secrets User, Key Vault Crypto User, Key Vault Administrator); access policies are legacy and cannot express per-secret scope the way RBAC can'],
                ['Secrets vs certificates', 'Use the certificate object for TLS certs so Key Vault can auto-renew with integrated CAs and notify; do not store PFX files as plain secrets'],
                ['Rotation', 'Define rotation policies and use Event Grid `NearExpiry` events to trigger rotation functions; prefer designs where there is nothing to rotate (managed identities)'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Throttling:** vaults have per-vault request limits. Cache secrets in memory in your app (refreshing on a timer or on failure) instead of fetching on every request — App Service Key Vault references and the Container Apps secret references already cache for you.',
                '**Key Vault references** resolve at app start and refresh periodically; a rotated secret can take time to reach running instances, and a restart forces an immediate refresh. Referencing a versionless secret URI picks up new versions automatically.',
                '**Envelope encryption:** keys in Key Vault typically wrap data-encryption keys (DEKs) rather than encrypt bulk data directly, which keeps the master key inside the HSM boundary and makes rotation cheap.',
                '**Network:** with the firewall on, "Allow trusted Microsoft services" lets specific first-party services through; prefer private endpoints and explicit allow rules.',
                '**Audit:** send `AuditEvent` logs to Log Analytics and alert on anomalous `SecretGet` or `KeyDecrypt` volume or unfamiliar callers.',
              ],
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
              code: 'flowchart TB\n  Resources["Azure resources<br/>(VMs, App Service, SQL, ...)"] -->|metrics| Metrics["Azure Monitor Metrics<br/>(near-real-time, numeric)"]\n  Resources -->|diagnostic logs| LA["Log Analytics Workspace<br/>(KQL queryable)"]\n  App["Application code"] -->|SDK/auto-instrumentation| AI["Application Insights<br/>(requests, dependencies,<br/>exceptions, traces)"]\n  AI --> LA\n  Metrics --> Alerts["Alert Rules"]\n  LA --> Alerts\n  Alerts --> AG["Action Group:<br/>email / SMS / webhook / Function / autoscale"]',
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
            {
              type: 'heading',
              text: 'Modern Instrumentation: OpenTelemetry and Workspace-Based Insights',
            },
            {
              type: 'list',
              items: [
                '**Application Insights is workspace-based**: telemetry lands in a Log Analytics workspace (classic standalone resources were retired), so one KQL surface, one RBAC model, and one retention policy covers app and infrastructure logs.',
                '**OpenTelemetry is the strategic direction.** The Azure Monitor OpenTelemetry distros (for .NET, Java, Node.js, Python) emit standard OTel traces, metrics, and logs, so instrumentation is vendor-neutral and you can dual-export. The older Application Insights classic SDKs are in maintenance mode for new work. Java, Node.js, and Python apps on App Service and Functions can often be auto-instrumented with no code change.',
                '**Sampling controls cost.** Adaptive or fixed-percentage sampling keeps representative traces while cutting ingestion; sample *requests and dependencies* together so traces stay coherent, and never sample exceptions away blindly.',
                '**Azure Monitor Agent (AMA)** with **Data Collection Rules (DCRs)** replaces the legacy Log Analytics (MMA) agent for VM logs and metrics; DCRs also let you filter and transform data at ingestion to cut volume.',
                '**Managed Prometheus and Managed Grafana** provide Kubernetes and custom metrics without running your own Prometheus; Container Insights covers logs.',
                '**Alert design:** alert on symptoms users feel (error rate, latency SLO burn rate, failed availability tests) rather than every CPU spike; use alert processing rules to suppress during maintenance and action groups to route by severity.',
              ],
            },
            {
              type: 'code',
              language: 'text',
              title: 'KQL: error rate and slowest dependencies, correlated across a trace',
              code: `// failure rate per 5 minutes
requests
| where timestamp > ago(6h)
| summarize total = count(), failed = countif(success == false) by bin(timestamp, 5m)
| extend failureRate = round(100.0 * failed / total, 2)
| render timechart

// which downstream dependency is dragging p95?
dependencies
| where timestamp > ago(1h)
| summarize p95 = percentile(duration, 95), calls = count() by type, target
| order by p95 desc
| take 10`,
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Turning on diagnostic settings for every resource into one workspace without a plan is the fastest way to a surprise bill. Decide which categories you actually query, route high-volume low-value logs to cheaper tables or storage, and set retention per table. Also centralize workspaces by environment/region and compliance boundary — not one per application, and not one for the whole company.',
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
              code: 'flowchart TB\n  Root["Tenant Root Management Group"] --> Platform["Management Group: Platform"]\n  Root --> LZ["Management Group: Landing Zones"]\n  Platform --> Identity["Subscription: Identity"]\n  Platform --> Connectivity["Subscription: Connectivity<br/>(hub VNet, firewall, DNS)"]\n  Platform --> Mgmt["Subscription: Management<br/>(Log Analytics, Automation)"]\n  LZ --> Corp["Management Group: Corp"]\n  LZ --> Online["Management Group: Online"]\n  Corp --> SubA["Subscription: App Team A"]\n  Online --> SubB["Subscription: App Team B"]\n  Platform -.policy + RBAC inherited by.-> LZ',
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
            {
              type: 'heading',
              text: 'Policy Mechanics and Rollout',
            },
            {
              type: 'list',
              items: [
                '**Evaluation timing:** `Deny` blocks at ARM request time; existing non-compliant resources are found by periodic compliance scans (and on demand). `Audit`-only results do not change anything — a dashboard full of red nobody acts on is theater.',
                '**Remediation tasks** apply `DeployIfNotExists` and `Modify` policies to existing resources, using the policy assignment\'s managed identity, which needs the right RBAC role on the target scope.',
                '**Roll out safely:** start in `Audit` (or `DoNotEnforce` enforcement mode), review the impact, then switch to `Deny`. Use **exemptions** (with expiry) for justified exceptions rather than weakening the policy for everyone.',
                '**Prefer built-in policies and initiatives** (such as the Microsoft cloud security benchmark, which Defender for Cloud assesses) before writing custom ones; assign at management-group scope and parameterize.',
                '**Azure Blueprints is deprecated.** Its role is now split: template specs or Git hold versioned definitions, and **Deployment Stacks** manage deployed lifecycle and protect resources with deny settings. Landing zone accelerators today are delivered as Bicep or Terraform modules (see Azure Verified Modules).',
                '**Subscription vending** automates creating a new subscription already placed in the right management group, with budgets, networking, policy, and RBAC applied — the factory that makes landing zones scale without a ticket queue.',
              ],
            },
            {
              type: 'code',
              language: 'bash',
              title: 'assign a built-in policy at management-group scope in audit mode first',
              code: `# find the built-in definition by display name
az policy definition list \\
  --query "[?displayName=='Allowed locations'].name" -o tsv

az policy assignment create --name allowed-locations \\
  --display-name "Allowed locations (EU only)" \\
  --scope "/providers/Microsoft.Management/managementGroups/mg-landing-zones" \\
  --policy <definition-name-from-above> \\
  --params '{ "listOfAllowedLocations": { "value": ["westeurope", "northeurope"] } }' \\
  --enforcement-mode DoNotEnforce      # flip to Default once compliance impact is understood`,
            },
          ],
        },
        {
          id: 'defender-security-posture',
          title: 'Security Posture: Defender for Cloud, Zero Trust & Defense in Depth',
          summary:
            'Azure security is layered: identity, network, data, workload, and governance controls, with Microsoft Defender for Cloud providing posture assessment (CSPM) and threat protection (CWPP) across them.',
          keyPoints: [
            '**Zero Trust** means verify explicitly (strong authN, device and risk signals), use least privilege (JIT/JEA, scoped RBAC), and assume breach (segment, encrypt, log everything). Network location is no longer a trust signal.',
            '**Defender for Cloud** has two halves: **CSPM** (secure score, recommendations, attack-path analysis against the Microsoft cloud security benchmark) and **CWPP** (per-workload Defender plans for servers, containers, storage, databases, App Service, Key Vault, and APIs that detect threats at runtime).',
            '**Encryption**: data is encrypted at rest by default with platform-managed keys; customer-managed keys (CMK in Key Vault/Managed HSM) add control and revocation; TLS 1.2+ protects data in transit; **confidential computing** protects data in use.',
            'The security baseline is mostly *not* exotic: no public IPs on VMs, private endpoints, no shared keys, managed identities, MFA/PIM for humans, policy guardrails, and logging — most breaches exploit the gaps in these basics.',
          ],
          blocks: [
            {
              type: 'mermaid',
              code: 'flowchart TB\n  subgraph Identity["Identity"]\n    I1["Entra ID, MFA, Conditional Access, PIM"]\n  end\n  subgraph Network["Network"]\n    N1["Private endpoints, NSG, Firewall, WAF, DDoS Protection"]\n  end\n  subgraph Compute["Compute and workload"]\n    C1["Defender plans, Update Manager, Trusted Launch"]\n  end\n  subgraph Data["Data"]\n    D1["Encryption, Key Vault, Purview, backup immutability"]\n  end\n  subgraph Gov["Governance and monitoring"]\n    G1["Policy, Defender for Cloud, Sentinel, Activity and resource logs"]\n  end\n  Identity --> Network --> Compute --> Data\n  Gov -.-> Identity\n  Gov -.-> Network\n  Gov -.-> Compute\n  Gov -.-> Data',
            },
            {
              type: 'table',
              headers: ['Service', 'Role', 'Notes'],
              rows: [
                ['Microsoft Defender for Cloud', 'Posture management plus workload threat detection', 'Free foundational CSPM; paid Defender plans are enabled per resource type'],
                ['Microsoft Sentinel', 'Cloud-native SIEM/SOAR on top of Log Analytics', 'Ingests Azure, Entra, M365, and third-party logs; analytics rules and playbooks (Logic Apps)'],
                ['Azure Firewall', 'Managed network firewall with FQDN rules, threat intel, TLS inspection (Premium)', 'Usually deployed in the hub VNet with UDRs forcing egress through it'],
                ['Azure DDoS Protection', 'Enhanced L3/L4 DDoS mitigation with rapid response support', 'Basic protection is automatic; the paid tier adds adaptive tuning and cost protection for public IPs'],
                ['Azure Bastion', 'Browser/native-client RDP and SSH over TLS without public VM IPs', 'Pair with JIT access and disable direct management ports'],
                ['Microsoft Purview', 'Data governance, classification, and sensitivity labeling', 'Helps find where regulated data actually lives'],
              ],
            },
            {
              type: 'list',
              items: [
                '**Start with the secure score recommendations that remove the biggest risks**: exposed management ports, missing MFA for admins, storage accounts with public access, unpatched VMs, and overpermissioned identities.',
                '**Attack-path analysis** shows how an internet-exposed VM with a managed identity holding Contributor chains to a sensitive database — the context a flat list of findings lacks.',
                '**Shift left:** Defender for DevOps / GitHub Advanced Security scan IaC and code; Defender for Containers scans images in ACR and checks AKS runtime and admission policy.',
                '**Break-glass accounts:** keep two cloud-only emergency admin accounts excluded from Conditional Access, protected by hardware keys, and monitored by alerts — so a Conditional Access mistake cannot lock the whole tenant out.',
                '**Centralize logs** (Activity Log, Entra sign-in and audit logs, resource logs) into a workspace with enough retention for investigations; you cannot investigate what you did not collect.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Network Security Groups and "private" networking do not protect you from a stolen credential or an over-permissioned identity. Many real Azure incidents were identity-based: leaked client secrets, tokens, or SAS URLs. Treat identity as the primary perimeter and eliminate long-lived secrets (managed identities, workload identity federation, user-delegation SAS).',
            },
          ],
        },
        {
          id: 'azure-ai-foundry',
          title: 'Azure AI Platform: Microsoft Foundry, Azure OpenAI Models & Secure Patterns',
          summary:
            'Microsoft Foundry (formerly Azure AI Foundry) is the unified Azure platform for building AI apps and agents: model catalog, deployments, evaluation, safety, and agent tooling — with the same identity, networking, and governance you apply to any other Azure workload.',
          keyPoints: [
            'Naming has shifted several times: Azure AI Studio became Azure AI Foundry (late 2024) and was renamed **Microsoft Foundry** at Ignite 2025; Azure OpenAI models are presented in Foundry as models sold directly by Azure. Verify current names in the docs, because portals and SDKs evolve quickly.',
            'You **deploy** a model to get an endpoint. The **deployment type** decides data-processing location and billing: Global, Data Zone, or Regional, each as Standard (pay per token), Provisioned (reserved PTUs for predictable latency), or Batch (asynchronous, discounted).',
            'Production apps use **Entra ID / managed identity** (role such as Cognitive Services OpenAI User) instead of API keys, private endpoints for network isolation, and content filtering plus evaluation for safety.',
            'Treat model calls like any dependency: they are rate-limited (tokens per minute and requests per minute quotas), can return 429, and need retries, timeouts, caching, and fallbacks.',
          ],
          blocks: [
            {
              type: 'table',
              headers: ['Deployment type', 'Billing', 'Data processing', 'Choose it when'],
              rows: [
                ['Global Standard', 'Pay per token', 'Any Azure region where the model is available (data at rest stays in your chosen geography)', 'Default starting point: highest default quota, best availability'],
                ['Data Zone Standard', 'Pay per token', 'Kept inside a zone such as US or EU', 'Residency requirements without a single-region constraint'],
                ['Regional Standard', 'Pay per token', 'Single region', 'Strict regional processing needs'],
                ['Provisioned (Global / Data Zone / Regional)', 'Reserved PTUs', 'Per the chosen scope', 'Steady, latency-sensitive production traffic needing consistent throughput'],
                ['Batch (Global / Data Zone)', 'Discounted per token, up to 24h turnaround', 'Per the chosen scope', 'Offline scoring, enrichment, evaluation runs'],
              ],
            },
            {
              type: 'mermaid',
              code: 'flowchart LR\n  App["App Service / Container App<br/>managed identity"] -->|"private endpoint"| GW["API gateway (optional)<br/>APIM: auth, quota, logging"]\n  GW --> Model["Foundry model deployment<br/>content filters"]\n  App --> Search[("Azure AI Search<br/>vector + keyword index")]\n  App --> Cosmos[("Cosmos DB<br/>chat history, agent memory")]\n  Search -.->|"grounding documents"| App\n  Model -.-> Mon["Azure Monitor / OpenTelemetry<br/>token usage, latency, evals"]',
            },
            {
              type: 'code',
              language: 'python',
              title: 'calling a deployed model with Entra ID instead of an API key',
              code: `from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from openai import AzureOpenAI

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://cognitiveservices.azure.com/.default"
)

client = AzureOpenAI(
    azure_endpoint="https://my-foundry-resource.openai.azure.com",
    azure_ad_token_provider=token_provider,   # no key in code or config
    api_version="2024-10-21",                 # pin the API version you tested
    max_retries=4,
)

resp = client.chat.completions.create(
    model="my-deployment-name",               # the DEPLOYMENT name, not the base model name
    messages=[{"role": "user", "content": "Summarize our refund policy in two lines."}],
    temperature=0.2,
)
print(resp.choices[0].message.content, resp.usage.total_tokens)`,
            },
            {
              type: 'list',
              items: [
                '**RAG** (retrieval-augmented generation) is the standard way to ground a model in your data: chunk and embed documents, store them in **Azure AI Search** (hybrid keyword plus vector, semantic ranking) or Cosmos DB / PostgreSQL vector indexes, retrieve top results per query, and pass them in the prompt. Use document-level security trimming so users only retrieve what they may see.',
                '**Agents** combine a model with tools and memory; Foundry provides an agent service, and open protocols such as MCP let tools be shared across agents. Give agents their own managed identity with least-privilege RBAC — an agent with Contributor on the subscription is a prompt-injection incident waiting to happen.',
                '**Safety:** configure content filters, add prompt-injection defenses (treat retrieved text and tool output as untrusted data), and run evaluations (groundedness, relevance, safety) in CI so prompt or model changes cannot regress silently.',
                '**Cost and capacity:** tokens drive cost; cap output length, cache repeated prompts, route simple tasks to smaller models, and use Batch for offline work. Put an API gateway (API Management) in front for per-team quotas, token-limit policies, load balancing across deployments, and audit logging.',
                '**Model lifecycle:** models are versioned and eventually retired. Pin versions, subscribe to retirement notices, and keep an evaluation suite so you can swap models confidently.',
              ],
            },
            {
              type: 'callout',
              kind: 'pitfall',
              text: 'Shipping API keys in app settings or front-end code is the most common AI-on-Azure security failure. Disable key-based auth on the resource (`disableLocalAuth`), use managed identities, and put the model endpoint behind a private endpoint. Also remember the `model` argument is your deployment name: renaming or deleting a deployment silently breaks callers.',
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
              code: 'flowchart TB\n  Users(("Users")) --> FD["Azure Front Door<br/>(WAF, edge cache, global routing)"]\n  FD --> AGW["Application Gateway<br/>(regional, per-region WAF)"]\n  AGW --> AppSvc["App Service<br/>(VNet-integrated, autoscale,<br/>slots for safe deploys)"]\n  AppSvc -->|managed identity| KV["Key Vault<br/>(secrets, connection info)"]\n  AppSvc -->|private endpoint| SQL[("Azure SQL Database<br/>zone-redundant + geo-replica")]\n  AppSvc -->|private endpoint| Cosmos[("Cosmos DB<br/>multi-region reads")]\n  AppSvc -->|private endpoint| Blob[("Blob Storage<br/>static assets, uploads")]\n  Users -->|sign in| Entra["Entra ID"]\n  AppSvc -.telemetry.-> AI["Application Insights"]\n  AI --> LA[("Log Analytics")]\n  Policy["Azure Policy"] -.governs.-> AppSvc\n  Policy -.governs.-> SQL',
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
              question: "What is the difference between Microsoft Entra ID (formerly Azure AD) and Azure RBAC?",
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
            {
              question: 'A developer is Owner on a storage account but gets a 403 reading a blob. Why, and how do you fix it properly?',
              answer:
                'Owner is a **control-plane** role: it lets the developer manage the account, not necessarily read the data in it. Blob reads are **data-plane** operations, authorized by data roles such as Storage Blob Data Reader/Contributor (or by account keys/SAS if shared-key access is still allowed). If the account has shared-key access disabled, which is best practice, the developer needs an explicit data role assignment at the narrowest scope that works (the container, ideally). Be aware role assignments can take a few minutes to propagate. The wrong fix is to hand out account keys or give Owner more widely; the right fix is a scoped data role assigned to a group, and the same distinction explains why the Activity Log does not show blob reads unless data-plane diagnostic logs are enabled.',
            },
            {
              question: 'How would you give a GitHub Actions pipeline access to deploy to Azure without storing a secret?',
              answer:
                'Use **workload identity federation**. Create a user-assigned managed identity (or app registration) and add a **federated identity credential** that trusts GitHub\'s OIDC issuer with a specific subject, for example `repo:org/app:environment:production`. The workflow requests an OIDC token (`id-token: write`), `azure/login` exchanges it for a short-lived Entra token, and nothing secret is stored anywhere. Security hinges on the subject: bind it to a protected environment with required reviewers, use one identity per environment, and grant RBAC only on the resource groups it deploys to. A broad subject or a subscription-wide Owner identity recreates the risk federation was meant to remove.',
            },
            {
              question: 'Compare Service Bus, Event Grid, and Event Hubs. How do you decide?',
              answer:
                'They model different things. **Service Bus** is a broker for *commands and business messages*: queues/topics, peek-lock, dead-lettering, sessions, duplicate detection, transactions. **Event Grid** routes *discrete events* ("something happened") to handlers with filtering and retries, with no replay. **Event Hubs** is a partitioned *stream* for very high-volume telemetry with consumer-managed offsets and replay within retention. Rule of thumb: if losing or double-processing one message has business consequences and you need per-message settlement, Service Bus; if reacting to state changes across services, Event Grid; if ingesting firehoses of data for analytics, Event Hubs. In all cases delivery is at-least-once, so consumers must be idempotent, and writes to a database plus a message should use an outbox to stay consistent.',
            },
            {
              question: 'What is the difference between a private endpoint and a service endpoint, and why is DNS the usual cause of private endpoint problems?',
              answer:
                'A **service endpoint** extends your subnet identity to a public PaaS endpoint so its firewall can allow your subnet; the destination IP is still public and it does not work from on-premises. A **private endpoint** injects a NIC with a private IP for one specific resource into your subnet, works from peered VNets and on-prem over VPN/ExpressRoute, and lets you disable public access entirely. Because clients still use the normal hostname (`acct.blob.core.windows.net`), DNS must return the private IP: the name CNAMEs to `privatelink.*`, which must be resolved by a Private DNS zone linked to the VNet (and, for on-prem clients, forwarded through an Azure DNS Private Resolver). Missing zone links, duplicated zones across subscriptions, or on-prem DNS that never forwards are why traffic fails or silently goes to the public IP.',
            },
            {
              question: 'Why can a VM no longer assume it has outbound internet access, and what should you configure?',
              answer:
                'The implicit "default outbound access" IP was a Microsoft-owned address that was unpredictable, not allow-listable, and not under your control. Newly created VNets now default to **private subnets** (changed from 31 March 2026 for newer API versions), so VMs need explicit egress. Existing VNets are not broken, but best practice is the same everywhere: attach a **NAT Gateway** for predictable static outbound IPs and a large SNAT port pool, or route egress through Azure Firewall/an NVA via a UDR when inspection is required. Use private endpoints for Azure PaaS access so that traffic bypasses SNAT entirely, and reuse connections to avoid SNAT port exhaustion.',
            },
            {
              question: 'Which Azure Functions hosting plan would you choose for a new project today, and what changed recently?',
              answer:
                '**Flex Consumption** is the default recommendation for new serverless workloads: scale to zero, per-execution billing, VNet integration, per-function scaling, and optional always-ready instances to kill cold starts. The legacy Linux Consumption plan gets no new features and retires on 30 September 2028, so migrate those apps. Choose Premium when you need long-proven pre-warmed instances and features, Dedicated when you already own App Service capacity, and Container Apps when you want a container-based hosting model. For .NET, use the isolated worker model: in-process support ends on 10 November 2026. Regardless of plan, reuse SDK clients, make handlers idempotent, and remember HTTP-triggered functions have a roughly 230-second response ceiling.',
            },
            {
              question: 'How do deployment stacks differ from plain deployments, and where do they fit relative to Azure Blueprints?',
              answer:
                'A normal ARM/Bicep deployment pushes resources but forgets about them afterward; removing a resource from the template does not delete it unless you use risky Complete mode. A **deployment stack** records the set of managed resources, can **delete or detach** resources removed from the template, and supports **deny settings** that block out-of-band edits except for excluded principals. That covers what Azure Blueprints offered for lifecycle and resource locking, which is why Blueprints is deprecated: versioned definitions now live in template specs or Git, and stacks do the deployment and protection. Use stacks for environments or shared platform components where drift is unacceptable.',
            },
            {
              question: 'Design a DR strategy for a business-critical API with an RTO of 15 minutes and an RPO of 1 minute.',
              answer:
                'Those numbers rule out cold standby and restore-from-backup as the primary mechanism. I would run **active-passive warm** (or active-active if the budget and data model allow) across two regions: Front Door fronting both with health probes; compute pre-provisioned and scaled down in the secondary, deployed from the same Bicep and pipeline; zone-redundant services within each region; data replicated asynchronously with native tools (SQL failover group, Cosmos multi-region, GZRS) whose RPO I verify meets one minute under load. Failover must be automated or a single rehearsed runbook, with DNS/routing changes not dependent on long TTLs. I would keep immutable backups separately because replication copies corruption, test with Chaos Studio and scheduled DR drills including failback, and monitor replication lag as an alert so RPO is measured, not assumed.',
            },
            {
              question: 'What does a deny assignment do, and when would an Owner still be blocked from deleting a resource?',
              answer:
                'Role assignments are additive allows, and an Owner at a scope normally can do anything beneath it. Deny assignments are the only construct that explicitly blocks actions even for principals who hold an allowing role, and they cannot be authored directly; the platform creates them, today mostly via **Deployment Stacks deny settings** and managed applications. Separately, **resource locks** (`CanNotDelete`/`ReadOnly`) block control-plane operations even for Owners until the lock is removed, and a `Deny`-effect **Azure Policy** can reject a request regardless of RBAC. So an Owner can be blocked by a lock, a policy, a stack deny setting, or a PIM requirement to activate the role first.',
            },
            {
              question: 'How do you control and reduce Azure Monitor / Log Analytics costs without losing observability?',
              answer:
                'Ingestion volume is the main driver, so treat it like a budget. Decide which log categories you truly query; use data collection rules to filter/transform at ingestion; apply sampling to Application Insights (keeping requests and dependencies coherent); put high-volume, low-value tables on cheaper table plans or archive them; set retention per table; and use daily caps cautiously because they can blind you during an incident. Keep metrics for alerting (cheap, fast) and logs for investigation. Alert on user-facing symptoms (error rate, latency SLO burn) rather than every resource metric, and review the top tables by ingestion monthly.',
            },
            {
              question: 'When would you choose Cosmos DB autoscale, manual throughput, or serverless, and how do you size partitions?',
              answer:
                'Use **manual** provisioned RU/s for steady, predictable load (cheapest per RU), **autoscale** when traffic varies within a known ceiling (it scales between 10% and 100% of the maximum, billed on the peak reached each hour), and **serverless** for small, intermittent, single-region workloads such as dev/test. Throughput is divided across physical partitions, so the partition key must spread both storage and request volume; low-cardinality keys create hot partitions and 429s even when total RU/s looks sufficient. For multi-tenant data with a few huge tenants, hierarchical partition keys avoid the logical-partition size limit. Design around point reads (id plus partition key) and single-partition queries, and measure `x-ms-request-charge` rather than guessing.',
            },
            {
              question: 'Describe how you would secure an Azure OpenAI / Microsoft Foundry model endpoint used by an internal application.',
              answer:
                'Disable key authentication and use **managed identity** with a narrow data-plane role (for example Cognitive Services OpenAI User). Put the resource behind a **private endpoint** with public network access disabled and the right Private DNS zone. Front it with API Management where you need per-team quotas, token-limit policies, central logging, and load balancing across deployments. Enable content filters, treat retrieved documents and tool output as untrusted input to defend against prompt injection, apply security trimming in the retrieval layer, and keep prompts and responses out of logs when they may contain sensitive data. Add evaluation and cost monitoring (token usage per caller), pin model versions, and plan for model retirements.',
            },
            {
              question: 'What is the difference between Azure Backup, Azure Site Recovery, and geo-replication, and why is replication not a backup?',
              answer:
                '**Azure Backup** takes policy-based point-in-time copies to a vault, giving recovery from deletion, corruption, and ransomware (enable soft delete and immutability). **Azure Site Recovery** continuously replicates VMs to another region/zone and orchestrates failover for availability, with RPO typically measured in seconds to minutes. **Native geo-replication** (SQL failover groups, Cosmos DB multi-region, GZRS) is service-managed replication and is preferred when the PaaS service offers it. Replication copies every write, including bad ones: an accidental delete, a buggy migration, or ransomware encryption propagates to the replica within seconds. So you need all three ideas: replication for availability, backups for point-in-time recovery, and rehearsed restores to prove both work.',
            },
          ],
        },
      ],
    },
  ],
}
