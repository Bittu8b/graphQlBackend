const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./GraphQL/Schema/index.js');
const graphQlResolver = require('./GraphQL/Resolver/index.js');
const isAuth = require('./middleware/is-auth');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(isAuth);

app.get('/', (req, res) => {
  res.json({ status: 'You have reached to home' });
});

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
  })
);

mongoose
  .connect(
    'mongodb+srv://admin:007@graphql-cluster-v8me6.mongodb.net/graphql-dev?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connection Successful');
  })
  .catch(err => {
    console.log(err);
  });

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
