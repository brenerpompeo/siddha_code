
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://api.emergent.sh/v1',
});

async function main() {
  console.log('Testing with Key:', process.env.EMERGENT_LLM_KEY ? 'Present' : 'Missing');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log('Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
