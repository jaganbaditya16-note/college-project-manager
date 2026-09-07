import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  FileText,
  FolderKanban,
  Github,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  X,
} from 'lucide-react';
import './styles.css';
import { supabase, supabaseConfigured } from './lib/supabase';

const seedProjects = [
  { id: 'p1', title: 'Smart Lost & Found', code: 'IT-24-081', type: 'Major Project', progress: 78, accent: 'violet', members: 4, due: 'Oct 20', status: 'On track' },
  { id: 'p2', title: 'Campus Shuttle Tracker', code: 'IT-24-064', type: 'Mini Project', progress: 54, accent: 'cyan', members: 3, due: 'Nov 04', status: 'At risk' },
  { id: 'p3', title: 'AI Study Companion', code: 'IT-24-053', type: 'Research', progress: 31, accent: 'orange', members: 5, due: 'Nov 18', status: 'Planning' },
];

const seedTasks = [
  { id: 't1', title: 'Finalize database schema', project: 'Smart Lost & Found', assignee: 'JB', priority: 'High', due: 'Today', done: false },
  { id: 't2', title: 'Write SRS introduction', project: 'Smart Lost & Found', assignee: 'AR', priority: 'Medium', due: 'Tomorrow', done: false },
  { id: 't3', title: 'Connect auth screens', project: 'Campus Shuttle Tracker', assignee: 'SK', priority: 'High', due: 'Sep 12', done: true },
  { id: 't4', title: 'Prepare viva questions', project: 'AI Study Companion', assignee: 'NP', priority: 'Low', due: 'Sep 15', done: false },
];

const seedMembers = [
  { id: 'm1', name: 'Jagan Baditya', role: 'Team Lead · Full Stack', initials: 'JB', online: true },
  { id: 'm2', name: 'Ananya Rao', role: 'Research · Documentation', initials: 'AR', online: true },
  { id: 'm3', name: 'Sahil Kulkarni', role: 'Backend · Database', initials: 'SK', online: false },
  { id: 'm4', name: 'Neha Patil', role: 'UI/UX · Presentation', initials: 'NP', online: false },
];

const nav = [
  ['Overview', LayoutDashboard],
  ['Projects', FolderKanban],
  ['Tasks', CheckCircle2],
  ['Timeline', CalendarDays],
  ['Team', Users],
  ['Documents', FileText],
  ['Viva Lab', MessageSquareText],
];

function App() {
  const [active, setActive] = useState('Overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [projects, setProjects] = useState(seedProjects);
  const [tasks, setTasks] = useState(seedTasks);
  const [showProject, setShowProject] = useState(false);
  const [search, setSearch] = useState('');

  const visibleProjects = useMemo(() => projects.filter((p) => `${p.title} ${p.code}`.toLowerCase().includes(search.toLowerCase())), [projects, search]);

  function toast(message) {
    setNotice(message);
    window.clearTimeout(window.__toast);
    window.__toast = window.setTimeout(() => setNotice(''), 2600);
  }

  function addProject(title) {
    const next = { id: crypto.randomUUID(), title, code: `IT-26-${Math.floor(100 + Math.random() * 899)}`, type: 'New Project', progress: 4, accent: ['violet', 'cyan', 'orange'][projects.length % 3], members: 1, due: 'Set date', status: 'Planning' };
    setProjects((p) => [next, ...p]);
    setShowProject(false);
    toast('Project created. Add your milestones to get moving.');
  }

  function toggleTask(id) {
    setTasks((items) => items.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
    toast('Task updated');
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand"><span className="brand-mark">C</span><span>CampusFlow</span></div>
        <div className="workspace-card">
          <div className="workspace-icon">IT</div>
          <div><b>Information Tech</b><span>Final Year · 2026</span></div>
          <ChevronRight size={16} />
        </div>
        <div className="nav-label">Workspace</div>
        <nav>
          {nav.map(([label, Icon]) => <button key={label} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => { setActive(label); setMobileOpen(false); }}><Icon size={18} /><span>{label}</span>{label === 'Tasks' && <em>4</em>}</button>)}
        </nav>
        <div className="side-spacer" />
        <div className="ai-card"><div className="ai-orb"><Sparkles size={17} /></div><b>Project Copilot</b><p>Ask about deadlines, blockers or your next best task.</p><button onClick={() => toast('Copilot is ready — connect your AI key to enable live answers.')}>Open Copilot <ArrowUpRight size={15} /></button></div>
        <button className="nav-item"><Settings size={18} /><span>Settings</span></button>
        <div className="profile-mini"><div className="avatar">JB</div><div><b>Jagan Baditya</b><span>Student admin</span></div><MoreHorizontal size={17} /></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={20} /></button>
          <div className="crumb"><span>{active}</span><span className="dot">/</span><b>My workspace</b></div>
          <div className="top-actions">
            <label className="search"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, tasks…" /></label>
            <button className="icon-btn" title="GitHub" onClick={() => toast('GitHub integration is ready for OAuth wiring.')}><Github size={18} /></button>
            <button className="icon-btn notif" title="Notifications" onClick={() => toast('No new notifications')}><Bell size={18} /><i /></button>
            <button className="new-btn" onClick={() => setShowProject(true)}><Plus size={17} /> New project</button>
          </div>
        </header>

        <div className="content">
          {active === 'Overview' && <Overview projects={visibleProjects} tasks={tasks} onAdd={() => setShowProject(true)} onToggle={toggleTask} toast={toast} />}
          {active === 'Projects' && <Projects projects={visibleProjects} onAdd={() => setShowProject(true)} onOpen={(p) => toast(`${p.title} opened`)} />}
          {active === 'Tasks' && <Tasks tasks={tasks} onToggle={toggleTask} />}
          {active === 'Timeline' && <Timeline />}
          {active === 'Team' && <Team />}
          {active === 'Documents' && <Documents />}
          {active === 'Viva Lab' && <Viva toast={toast} />}
        </div>
      </main>

      {showProject && <ProjectModal onClose={() => setShowProject(false)} onCreate={addProject} />}
      {notice && <div className="toast"><CheckCircle2 size={17} />{notice}</div>}
    </div>
  );
}

function Overview({ projects, tasks, onAdd, onToggle, toast }) {
  const completed = tasks.filter((t) => t.done).length;
  return <>
    <section className="hero-head">
      <div><div className="eyebrow"><span className="pulse" /> Semester workspace</div><h1>Build better projects,<br /><span>finish with confidence.</span></h1><p>One calm workspace for planning, teamwork, documentation and viva prep — built around how college projects actually happen.</p></div>
      <div className="hero-actions"><button className="ghost-btn" onClick={() => toast('Demo report prepared')}>View report <ArrowUpRight size={16} /></button><button className="new-btn" onClick={onAdd}><Plus size={17} /> New project</button></div>
    </section>

    <section className="stat-grid">
      <Stat label="Active projects" value={String(projects.length).padStart(2, '0')} trend="+1 this month" icon={FolderKanban} />
      <Stat label="Tasks completed" value={`${completed}/${tasks.length}`} trend={`${Math.round((completed / Math.max(tasks.length, 1)) * 100)}% complete`} icon={CheckCircle2} />
      <Stat label="Next deadline" value="12 days" trend="SRS · Lost & Found" icon={Clock3} />
      <Stat label="Team velocity" value="8.4" trend="↑ 14% this week" icon={Target} />
    </section>

    <div className="section-row"><div><div className="eyebrow">Live workspace</div><h2>Current projects</h2></div><button className="text-btn" onClick={() => toast('Showing all projects')}>View all <ChevronRight size={16} /></button></div>
    <section className="project-grid">{projects.map((project, i) => <ProjectCard key={project.id} project={project} featured={i === 0} onOpen={() => toast(`${project.title} opened`)} />)}</section>

    <section className="lower-grid">
      <div className="panel"><div className="panel-head"><div><div className="eyebrow">Execution</div><h3>My tasks</h3></div><button className="small-btn" onClick={() => toast('Task composer opened')}><Plus size={14} /> Add</button></div>{tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => onToggle(task.id)} />)}</div>
      <div className="panel focus-panel"><div className="panel-head"><div><div className="eyebrow">Next up</div><h3>Project health</h3></div><span className="health-badge">Healthy</span></div><div className="health-ring"><div><strong>82</strong><span>/100</span></div></div><div className="health-copy"><b>You're on track.</b><p>Documentation is the only area trending behind your code progress.</p></div><div className="mini-bars"><Bar label="Code" value={90} /><Bar label="Docs" value={64} /><Bar label="Testing" value={72} /><Bar label="Team" value={84} /></div></div>
    </section>

    <section className="copilot-banner"><div className="banner-orb"><Sparkles /></div><div><div className="eyebrow">Project Copilot</div><h3>Turn your project chaos into your next three actions.</h3><p>Get a focused checklist from your project data instead of another generic productivity plan.</p></div><button className="new-btn" onClick={() => toast('Copilot is ready for AI API setup')}>Try Copilot <ArrowUpRight size={16} /></button></section>
  </>;
}

function Stat({ label, value, trend, icon: Icon }) { return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div>; }
function ProjectCard({ project, featured, onOpen }) { return <article className={`project-card ${featured ? 'featured' : ''} ${project.accent}`} onClick={onOpen}><div className="project-top"><span className="project-type">{project.type}</span><button className="round-arrow"><ArrowUpRight size={16} /></button></div><div className="project-visual"><div className="visual-grid" /><div className="project-code">{project.code}</div><div className="visual-title">{project.title}</div></div><div className="project-body"><div><h3>{project.title}</h3><p>{project.status} · due {project.due}</p></div><span className="project-percent">{project.progress}%</span></div><div className="progress"><i style={{ width: `${project.progress}%` }} /></div><div className="project-footer"><span><Users size={14} /> {project.members} members</span><span className="status-dot">{project.status}</span></div></article>; }
function TaskRow({ task, onToggle }) { return <button className={`task-row ${task.done ? 'done' : ''}`} onClick={onToggle}><span className="task-check">{task.done ? <Check size={13} /> : <Circle size={13} />}</span><span className="task-main"><b>{task.title}</b><small>{task.project}</small></span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><span className="task-due">{task.due}</span><span className="task-avatar">{task.assignee}</span></button>; }
function Bar({ label, value }) { return <div className="bar-row"><span>{label}</span><div className="bar"><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>; }

function Projects({ projects, onAdd, onOpen }) { return <><PageHead eyebrow="Workspace" title="Projects" description="Every idea, milestone and deliverable in one place." action="New project" onAction={onAdd} /><div className="projects-list">{projects.map((p) => <ProjectListRow key={p.id} p={p} onOpen={() => onOpen(p)} />)}</div></>; }
function ProjectListRow({ p, onOpen }) { return <button className="project-list-row" onClick={onOpen}><div className={`list-icon ${p.accent}`}>{p.title.slice(0,1)}</div><div className="list-title"><b>{p.title}</b><span>{p.code} · {p.type}</span></div><div className="list-progress"><div className="bar"><i style={{ width: `${p.progress}%` }} /></div><span>{p.progress}%</span></div><span className="list-due">{p.due}</span><ChevronRight size={17} /></button>; }
function Tasks({ tasks, onToggle }) { return <><PageHead eyebrow="Execution" title="Tasks" description="Keep the team moving one clear action at a time." /><div className="panel task-panel">{tasks.concat([{ id:'new', title:'Create user testing plan', project:'Smart Lost & Found', assignee:'JB', priority:'Medium', due:'Sep 17', done:false }]).map((t) => <TaskRow key={t.id} task={t} onToggle={() => t.id !== 'new' && onToggle(t.id)} />)}</div></>; }
function Timeline() { return <><PageHead eyebrow="Schedule" title="Timeline" description="A single view of your academic project deadlines." /><div className="timeline-panel">{['Requirements', 'UI / UX', 'Backend', 'Integration', 'Testing', 'Documentation', 'Viva'].map((x, i) => <div className="timeline-row" key={x}><span className="date">Sep {10 + i * 5}</span><div className="timeline-line"><i /></div><div><b>{x}</b><p>{i < 3 ? 'Completed milestone' : i === 3 ? 'In progress' : 'Upcoming milestone'}</p></div><span className={`timeline-status s${i}`}>{i < 3 ? 'Done' : i === 3 ? 'Active' : 'Planned'}</span></div>)}</div></>; }
function Team() { return <><PageHead eyebrow="People" title="Team" description="Roles, ownership and momentum without the spreadsheet chase." action="Invite member" onAction={() => window.alert('Invite flow can be connected to Supabase Auth.')} /><div className="team-grid">{seedMembers.map((m) => <div className="member-card" key={m.id}><div className="member-avatar">{m.initials}<i className={m.online ? 'online' : ''} /></div><h3>{m.name}</h3><p>{m.role}</p><span>Active this week</span></div>)}</div></>; }
function Documents() { const docs = [['Project Abstract','2 pages','Updated today'],['Software Requirements Specification','14 pages','Updated yesterday'],['Database Schema','1 page','Updated Sep 03'],['Presentation Deck','18 slides','Updated Sep 01'],['Research References','28 sources','Updated Aug 28']]; return <><PageHead eyebrow="Project files" title="Documents" description="Your project evidence, report drafts and presentation materials." /><div className="doc-grid">{docs.map(([title, meta, updated]) => <div className="doc-card" key={title}><div className="doc-icon"><FileText size={19} /></div><h3>{title}</h3><p>{meta}</p><small>{updated}</small><button><ArrowUpRight size={15} /></button></div>)}</div></>; }
function Viva({ toast }) { const questions = ['Why did you choose this technology stack?', 'What problem does your project solve?', 'How does your database maintain consistency?', 'What are the current limitations?', 'How would you scale this project?']; return <><PageHead eyebrow="Practice" title="Viva Lab" description="Practice the questions an examiner is likely to ask." action="Start mock viva" onAction={() => toast('Mock viva session created')} /><div className="viva-layout"><div className="viva-hero"><div className="banner-orb"><Sparkles /></div><div><h2>Ready when you are.</h2><p>Pick a difficulty and answer aloud. Your future self will thank you at the viva table.</p></div></div><div className="panel"><div className="panel-head"><h3>Question bank</h3><span className="muted">5 curated questions</span></div>{questions.map((q, i) => <div className="question" key={q}><span>0{i + 1}</span><b>{q}</b><ArrowUpRight size={16} /></div>)}</div></div></>; }
function PageHead({ eyebrow, title, description, action, onAction }) { return <section className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="new-btn" onClick={onAction}><Plus size={17} /> {action}</button>}</section>; }
function ProjectModal({ onClose, onCreate }) { const [title, setTitle] = useState(''); return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">New workspace</div><h2>Create project</h2></div><button className="icon-btn" onClick={onClose}><X size={18} /></button></div><label>Project name<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Smart Campus Assistant" /></label><label>Project type<select defaultValue="Major Project"><option>Major Project</option><option>Mini Project</option><option>Research</option><option>Hackathon</option></select></label><div className="modal-note"><Sparkles size={15} /> We'll create a clean workspace with milestones, tasks and a starter timeline.</div><button className="new-btn wide" disabled={!title.trim()} onClick={() => onCreate(title.trim())}>Create project <ArrowUpRight size={16} /></button></div></div>; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
