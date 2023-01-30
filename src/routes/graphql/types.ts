import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

const Profile = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const Post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: new GraphQLNonNull(GraphQLInt) },
    monthPostsLimit: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const User: GraphQLObjectType = new GraphQLObjectType({
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

export { Profile, Post, MemberType, User };
