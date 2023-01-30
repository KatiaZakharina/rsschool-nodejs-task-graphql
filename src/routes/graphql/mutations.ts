import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { MemberTypes, Post, Profile, User } from './types';
import {
  PostInput,
  ProfileInput,
  ProfileUpdateInput,
  UserInput,
  UserUpdateInput,
  PostUpdateInput,
  MemberTypesUpdateInput
} from './mutation-types';

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
    updateUser: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: {
          type: new GraphQLNonNull(UserUpdateInput),
        },
      },
      resolve: function (parent, { id, data }, contextValue) {
        return contextValue.db.users.change(id, data);
      },
    },
    updateProfile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: {
          type: new GraphQLNonNull(ProfileUpdateInput),
        },
      },
      resolve: function (parent, { id, data }, contextValue) {
        return contextValue.db.profiles.change(id, data);
      },
    },
    updatePost: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        data: {
          type: new GraphQLNonNull(PostUpdateInput),
        },
      },
      resolve: function (parent, { id, data }, contextValue) {
        return contextValue.db.posts.change(id, data);
      },
    },
    updateMemberTypes: {
      type: MemberTypes,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        data: {
          type: new GraphQLNonNull(MemberTypesUpdateInput),
        },
      },
      resolve: function (parent, { id, data }, contextValue) {
        return contextValue.db.memberTypes.change(id, data);
      },
    },
  }),
});

export default mutationsQuery;
