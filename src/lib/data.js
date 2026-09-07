import { supabase } from './supabase';

export async function getProjects(userId) {
  if (!supabase || !userId) return { data: null, error: null };
  return supabase
    .from('projects')
    .select('id,title,code,type,description,status,progress,due_date,created_at')
    .or(`owner_id.eq.${userId},id.in.(select project_id from project_members where user_id.eq.${userId})`)
    .order('created_at', { ascending: false });
}

export async function createProject({ ownerId, title, code, type = 'Major Project' }) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('projects').insert({ owner_id: ownerId, title, code, type }).select().single();
}

export async function getProjectTasks(projectId) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('tasks').select('id,title,description,priority,due_date,done,assignee_id,created_at').eq('project_id', projectId).order('created_at', { ascending: false });
}

export async function setTaskDone(taskId, done) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  return supabase.from('tasks').update({ done }).eq('id', taskId).select().single();
}
