import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import cors, { CorsRequest } from "cors";
import schema from "./schema";
import resolvers from "./resolvers";
import env from "./envLoader";

(async () => {
  const app = express();
  const server = new ApolloServer<BaseContext>({
    typeDefs: schema,
    resolvers,
  });

  const clientUrl = env.CLIENT_URL as string;
  const port = env.PORT || 8000;

  await server.start();

  app.use(
    "/graphql",
    cors<CorsRequest>({
      origin: [
        clientUrl,
        "https://studio.apollographql.com",
        "https://clone-shopping-mall.vercel.app",
      ],
      credentials: true,
    }),
    bodyParser.json(),
    expressMiddleware(server)
  );

  await app.listen({ port });
  console.log(`Server listening on ${port}...`);
})();
