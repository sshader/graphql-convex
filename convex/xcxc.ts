import {
  GraphQLEnumType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  graphql,
} from "graphql";

/**
 * This is designed to be an end-to-end test, demonstrating
 * the full GraphQL stack.
 *
 * We will create a GraphQL schema that describes the major
 * characters in the original Star Wars trilogy.
 *
 * NOTE: This may contain spoilers for the original Star
 * Wars trilogy.
 */

/**
 * Using our shorthand to describe type systems, the type system for our
 * Star Wars example is:
 *
 * ```graphql
 * enum Episode { NEW_HOPE, EMPIRE, JEDI }
 *
 * interface Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 * }
 *
 * type Human implements Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 *   homePlanet: String
 * }
 *
 * type Droid implements Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 *   primaryFunction: String
 * }
 *
 * type Query {
 *   hero(episode: Episode): Character
 *   human(id: String!): Human
 *   droid(id: String!): Droid
 * }
 * ```
 *
 * We begin by setting up our schema.
 */

/**
 * The original trilogy consists of three movies.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * enum Episode { NEW_HOPE, EMPIRE, JEDI }
 * ```
 */
const episodeEnum = new GraphQLEnumType({
  name: "Episode",
  description: "One of the films in the Star Wars Trilogy",
  values: {
    NEW_HOPE: {
      value: 4,
      description: "Released in 1977.",
    },
    EMPIRE: {
      value: 5,
      description: "Released in 1980.",
    },
    JEDI: {
      value: 6,
      description: "Released in 1983.",
    },
  },
});

/**
 * Characters in the Star Wars trilogy are either humans or droids.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * interface Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 *   secretBackstory: String
 * }
 * ```
 */
const characterInterface: GraphQLInterfaceType = new GraphQLInterfaceType({
  name: "Character",
  description: "A character in the Star Wars Trilogy",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the character.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the character.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        "The friends of the character, or an empty list if they have none.",
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "All secrets about their past.",
    },
  }),
  resolveType(character) {
    switch (character.type) {
      case "Human":
        return humanType.name;
      case "Droid":
        return droidType.name;
    }
  },
});

/**
 * We define our human type, which implements the character interface.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * type Human : Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 *   secretBackstory: String
 * }
 * ```
 */
const humanType = new GraphQLObjectType<Doc<"Human">, QueryCtx>({
  name: "Human",
  description: "A humanoid creature in the Star Wars universe.",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the human.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the human.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        "The friends of the human, or an empty list if they have none.",
      resolve: (human, args, context) => {
        return human.friends.map((id) => context.db.get(id));
      },
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    homePlanet: {
      type: GraphQLString,
      description: "The home planet of the human, or null if unknown.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "Where are they from and how they came to be who they are.",
      resolve() {
        throw new Error("secretBackstory is secret.");
      },
    },
  }),
  interfaces: [characterInterface],
});

/**
 * The other type of character in Star Wars is a droid.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * type Droid : Character {
 *   id: String!
 *   name: String
 *   friends: [Character]
 *   appearsIn: [Episode]
 *   secretBackstory: String
 *   primaryFunction: String
 * }
 * ```
 */
const droidType = new GraphQLObjectType<Doc<"Droid">, QueryCtx>({
  name: "Droid",
  description: "A mechanical creature in the Star Wars universe.",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The id of the droid.",
    },
    name: {
      type: GraphQLString,
      description: "The name of the droid.",
    },
    friends: {
      type: new GraphQLList(characterInterface),
      description:
        "The friends of the droid, or an empty list if they have none.",
      resolve: (droid, _args, context) => {
        return droid.friends.map((id) => context.db.get(id));
      },
    },
    appearsIn: {
      type: new GraphQLList(episodeEnum),
      description: "Which movies they appear in.",
    },
    secretBackstory: {
      type: GraphQLString,
      description: "Construction date and the name of the designer.",
      resolve() {
        throw new Error("secretBackstory is secret.");
      },
    },
    primaryFunction: {
      type: GraphQLString,
      description: "The primary function of the droid.",
    },
  }),
  interfaces: [characterInterface],
});

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema. It gives us the ability to fetch
 * objects by their IDs, as well as to fetch the undisputed hero
 * of the Star Wars trilogy, R2-D2, directly.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * type Query {
 *   hero(episode: Episode): Character
 *   human(id: String!): Human
 *   droid(id: String!): Droid
 * }
 * ```
 */
const queryType = new GraphQLObjectType<unknown, QueryCtx>({
  name: "Query",
  fields: () => ({
    hero: {
      type: characterInterface,
      args: {
        episode: {
          description:
            "If omitted, returns the hero of the whole saga. If provided, returns the hero of that particular episode.",
          type: episodeEnum,
        },
      },
      resolve: async (_source, { episode }, context) => {
        console.log("xcxc");
        if (episode === 5) {
          // Luke is the hero of Episode V.
          return await context.db
            .query("Human")
            .filter((q) => q.eq(q.field("name"), "Luke Skywalker"))
            .unique();
        }
        // Artoo is the hero otherwise.
        return await context.db
          .query("Droid")
          .filter((q) => q.eq(q.field("name"), "R2-D2"))
          .unique();
      },
    },
    human: {
      type: humanType,
      args: {
        id: {
          description: "id of the human",
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, { id }, context) => {
        return await context.db.get(new Id("Human", id));
      },
    },
    droid: {
      type: droidType,
      args: {
        id: {
          description: "id of the droid",
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_source, { id }, context) => {
        return await context.db.get(new Id("Droid", id));
      },
    },
  }),
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const StarWarsSchema = new GraphQLSchema({
  query: queryType,
  types: [humanType, droidType],
});

import { QueryCtx, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export default query(
  async (
    ctx,
    args: {
      query: string;
      operationName?: string | null;
      variables?: any;
    }
  ) => {
    const result = await graphql({
      schema: StarWarsSchema,
      source: args.query.trim(),
      variableValues: args.variables,
      operationName: args.operationName,
      contextValue: ctx,
    });
    // @ts-ignore
    result.errors = result.errors?.map((e) => e.toString());
    return result;
  }
);
