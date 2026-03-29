import { createServer } from "vite";

const server = await createServer({
  server: {
    host: true,
    port: 8080,
    strictPort: true,
  },
});

const closeServer = async () => {
  await server.close();
  process.exit(0);
};

process.on("SIGINT", closeServer);
process.on("SIGTERM", closeServer);

await server.listen();
server.printUrls();