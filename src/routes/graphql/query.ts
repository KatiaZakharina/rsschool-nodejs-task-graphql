import { GraphQLObjectType, GraphQLList, GraphQLID } from 'graphql';

import { User, Profile, Post, MemberType } from './types';

const rootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve: function (parent, args, contextValue) {
        return contextValue.db.users.findMany();
      },
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve(parent, args, contextValue) {
        return contextValue.db.profiles.findMany();
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args, contextValue) {
        return contextValue.db.posts.findMany();
      },
    },
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve(parent, args, contextValue) {
        return contextValue.db.memberTypes.findMany();
      },
    },
    user: {
      type: User,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }, contextValue) {
        return contextValue.db.users.findOne({ key: 'id', equals: id });
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }, contextValue) {
        return contextValue.db.profiles.findOne({ key: 'id', equals: id });
      },
    },
    post: {
      type: Post,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }, contextValue) {
        return contextValue.db.posts.findOne({ key: 'id', equals: id });
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }, contextValue) {
        return contextValue.db.memberTypes.findOne({ key: 'id', equals: id });
      },
    },
  },
});

export default rootQuery;
