import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import cors, { CorsRequest } from "cors";
import schema from "./schema";
import resolvers from "./resolvers";

(async () => {
  const app = express();
  const server = new ApolloServer<BaseContext>({
    typeDefs: schema,
    resolvers,
  });
  const PORT = process.env.NODE_ENV || "http://localhost:8000";

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({
      origin: [
        "https://clone-shopping-mall.vercel.app",
        "https://studio.apollographql.com",
      ],
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server)
  );

  await app.listen({ port: PORT });
  console.log(`Server listening on ${PORT}...`);
})();
