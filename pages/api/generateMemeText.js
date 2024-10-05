import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  console.log('Received request body:', req.body);
  
  const { 
    avatar, 
    desiredOutcome, 
    ineffectiveMethod1, 
    ineffectiveMethod2, 
    ineffectiveMethod3, 
    newSolution 
  } = req.body;

  console.log('Received request with data:', req.body);

  // Input validation
  if (!avatar || !desiredOutcome || !ineffectiveMethod1 || !ineffectiveMethod2 || !ineffectiveMethod3 || !newSolution) {
    console.error('Missing required fields:', {
      avatar, 
      desiredOutcome, 
      ineffectiveMethod1, 
      ineffectiveMethod2, 
      ineffectiveMethod3, 
      newSolution
    });
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Cycle through ineffective methods
  const ineffectiveMethods = [ineffectiveMethod1, ineffectiveMethod2, ineffectiveMethod3];
  const randomIneffectiveMethod = ineffectiveMethods[Math.floor(Math.random() * ineffectiveMethods.length)];
  console.log('Selected ineffective method:', randomIneffectiveMethod);

  const prompt = `
  Provide two short phrases suitable for the top and bottom text of a meme, in the following format:

  Top Text: [IF YOU WANT ${desiredOutcome}, DON’T ${randomIneffectiveMethod}]
  Bottom Text: [DO THIS INSTEAD: ${newSolution}]

  The text should be attention-grabbing and relevant to the audience and the solution.
  Do not include hashtags, emojis, or quotation marks in the text.
  Keep each phrase short and impactful, ideally no more than 5-7 words each.
  `;

  try {
    console.log('Sending request to OpenAI for meme text generation with prompt:', prompt);
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 60,
      temperature: 0.7,
    });

    console.log('Received response from OpenAI');
    const content = completion.choices[0]?.message?.content.trim();
    console.log('Generated content:', content);

    // Extract the top and bottom text from the response
    const topTextMatch = content.match(/Top Text:\s*(.*)/i);
    const bottomTextMatch = content.match(/Bottom Text:\s*(.*)/i);

    let topText = topTextMatch ? topTextMatch[1] : '';
    let bottomText = bottomTextMatch ? bottomTextMatch[1] : '';

    // Remove any remaining hashtags, emojis, or quotation marks
    topText = topText.replace(/#\w+|[""]|[^\w\s!?.,]/g, '').trim();
    bottomText = bottomText.replace(/#\w+|[""]|[^\w\s!?.,]/g, '').trim();

    console.log('Cleaned top text:', topText);
    console.log('Cleaned bottom text:', bottomText);

    res.status(200).json({ topText, bottomText });
  } catch (error) {
    console.error('Error generating meme text:', error.message);
    res.status(500).json({ error: 'Failed to generate meme text' });
  }
}