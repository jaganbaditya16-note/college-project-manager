import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight, Bell, CalendarDays, Check, CheckCircle2, ChevronRight, Circle,
  Clock3, FileText, FolderKanban, Github, LayoutDashboard, Menu, MessageSquareText,
  MoreHorizontal, Plus, Search, Settings, Sparkles, Target, Users, X,
} from 'lucide-react';
import './styles.css';
import { supabaseConfigured } from './lib/supabase';

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

const members = [
  { name: 'Jagan Baditya', role: 'Team Lead · Full Stack', initials: 'JB', online: true },
  { name: 'Ananya Rao', role: 'Research · Documentation', initials: 'AR', online: true },
  { name: 'Sahil Kulkarni', role: 'Backend · Database', initials: 'SK', online: false },
  { name: 'Neha Patil', role: 'UI/UX · Presentation', initials: 'NP', online: false },
];

const nav = [
  ['Overview', LayoutDashboard], ['Projects', FolderKanban], ['Tasks', CheckCircle2],
  ['Timeline', CalendarDays], ['Team', Users], ['Documents', FileText], ['Viva Lab', MessageSquareText],
];

function App() {
  const [active, setActive] = useState('Overview');
  const [projects, setProjects] = useState(seedProjects);
  const [tasks, setTasks] = useState(seedTasks);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState('');

  const filtered = useMemo(() => projects.filter((p) => `${p.title} ${p.code}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);

  const toast = (message) => {
    setNotice(message);
    window.clearTimeout(window.__campusflowToast);
    window.__campusflowToast = window.setTimeout(() => setNotice(''), 2600);
  };

  const toggleTask = (id) => {
    setTasks((items) => items.map((t) => t.id === id ? { ...t, done: !t.done } : t));
    toast('Task updated');
  };

  const addProject = (title) => {
    const safeTitle = title.trim();
    if (!safeTitle) return;
    const next = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: safeTitle,
      code: `IT-26-${Math.floor(100 + Math.random() * 899)}`,
      type: 'New Project', progress: 4, accent: ['violet', 'cyan', 'orange'][projects.length % 3],
      members: 1, due: 'Set date', status: 'Planning',
    };
    setProjects((items) => [next, ...items]);
    setShowModal(false);
    toast('Project created');
  };

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
        <nav>{nav.map(([label, Icon]) => (
          <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setMobileOpen(false); }}>
            <Icon size={18} /><span>{label}</span>{label === 'Tasks' && <em>{tasks.filter((t) => !t.done).length}</em>}
          </button>
        ))}</nav>
        <div className="side-spacer" />
        <div className="ai-card">
          <div className="ai-orb"><Sparkles size={17} /></div><b>Project Copilot</b>
          <p>Ask about deadlines, blockers or your next best task.</p>
          <button onClick={() => toast(supabaseConfigured ? 'AI endpoint can now be connected securely.' : 'Add Supabase to enable protected AI calls.')}>Open Copilot <ArrowUpRight size={15} /></button>
        </div>
        <button className="nav-item" onClick={() => toast('Settings are ready for the next release')}><Settings size={18} /><span>Settings</span></button>
        <div className="profile-mini"><div className="avatar">JB</div><div><b>Jagan Baditya</b><span>{supabaseConfigured ? 'Supabase configured' : 'Local workspace'}</span></div><MoreHorizontal size={17} /></div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu"><Menu size={20} /></button>
          <div className="crumb"><span>{active}</span><span className="dot">/</span><b>My workspace</b></div>
          <div className="top-actions">
            <label className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects…" /></label>
            <button className="icon-btn" onClick={() => toast('GitHub integration is ready for OAuth setup')} aria-label="GitHub"><Github size={18} /></button>
            <button className="icon-btn notif" onClick={() => toast('No new notifications')} aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="new-btn" onClick={() => setShowModal(true)}><Plus size={17} /> New project</button>
          </div>
        </header>
        <div className="content">
          {active === 'Overview' && <Overview projects={filtered} tasks={tasks} onAdd={() => setShowModal(true)} onToggle={toggleTask} toast={toast} />}
          {active === 'Projects' && <Projects projects={filtered} onAdd={() => setShowModal(true)} toast={toast} />}
          {active === 'Tasks' && <Tasks tasks={tasks} onToggle={toggleTask} />}
          {active === 'Timeline' && <Timeline />}
          {active === 'Team' && <Team toast={toast} />}
          {active === 'Documents' && <Documents toast={toast} />}
          {active === 'Viva Lab' && <Viva toast={toast} />}
        </div>
      </main>
      {showModal && <ProjectModal onClose={() => setShowModal(false)} onCreate={addProject} />}
      {notice && <div className="toast"><CheckCircle2 size={17} />{notice}</div>}
    </div>
  );
}

function Overview({ projects, tasks, onAdd, onToggle, toast }) {
  const completed = tasks.filter((t) => t.done).length;
  return <>
    <section className="hero-head">
      <div><div className="eyebrow"><span className="pulse" /> Semester workspace</div><h1>Build better projects,<br /><span>finish with confidence.</span></h1><p>One calm workspace for planning, teamwork, documentation and viva prep — built around how college projects actually happen.</p></div>
      <div className="hero-actions"><button className="ghost-btn" onClick={() => toast('Report preview prepared')}>View report <ArrowUpRight size={16} /></button><button className="new-btn" onClick={onAdd}><Plus size={17} /> New project</button></div>
    </section>
    <section className="stat-grid">
      <Stat label="Active projects" value={String(projects.length).padStart(2, '0')} trend="Across your workspace" icon={FolderKanban} />
      <Stat label="Tasks completed" value={`${completed}/${tasks.length}`} trend={`${Math.round((completed / Math.max(tasks.length, 1)) * 100)}% complete`} icon={CheckCircle2} />
      <Stat label="Next deadline" value="12 days" trend="SRS · Lost & Found" icon={Clock3} />
      <Stat label="Team velocity" value="8.4" trend="↑ 14% this week" icon={Target} />
    </section>
    <div className="section-row"><div><div className="eyebrow">Live workspace</div><h2>Current projects</h2></div><button className="text-btn" onClick={() => toast('Use Projects in the sidebar to browse all')}>View all <ChevronRight size={16} /></button></div>
    <section className="project-grid">{projects.map((p, i) => <ProjectCard key={p.id} project={p} featured={i === 0} onOpen={() => toast(`${p.title} opened`)} />)}</section>
    <section className="lower-grid">
      <div className="panel"><div className="panel-head"><div><div className="eyebrow">Execution</div><h3>My tasks</h3></div><button className="small-btn" onClick={() => toast('Task composer ready')}><Plus size={14} /> Add</button></div>{tasks.map((t) => <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} />)}</div>
      <div className="panel focus-panel"><div className="panel-head"><div><div className="eyebrow">Next up</div><h3>Project health</h3></div><span className="health-badge">Healthy</span></div><div className="health-ring"><div><strong>82</strong><span>/100</span></div></div><div className="health-copy"><b>You're on track.</b><p>Documentation is the only area trending behind your code progress.</p></div><div className="mini-bars"><Bar label="Code" value={90} /><Bar label="Docs" value={64} /><Bar label="Testing" value={72} /><Bar label="Team" value={84} /></div></div>
    </section>
    <section className="copilot-banner"><div className="banner-orb"><Sparkles /></div><div><div className="eyebrow">Project Copilot</div><h3>Turn project chaos into your next three actions.</h3><p>Use your project data to get a focused checklist instead of a generic productivity plan.</p></div><button className="new-btn" onClick={() => toast('Copilot UI is ready for an AI Edge Function')}>Try Copilot <ArrowUpRight size={16} /></button></section>
  </>;
}

function Stat({ label, value, trend, icon: Icon }) { return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div>; }
function ProjectCard({ project, featured, onOpen }) { return <article className={`project-card ${featured ? 'featured' : ''} ${project.accent}`} onClick={onOpen}><div className="project-top"><span className="project-type">{project.type}</span><span className="round-arrow"><ArrowUpRight size={16} /></span></div><div className="project-visual"><div className="visual-grid" /><div className="project-code">{project.code}</div><div className="visual-title">{project.title}</div></div><div className="project-body"><div><h3>{project.title}</h3><p>{project.status} · due {project.due}</p></div><span className="project-percent">{project.progress}%</span></div><div className="progress"><i style={{ width: `${project.progress}%` }} /></div><div className="project-footer"><span><Users size={14} /> {project.members} members</span><span className="status-dot">{project.status}</span></div></article>; }
function TaskRow({ task, onToggle }) { return <button className={`task-row ${task.done ? 'done' : ''}`} onClick={onToggle}><span className="task-check">{task.done ? <Check size={13} /> : <Circle size={13} />}</span><span className="task-main"><b>{task.title}</b><small>{task.project}</small></span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><span className="task-due">{task.due}</span><span className="task-avatar">{task.assignee}</span></button>; }
function Bar({ label, value }) { return <div className="bar-row"><span>{label}</span><div className="bar"><i style={{ width: `${value}%` }} /></div><b>{value}%</b></div>; }
function PageHead({ eyebrow, title, description, action, onAction }) { return <section className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <button className="new-btn" onClick={onAction}><Plus size={17} /> {action}</button>}</section>; }
function Projects({ projects, onAdd, toast }) { return <><PageHead eyebrow="Workspace" title="Projects" description="Every idea, milestone and deliverable in one place." action="New project" onAction={onAdd} /><div className="projects-list">{projects.length ? projects.map((p) => <button className="project-list-row" key={p.id} onClick={() => toast(`${p.title} opened`)}><div className={`list-icon ${p.accent}`}>{p.title[0]}</div><div className="list-title"><b>{p.title}</b><span>{p.code} · {p.type}</span></div><div className="list-progress"><div className="bar"><i style={{ width: `${p.progress}%` }} /></div><span>{p.progress}%</span></div><span className="list-due">{p.due}</span><ChevronRight size={17} /></button>) : <div className="empty-state">No projects match your search.</div>}</div></>; }
function Tasks({ tasks, onToggle }) { return <><PageHead eyebrow="Execution" title="Tasks" description="Keep the team moving one clear action at a time." /><div className="panel task-panel">{tasks.map((t) => <TaskRow key={t.id} task={t} onToggle={() => onToggle(t.id)} />)}</div></>; }
function Timeline() { const items = ['Requirements', 'UI / UX', 'Backend', 'Integration', 'Testing', 'Documentation', 'Viva']; return <><PageHead eyebrow="Schedule" title="Timeline" description="A single view of your academic project deadlines." /><div className="timeline-panel">{items.map((x, i) => <div className="timeline-row" key={x}><span className="date">Sep {10 + i * 5}</span><div className="timeline-line"><i /></div><div><b>{x}</b><p>{i < 3 ? 'Completed milestone' : i === 3 ? 'In progress' : 'Upcoming milestone'}</p></div><span className={`timeline-status s${i}`}>{i < 3 ? 'Done' : i === 3 ? 'Active' : 'Planned'}</span></div>)}</div></>; }
function Team({ toast }) { return <><PageHead eyebrow="People" title="Team" description="Roles, ownership and momentum without the spreadsheet chase." action="Invite member" onAction={() => toast('Invite flow ready for Supabase Auth')} /><div className="team-grid">{members.map((m) => <div className="member-card" key={m.name}><div className="member-avatar">{m.initials}</div><div><b>{m.name}</b><p>{m.role}</p></div><span className={`online ${m.online ? 'yes' : ''}`} /></div>)}</div></>; }
function Documents({ toast }) { const docs = [['Project Abstract','DOCX','Updated 2h ago'],['SRS Document','PDF','Updated yesterday'],['System Architecture','PNG','Updated Sep 04'],['Presentation Deck','PPTX','Updated Sep 02']]; return <><PageHead eyebrow="Knowledge" title="Documents" description="Keep reports, diagrams and submission files close to the project." action="Upload" onAction={() => toast('Storage upload can be connected next')} /><div className="docs-grid">{docs.map(([name, type, time]) => <button className="doc-card" key={name} onClick={() => toast(`${name} selected`)}><div className="doc-icon"><FileText size={19} /></div><div><b>{name}</b><span>{type} · {time}</span></div><ArrowUpRight size={16} /></button>)}</div></>; }
function Viva({ toast }) { return <><PageHead eyebrow="Practice" title="Viva Lab" description="Turn your project knowledge into confident answers before the examiner does." action="Start session" onAction={() => toast('Viva session started in demo mode')} /><div className="viva-hero"><div className="banner-orb"><MessageSquareText /></div><div><div className="eyebrow">AI examiner</div><h2>Practice the questions that matter.</h2><p>Run a timed mock viva, get a score and see which concepts need another look.</p></div></div><div className="viva-grid"><div className="panel"><div className="eyebrow">Recent session</div><h3>Smart Lost & Found</h3><strong className="big-score">8.4<span>/10</span></strong><p>Strong technical answers. Improve database trade-off explanations.</p></div><div className="panel"><div className="eyebrow">Question bank</div><h3>42 questions ready</h3><p>Architecture, database, security, testing and project-specific questions.</p><button className="small-btn" onClick={() => toast('Question bank opened')}>Open bank <ChevronRight size={15} /></button></div></div></>; }
function ProjectModal({ onClose, onCreate }) { const [title, setTitle] = useState(''); return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><div className="eyebrow">New workspace item</div><h2>Create a project</h2><p>Give your project a clear working title. You can add milestones and teammates next.</p><label>Project name<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onCreate(title)} placeholder="e.g. Smart Campus Assistant" /></label><div className="modal-actions"><button className="ghost-btn" onClick={onClose}>Cancel</button><button className="new-btn" disabled={!title.trim()} onClick={() => onCreate(title)}><Plus size={16} /> Create project</button></div></div></div>; }

createRoot(document.getElementById('root')).render(<App />);
