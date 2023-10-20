import { Configuration, OpenAIApi } from 'openai-edge';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function generateImagePrompt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled',
        },
        {
          role: 'user',
          content: `Please generate a thumbnail description for my notebook titles ${name}`,
        },
      ],
    });

    const data = await response.json();

    const imageDescription = data.choices[0].message.content;

    return imageDescription as string;
  } catch (error) {
    console.info('openia.ts', error);
    throw error;
  }
}

export async function generateImage(imageDescription: string) {
  try {
    const response = await openai.createImage({
      prompt: imageDescription,
      n: 1,
      size: '256x256',
    });

    const data = await response.json();

    const imageUrl = data.data[0].url;

    return imageUrl as string;
  } catch (error) {
    console.error(error);
  }
}
