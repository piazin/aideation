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
            'Você é um assistente de IA criativo e útil, capaz de gerar descrições interessantes em miniaturas para minhas anotações. Sua saída será alimentada na API DALLE para gerar uma miniatura. A descrição deve ser minimalista e de estilo simples',
        },
        {
          role: 'user',
          content: `Por favor, gere uma descrição em miniatura para os títulos dos meus cadernos ${name}`,
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
