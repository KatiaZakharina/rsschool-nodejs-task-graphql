import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { MemberType,  MemberTypeUpdateInput} from './types/member-type';
import { Post, PostInput, PostUpdateInput } from './types/post';
import { Profile, ProfileInput, ProfileUpdateInput } from './types/profile';
import { User, UserInput, UserUpdateInput } from './types/user';


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
    updateMemberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        data: {
          type: new GraphQLNonNull(MemberTypeUpdateInput),
        },
      },
      resolve: function (parent, { id, data }, contextValue) {
        return contextValue.db.memberTypes.change(id, data);
      },
    },
    subscribeUserTo: {
      type: User,
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async function (parent, { subscriberId, id }, contextValue) {
        const user = await contextValue.db.users.findOne({
          key: 'id',
          equals: id,
        });

        const subscriber = await contextValue.db.users.findOne({
          key: 'id',
          equals: subscriberId,
        });

        if (!subscriber || !user) {
          return null;
        }

        user.subscribedToUserIds.push(subscriberId);
        return contextValue.db.users.change(id, user);
      },
    },
    unsubscribeUserFrom: {
      type: User,
      args: {
        subscriberId: { type: new GraphQLNonNull(GraphQLID) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async function (parent, { subscriberId, id }, contextValue) {
        const user = await contextValue.db.users.findOne({
          key: 'id',
          equals: id,
        });

        const subscriber = await contextValue.db.users.findOne({
          key: 'id',
          equals: subscriberId,
        });

        if (!subscriber || !user) {
          return null;
        }

        const index = user.subscribedToUserIds.indexOf(subscriberId);
        if (index === -1) {
          return null;
        }

        user.subscribedToUserIds.splice(index, 1);

        const subscribedUser = await contextValue.db.users.change(
          user.id,
          user
        );
        return subscribedUser;
      },
    },
  }),
});

export default mutationsQuery;
