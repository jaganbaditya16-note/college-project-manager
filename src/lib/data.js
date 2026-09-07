import { supabase } from './supabase';

export async function getProjects(userId) {
  if (!supabase || !userId) return { data: null, error: null };

  // RLS on the projects table already limits this result to projects the
  // authenticated user owns or belongs to. Avoid unsupported PostgREST
  // subqueries inside .or().
  return supabase
    .from('projects')
    .select('id,title,code,type,description,status,progress,due_date,created_at')
    .order('created_at', { ascending: false });
}

export async function createProject({ ownerId, title, code, type = 'Major Project' }) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  if (!ownerId || !title?.trim() || !code?.trim()) {
    return { data: null, error: new Error('ownerId, title and code are required') };
  }

  return supabase
    .from('projects')
    .insert({ owner_id: ownerId, title: title.trim(), code: code.trim(), type })
    .select()
    .single();
}

export async function getProjectTasks(projectId) {
  if (!supabase || !projectId) return { data: null, error: null };
  return supabase
    .from('tasks')
    .select('id,title,description,priority,due_date,done,assignee_id,created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
}

export async function setTaskDone(taskId, done) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  if (!taskId) return { data: null, error: new Error('taskId is required') };

  return supabase.from('tasks').update({ done: Boolean(done) }).eq('id', taskId).select().single();
}
