import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw reply.notFound();
      }

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const createdUser = await fastify.db.users.create(request.body);

      reply.code(201);
      return createdUser;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw reply.badRequest();
      }

      const subscribedUsers = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: request.params.id,
      });

      await Promise.all(
        subscribedUsers.map(async (subscribedUser) => {
          const index = subscribedUser.subscribedToUserIds.indexOf(
            request.params.id
          );

          subscribedUser.subscribedToUserIds.splice(index, 1);
          await fastify.db.users.change(subscribedUser.id, subscribedUser);
        })
      );

      const userProfile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.params.id,
      })

      if (userProfile) {
        await fastify.db.profiles.delete(userProfile.id);
      }

      await fastify.db.users.delete(user.id);

      reply.code(204);
      return user;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!user) {
        throw reply.notFound();
      }

      user.subscribedToUserIds.push(request.params.id);

      const subscribedUser = await fastify.db.users.change(user.id, user);

      reply.code(200);
      return subscribedUser;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!user) {
        throw reply.notFound();
      }

      const index = user.subscribedToUserIds.indexOf(request.params.id);
      if (index === -1) {
        throw reply.badRequest();
      }

      user.subscribedToUserIds.splice(index, 1);

      const subscribedUser = await fastify.db.users.change(user.id, user);

      reply.code(200);
      return subscribedUser;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw reply.badRequest();
      }

      const changedUser = await fastify.db.users.change(user.id, request.body);

      reply.code(200);
      return changedUser;
    }
  );
};

export default plugin;
