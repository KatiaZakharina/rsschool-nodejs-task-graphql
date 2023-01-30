import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { Post, Profile, User } from './types';
import { PostInput, ProfileInput, UserInput } from './mutation-types';

const mutationsQuery = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: {
      type: User,
      args: {
        data: {
          type: new GraphQLNonNull(UserInput),
        },
      },
      resolve: function (parent, { data }, contextValue) {
        return contextValue.db.users.create(data);
      },
    },
    createProfile: {
      type: Profile,
      args: {
        data: {
          type: new GraphQLNonNull(ProfileInput),
        },
      },
      resolve: async function (parent, { data }, contextValue) {
        const profile = await contextValue.db.profiles.findOne({
          key: 'userId',
          equals: data.userId,
        });

        if (profile) {
          return null;
        }

        return await contextValue.db.profiles.create(data);
      },
    },
    createPost: {
      type: Post,
      args: {
        data: {
          type: new GraphQLNonNull(PostInput),
        },
      },
      resolve: function (parent, { data }, contextValue) {
        return contextValue.db.posts.create(data);
      },
    },
  }),
});

export default mutationsQuery;
