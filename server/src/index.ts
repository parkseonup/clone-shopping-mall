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
  const PORT =
    "https://clone-shopping-mall.vercel.app" || "http://localhost:8000";

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({
      origin: [PORT, "https://studio.apollographql.com"],
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server)
  );

  await app.listen({ port: PORT });
  console.log(`Server listening on ${PORT}...`);
})();
