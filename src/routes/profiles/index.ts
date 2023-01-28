import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.notFound();
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const isProfileAlreadyExist = !!(await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      }));

      if (isProfileAlreadyExist) {
        throw reply.badRequest();
      }

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.body.memberTypeId,
      });

      if (!memberType) {
        throw reply.badRequest();
      }

      const createdProfile = await fastify.db.profiles.create(request.body);

      reply.code(201);
      return createdProfile;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.badRequest();
      }

      const deletedProfile = await fastify.db.profiles.delete(
        request.params.id
      );

      reply.code(204);
      return deletedProfile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw reply.badRequest();
      }

      const changedProfile = await fastify.db.profiles.change(
        request.params.id,
        request.body
      );

      return changedProfile;
    }
  );
};

export default plugin;
