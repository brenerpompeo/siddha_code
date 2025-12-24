const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/app/.env' }); // Adjust path if needed

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting seed process...');

  // 1. Create/Get User
  const email = `test_user_${Date.now()}@siddhacode.com`;
  const password = 'Password123!';
  
  console.log(`Creating user: ${email}`);
  
  let { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('Error creating user:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`User created with ID: ${userId}`);

  // 2. Create Profile
  console.log('Creating profile...');
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

  // 3. Create Ciclo (Meta Year)
  console.log('Creating Ciclo...');
  const { data: ciclo, error: cicloError } = await supabase.from('meta_years').insert({
    user_id: userId,
    year: 2025,
    theme: 'Ano da Expansão Digital',
    intention: 'Construir bases sólidas para o futuro.',
    status: 'active'
  }).select().single();

  if (cicloError) console.error('Error creating ciclo:', cicloError.message);

  // 4. Create Sprint
  console.log('Creating Sprint...');
  const { data: sprint, error: sprintError } = await supabase.from('sprints').insert({
    user_id: userId,
    meta_year_id: ciclo?.id,
    title: 'Sprint 1: Fundação',
    intention: 'Estabelecer rotinas básicas.',
    status: 'active',
    duration: 14,
    focus_pillars: ['physical', 'professional'],
    goals: ['Acordar às 6h', 'Lançar MVP'],
    start_date: new Date().toISOString()
  }).select().single();

  if (sprintError) console.error('Error creating sprint:', sprintError.message);

  // 5. Create Tasks
  console.log('Creating Tasks...');
  if (sprint) {
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

  console.log('✅ Seed completed successfully!');
  console.log(`\nLOGIN CREDENTIALS:\nEmail: ${email}\nPassword: ${password}\n`);
}

seed();
