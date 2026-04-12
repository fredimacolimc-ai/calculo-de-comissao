import { createServer } from "vite";

const server = await createServer({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
});

await server.listen();
server.printUrls();
