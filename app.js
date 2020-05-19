require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/schema/index');
const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

const app = express();

app.use(bodyParser.json());

const server = new ApolloServer({
     schema,
     context: { redis, redisClient }
});

server.applyMiddleware({ app, path: '/graphql' });

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
).then(result => {
    app.listen(3000);
})