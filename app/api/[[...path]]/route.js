import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo (will be replaced with Supabase)
let users = [
  {
    id: uuidv4(),
    username: 'SiddhaWarrior',
    full_name: 'Demo User',
    email: 'demo@siddhacode.com',
    xp: 2340,
    streak: 7,
    rank: 'praticante',
    hd_type: 'generator',
    hd_strategy: 'To Respond',
    hd_authority: 'Sacral',
    pillars_stats: {
      physical: 15,
      mental: 22,
      intellectual: 18,
      spiritual: 25,
      cultural: 10,
      professional: 30,
      personal: 12
    },
    created_at: new Date().toISOString()
  }
];

let sprints = [
  {
    id: uuidv4(),
    user_id: users[0].id,
    title: 'Week 1 - Foundation',
    status: 'active',
    start_date: new Date().toISOString(),
    goals: ['Complete daily protocols', 'Build momentum'],
    stats: { tasks_completed: 5, total_xp: 150 },
    created_at: new Date().toISOString()
  }
];

let tasks = [
  { id: uuidv4(), sprint_id: sprints[0].id, user_id: users[0].id, title: 'Morning meditation practice', pillar: 'spiritual', status: 'wisdom', gut_check_score: 9, xp_reward: 15, created_at: new Date().toISOString() },
  { id: uuidv4(), sprint_id: sprints[0].id, user_id: users[0].id, title: 'Read 20 pages of Design Patterns book', pillar: 'intellectual', status: 'integration', gut_check_score: 8, xp_reward: 10, created_at: new Date().toISOString() },
  { id: uuidv4(), sprint_id: sprints[0].id, user_id: users[0].id, title: 'Complete React course module', pillar: 'professional', status: 'response', gut_check_score: 9, xp_reward: 20, created_at: new Date().toISOString() },
  { id: uuidv4(), sprint_id: sprints[0].id, user_id: users[0].id, title: 'Family dinner planning', pillar: 'personal', status: 'potential', gut_check_score: null, xp_reward: 10, created_at: new Date().toISOString() },
  { id: uuidv4(), sprint_id: sprints[0].id, user_id: users[0].id, title: '30 min cardio workout', pillar: 'physical', status: 'potential', gut_check_score: null, xp_reward: 15, created_at: new Date().toISOString() },
];

let protocols = [
  { id: uuidv4(), user_id: users[0].id, name: 'Morning Routine', is_checked: true, check_date: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: users[0].id, name: 'Hydration (8 glasses)', is_checked: true, check_date: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: users[0].id, name: 'Meditation', is_checked: true, check_date: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: users[0].id, name: 'Exercise', is_checked: false, check_date: null, created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: users[0].id, name: 'Learning Time', is_checked: false, check_date: null, created_at: new Date().toISOString() },
  { id: uuidv4(), user_id: users[0].id, name: 'Evening Review', is_checked: false, check_date: null, created_at: new Date().toISOString() },
];

let journalEntries = [];

// XP Rewards constants
const XP_REWARDS = {
  task_complete: 10,
  daily_task_complete: 15,
  protocol_complete: 5,
  all_protocols_daily: 25,
  sprint_complete: 100,
  journal_entry: 10,
  not_self_log: 15,
  high_gut_check: 5
};

// Rank thresholds
const RANKS = [
  { rank: 'iniciado', xp_min: 0 },
  { rank: 'buscador', xp_min: 500 },
  { rank: 'praticante', xp_min: 1500 },
  { rank: 'adepto', xp_min: 3500 },
  { rank: 'guardiao', xp_min: 7000 },
  { rank: 'mistico', xp_min: 12000 },
  { rank: 'alquimista', xp_min: 20000 },
  { rank: 'oraculo', xp_min: 32000 },
  { rank: 'mestre_do_tempo', xp_min: 50000 },
  { rank: 'marechal_siddha', xp_min: 75000 }
];

function getRankByXp(xp) {
  let currentRank = RANKS[0].rank;
  for (const r of RANKS) {
    if (xp >= r.xp_min) {
      currentRank = r.rank;
    } else {
      break;
    }
  }
  return currentRank;
}

// Route handlers
export async function GET(request, context) {
  const { path } = await context.params;
  const pathString = path ? path.join('/') : '';
  
  // Health check
  if (pathString === 'health' || pathString === '') {
    return NextResponse.json({
      status: 'healthy',
      service: 'siddha-code-api',
      timestamp: new Date().toISOString()
    });
  }
  
  // Get current user profile
  if (pathString === 'profiles/me') {
    return NextResponse.json(users[0]);
  }
  
  // Get all sprints
  if (pathString === 'sprints') {
    const userSprints = sprints.filter(s => s.user_id === users[0].id);
    return NextResponse.json(userSprints);
  }
  
  // Get active sprint
  if (pathString === 'sprints/active') {
    const activeSprint = sprints.find(s => s.user_id === users[0].id && s.status === 'active');
    if (!activeSprint) {
      return NextResponse.json({ error: 'No active sprint found' }, { status: 404 });
    }
    return NextResponse.json(activeSprint);
  }
  
  // Get sprint tasks
  if (pathString.match(/^sprints\/[\w-]+\/tasks$/)) {
    const sprintId = pathString.split('/')[1];
    const sprintTasks = tasks.filter(t => t.sprint_id === sprintId);
    return NextResponse.json(sprintTasks);
  }
  
  // Get all tasks
  if (pathString === 'tasks') {
    const userTasks = tasks.filter(t => t.user_id === users[0].id);
    return NextResponse.json(userTasks);
  }
  
  // Get protocols
  if (pathString === 'protocols') {
    const userProtocols = protocols.filter(p => p.user_id === users[0].id);
    return NextResponse.json(userProtocols);
  }
  
  // Get journal entries
  if (pathString === 'journal') {
    const userJournals = journalEntries.filter(j => j.user_id === users[0].id);
    return NextResponse.json(userJournals);
  }
  
  // Get gamification stats
  if (pathString === 'gamification/rank-progress') {
    const user = users[0];
    const currentRankIndex = RANKS.findIndex(r => r.rank === user.rank);
    const nextRank = currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
    
    return NextResponse.json({
      current_rank: user.rank,
      current_xp: user.xp,
      next_rank: nextRank?.rank || null,
      xp_to_next: nextRank ? nextRank.xp_min - user.xp : 0,
      progress_percent: nextRank 
        ? ((user.xp - RANKS[currentRankIndex].xp_min) / (nextRank.xp_min - RANKS[currentRankIndex].xp_min)) * 100
        : 100
    });
  }
  
  // Get constants
  if (pathString === 'constants/pillars') {
    return NextResponse.json([
      { key: 'physical', label: 'Físico', color: '#10b981' },
      { key: 'mental', label: 'Mental', color: '#0ea5e9' },
      { key: 'intellectual', label: 'Intelectual', color: '#6366f1' },
      { key: 'spiritual', label: 'Espiritual', color: '#8b5cf6' },
      { key: 'cultural', label: 'Cultural', color: '#ec4899' },
      { key: 'professional', label: 'Profissional', color: '#f59e0b' },
      { key: 'personal', label: 'Pessoal', color: '#ef4444' }
    ]);
  }
  
  if (pathString === 'constants/ranks') {
    return NextResponse.json(RANKS);
  }
  
  if (pathString === 'constants/kanban-columns') {
    return NextResponse.json([
      { id: 'potential', label: 'Potencial', color: '#6b7280' },
      { id: 'response', label: 'Resposta', color: '#10b981', requiresGutCheck: true },
      { id: 'integration', label: 'Integração', color: '#f59e0b' },
      { id: 'wisdom', label: 'Sabedoria', color: '#8b5cf6' }
    ]);
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request, context) {
  const { path } = await context.params;
  const pathString = path ? path.join('/') : '';
  
  try {
    const body = await request.json();
    
    // Create sprint
    if (pathString === 'sprints') {
      const newSprint = {
        id: uuidv4(),
        user_id: users[0].id,
        title: body.title,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: body.end_date || null,
        goals: body.goals || [],
        stats: { tasks_completed: 0, total_xp: 0 },
        created_at: new Date().toISOString()
      };
      sprints.push(newSprint);
      return NextResponse.json(newSprint, { status: 201 });
    }
    
    // Create task
    if (pathString.match(/^sprints\/[\w-]+\/tasks$/) || pathString === 'tasks') {
      const sprintId = pathString.includes('sprints') ? pathString.split('/')[1] : sprints[0]?.id;
      
      const newTask = {
        id: uuidv4(),
        sprint_id: sprintId,
        user_id: users[0].id,
        title: body.title,
        pillar: body.pillar || 'personal',
        status: 'potential',
        gut_check_score: null,
        xp_reward: body.xp_reward || XP_REWARDS.task_complete,
        is_recurring: body.is_recurring || false,
        due_date: body.due_date || null,
        completed_at: null,
        created_at: new Date().toISOString()
      };
      tasks.push(newTask);
      return NextResponse.json(newTask, { status: 201 });
    }
    
    // Create journal entry
    if (pathString === 'journal') {
      const newEntry = {
        id: uuidv4(),
        user_id: users[0].id,
        type: body.type || 'reflection',
        content: body.content,
        emotion: body.emotion || null,
        trigger_situation: body.trigger_situation || null,
        lesson_learned: body.lesson_learned || null,
        energy_level: body.energy_level || null,
        related_pillars: body.related_pillars || [],
        created_at: new Date().toISOString()
      };
      journalEntries.push(newEntry);
      
      // Award XP for journal entry
      users[0].xp += XP_REWARDS.journal_entry;
      users[0].rank = getRankByXp(users[0].xp);
      
      return NextResponse.json(newEntry, { status: 201 });
    }
    
    // Add XP
    if (pathString === 'gamification/add-xp') {
      const { amount } = body;
      users[0].xp += amount;
      users[0].rank = getRankByXp(users[0].xp);
      
      return NextResponse.json({
        new_xp: users[0].xp,
        new_rank: users[0].rank,
        xp_added: amount
      });
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request, context) {
  const { path } = await context.params;
  const pathString = path ? path.join('/') : '';
  
  try {
    const body = await request.json();
    
    // Update profile
    if (pathString === 'profiles/me') {
      users[0] = { ...users[0], ...body, updated_at: new Date().toISOString() };
      return NextResponse.json(users[0]);
    }
    
    // Update task
    if (pathString.match(/^tasks\/[\w-]+$/)) {
      const taskId = pathString.split('/')[1];
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      
      const oldTask = tasks[taskIndex];
      tasks[taskIndex] = { ...oldTask, ...body, updated_at: new Date().toISOString() };
      
      // If task moved to wisdom (completed), award XP
      if (body.status === 'wisdom' && oldTask.status !== 'wisdom') {
        tasks[taskIndex].completed_at = new Date().toISOString();
        users[0].xp += tasks[taskIndex].xp_reward;
        users[0].rank = getRankByXp(users[0].xp);
        users[0].pillars_stats[tasks[taskIndex].pillar] = 
          (users[0].pillars_stats[tasks[taskIndex].pillar] || 0) + 1;
      }
      
      return NextResponse.json(tasks[taskIndex]);
    }
    
    // Update task status
    if (pathString.match(/^tasks\/[\w-]+\/status$/)) {
      const taskId = pathString.split('/')[1];
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      
      const oldStatus = tasks[taskIndex].status;
      tasks[taskIndex].status = body.status;
      tasks[taskIndex].updated_at = new Date().toISOString();
      
      // If moving to response, require gut check score
      if (body.status === 'response' && body.gut_check_score) {
        tasks[taskIndex].gut_check_score = body.gut_check_score;
        if (body.gut_check_score >= 8) {
          users[0].xp += XP_REWARDS.high_gut_check;
        }
      }
      
      // If completed, award XP
      if (body.status === 'wisdom' && oldStatus !== 'wisdom') {
        tasks[taskIndex].completed_at = new Date().toISOString();
        users[0].xp += tasks[taskIndex].xp_reward;
        users[0].rank = getRankByXp(users[0].xp);
        users[0].pillars_stats[tasks[taskIndex].pillar] = 
          (users[0].pillars_stats[tasks[taskIndex].pillar] || 0) + 1;
      }
      
      return NextResponse.json(tasks[taskIndex]);
    }
    
    // Toggle protocol
    if (pathString.match(/^protocols\/[\w-]+$/)) {
      const protocolId = pathString.split('/')[1];
      const protocolIndex = protocols.findIndex(p => p.id === protocolId);
      
      if (protocolIndex === -1) {
        return NextResponse.json({ error: 'Protocol not found' }, { status: 404 });
      }
      
      protocols[protocolIndex].is_checked = !protocols[protocolIndex].is_checked;
      protocols[protocolIndex].check_date = protocols[protocolIndex].is_checked 
        ? new Date().toISOString() 
        : null;
      protocols[protocolIndex].updated_at = new Date().toISOString();
      
      // Award XP for completing protocol
      if (protocols[protocolIndex].is_checked) {
        users[0].xp += XP_REWARDS.protocol_complete;
        
        // Check if all protocols completed
        const allCompleted = protocols
          .filter(p => p.user_id === users[0].id)
          .every(p => p.is_checked);
        
        if (allCompleted) {
          users[0].xp += XP_REWARDS.all_protocols_daily;
        }
        
        users[0].rank = getRankByXp(users[0].xp);
      }
      
      return NextResponse.json(protocols[protocolIndex]);
    }
    
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request, context) {
  const { path } = await context.params;
  const pathString = path ? path.join('/') : '';
  
  // Delete task
  if (pathString.match(/^tasks\/[\w-]+$/)) {
    const taskId = pathString.split('/')[1];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    tasks.splice(taskIndex, 1);
    return NextResponse.json({ success: true });
  }
  
  // Delete sprint
  if (pathString.match(/^sprints\/[\w-]+$/)) {
    const sprintId = pathString.split('/')[1];
    const sprintIndex = sprints.findIndex(s => s.id === sprintId);
    
    if (sprintIndex === -1) {
      return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
    }
    
    // Remove associated tasks
    tasks = tasks.filter(t => t.sprint_id !== sprintId);
    sprints.splice(sprintIndex, 1);
    return NextResponse.json({ success: true });
  }
  
  // Delete journal entry
  if (pathString.match(/^journal\/[\w-]+$/)) {
    const entryId = pathString.split('/')[1];
    const entryIndex = journalEntries.findIndex(j => j.id === entryId);
    
    if (entryIndex === -1) {
      return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }
    
    journalEntries.splice(entryIndex, 1);
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}