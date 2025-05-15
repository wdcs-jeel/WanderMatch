// schema.js
const { gql } = require('apollo-server');

const typeDefs = gql`
  type Feedback {
    id: ID!
    feedback: String!
  }

  type Query {
    feedbacks: [Feedback]
  }

  type Mutation {
    addFeedback(feedback: String!): Feedback
    deleteFeedback(id: ID!): Boolean
    updateFeedback(id: ID!, feedback: String!): Feedback
  }
`;

module.exports = typeDefs;
