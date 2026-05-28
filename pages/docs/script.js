document.addEventListener('DOMContentLoaded', () => {
  // 1. Copy to Clipboard Functionality
  function bindCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
      // Remove old listeners by replacing element (simple way to avoid duplicates if re-bound)
      const newBtn = btn.cloneNode(true);
      if(btn.parentNode) btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', (e) => {
        const card = e.target.closest('.step-card') || e.target.closest('.section-block');
        let textToCopy = '';
        
        const codeBlock = card.querySelector('.code-block:not(.hidden) pre code') || card.querySelector('pre code');
        const terminalBlock = card.querySelector('.t-line');
        
        if (codeBlock) {
          textToCopy = codeBlock.textContent;
        } else if (terminalBlock) {
          textToCopy = terminalBlock.textContent;
        }
        
        if (textToCopy) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = newBtn.textContent;
            newBtn.textContent = '✓';
            newBtn.style.color = '#22c55e'; // success green
            setTimeout(() => {
              newBtn.textContent = originalText;
              newBtn.style.color = '';
            }, 2000);
          });
        }
      });
    });
  }
  bindCopyButtons();

  // 2. Role Selector Dynamic Content
  const roleSnippets = {
    'For Founders': `// Generate an internal tool instantly
import { OneAtlas } from 'oneatlas';

const app = await OneAtlas.generate({
  type: "CRM Dashboard",
  auth: "clerk",
  database: "neon-postgres"
});`,
    'For Engineers': `// Extend with Next.js & Prisma
import { prisma } from '@/lib/db';
import { currentUser } from '@clerk/nextjs';

export async function GET() {
  const user = await currentUser();
  const data = await prisma.project.findMany({
    where: { organizationId: user.orgId }
  });
  return Response.json(data);
}`,
    'For AI Teams': `// Orchestrate AI Models via Gateway
import { AIGateway } from '@oneatlas/ai-engine';

const response = await AIGateway.route({
  prompt: "Generate a sales workflow",
  prefer: "cost-efficiency", // Routes to Claude Haiku/Gemini Flash
  fallback: "reasoning" // Routes to Claude Opus/GPT-4
});`,
    'For Enterprises': `// Deploy to Cloudflare Edge
import { DeploymentEngine } from '@oneatlas/deployment';

await DeploymentEngine.deploy({
  projectId: "crm-app-1",
  runtime: "cloudflare-workers",
  storage: "cloudflare-r2",
  isolation: "schema-level"
});`
  };

  function bindRoleButtons() {
    const roleBtns = document.querySelectorAll('.role-btn');
    const codeBlockSnippet = document.querySelector('.code-block pre code');
    
    roleBtns.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      if(btn.parentNode) btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.role-btn').forEach(b => {
          b.classList.remove('active');
          b.style.borderColor = '';
          b.style.boxShadow = '';
        });
        newBtn.classList.add('active');
        newBtn.style.borderColor = 'var(--color-primary)';
        newBtn.style.boxShadow = 'var(--shadow-sm)';

        // Update snippet
        const roleName = newBtn.querySelector('strong').textContent;
        if (codeBlockSnippet && roleSnippets[roleName]) {
          codeBlockSnippet.style.opacity = '0';
          setTimeout(() => {
            codeBlockSnippet.textContent = roleSnippets[roleName];
            codeBlockSnippet.style.opacity = '1';
          }, 200);
        }
      });
    });
    
    // Set first role as active by default
    const currentBtns = document.querySelectorAll('.role-btn');
    if(currentBtns.length > 0) currentBtns[0].click();
  }
  bindRoleButtons();

  // 3. Toast Notification System
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add to body
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3s
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Theme logic is now handled by shared/js/theme.js

  // 5. Chat Bar Interaction
  const chatInput = document.querySelector('.chat-input-wrapper input');
  const chatSubmit = document.querySelector('.chat-submit');
  const chatActionBtns = document.querySelectorAll('.chat-action-btn');

  function handleChatSubmit() {
    const query = chatInput.value.trim();
    if (query) {
      showToast(`Atlas is thinking about: "${query}"...`, 'info');
      chatInput.value = '';
      
      // Mock response
      setTimeout(() => {
        showToast(`Atlas says: I've found 3 examples for that. Check the Reference section!`, 'success');
      }, 2000);
    }
  }

  if (chatSubmit && chatInput) {
    chatSubmit.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChatSubmit();
    });
  }

  chatActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.textContent;
      chatInput.focus();
    });
  });

  // Adding CSS for Toasts dynamically so we don't have to edit style.css
  const style = document.createElement('style');
  style.textContent = `
    .code-block pre code { transition: opacity 0.2s ease; }
    .toast-container { position: fixed; bottom: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { background: white; border: 1px solid var(--color-border); padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(20px); opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 0.9rem; font-weight: 500; }
    .toast.show { transform: translateY(0); opacity: 1; }
    .toast-success { border-left: 4px solid #22c55e; }
    .toast-info { border-left: 4px solid var(--color-primary); }
    .copy-btn { cursor: pointer; background: none; border: none; font-size: 1.2rem; transition: color 0.2s; }
    .copy-btn:hover { color: var(--color-text); }
  `;
  document.head.appendChild(style);

  // Adding CSS for Content Body transition dynamically
  const extraStyle = document.createElement('style');
  extraStyle.textContent = `
    .content-body { transition: opacity 0.3s ease; }
  `;
  document.head.appendChild(extraStyle);

  // Generic Button Catch & Dynamic Content Switcher
  const contentBody = document.querySelector('.content-body');
  const originalContent = contentBody ? contentBody.innerHTML : '';
  
  const actionLinks = document.querySelectorAll('a.nav-item, a.top-nav-link, a.cap-card, .action-list a, .page-nav a');
  actionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') === '#') {
        e.preventDefault();
        
        // Remove active class from all sidebar links and add to clicked
        document.querySelectorAll('a.nav-item').forEach(l => l.classList.remove('active'));
        if(link.classList.contains('nav-item')) link.classList.add('active');

        const rawText = link.textContent.trim();
        // Extract plain text by stripping leading emojis/icons if present
        const itemName = rawText.replace(/^[^\w\s]+/, '').trim() || rawText;
        const safeKey = itemName.replace(/[^a-zA-Z0-9]/g, '');

        // Utility actions that shouldn't open a doc page
        if (['Copypagelink', 'DownloadSDK', 'Reportanissue', 'RunAPIexample'].includes(safeKey)) {
          showToast(itemName + ' action triggered.', 'info');
          return;
        }

        if (!contentBody) {
          showToast('Opened document: ' + itemName, 'success');
          return;
        }

        // Fade out
        contentBody.style.opacity = '0';
        
        // Define real documentation content mapping
        const docData = {
          'AIEngine': {
            subtitle: 'Core generation, iteration, and repair layer',
            overview: 'The AI Engine is the core brain of OneAtlas. It handles multi-model routing via the Gateway (supporting Claude, Gemini, OpenAI), semantic understanding of user intent, and orchestration of code generation across schemas, UI components, and workflows.',
            code: `import { AIGateway, SchemaGenerator } from '@oneatlas/ai-engine';

// Route prompt to optimal model
const response = await AIGateway.route({
  prompt: "Generate a sales workflow",
  prefer: "cost-efficiency", 
  fallback: "reasoning"
});

// Generate AST and metadata
const schema = await SchemaGenerator.parse(response);`,
            features: [
              { icon: '🔀', title: 'Smart Gateway', desc: 'Routes to Claude, Gemini, or OpenAI based on task.' },
              { icon: '🧠', title: 'Understanding', desc: 'Parses and enriches user intent securely.' },
              { icon: '🔧', title: 'Auto-Repair', desc: 'Self-healing iteration and output validation.' }
            ]
          },
          'SubdomainRouting': {
            subtitle: 'Automatic isolated environments',
            overview: 'Every generated app in OneAtlas is deployed to its own dedicated subdomain instantly (e.g. crm.oneatlas.app). We avoid path-based routing to ensure maximum isolation, enterprise scaling, and better SSL handling.',
            code: `// Apps are routed at the edge
export function edgeRouter(request) {
  const host = request.headers.get('host');
  const tenant = parseSubdomain(host);
  
  if (!tenant) return Response.redirect('https://oneatlas.dev');
  return renderTenantApp(tenant);
}`,
            features: [
              { icon: '🌍', title: 'Edge Routing', desc: 'Handled directly by Cloudflare.' },
              { icon: '🔒', title: 'SSL', desc: 'Automatic certs per subdomain.' },
              { icon: '🏢', title: 'Enterprise Ready', desc: 'Pre-requisite for custom domains.' }
            ]
          },
          'EdgeIsolation': {
            subtitle: 'Multi-tenant runtime sandboxing',
            overview: 'Code generated by OneAtlas executes in shared V8 isolates via Cloudflare Workers. This provides 0ms cold starts while maintaining strict memory and execution boundaries between tenants.',
            code: `// Tools run in isolated sandboxes
import { Sandbox } from '@oneatlas/runtime';

const result = await Sandbox.execute({
  code: generatedCode,
  timeout: 5000,
  memoryLimit: '128MB'
});`,
            features: [
              { icon: '⚡', title: '0ms Cold Starts', desc: 'Instant execution anywhere.' },
              { icon: '🛡️', title: 'Memory Boundaries', desc: 'V8 isolates prevent leakage.' },
              { icon: '💸', title: 'Cost Efficient', desc: 'Shared infra, usage-based.' }
            ]
          },
          'R2Storage': {
            subtitle: 'Egress-free object storage',
            overview: 'OneAtlas utilizes Cloudflare R2 for storing generated static assets, compiled outputs, and user uploads. It ensures zero egress fees and tight integration with the Edge compute layer.',
            code: `import { Storage } from '@oneatlas/deployment';

await Storage.uploadAsset({
  bucket: 'tenant-assets',
  key: \`\${tenantId}/main.js\`,
  stream: compiledCodeStream
});`,
            features: [
              { icon: '📦', title: 'Zero Egress', desc: 'No cost for bandwidth.' },
              { icon: '⚡', title: 'Edge Native', desc: 'Reads directly from worker nodes.' },
              { icon: '🔒', title: 'Private Objects', desc: 'Secure signed URL access.' }
            ]
          },
          'ClaudeIntegration': {
            subtitle: 'Anthropic Claude for Reasoning',
            overview: 'OneAtlas routes complex tasks like schema generation and deep reasoning to Claude 3.5 Sonnet and Opus, leveraging their massive context windows and superior coding capabilities.',
            code: `import { AIGateway } from '@oneatlas/ai-engine';

const result = await AIGateway.route({
  prompt: "Design a complex DB schema",
  provider: "anthropic",
  model: "claude-3-5-sonnet"
});`,
            features: [
              { icon: '🧠', title: 'Deep Reasoning', desc: 'Best for architecture decisions.' },
              { icon: '📏', title: '200k Context', desc: 'Ingests massive codebases.' },
              { icon: '🎯', title: 'High Accuracy', desc: 'Minimal hallucinations in code.' }
            ]
          },
          'GeminiSupport': {
            subtitle: 'Google Gemini for Speed',
            overview: 'For high-throughput, low-latency tasks like routing intents or generating simple UI components, OneAtlas relies on Gemini 1.5 Flash. It provides extreme speed and massive context at a fraction of the cost.',
            code: `import { AIGateway } from '@oneatlas/ai-engine';

const intent = await AIGateway.route({
  prompt: "What does the user want?",
  provider: "google",
  model: "gemini-1.5-flash"
});`,
            features: [
              { icon: '⚡', title: 'High Speed', desc: 'Sub-second generation.' },
              { icon: '💸', title: 'Cost Effective', desc: 'Ideal for repetitive boilerplate.' },
              { icon: '📚', title: '1M Context', desc: 'Native massive context window.' }
            ]
          },
          'OpenAIFallback': {
            subtitle: 'GPT-4o Fallback Layer',
            overview: 'The OneAtlas AI Gateway implements robust retry logic. If our primary providers hit rate limits or fail complex schema validations, requests automatically fallback to OpenAI GPT-4o.',
            code: `import { AIGateway } from '@oneatlas/ai-engine';

const result = await AIGateway.route({
  prompt: "Build this widget",
  prefer: "anthropic",
  fallback: "openai"
});`,
            features: [
              { icon: '🔄', title: 'Auto-Retry', desc: 'Transparent fallback on failure.' },
              { icon: '🟢', title: 'High Uptime', desc: 'Cross-provider redundancy.' },
              { icon: '🛠️', title: 'Function Calling', desc: 'Strict tool use guarantees.' }
            ]
          },
          'CustomModelRouting': {
            subtitle: 'Advanced Model Routing',
            overview: 'Learn how to configure the AIGateway to route specific tasks to custom or fine-tuned models based on context size, latency requirements, or cost constraints.',
            code: `// Register a custom routing rule
AIGateway.addRule({
  condition: (req) => req.tokens > 100000,
  routeTo: { provider: 'anthropic', model: 'claude-3-opus' }
});`,
            features: [
              { icon: '🔀', title: 'Dynamic Routing', desc: 'Based on token count or latency.' },
              { icon: '💰', title: 'Cost Control', desc: 'Prevent expensive over-usage.' },
              { icon: '⚙️', title: 'Fine-Tuning', desc: 'Route to your custom weights.' }
            ]
          },
          'BuildingIntegrations': {
            subtitle: 'Extend OneAtlas via Integrations OS',
            overview: 'The Integrations OS allows you to connect custom internal APIs. It provides an OAuth layer, credential vault, and unifies external APIs so the AI Agents can use them as native Tools.',
            code: `import { IntegrationsOS } from '@oneatlas/integrations';

// Register a custom internal API
IntegrationsOS.register({
  name: "Internal_ERP",
  auth: "Bearer",
  schema: erpOpenApiSpec
});`,
            features: [
              { icon: '🔗', title: 'Unified APIs', desc: 'Turn any REST API into an Agent tool.' },
              { icon: '🔐', title: 'Credential Vault', desc: 'Securely store API keys.' },
              { icon: '⚡', title: 'OAuth Flow', desc: 'Native multi-tenant auth flows.' }
            ]
          },
          'RBACSetup': {
            subtitle: 'Enterprise Role-Based Access Control',
            overview: 'OneAtlas is designed for enterprise scale. Learn how to configure granular permissions, custom roles, and audit logs to secure your generated applications.',
            code: `import { RBAC } from '@oneatlas/auth';

// Define a custom policy
await RBAC.createPolicy({
  role: "Support_Tier_1",
  resources: ["users", "tickets"],
  actions: ["read", "update"]
});`,
            features: [
              { icon: '🛡️', title: 'Granular Access', desc: 'Resource-level permissions.' },
              { icon: '📝', title: 'Audit Logs', desc: 'Track every action taken.' },
              { icon: '🏢', title: 'SSO/SAML', desc: 'Integrate with Okta or Azure AD.' }
            ]
          },
          'MultitenantData': {
            subtitle: 'Managing Multi-tenant Data Models',
            overview: 'Understand how OneAtlas physically isolates tenant data using PostgreSQL schemas, ensuring no cross-contamination while maintaining a cost-effective shared infrastructure.',
            code: `import { db } from '@oneatlas/db';

// The engine automatically applies the RLS policies
// or schema routing based on the auth context
const data = await db.tenant(req.user.orgId)
  .query('SELECT * FROM customers');`,
            features: [
              { icon: '🐘', title: 'Schema Isolation', desc: 'One DB schema per tenant.' },
              { icon: '🔒', title: 'Row-Level Security', desc: 'Database-level boundary enforcement.' },
              { icon: '💸', title: 'Shared Compute', desc: 'Massively reduces overhead costs.' }
            ]
          },
          'WhatisOneAtlas': {
            subtitle: 'AI-Native Internal Tools Platform',
            overview: 'OneAtlas is an AI-native platform for generating and deploying business applications. It focuses on internal tools, CRUD apps, dashboards, admin panels, and workflow automation, built on a cost-efficient, serverless, edge-first architecture.',
            code: `// Generate a full production-ready CRM
import { OneAtlas } from 'oneatlas';

const app = await OneAtlas.generate({
  type: "CRM Dashboard",
  database: "neon-postgres",
  auth: "clerk"
});
await app.deploy();`,
            features: [
              { icon: '🚀', title: 'Serverless First', desc: 'Edge-based architecture.' },
              { icon: '🤖', title: 'AI-Native', desc: 'Built for Cursor, Claude, and Copilot workflows.' },
              { icon: '🏢', title: 'Enterprise Ready', desc: 'Multi-tenant isolation via schemas.' }
            ]
          },
          'Howitworks': {
            subtitle: 'From prompt to production in seconds',
            overview: 'OneAtlas avoids hallucinating raw code from scratch. Instead, it uses a Template-First approach, AST patching, and Metadata-driven rendering to guarantee lower AI costs, faster generation, and deterministic, bug-free output.',
            code: `import { Compiler } from '@oneatlas/core';

// OneAtlas Pipeline
const plan = await AI.understand(prompt);
const schema = await Entities.generate(plan);
const ui = await Templates.hydrate(schema);

await Compiler.build(ui);`,
            features: [
              { icon: '🧩', title: 'Template First', desc: 'Injects dynamic data into stable UI DNA.' },
              { icon: '📉', title: 'Low Cost', desc: 'Uses cheaper models for boilerplate generation.' },
              { icon: '🔍', title: 'AST Patching', desc: 'Incrementally updates code reliably.' }
            ]
          },
          'PostgreSQLNeon': {
            subtitle: 'Shared multi-tenant database infrastructure',
            overview: 'OneAtlas leverages a shared Neon Serverless Postgres cluster. It ensures data isolation for tenants through schema-level separation, driven by Prisma ORM.',
            code: `import { PrismaClient } from '@prisma/client';

// Connect to tenant-specific schema dynamically
const tenantDb = new PrismaClient({
  datasources: {
    db: { url: \`postgres://neon.tech/main?schema=\${tenantId}\` }
  }
});

const users = await tenantDb.user.findMany();`,
            features: [
              { icon: '🐘', title: 'Serverless Postgres', desc: 'Scales compute to zero when idle.' },
              { icon: '🛡️', title: 'Schema Isolation', desc: 'Strict multi-tenant data boundaries.' },
              { icon: '⚡', title: 'Prisma ORM', desc: 'Type-safe database queries.' }
            ]
          },
          'CloudflareEdge': {
            subtitle: 'Global Serverless Runtime and Hosting',
            overview: 'Our runtime runs exclusively at the Edge. Frontend assets are served via Cloudflare Pages, backend functions via Workers and Durable Objects, and storage via R2 buckets.',
            code: `import { Runtime } from '@oneatlas/deployment';

// Deploying an app to the Cloudflare Edge
await Runtime.deploy({
  target: 'cloudflare-workers',
  kv: true,
  durableObjects: ['WorkflowState'],
  subdomain: 'hr.oneatlas.app'
});`,
            features: [
              { icon: '🌍', title: 'Workers', desc: '0ms cold starts globally.' },
              { icon: '📦', title: 'R2 Storage', desc: 'Egress-free object storage.' },
              { icon: '🔄', title: 'Subdomains', desc: 'Apps deploy to isolated subdomains instantly.' }
            ]
          },
          'ClerkAuth': {
            subtitle: 'Authentication and Identity',
            overview: 'OneAtlas uses Clerk for authentication, providing a secure foundation for user identities before graduating to custom SSO, SAML, and SCIM abstractions for Enterprise RBAC.',
            code: `import { currentUser } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });
  
  // Enforce tenant boundaries
  return db.fetchProjects(user.orgId);
}`,
            features: [
              { icon: '🔐', title: 'Identity', desc: 'Drop-in auth components.' },
              { icon: '🏢', title: 'Organizations', desc: 'Native multi-tenant org support.' },
              { icon: '🛡️', title: 'RBAC Ready', desc: 'Foundation for strict role based access.' }
            ]
          },
          'Contracts': {
            subtitle: 'Deterministic AI Output Layer',
            overview: 'To ensure LLMs return perfect JSON, OneAtlas relies on strict Zod Contracts. This forces the AI Gateway to return deterministic schemas for Entities, Workflows, and UI Generation.',
            code: `import { z } from 'zod';

export const SchemaGenerationContract = z.object({
  tables: z.array(z.object({
    name: z.string(),
    fields: z.array(z.object({
      name: z.string(),
      type: z.enum(['string', 'int', 'boolean'])
    }))
  }))
});`,
            features: [
              { icon: '📜', title: 'Strict Schemas', desc: 'Validates all LLM output.' },
              { icon: '🔄', title: 'Auto-Retry', desc: 'Feeds errors back to LLM to self-correct.' },
              { icon: '🧩', title: 'Modularity', desc: 'Cross-team deterministic boundaries.' }
            ]
          },
          'SharedTypes': {
            subtitle: 'Cross-Team Protocol Boundaries',
            overview: 'The OneAtlas monorepo relies on the @oneatlas/shared package to ensure the Frontend (Team 1), Backend (Team 2), and AI (Team 3) layers communicate via strongly typed TypeScript interfaces.',
            code: `import type { AIProvider, AppSchema } from '@oneatlas/shared/types';

export interface GenerationRequest {
  provider: AIProvider;
  schema: AppSchema;
  tenantId: string;
}`,
            features: [
              { icon: '📘', title: 'TypeScript First', desc: 'End-to-end type safety.' },
              { icon: '🔗', title: 'Monorepo', desc: 'Turborepo shared packages.' },
              { icon: '🛡️', title: 'No Silos', desc: 'Unified domain modeling across teams.' }
            ]
          },
          'UIComponents': {
            subtitle: 'Atomic Design System',
            overview: 'OneAtlas utilizes ShadCN and TailwindCSS as its core UI foundation. These components are used by the Template Engine to stitch together dynamic pages without relying on the AI to write raw CSS.',
            code: `import { Button, Card, DataTable } from '@oneatlas/ui';

export function DashboardShell({ data }) {
  return (
    <Card className="p-6">
      <DataTable data={data} />
      <Button variant="primary">Export Data</Button>
    </Card>
  );
}`,
            features: [
              { icon: '🎨', title: 'TailwindCSS', desc: 'Utility-first robust styling.' },
              { icon: '🧱', title: 'ShadCN', desc: 'Accessible, unstyled primitives.' },
              { icon: '🚀', title: 'High Performance', desc: 'Zero runtime CSS overhead.' }
            ]
          },
          'APIReference': {
            subtitle: 'Hono.js Backend Orchestration',
            overview: 'The backend API layer is built on Hono for maximum performance on Node.js and the Edge. It serves as a thin proxy, delegating business logic to specific domain services.',
            code: `import { Hono } from 'hono';
import { ProjectService } from '@services/project';

const app = new Hono();

app.post('/api/projects', async (c) => {
  const body = await c.req.json();
  const project = await ProjectService.create(body);
  return c.json(project);
});`,
            features: [
              { icon: '⚡', title: 'Hono', desc: 'Ultrafast web framework.' },
              { icon: '🔌', title: 'Thin API', desc: 'Decoupled from heavy business logic.' },
              { icon: '🌐', title: 'Edge Ready', desc: 'Runs seamlessly on Cloudflare Workers.' }
            ]
          },
          'API': {
            subtitle: 'Hono.js Backend Orchestration',
            overview: 'The backend API layer is built on Hono for maximum performance on Node.js and the Edge. It serves as a thin proxy, delegating business logic to specific domain services.',
            code: `import { Hono } from 'hono';
import { ProjectService } from '@services/project';

const app = new Hono();

app.post('/api/projects', async (c) => {
  const body = await c.req.json();
  const project = await ProjectService.create(body);
  return c.json(project);
});`,
            features: [
              { icon: '⚡', title: 'Hono', desc: 'Ultrafast web framework.' },
              { icon: '🔌', title: 'Thin API', desc: 'Decoupled from heavy business logic.' },
              { icon: '🌐', title: 'Edge Ready', desc: 'Runs seamlessly on Cloudflare Workers.' }
            ]
          },
          'Changelog': {
            subtitle: 'OneAtlas Release History',
            overview: 'Track the latest updates to the OneAtlas internal tools platform as we execute on our MVP engineering plan.',
            code: `// Version 1.0.0-MVP
- Added conversational app generator
- Implemented Cloudflare Edge deployment (Subdomains)
- Added Neon Postgres shared clusters
- Integrated AI Gateway (Claude/Gemini/OpenAI)`,
            features: [
              { icon: '🎯', title: 'MVP Goal', desc: '7-Day execution timeline.' },
              { icon: '🔄', title: 'CI/CD', desc: 'Continuous integration and deployment.' },
              { icon: '📈', title: 'Scalable Base', desc: 'Ready for enterprise RBAC and SSO.' }
            ]
          },
          'Examples': {
            subtitle: 'Explore Use Cases',
            overview: 'Discover how different teams leverage OneAtlas to rapidly spin up internal operational tools without managing infrastructure.',
            code: `// Example: Automated HR Onboarding App
const hrApp = await OneAtlas.generate({
  type: "HR Portal",
  workflows: [
    { trigger: "employee_added", action: "send_slack_invite" },
    { trigger: "employee_added", action: "provision_google_workspace" }
  ]
});`,
            features: [
              { icon: '👔', title: 'HR Portals', desc: 'Manage employee data securely.' },
              { icon: '📊', title: 'CRM Dashboards', desc: 'Track sales and inbound pipelines.' },
              { icon: '🛠️', title: 'Admin Panels', desc: 'Read/write your production databases.' }
            ]
          },
          'AgentSystem': {
            subtitle: 'Multi-agent coordination and lifecycle management',
            overview: 'The Agent System orchestrates a team of specialized AI agents. The Coordinator hands off tasks to the Planner, which delegates to specialized Frontend, Backend, Validator, and Repair agents to build production-ready software autonomously.',
            code: `import { Coordinator, TaskRouter } from '@oneatlas/agent-system';

const taskGraph = await Coordinator.plan("Build a CRM");

// Delegate tasks to specialized agents
await TaskRouter.dispatch(taskGraph, {
  frontendAgent: true,
  backendAgent: true,
  validatorAgent: true
});`,
            features: [
              { icon: '🤝', title: 'Coordination', desc: 'Manages agent lifecycle and task handoffs.' },
              { icon: '🏗️', title: 'Specialized Agents', desc: 'Dedicated Frontend, Backend, and Repair agents.' },
              { icon: '💾', title: 'Shared Memory', desc: 'Agents share context via unified memory.' }
            ]
          },
          'TemplateEngine': {
            subtitle: 'Reusable UI DNA and Archetypes',
            overview: 'The Template Engine is responsible for assembling the frontend structure. Instead of hallucinating UI from scratch, OneAtlas uses pre-built Archetypes (CRM, Admin, SaaS, eCommerce), composable sections, and atomic widgets to guarantee high-quality designs.',
            code: `import { TemplateRegistry, Composer } from '@oneatlas/template-engine';

// Fetch the best archetype for the intent
const archetype = await TemplateRegistry.get('crm-dashboard');

// Compose the UI with generated schema
const layout = Composer.assemble(archetype, {
  theme: 'modern-dark',
  slots: generatedSchema
});`,
            features: [
              { icon: '🎨', title: 'Archetypes', desc: 'Pre-built SaaS, CRM, and eCommerce templates.' },
              { icon: '🧩', title: 'Composable UI', desc: 'Atomic widgets and layout shells.' },
              { icon: '✨', title: 'Theming', desc: 'Design token sets injected dynamically.' }
            ]
          },
          'WorkflowEngine': {
            subtitle: 'DAG-based automation and execution',
            overview: 'The Workflow Engine executes complex multi-step processes securely. It supports Webhook, Schedule, and Event triggers, passing data through a Directed Acyclic Graph (DAG) of HTTP, Database, Email, and AI actions.',
            code: `import { GraphBuilder, Executor } from '@oneatlas/workflow-engine';

// Define a DAG workflow
const graph = new GraphBuilder()
  .addTrigger('schedule', { cron: '0 0 * * *' })
  .addAction('ai-summarize', { input: '$db.recent_events' })
  .addAction('email', { to: '$user.email', body: '$ai.output' })
  .build();

await Executor.run(graph);`,
            features: [
              { icon: '📈', title: 'DAG Execution', desc: 'Reliable multi-step graph execution.' },
              { icon: '⚡', title: 'Triggers', desc: 'Support for webhooks, crons, and events.' },
              { icon: '🔌', title: 'Actions', desc: 'Native HTTP, DB, and AI tool calling.' }
            ]
          },
          'Buildingyourfirstagent': {
            subtitle: 'Guide: Create an autonomous worker in 3 steps',
            overview: 'Agents in OneAtlas use an iterative Observe-Orient-Decide-Act (OODA) loop algorithm. To build an agent, you define its Persona (system prompt), its Tools (functions it can execute), and its Memory layer.',
            code: `import { AgentBuilder, SearchTool, DBOpTool } from '@oneatlas/agent-system';

// 1. Initialize the Agent with its core algorithm
const salesAgent = new AgentBuilder("Sales SDR")
  .setSystemPrompt("You qualify inbound leads.")
  .addTool(new SearchTool())
  .addTool(new DBOpTool({ table: "Leads" }))
  .setMemoryWindow(10) // Retain last 10 interactions
  .build();

// 2. Execute the OODA loop algorithm
const result = await salesAgent.run("Evaluate lead: john@acme.com");`,
            features: [
              { icon: '1️⃣', title: 'Define Persona', desc: 'Set the constraints and goals of the agent.' },
              { icon: '2️⃣', title: 'Attach Tools', desc: 'Give the agent read/write access via APIs.' },
              { icon: '3️⃣', title: 'Run Loop', desc: 'The agent will autonomously solve the goal.' }
            ]
          },
          'Workingwithtools': {
            subtitle: 'Guide: Exposing external APIs to your agents',
            overview: 'Tools follow a strict input validation algorithm using Zod schemas. When an agent decides to use a tool, OneAtlas intercepts the call, validates the LLM-generated arguments against the schema, executes the secure sandbox function, and returns the deterministic result to the agent.',
            code: `import { Tool, z } from '@oneatlas/core';

// Define the tool's input schema and execution algorithm
export const createStripeCustomerTool = new Tool({
  name: "create_stripe_customer",
  description: "Creates a new customer in Stripe billing.",
  schema: z.object({
    email: z.string().email(),
    name: z.string()
  }),
  execute: async ({ email, name }) => {
    // Deterministic execution
    const customer = await stripe.customers.create({ email, name });
    return { success: true, customerId: customer.id };
  }
});`,
            features: [
              { icon: '🛡️', title: 'Schema Validation', desc: 'Guarantees the LLM outputs correct JSON.' },
              { icon: '⚡', title: 'Sandbox Execution', desc: 'Tools run in isolated Edge environments.' },
              { icon: '🔄', title: 'Feedback Loop', desc: 'Tool errors are fed back to the LLM to self-correct.' }
            ]
          },
          'Deployingtoproduction': {
            subtitle: 'Guide: Push your application to the Edge',
            overview: 'OneAtlas deployment uses a zero-downtime rolling update algorithm. Assets are uploaded to Cloudflare R2, Edge Workers are compiled via esbuild, and the database schema is safely migrated on Neon Postgres.',
            code: `import { DeploymentEngine } from '@oneatlas/deployment';

// Trigger the deployment pipeline algorithm
await DeploymentEngine.deploy({
  projectId: "prod-crm",
  target: "cloudflare-edge",
  database: "neon-postgres",
  strategy: "rolling",
  // Automatic rollback if health checks fail
  healthCheckUrl: "/api/health"
});`,
            features: [
              { icon: '🌍', title: 'Edge Network', desc: 'Deploys globally in milliseconds.' },
              { icon: '🗄️', title: 'Safe Migrations', desc: 'Non-destructive schema updates.' },
              { icon: '🔙', title: 'Auto-Rollback', desc: 'Reverts changes if post-deploy checks fail.' }
            ]
          },
          'Memoryandcontext': {
            subtitle: 'Guide: Managing LLM Context Windows',
            overview: 'OneAtlas uses a hierarchical memory summarization algorithm to prevent context window overflow. Short-term interactions are kept verbatim, while long-term context is continuously summarized and embedded into a vector database for semantic retrieval.',
            code: `import { MemoryManager } from '@oneatlas/ai-engine';

const memory = new MemoryManager({
  strategy: "hierarchical",
  maxTokens: 4000,
  vectorStore: "pinecone"
});

// The algorithm automatically summarizes old messages
await memory.addMessage({ role: 'user', content: 'Huge document...' });
const compressedContext = await memory.getOptimizedContext();`,
            features: [
              { icon: '🗜️', title: 'Summarization', desc: 'Compresses old context automatically.' },
              { icon: '🔍', title: 'Semantic Search', desc: 'Retrieves relevant memories via vector embeddings.' },
              { icon: '📏', title: 'Token Control', desc: 'Strictly enforces context window limits.' }
            ]
          },
          'Guides': {
            subtitle: 'OneAtlas Step-by-Step Guides',
            overview: 'Explore our comprehensive guides to mastering the OneAtlas platform. Learn the algorithms and architecture behind building autonomous agents, deploying full-stack apps, and writing custom tools.',
            code: `// Start your journey by exploring the CLI
$ atlas login
$ atlas init my-new-project
$ atlas generate scaffold --type=dashboard
$ atlas deploy --prod`,
            features: [
              { icon: '🤖', title: 'Agent Mastery', desc: 'Learn to build multi-agent teams.' },
              { icon: '🛠️', title: 'Tool Creation', desc: 'Integrate external APIs securely.' },
              { icon: '🚀', title: 'Deployment', desc: 'Ship to production confidently.' }
            ]
          },
          'WhyOneAtlas': {
            subtitle: 'AI-Native, Serverless, Cost-Efficient',
            overview: 'OneAtlas is built on three core engineering principles: Low-Cost Architecture, AI-First Development, and an Enterprise-Ready Foundation. We avoid heavy VMs and Kubernetes in favor of Edge computing and Serverless Postgres.',
            code: `// Built for extreme scale and zero idle costs
import { EdgeArchitecture } from '@oneatlas/core';

await EdgeArchitecture.initialize({
  frontend: 'Cloudflare Pages',
  backend: 'Cloudflare Workers',
  database: 'Neon Serverless Postgres',
  storage: 'Cloudflare R2'
});`,
            features: [
              { icon: '💸', title: 'Low Cost', desc: 'Shared multi-tenant usage-based infra.' },
              { icon: '🤖', title: 'AI-First', desc: 'Designed for Cursor and Claude workflows.' },
              { icon: '🏢', title: 'Enterprise Ready', desc: 'RBAC, Audit logs, and SSO built-in.' }
            ]
          },
          'Whatsnext': {
            subtitle: 'The Roadmap to Scale',
            overview: 'Our MVP focuses on generating internal tools, CRUD apps, and dashboards. Moving forward, OneAtlas will scale into a massive integrations ecosystem and introduce sandboxed MicroVM isolation for complex backend workloads.',
            code: `// Future Roadmap Capabilities
const roadmap = [
  "NestJS Event-Driven Microservices",
  "Internal Auth Abstraction (SCIM/SAML)",
  "Advanced Visual Editor",
  "Sandboxed MicroVM Runtime"
];`,
            features: [
              { icon: '📈', title: 'MicroVMs', desc: 'Isolated heavy workloads.' },
              { icon: '🔗', title: 'Integrations OS', desc: 'The ultimate long-term moat.' },
              { icon: '🛡️', title: 'Compliance', desc: 'SOC2 and HIPAA ready infrastructure.' }
            ]
          }
        };

        setTimeout(() => {
          if (itemName.toLowerCase() === 'welcome' || itemName.toLowerCase() === 'quickstart') {
            contentBody.innerHTML = originalContent;
            bindRoleButtons();
            bindCopyButtons();
          } else {
            const safeKey = itemName.replace(/[^a-zA-Z0-9]/g, '');
            const data = docData[safeKey] || {
              subtitle: `Learn how to configure and scale ${itemName}.`,
              overview: `${itemName} is a core component of the OneAtlas ecosystem, providing robust capabilities and a seamless developer experience.`,
              code: `import { ${safeKey} } from '@oneatlas/core';\n\nawait ${safeKey}.init();`,
              features: [
                { icon: '⚡', title: 'Fast Execution', desc: 'Zero cold starts' },
                { icon: '🔒', title: 'Secure', desc: 'Enterprise grade isolation' },
                { icon: '🌐', title: 'Global', desc: 'Deployed to the edge' }
              ]
            };

            contentBody.innerHTML = `
              <div class="content-header relative">
                <span class="badge-native text-primary">✨ ONEATLAS DOCUMENTATION</span>
                <h1 class="docs-title">${itemName}</h1>
                <p class="docs-subtitle">${data.subtitle}</p>
              </div>
              <div class="section-block mt-8">
                <h3>Architecture Overview</h3>
                <p class="text-muted mb-4">${data.overview}</p>
                <div class="step-card mt-6" style="margin-top: 2rem;">
                  <div class="step-header">
                    <div class="step-num">1</div>
                    <h4>Implementation Example</h4>
                    <button class="copy-btn">📋</button>
                  </div>
                  <div class="code-block" style="min-height: auto;">
<pre><code>${data.code}</code></pre>
                  </div>
                </div>
              </div>
              <div class="section-block mt-8">
                <h3>Capabilities</h3>
                <div class="capabilities-grid grid-3" style="margin-top: 1.5rem;">
                  ${data.features.map(f => `
                  <div class="cap-card" style="pointer-events:none;">
                    <div class="cap-icon bg-purple-light text-primary">${f.icon}</div>
                    <div class="cap-text"><strong>${f.title}</strong><span>${f.desc}</span></div>
                  </div>
                  `).join('')}
                </div>
              </div>
            `;
            bindCopyButtons();
          }
          
          // Fade in
          contentBody.style.opacity = '1';
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast(`Opened document: ${itemName}`, 'success');
        }, 300);
      }
    });
  });

  // 6. Search Modal Logic
  const topSearchInput = document.querySelector('.search-container input');
  const searchModal = document.getElementById('searchModal');
  const modalSearchInput = document.getElementById('searchInput');
  const closeSearchBtn = document.querySelector('.close-search-btn');

  function openSearch() {
    if (searchModal) {
      searchModal.classList.remove('hidden');
      setTimeout(() => modalSearchInput && modalSearchInput.focus(), 100);
    }
  }

  function closeSearch() {
    if (searchModal) {
      searchModal.classList.add('hidden');
    }
  }

  if (topSearchInput) {
    topSearchInput.addEventListener('click', openSearch);
    topSearchInput.addEventListener('focus', (e) => { e.target.blur(); openSearch(); });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) {
        closeSearch();
      }
    });
    
    // Close modal if a search result is clicked
    const resultItems = searchModal.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', closeSearch);
    });
  }

  // 7. Code Block Tabs
  const codeTabs = document.querySelectorAll('.tab-btn');
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const parent = tab.closest('.code-tabs');
      if(!parent) return;
      
      parent.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-target');
      const container = tab.closest('.step-card');
      if (container) {
        container.querySelectorAll('.code-block[id^="code-"]').forEach(block => {
          block.classList.add('hidden');
        });
        const targetBlock = document.getElementById(targetId);
        if (targetBlock) {
          targetBlock.classList.remove('hidden');
        }
      }
    });
  });

  // 8. Scroll Spy (On this page)
  const scrollContainer = document.querySelector('.content-scroll');
  if (scrollContainer) {
    const sections = document.querySelectorAll('.section-block[id], .content-header[id]');
    
    scrollContainer.addEventListener('scroll', () => {
      let currentId = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollContainer.scrollTop >= (sectionTop - 100)) {
          currentId = section.getAttribute('id');
        }
      });
      
      if (currentId) {
        const navLinks = document.querySelectorAll('.page-nav a');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + currentId) {
            link.classList.add('active');
          }
        });
      }
    });
  }
});
