import { fastify } from "fastify";

const server = fastify({
  logger: true,
});

server.listen({ port: 3000 }, (err) => {
  console.log('started');
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
});
