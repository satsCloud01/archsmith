import { Link } from 'react-router-dom'
import {
  Layers, ChevronRight, Sparkles, Wand2, GitMerge, ShieldCheck,
  Zap, FileText, BarChart2, BookOpen, CheckCircle, ArrowRight,
  Globe, Lock, AlertTriangle, Clock, HelpCircle
} from 'lucide-react'
import { useTour } from '../hooks/useTour'
import type { TourStep } from '../hooks/useTour'
import { TourOverlay } from '../components/ui/TourOverlay'

const LIFECYCLE = [
  { step: 1, color: 'from-violet-600 to-violet-400', label: 'Design', sub: 'Describe system goals', icon: Wand2 },
  { step: 2, color: 'from-brand-600 to-brand-400',   label: 'Model', sub: 'Structure domains & services', icon: GitMerge },
  { step: 3, color: 'from-sky-600 to-sky-400',       label: 'Generate', sub: 'Create 8 artifact types', icon: FileText },
  { step: 4, color: 'from-orange-600 to-orange-400', label: 'Analyse', sub: 'Run impact analysis', icon: Zap },
  { step: 5, color: 'from-emerald-600 to-emerald-400', label: 'Approve', sub: 'Governance sign-off', icon: ShieldCheck },
  { step: 6, color: 'from-teal-600 to-teal-400',    label: 'Publish', sub: 'Version-controlled output', icon: Globe },
]

const CAPABILITIES = [
  { icon: Wand2,     title: 'AI Architecture Suggest', desc: 'Describe your system and Claude AI generates domains, services, APIs, events, and data entities in seconds.' },
  { icon: FileText,  title: '8 Artifact Types', desc: 'Domain Model, C4 Diagrams, OpenAPI, AsyncAPI, Terraform Blueprints, ADRs, Impact Baselines, and arc42 packs.' },
  { icon: GitMerge,  title: 'Traceability (FR2)', desc: 'Every artifact traces back to requirements and ADRs — no more documentation drift.' },
  { icon: Zap,       title: 'Impact Analysis (FR3)', desc: 'Breaking change detection, mitigation plans, and migration steps before any schema change ships.' },
  { icon: Globe,     title: 'Multi-Cloud Blueprints (FR4)', desc: 'Terraform modules generated for AWS, Azure, and GCP — infrastructure as code from day one.' },
  { icon: ShieldCheck, title: 'Governance Workflow (FR6)', desc: 'RBAC-gated approvals, immutable audit logs, and ADR generation on every governance action.' },
  { icon: BookOpen,  title: 'Example Templates', desc: '4 industry-grade templates: Retail Banking, E-Commerce, Healthcare, and Real-Time Analytics.' },
  { icon: BarChart2, title: 'NFR Coverage Scoring', desc: 'Track non-functional requirement coverage across your entire architecture portfolio.' },
]

const PROBLEMS = [
  { icon: AlertTriangle, title: 'Inconsistent Artifacts', desc: 'Teams produce conflicting docs with no shared standard.' },
  { icon: Lock,          title: 'No Traceability', desc: 'Requirements disappear between design and implementation.' },
  { icon: Clock,         title: 'Slow Design Cycles', desc: 'Manual ADR creation and artifact generation wastes weeks.' },
  { icon: Zap,           title: 'Late-Stage Reworks', desc: 'Breaking changes discovered in production instead of design.' },
]

const ARTIFACTS_PREVIEW = [
  { type: 'domain_model', label: 'Domain Model',    color: 'bg-violet-500/10 text-violet-400' },
  { type: 'c4',           label: 'C4 Diagram',       color: 'bg-sky-500/10 text-sky-400' },
  { type: 'openapi',      label: 'OpenAPI Spec',      color: 'bg-emerald-500/10 text-emerald-400' },
  { type: 'asyncapi',     label: 'AsyncAPI Spec',     color: 'bg-orange-500/10 text-orange-400' },
  { type: 'terraform',    label: 'Terraform Blueprint',color: 'bg-amber-500/10 text-amber-400' },
  { type: 'adr',          label: 'ADR Records',       color: 'bg-red-500/10 text-red-400' },
  { type: 'impact_baseline','label': 'Impact Baseline', color: 'bg-pink-500/10 text-pink-400' },
  { type: 'arc42',        label: 'arc42 Pack',        color: 'bg-brand-500/10 text-brand-400' },
]

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="hero"]',
    title: 'Welcome to ArchSmith',
    content: 'ArchSmith is an AI-powered architecture design platform. Describe your system in plain English and get production-ready architectural artifacts in minutes.',
    example: 'Click "Start in Studio" to launch the 6-step wizard. Try the Retail Banking template to see a complete architecture package generated instantly.',
    proTip: 'ArchSmith aligns every output to arc42 standards and your PRD requirements (FR1-FR6) automatically.',
  },
  {
    target: '[data-tour="problems"]',
    title: 'The Problems We Solve',
    content: 'Traditional architecture documentation is inconsistent, untraceable, and slow. Teams waste weeks creating artifacts that drift from reality.',
    example: 'Think about your last project: did the API spec match the actual implementation? ArchSmith keeps all 8 artifact types in sync from a single source of truth.',
    proTip: 'Impact Analysis catches breaking changes at design time, eliminating costly late-stage reworks.',
  },
  {
    target: '[data-tour="lifecycle"]',
    title: 'The 6-Step Studio Workflow',
    content: 'The Studio wizard guides you through Design, Model, Generate, Analyse, Approve, and Publish. Each step builds on the previous one.',
    example: 'In Step 1 (Design), describe "A real-time payment processing system with fraud detection." Claude AI will structure domains, services, and APIs for you in Step 2.',
    proTip: 'You can skip straight to Step 3 (Generate) by selecting one of the 4 built-in templates: Retail Banking, E-Commerce, Healthcare, or Real-Time Analytics.',
  },
  {
    target: '[data-tour="capabilities"]',
    title: 'Platform Capabilities',
    content: 'ArchSmith covers AI-powered suggestions, 8 artifact types, full traceability, impact analysis, multi-cloud Terraform, governance workflows, templates, and NFR scoring.',
    example: 'Enable the Claude API key in Settings, then use "AI Architecture Suggest" in the Studio to auto-generate a complete domain model from a 2-sentence description.',
    proTip: 'AI features use Claude Haiku for fast, cost-effective suggestions. Without an API key, the app works fully with manual input.',
  },
  {
    target: '[data-tour="artifacts"]',
    title: '8 Artifact Types Per Package',
    content: 'Every architecture package generates Domain Models, C4 Diagrams, OpenAPI specs, AsyncAPI specs, Terraform blueprints, ADRs, Impact Baselines, and arc42 documentation.',
    example: 'Create a package, then navigate to the Package Detail page to browse each artifact type. The C4 diagram shows system context, containers, and component views.',
    proTip: 'All artifacts are cross-linked — changing a domain model automatically flags impacted OpenAPI endpoints and Terraform modules via Impact Analysis.',
  },
  {
    target: '[data-tour="metrics"]',
    title: 'Success Metrics & PRD Targets',
    content: 'ArchSmith targets 40% reduction in documentation time, 60% faster ADR creation, 50% fewer late-stage reworks, and 80% NFR coverage.',
    example: 'Check the Dashboard page to see your actual NFR coverage score across all packages. The Governance page shows approval cycle times.',
    proTip: 'Use the Impact Analysis page to compare before/after metrics when evaluating architecture changes.',
  },
  {
    target: '[data-tour="cta"]',
    title: 'Get Started Now',
    content: 'Open the Studio to create your first architecture package. Start from a template or describe your own system.',
    example: 'Try the "Retail Banking Core" template first — it generates a complete package with payment services, account management, and fraud detection domains.',
    proTip: 'Bookmark the Dashboard to track all your packages. Use the Packages page to compare architecture versions side by side.',
  },
]

export default function Landing() {
  const tour = useTour(TOUR_STEPS, 'landing')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-8 h-16 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">ArchSmith</span>
          <span className="badge bg-brand-900/60 text-brand-400 border border-brand-700/40 text-[10px] ml-1">PRD-aligned</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={tour.isActive ? tour.finish : tour.start}
            className="btn-ghost text-sm flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {tour.isActive ? 'Exit Tour' : 'Take a Tour'}
          </button>
          <Link to="/dashboard" className="btn-ghost text-sm">Dashboard</Link>
          <Link to="/studio" className="btn-primary text-sm flex items-center gap-1.5">
            Open Studio <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section data-tour="hero" className="px-8 pt-24 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 badge bg-brand-900/40 border border-brand-700/40 text-brand-300 text-xs mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered · PRD FR1–FR6 · arc42 Aligned
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-r from-slate-100 via-brand-200 to-brand-400 bg-clip-text text-transparent">
          Architecture Intelligence<br />Platform
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate standards-aligned, traceable, production-ready architectural artifacts.
          Describe your system — Claude AI structures it. Review, refine, approve.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/studio" className="btn-primary px-6 py-3 text-base flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Start in Studio
          </Link>
          <Link to="/dashboard" className="btn-outline px-6 py-3 text-base flex items-center gap-2">
            <BarChart2 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Problems */}
      <section data-tour="problems" className="px-8 py-16 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2 text-center">The Problem</p>
          <h2 className="text-2xl font-bold text-center mb-10">Why architecture docs fail</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROBLEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-sm font-medium mb-1">{title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section data-tour="lifecycle" className="px-8 py-16 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2 text-center">Workflow</p>
          <h2 className="text-2xl font-bold text-center mb-10">From description to approved artifact</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {LIFECYCLE.map(({ step, color, label, sub, icon: Icon }, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="card text-center w-32 py-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-semibold mb-0.5">{label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{sub}</div>
                </div>
                {i < LIFECYCLE.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-700 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section data-tour="capabilities" className="px-8 py-16 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2 text-center">Capabilities</p>
          <h2 className="text-2xl font-bold text-center mb-10">Everything the PRD requires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CAPABILITIES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card hover:border-brand-700/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-brand-900/60 border border-brand-700/30 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-sm font-semibold mb-1.5">{title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artifacts */}
      <section data-tour="artifacts" className="px-8 py-16 bg-slate-900/40 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2 text-center">Output</p>
          <h2 className="text-2xl font-bold text-center mb-3">8 artifact types per package</h2>
          <p className="text-sm text-slate-500 text-center mb-10">All traceable to requirements and ADRs</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {ARTIFACTS_PREVIEW.map(({ label, color }) => (
              <div key={label} className={`badge border px-3 py-1.5 text-xs font-medium ${color} border-current/20`}>
                <CheckCircle className="w-3 h-3" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section data-tour="metrics" className="px-8 py-16 border-t border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2 text-center">Success Metrics</p>
          <h2 className="text-2xl font-bold text-center mb-10">Measured against PRD targets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '40%', label: 'Reduction in documentation time' },
              { value: '60%', label: 'Faster ADR creation' },
              { value: '50%', label: 'Fewer late-stage reworks' },
              { value: '80%', label: 'NFR coverage target' },
            ].map(({ value, label }) => (
              <div key={label} className="card text-center">
                <div className="text-3xl font-bold text-brand-400 mb-2">{value}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section data-tour="cta" className="px-8 py-20 border-t border-slate-800/60 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to forge your architecture?</h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Start with an example template or describe your system and let AI generate the blueprint.
            Your first architecture package is one click away.
          </p>
          <Link to="/studio" className="btn-primary px-8 py-3 text-base inline-flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Open ArchSmith Studio
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-800/60 px-8 py-6 text-center text-xs text-slate-700 space-y-1">
        <div>ArchSmith — Architecture Intelligence Platform · PRD-aligned · arc42 · FR1–FR6</div>
        <div>
          Developed by{' '}
          <a href="https://my-solution-registry.satszone.link" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">
            Sathish Siva Shankar
          </a>
          {' '}·{' '}
          <a href="https://my-solution-registry.satszone.link" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-500">
            View All Solutions
          </a>
        </div>
      </footer>

      {/* Tour Overlay */}
      <TourOverlay
        step={tour.step}
        currentStep={tour.currentStep}
        totalSteps={tour.totalSteps}
        onNext={tour.next}
        onPrev={tour.prev}
        onFinish={tour.finish}
      />
    </div>
  )
}
