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
    Write two variations of a Facebook ad caption using the following information:

    Avatar and Their Problem: ${avatar}
    Desired Outcome: ${desiredOutcome}
    Ineffective Method 1: ${ineffectiveMethod1}
    Ineffective Method 2: ${ineffectiveMethod2}
    Ineffective Method 3: ${ineffectiveMethod3}
    New Solution Name: ${newSolution}

    Please write each ad copy variation in this format:

    Variation 1:
    Line 1: 📞 CALLING ALL [AVATAR + THEIR PAIN]: [achieve your desired outcome] with this NEW METHOD...
    Line 2: I understand that you may have already tried:
    - [Ineffective Method 1]
    - [Ineffective Method 2]
    - Or even - [Ineffective Method 3]
    Line 3: But you're still seeing no progress towards [desired outcome].
    Line 4: That's why I want to introduce you to [new solution name].
    Line 5: As of 2024, it's the fastest and easiest way to [desired outcome].
    Line 6: If you're interested in learning more…
    Line 7: You can access it right here: [INSERT LINK]

    Variation 2:
    [Create a different approach using the same information but with a unique angle or hook]

    Make sure both ad copy variations are engaging, persuasive, and tailored to the specific avatar and their problem. Use emojis where appropriate to make the ads more visually appealing.
    `;

    console.log('Sending request to OpenAI');
    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
      temperature: 0.7,
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