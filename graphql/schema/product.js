const { gql } = require('apollo-server-express');

module.exports = gql`
    type Product {
        _id: ID!
        title: String!
        price: Int!
        description: String
        images: [String]
        createdAt: String
        updatedAt: String
    }

    input productInputData {
        title: String!
        price: Int!
        description: String
        images: [String]
    }

    type Query {
        products: [Product]
        product(id: String!): Product!
    }

    type Mutation {
        createProduct(
            title: String!
            price: Int!
            description: String
            images: [String]): Product!
        updateProduct(id: String!, productInput: productInputData): Product!
    }
`;
