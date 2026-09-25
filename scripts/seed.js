const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting seed process...');

  const email = 'tester@example.com';
  const password = 'Password123!';
  
  console.log(`Checking user: ${email}`);
  
  // 1. Try to sign in first
  let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (signInError) {
    console.log('User not found or password wrong, trying to create...');
    // 2. Sign up if not exists
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
        console.error('Error creating user:', signUpError.message);
        // If it says valid email required, maybe try a real-looking one or check config
        // But let's proceed assuming we might have a user ID from a previous run or manual insert?
        // Actually, without a user ID, we can't seed data linked to a user.
        // Let's try to fetch a user directly if possible? No, client can't list users.
        
        // Let's try a fallback user ID if we can't auth
        // process.exit(1); 
    }
    authData = signUpData;
  }

  const userId = authData?.user?.id;
  
  if (!userId) {
      console.error('❌ Could not obtain a User ID. Aborting seed.');
      return;
  }

  console.log(`Using User ID: ${userId}`);

  // 2. Create Profile
  console.log('Creating/Updating profile...');
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: email,
    username: 'SiddhaTester',
    full_name: 'Test User',
    xp: 1500,
    streak: 5,
    hd_type: 'generator',
    archetype: 'hero',
    pillars_stats: { physical: 10, mental: 20, spiritual: 50, professional: 30 }
  });

  if (profileError) console.error('Error creating profile:', profileError.message);

  // 3. Create Ciclo
  console.log('Creating Ciclo...');
  const { data: ciclo, error: cicloError } = await supabase.from('meta_years').insert({
    user_id: userId,
    year: 2025,
    theme: 'Ano da Expansão Digital',
    intention: 'Construir bases sólidas para o futuro.',
    status: 'active'
  }).select().single();

  if (cicloError) console.log('Ciclo creation note:', cicloError.message);

  // 4. Create Sprint
  console.log('Creating Sprint...');
  const { data: sprint, error: sprintError } = await supabase.from('sprints').insert({
    user_id: userId,
    meta_year_id: ciclo?.id, // Might be null if ciclo failed, that's okay
    title: 'Sprint 1: Fundação',
    intention: 'Estabelecer rotinas básicas.',
    status: 'active',
    duration: 14,
    focus_pillars: ['physical', 'professional'],
    goals: ['Acordar às 6h', 'Lançar MVP'],
    start_date: new Date().toISOString()
  }).select().single();

  if (sprintError) console.log('Sprint creation note:', sprintError.message);

  // 5. Create Tasks
  if (sprint) {
    console.log('Creating Tasks...');
    const tasks = [
      { title: 'Configurar ambiente de dev', pillar: 'professional', status: 'wisdom', xp_reward: 20 },
      { title: 'Corrida de 5km', pillar: 'physical', status: 'response', gut_check_score: 9, xp_reward: 50 },
      { title: 'Ler O Caibalion', pillar: 'spiritual', status: 'potential', xp_reward: 15 }
    ];

    for (const t of tasks) {
      await supabase.from('tasks').insert({
        user_id: userId,
        sprint_id: sprint.id,
        ...t
      });
    }
  }

  // 6. Create Journal Entry
  console.log('Creating Journal Entry...');
  await supabase.from('journal_entries').insert({
    user_id: userId,
    title: 'Primeiro dia de testes',
    content: 'O sistema parece estar funcionando bem. Preciso verificar a integração com a IA.',
    pillar: 'intellectual',
    tags: ['teste', 'dev']
  });

  console.log('✅ Seed completed!');
}

seed();
