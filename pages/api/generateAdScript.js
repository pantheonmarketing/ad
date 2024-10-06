import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log('Handler started');
  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { avatar, desiredOutcome, ineffectiveMethod1, ineffectiveMethod2, ineffectiveMethod3, newSolution } = req.body;

    const prompt = `
    Create two variations of an ad script for the following:
    Avatar: ${avatar}
    Desired Outcome: ${desiredOutcome}
    Ineffective Methods: ${ineffectiveMethod1}, ${ineffectiveMethod2}, ${ineffectiveMethod3}
    New Solution: ${newSolution}

    Strictly follow this template for each variation:

    Variation 1:
    Headline (max 10 words): [Insert headline here]
    
    Main body (50-70 words):
    [Insert main body text here]
    
    Call to Action (5-7 words): [Insert call to action here]

    Variation 2:
    Headline (max 10 words): [Insert headline here]
    
    Main body (50-70 words):
    [Insert main body text here]
    
    Call to Action (5-7 words): [Insert call to action here]

    Focus on the benefits of the new solution and how it addresses the avatar's pain points. Be direct and persuasive.
    `;

    console.log('Sending request to OpenAI');
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.3,
    });
    const endTime = Date.now();
    console.log(`OpenAI request took ${endTime - startTime}ms`);

    const content = completion.choices[0].message.content;
    const [variation1, variation2] = content.split('Variation 2:').map(v => v.trim());

    res.status(200).json({ variation1, variation2 });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}