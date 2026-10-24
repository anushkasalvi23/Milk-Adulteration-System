import React from 'react';
import {
  ShieldCheck, ArrowRight, ArrowUpRight, Sparkles, FlaskConical, Activity, Gauge, Layers,
  AlertTriangle, ScanLine, FileSpreadsheet, LineChart, Server, Lock, Microscope, CheckCircle2,
  Droplet, Beaker, Thermometer, Zap, Waves, TestTube,
} from 'lucide-react';

const NAV = [['Features', '#features'], ['How it works', '#how'], ['Why us', '#why'], ['Detects', '#detects'], ['FAQ', '#faq']];

const READINGS = [
  { icon: Droplet, label: 'Fat', unit: '%' },
  { icon: Layers, label: 'SNF', unit: '%' },
  { icon: Gauge, label: 'Density', unit: 'g/mL' },
  { icon: Beaker, label: 'pH', unit: '' },
  { icon: Thermometer, label: 'Freezing point', unit: '°C' },
  { icon: Zap, label: 'Conductivity', unit: 'mS/cm' },
];

const ADULTERANTS = ['Water', 'Starch', 'Urea', 'Detergent', 'Sodium bicarbonate', 'Glucose', 'Skimmed milk powder', 'Other (lab confirm)'];

const WHY = [
  { icon: Microscope, title: 'Built for collection centers', text: 'Uses only the six readings a center can measure in minutes. No HPLC, no GC-MS.' },
  { icon: Sparkles, title: 'Two-stage AI decision', text: 'Stage 1 scores risk. Stage 2 names the likely adulterant, only when flagged.' },
  { icon: AlertTriangle, title: 'Honest about uncertainty', text: 'Readings outside what the model has seen are never accepted, only sent to retest.' },
  { icon: Lock, title: 'Monitored in production', text: 'Prometheus metrics and Grafana dashboards track volume, risk and latency.' },
  { icon: Server, title: 'Easy to deploy', text: 'One Docker Compose command brings up the API, dashboard, MLflow and monitoring.' },
  { icon: FileSpreadsheet, title: 'Single sample or batch', text: 'Type in one reading set or upload a CSV of up to 10,000 samples.' },
];

const FAQ = [
  ['Does it replace laboratory testing?', 'No. It triages. A flagged or retest sample should be confirmed by a lab. Adulterants such as formalin, hydrogen peroxide, vegetable oil and melamine look like pure milk in these six readings, so they are routed to a confirmatory test.'],
  ['What data was the model trained on?', 'A public, synthetic milk adulteration dataset. Validation on real milk samples is still in progress, so treat current results as indicative.'],
  ['What do accept, retest and reject mean?', 'Accept: low risk. Retest: uncertain or unusual readings, measure again. Reject: high risk of adulteration.'],
  ['What inputs are needed?', 'Fat %, SNF %, density, pH, freezing point and conductivity. Sample ID and collection point are optional.'],
];

const Pill = ({ children }) => (
  <span className="inline-block text-[11px] font-semibold tracking-widest uppercase text-slate-500 bg-white border border-slate-200 rounded-full px-3 py-1">{children}</span>
);

const Heading = ({ pill, title, sub, dark }) => (
  <div className="text-center max-w-2xl mx-auto">
    <Pill>{pill}</Pill>
    <h2 className={`mt-4 text-3xl sm:text-5xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    <p className="mt-4 text-slate-500">{sub}</p>
  </div>
);

export default function Landing({ onStart, onSignIn }) {
  return (
    <div className="bg-white text-slate-900 font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#020b14] text-white">
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,198,0.55),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,#fff_0,#fff_1px,transparent_1px,transparent_60px)]" />
        <header className="relative max-w-6xl mx-auto flex items-center justify-between px-5 py-5">
          <a href="#top" className="flex items-center gap-2 font-semibold text-lg"><ShieldCheck className="w-6 h-6 text-cyan-400" /> PureMilk</a>
          <nav className="hidden md:flex gap-8 text-sm text-slate-300">
            {NAV.map(([l, h]) => <a key={l} href={h} className="hover:text-white transition-colors">{l}</a>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onSignIn} className="text-sm text-slate-200 hover:text-white px-3 py-2">Log in</button>
            <button onClick={onStart} className="bg-white text-slate-900 text-sm font-medium rounded-full px-5 py-2 hover:bg-slate-200 transition-colors">Sign up</button>
          </div>
        </header>

        <div id="top" className="relative max-w-6xl mx-auto px-5 pt-16 pb-12">
          <span className="inline-flex items-center gap-2 text-xs border border-white/15 bg-white/5 rounded-md px-2 py-1 text-slate-300">
            <span className="bg-emerald-400 text-slate-900 font-bold rounded px-1.5">NEW</span> Two-stage adulterant detection <ArrowRight className="w-3 h-3" />
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
            Catch adulterated milk. Protect every batch with PureMilk.
          </h1>
          <p className="mt-5 text-slate-300 max-w-xl">
            Enter six routine field readings and get an instant risk score, a decision band and the likely adulterant, with live monitoring built in.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={onStart} className="flex items-center gap-2 bg-white text-slate-900 font-medium rounded-full px-6 py-3 hover:bg-slate-200 transition-colors">
              <FlaskConical className="w-4 h-4" /> Analyze a Sample
            </button>
            <a href="#how" className="flex items-center gap-1 text-sm text-slate-200 px-4 py-3 hover:text-white">See how it works <ArrowRight className="w-4 h-4" /></a>
          </div>

          {/* Product mock: miniature of the real dashboard */}
          <DashboardMock />
        </div>
      </section>

      {/* Inputs strip */}
      <section className="py-14 px-5 text-center">
        <p className="text-sm text-slate-600">Works from the six readings a collection center already measures</p>
        <div className="mt-7 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {READINGS.map(({ icon: Icon, label, unit }) => (
            <div key={label} className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium"><Icon className="w-5 h-5" /> {label}{unit && <span className="text-slate-400 text-xs">({unit})</span>}</div>
          ))}
        </div>
      </section>

      {/* Core features */}
      <section id="features" className="py-16 px-5 bg-white">
        <Heading pill="Core features" title={<>Powerful features built<br />to protect your supply</>} sub="Everything a quality team needs to screen milk quickly, consistently and with a clear audit trail." />
        <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-4 bg-slate-50 rounded-3xl p-3">
          <div className="md:col-span-1 bg-white rounded-2xl p-5 flex items-center gap-3"><span className="text-5xl font-semibold">6</span><span className="text-sm text-slate-600 leading-tight">field readings<br />in, one decision out</span></div>
          <div className="md:col-span-2 bg-white rounded-2xl p-5">
            <p className="font-semibold">Screening & Collaboration</p>
            <p className="text-sm text-slate-500 mt-1">Tag every sample with an ID and collection point so teams can trace results back to the source.</p>
          </div>

          <div className="rounded-2xl bg-[#020b14] p-6 text-white flex flex-col justify-between min-h-[300px]">
            <div className="mx-auto my-4 w-40 h-40 rounded-full border-[10px] border-cyan-400/60 shadow-[0_0_60px_rgba(34,211,238,0.5)] flex items-center justify-center"><ScanLine className="w-12 h-12 text-white" /></div>
            <div><p className="font-semibold">Stage 1: Risk Scoring</p><p className="text-xs text-slate-400 mt-1">A calibrated probability that the sample contains a detectable adulterant.</p></div>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-cyan-500 to-cyan-700 p-6 text-white flex flex-col justify-between min-h-[300px]">
            <div><p className="text-6xl font-semibold">8</p><p className="text-sm text-cyan-50">adulterant classes<br />identified by Stage 2</p></div>
            <div className="flex items-end gap-2 h-24">{[30, 45, 38, 60, 80, 100].map((h, i) => <div key={i} className="flex-1 bg-white/70 rounded-t" style={{ height: `${h}%` }} />)}</div>
            <button onClick={onStart} className="mt-4 bg-black/80 hover:bg-black rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> Try a sample</button>
          </div>
          <div className="rounded-2xl bg-[#020b14] p-6 text-white flex flex-col justify-between min-h-[300px]">
            <div><p className="text-6xl font-semibold">3</p><p className="text-sm text-slate-300">decision bands:<br />accept, retest, reject</p></div>
            <svg viewBox="0 0 200 60" className="w-full h-20"><path d="M0 50 C30 50 40 20 70 30 S120 55 150 25 S190 10 200 5 V60 H0Z" fill="#0e7490" /><path d="M0 50 C30 50 40 20 70 30 S120 55 150 25 S190 10 200 5" fill="none" stroke="#fff" strokeWidth="2" /></svg>
            <div><p className="font-semibold">Stage 2: Adulterant ID</p><p className="text-xs text-slate-400 mt-1">Names the likely adulterant with a confidence score, only when flagged.</p></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-16 px-5">
        <Heading pill="How it works" title="From reading to decision in seconds" sub="No lab equipment beyond the meters you already use." />
        <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-3 gap-4">
          {[[FlaskConical, '1. Enter readings', 'Type the six values for one sample, or upload a CSV for a whole batch.'], [Activity, '2. Model scores it', 'The cascade checks readings against safe ranges, scores risk, then names the adulterant.'], [CheckCircle2, '3. Act on the band', 'Accept it, measure again, or reject the batch and send it for lab confirmation.']].map(([Icon, t, d]) => (
            <div key={t} className="bg-slate-50 rounded-2xl p-6"><div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center"><Icon className="w-5 h-5" /></div><p className="mt-4 font-semibold">{t}</p><p className="text-sm text-slate-500 mt-1">{d}</p></div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-16 px-5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <Pill>Why choose us</Pill>
            <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight">Why quality teams choose PureMilk</h2>
            <p className="mt-4 text-slate-500 text-sm max-w-md">A practical triage tool that fits how collection centers actually work, and is upfront about what it can and cannot detect.</p>
            <button onClick={onStart} className="mt-6 inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-slate-700">Start Now <ArrowUpRight className="w-4 h-4" /></button>
          </div>
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-3 space-y-2">
            {WHY.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className={`flex items-center gap-4 rounded-xl px-4 py-3 ${i === 3 ? 'bg-[#020b14] text-white' : 'bg-white'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${i === 3 ? 'bg-cyan-500' : 'bg-slate-100 text-slate-600'}`}><Icon className="w-4 h-4" /></div>
                <div><p className="text-sm font-semibold">{title}</p><p className={`text-xs ${i === 3 ? 'text-slate-300' : 'text-slate-500'}`}>{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detects */}
      <section id="detects" className="py-16 px-5">
        <Heading pill="Key features" title="What we detect" sub="Adulterants Stage 2 can name from the six readings. Others are routed to a confirmatory lab test." />
        <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-3xl p-7">
            <p className="text-xl font-semibold">Adulterant identification</p>
            <p className="text-slate-500 mt-2 text-sm">Flagged samples get a named likely adulterant and a confidence score.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {ADULTERANTS.map((a) => <span key={a} className="bg-white border border-slate-200 text-sm rounded-full px-3 py-1.5 flex items-center gap-1.5"><TestTube className="w-3.5 h-3.5 text-cyan-600" />{a}</span>)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-3xl p-7">
            <p className="text-xl font-semibold">Live monitoring</p>
            <p className="text-slate-500 mt-2 text-sm">Track samples scored, flag rate, risk distribution and API latency on the dashboard or in Grafana.</p>
            <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 flex items-end gap-2 h-28">{[40, 65, 50, 80, 55, 90, 70, 100].map((h, i) => <div key={i} className="flex-1 bg-cyan-500/80 rounded-t" style={{ height: `${h}%` }} />)}</div>
            <p className="mt-3 text-xs text-slate-400 flex items-center gap-1"><LineChart className="w-3 h-3" /> Illustrative</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-5">
        <Heading pill="FAQ" title="Good to know" sub="Plain answers about scope and limits." />
        <div className="max-w-3xl mx-auto mt-10 space-y-3">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group bg-slate-50 rounded-2xl p-5">
              <summary className="cursor-pointer font-medium list-none flex justify-between items-center">{q}<span className="text-slate-400 group-open:rotate-45 transition-transform text-xl">+</span></summary>
              <p className="mt-3 text-sm text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA + footer */}
      <section className="px-5 pb-10">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-3xl bg-[#020b14] text-white text-center py-16 px-6">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_bottom,rgba(14,165,198,0.5),transparent_70%)]" />
          <div className="relative">
            <Waves className="w-8 h-8 mx-auto text-cyan-400" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">Screen your next batch in seconds</h2>
            <p className="mt-3 text-slate-300 text-sm">Triage with PureMilk, confirm in the lab.</p>
            <button onClick={onStart} className="mt-7 bg-white text-slate-900 font-medium rounded-full px-7 py-3 hover:bg-slate-200">Start Now</button>
          </div>
        </div>
        <p className="max-w-6xl mx-auto text-xs text-slate-400 mt-6 text-center">
          Results come from a model trained on synthetic data and have not yet been validated on real milk. PureMilk triages; a laboratory confirms.
        </p>
      </section>
    </div>
  );
}


const MOCK_BARS = [['Sodium bicarbonate', 67], ['Water', 33]];
const MOCK_ROWS = [
  ['S-001', 'Village Center', '2.1%', 'Pure', '-', 'emerald'],
  ['S-002', 'North Hub', '96.4%', 'Flagged', 'Water', 'red'],
  ['S-003', 'East Hub', '41.0%', 'Retest', '-', 'amber'],
];

function DashboardMock() {
  const kpis = [['Samples Scored', '1,248'], ['Flag Rate', '12.4%'], ['Rejected Rows', '0'], ['Avg Latency', '18 ms']];
  const pill = { emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200', red: 'bg-red-50 text-red-700 border-red-200', amber: 'bg-amber-50 text-amber-700 border-amber-200' };
  return (
    <div className="relative mt-14 mx-auto max-w-5xl rounded-3xl bg-white/10 p-2 sm:p-3 backdrop-blur shadow-2xl shadow-cyan-900/40">
      <div className="flex rounded-2xl overflow-hidden bg-[#f5f5f5] text-slate-800 text-left">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-44 shrink-0 flex-col p-3 gap-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-sm px-2 py-2"><ShieldCheck className="w-5 h-5" /> PureMilk</div>
          <div className="rounded-lg bg-slate-200/70 text-slate-500 px-3 py-1.5 mb-2">Search</div>
          <p className="px-2 text-slate-500">Menu</p>
          {[['Dashboard', Layers, true], ['Sample Analysis', FlaskConical], ['Prediction Log', Gauge]].map(([l, Icon, on]) => (
            <div key={l} className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${on ? 'bg-white shadow-sm font-medium' : 'text-slate-600'}`}><Icon className="w-3.5 h-3.5" />{l}</div>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between px-4 h-11 text-sm font-semibold">
            Dashboard
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">● API Online</span>
          </div>
          <div className="bg-white rounded-tl-2xl p-3 sm:p-4 space-y-3">
            <div className="grid grid-cols-2 lg:grid-cols-4 rounded-xl border border-slate-200 bg-[#f7f7f7] divide-x divide-slate-200">
              {kpis.map(([l, v]) => (
                <div key={l} className="p-3">
                  <p className="text-[10px] text-slate-500">{l}</p>
                  <p className="text-xl font-medium text-slate-900">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 rounded-xl border border-slate-200 p-3">
                <p className="text-[11px] text-slate-600">Risk Score Trend</p>
                <svg viewBox="0 0 300 90" className="w-full h-24 mt-1">
                  <defs><linearGradient id="mockFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f172a" stopOpacity="0.15" /><stop offset="100%" stopColor="#0f172a" stopOpacity="0" /></linearGradient></defs>
                  {[15, 40, 65].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />)}
                  <path d="M0 70 L30 62 L60 66 L90 48 L120 52 L150 36 L180 40 L210 24 L240 30 L270 14 L300 18 V90 H0Z" fill="url(#mockFill)" />
                  <path d="M0 70 L30 62 L60 66 L90 48 L120 52 L150 36 L180 40 L210 24 L240 30 L270 14 L300 18" fill="none" stroke="#0f172a" strokeWidth="2" />
                </svg>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[11px] text-slate-600">Detected Adulterants</p>
                <div className="mt-3 space-y-3">
                  {MOCK_BARS.map(([n, p]) => (
                    <div key={n}>
                      <div className="flex justify-between text-[11px]"><span>{n}</span><b className="font-medium">({p}%)</b></div>
                      <div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${p}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 p-3 overflow-x-auto">
              <p className="text-[11px] text-slate-600 mb-2">Recent Predictions</p>
              <table className="w-full text-[11px] min-w-[420px]">
                <thead><tr className="text-slate-700 border-b border-slate-200">{['ID', 'Source', 'Risk', 'Status', 'Adulterant'].map((h) => <th key={h} className="py-1.5 font-medium text-left">{h}</th>)}</tr></thead>
                <tbody>
                  {MOCK_ROWS.map(([id, src, risk, st, ad, c]) => (
                    <tr key={id} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5">{id}</td><td>{src}</td><td>{risk}</td>
                      <td><span className={`px-1.5 py-0.5 rounded border ${pill[c]}`}>{st}</span></td><td>{ad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-300 text-center mt-2">Illustrative example</p>
    </div>
  );
}
