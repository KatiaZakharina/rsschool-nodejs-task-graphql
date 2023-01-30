import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { GraphQLSchema, graphql, parse, validate } from 'graphql';
import depthLimit = require('graphql-depth-limit');

import { graphqlBodySchema } from './schema';
import rootQuery from './query';
import mutation from './mutations';

const DEPTH_LIMIT = 6;

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
    async function (request) {
      const source = request.body.query!;

      const schema = new GraphQLSchema({
        query: rootQuery,
        mutation,
      });

      const [error] = validate(schema, parse(source), [
        depthLimit(DEPTH_LIMIT),
      ]);

      if (error) {
        return {
          errors: {
            message: `Query exceeds maximum operation depth of ${DEPTH_LIMIT}`,
          },
          data: null,
        };
      }

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
