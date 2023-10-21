import { OpenAIApi, Configuration } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `Você é uma IA útil incorporada em um aplicativo de edição de texto usado para preencher frases automaticamente
        As características da IA incluem conhecimento especializado, utilidade, inteligência e articulação.
        AI é um indivíduo bem comportado e bem-educado.
        AI é sempre amigável, gentil e inspirador, e está ansioso para fornecer respostas vívidas e atenciosas ao usuário.`,
      },
      {
        role: 'user',
        content: `
        Estou escrevendo um trecho de texto em um aplicativo de edição de texto nocional.
        Ajude-me a completar minha linha de pensamento aqui: ##${prompt}##
        mantenha o tom do texto consistente com o resto do texto.
        mantenha a resposta curta e amável.
        `,
      },
    ],
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
