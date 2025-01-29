const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleAuth } = require('google-auth-library');

let generativeModel;
const auth = new GoogleAuth();
auth.getProjectId().then(result => {
  const vertex = new VertexAI({ project: result });
  generativeModel = vertex.getGenerativeModel({
      model: 'gemini-1.5-flash'
  });
});

const fastify = require('fastify')();
const PORT = parseInt(process.env.PORT || '8080');

fastify.get('/', async function (request, reply) {
  const animal = request.query.animal || 'dog';
  const prompt = `Give me 10 fun facts about ${animal}. Return this as html without backticks.`
  const resp = await generativeModel.generateContent(prompt);
  const html = resp.response.candidates[0].content.parts[0].text;
  reply.type('text/html').send(html);
})

fastify.listen({ host: '0.0.0.0', port: PORT }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`codelab-genai: listening on ${address}`);
})