import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { GraphQLSchema, graphql } from 'graphql';

import { graphqlBodySchema } from './schema';
import rootQuery from './query';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = request.body.query!;

      const schema = new GraphQLSchema({
        query: rootQuery,
      });

      return await graphql({
        schema,
        source,
        contextValue: fastify,
        variableValues: request.body.variables,
      });
    }
  );
};

export default plugin;
