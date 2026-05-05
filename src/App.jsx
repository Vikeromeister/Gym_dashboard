import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bell,
  CheckCircle2,
  Clipboard,
  Dumbbell,
  Globe,
  Info,
  KeyRound,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Webhook,
  Zap,
} from "lucide-react";

const HEVY_DOCS_URL = "https://api.hevyapp.com/docs/";
const GITHUB_PAGES_URL = "https://vikeromeister.github.io/Gym_dashboard/";

const initialWorkouts = [
  {
    id: "f1085cdb-32b2-4003-967d-53a3af8eaecb",
    title: "Push Day",
    createdAt: "2026-05-05T10:42:00.000Z",
    status: "received",
    exercises: 7,
    volumeKg: 12450,
    source: "Hevy webhook",
  },
  {
    id: "9b5c0b08-6f8f-4fe6-a15c-b6abfa3263af",
    title: "Leg Strength",
    createdAt: "2026-05-03T18:15:00.000Z",
    status: "synced",
    exercises: 6,
    volumeKg: 18320,
    source: "Demo data",
  },
  {
    id: "6e4b9ef1-5ff2-4d70-99d6-9d43193276a8",
    title: "Pull Hypertrophy",
    createdAt: "2026-05-01T07:31:00.000Z",
    status: "synced",
    exercises: 8,
    volumeKg: 14220,
    source: "Demo data",
  },
];

const backendOptions = [
  {
    name: "Cloudflare Worker",
    badge: "Recommended webhook receiver",
    pros: ["Fast global edge", "Easy POST endpoint", "Can add KV/D1 storage later"],
  },
  {
    name: "Netlify Function",
    badge: "Simple with Git deploys",
    pros: ["Good developer experience", "Frontend + function in one repo", "Easy environment variables"],
  },
  {
    name: "Vercel Function",
    badge: "Good if you later move to Next.js",
    pros: ["Easy API routes", "Great previews", "Simple secrets management"],
  },
];

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card stat-card"
    >
      <div className="stat-card__top">
        <div className="icon-box icon-box--dark"><Icon size={20} /></div>
        <div>
          <p className="muted small">{label}</p>
          <p className="stat-value">{value}</p>
        </div>
      </div>
      <p className="muted small stat-detail">{detail}</p>
    </motion.div>
  );
}

function SetupStep({ number, icon: Icon, title, children }) {
  return (
    <div className="card setup-step">
      <div className="icon-box icon-box--indigo"><Icon size={20} /></div>
      <div>
        <div className="step-heading">
          <span className="pill">Step {number}</span>
          <h3>{title}</h3>
        </div>
        <div className="muted setup-copy">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [query, setQuery] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("https://your-worker.yourname.workers.dev/hevy-webhook");
  const [copied, setCopied] = useState(false);

  const filteredWorkouts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workouts;
    return workouts.filter((workout) =>
      [workout.title, workout.id, workout.status, workout.source].join(" ").toLowerCase().includes(q)
    );
  }, [query, workouts]);

  const totalVolume = workouts.reduce((sum, workout) => sum + workout.volumeKg, 0);
  const lastWorkout = workouts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  function simulateWebhook() {
    const id = crypto.randomUUID();
    const next = {
      id,
      title: "New Hevy Workout",
      createdAt: new Date().toISOString(),
      status: "received",
      exercises: Math.floor(Math.random() * 5) + 4,
      volumeKg: Math.floor(Math.random() * 9000) + 7000,
      source: "Simulated webhook",
    };
    setWorkouts((current) => [next, ...current]);
  }

  async function copyWebhookUrl() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const workerSnippet = `export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const payload = await request.json();

    if (!payload.workoutId) {
      return new Response("Missing workoutId", { status: 400 });
    }

    // Store payload.workoutId, then optionally fetch full workout details
    // using env.HEVY_API_KEY from your serverless provider secrets.
    // Keep this fast: Hevy expects 200 OK within 5 seconds.

    return Response.json({ ok: true }, { status: 200 });
  }
};`;

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-grid">
          <div>
            <div className="eyebrow"><Webhook size={16} /> Hevy webhook dashboard starter</div>
            <h1>Workout notifications, ready for your future dashboard.</h1>
            <p className="hero-copy">
              This GitHub Pages frontend is ready for <strong>{GITHUB_PAGES_URL}</strong>. Connect it later to a small serverless webhook receiver that accepts Hevy POST events and stores workout data.
            </p>
          </div>
          <div className="header-actions">
            <button className="button button--primary" onClick={simulateWebhook}>
              <Radio size={16} /> Simulate Hevy webhook
            </button>
            <a className="button button--secondary" href={HEVY_DOCS_URL} target="_blank" rel="noreferrer">
              <Globe size={16} /> Hevy API docs
            </a>
          </div>
        </div>
      </header>

      <main className="container main-content">
        <section className="stats-grid">
          <StatCard icon={Dumbbell} label="Tracked workouts" value={workouts.length} detail="Webhook events plus demo data." />
          <StatCard icon={Activity} label="Total volume" value={`${totalVolume.toLocaleString()} kg`} detail="Placeholder metric for the future analytics view." />
          <StatCard icon={Bell} label="Last notification" value={lastWorkout ? formatDate(lastWorkout.createdAt) : "—"} detail="Most recent received workout event." />
          <StatCard icon={ShieldCheck} label="Webhook status" value="Frontend ready" detail="Needs a serverless backend before real Hevy connection." />
        </section>

        <section className="dashboard-grid">
          <div className="card panel">
            <div className="panel-header">
              <div>
                <h2>Workout inbox</h2>
                <p className="muted">New Hevy webhook events will appear here once the backend is connected.</p>
              </div>
              <div className="search-box">
                <Search size={16} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workouts" />
              </div>
            </div>

            <div className="workout-list">
              {filteredWorkouts.map((workout) => (
                <motion.div key={workout.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="workout-row">
                  <div className="workout-main">
                    <div className="workout-title-row">
                      <h3>{workout.title}</h3>
                      <span className={`status status--${workout.status}`}>{workout.status}</span>
                    </div>
                    <p className="workout-id">{workout.id}</p>
                    <p className="muted small">{formatDate(workout.createdAt)} · {workout.source}</p>
                  </div>
                  <div className="workout-metrics">
                    <div><span>Exercises</span><strong>{workout.exercises}</strong></div>
                    <div><span>Volume</span><strong>{workout.volumeKg.toLocaleString()} kg</strong></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="side-stack">
            <div className="card note-card">
              <div className="note-heading"><Info size={20} /><h2>Important hosting note</h2></div>
              <p className="muted">GitHub Pages is frontend-only. The Hevy webhook URL must point to a backend/serverless function that can receive POST requests and return 200 OK quickly.</p>
            </div>

            <div className="card note-card">
              <div className="note-heading"><Server size={20} /><h2>Webhook endpoint</h2></div>
              <label>Future webhook receiver URL</label>
              <div className="copy-row">
                <input value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} />
                <button onClick={copyWebhookUrl} title="Copy webhook URL" className="icon-button">
                  {copied ? <CheckCircle2 size={18} /> : <Clipboard size={18} />}
                </button>
              </div>
              <p className="muted small">Paste this URL into the Hevy webhook settings once your serverless receiver is deployed.</p>
            </div>
          </aside>
        </section>

        <section className="setup-grid">
          <div className="steps-stack">
            <SetupStep number="1" icon={Globe} title="Deploy">
              Push this package to your public <code>Gym_dashboard</code> repository and set Pages source to <strong>GitHub Actions</strong>.
            </SetupStep>
            <SetupStep number="2" icon={Zap} title="Create a serverless webhook receiver">
              GitHub Pages cannot receive POST requests. Use the included <code>webhook-receiver/cloudflare-worker.js</code> as a starting point.
            </SetupStep>
            <SetupStep number="3" icon={KeyRound} title="Keep the Hevy API key private">
              Do not expose <code>HEVY_API_KEY</code> in this frontend. Use it only inside a backend/serverless secret store.
            </SetupStep>
            <SetupStep number="4" icon={RefreshCw} title="Sync dashboard data">
              Add a read API later so the frontend can display recent workouts, charts, PRs, routines, and exercise history.
            </SetupStep>
          </div>

          <div className="code-card">
            <div className="code-heading"><Sparkles size={20} /><h2>Starter Cloudflare Worker</h2></div>
            <p>This is the minimal receiver shape included in the package.</p>
            <pre><code>{workerSnippet}</code></pre>
          </div>
        </section>

        <section className="card backend-section">
          <h2>Backend options for the real webhook</h2>
          <div className="backend-grid">
            {backendOptions.map((option) => (
              <div key={option.name} className="backend-card">
                <div className="backend-card-title">
                  <h3>{option.name}</h3>
                  <span className="pill">Free tier</span>
                </div>
                <p className="option-badge">{option.badge}</p>
                <ul>
                  {option.pros.map((pro) => (
                    <li key={pro}><CheckCircle2 size={16} /> {pro}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
