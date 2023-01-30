import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { Post } from './post';
import { Profile } from './profile';
import { MemberType } from './member-type';

export const User: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    subscribedToUserIds: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
    },
    subscribedToUser: {
      type: new GraphQLList(User),
      resolve: (user, args, contextValue) => {
        return contextValue.db.users.findMany({
          key: 'subscribedToUserIds',
          inArrayAnyOf: user.subscribedToUserIds,
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(User),
      resolve: (user, args, contextValue) => {
        return contextValue.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: user.id,
        });
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: (user, args, contextValue) =>
        contextValue.db.posts.findMany({
          key: 'userId',
          equals: user.id,
        }),
    },
    profile: {
      type: Profile,
      resolve: (user, args, contextValue) =>
        contextValue.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        }),
    },
    memberType: {
      type: MemberType,
      resolve: (user, args, contextValue) => {
        const profile = contextValue.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });

        return contextValue.db.memberTypes.findOne({
          key: 'id',
          equals: profile.memberTypeId,
        });
      },
    },
  }),
});

export const UserInput = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const UserUpdateInput = new GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});
