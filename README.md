# Test notes

Use Postman to send requests to the API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/19185799-40b6687d-ef99-40e6-b7ca-65557e4ec8da?action=collection%2Ffork&collection-url=entityId%3D19185799-40b6687d-ef99-40e6-b7ca-65557e4ec8da%26entityType%3Dcollection%26workspaceId%3Ddf436e13-5c79-480c-867a-cf69916dd26c)

Or use this examples

1. Create a user

```
mutation CreateUser($user: UserInput!) {
  createUser(data: $user) {
    id
    firstName
    lastName
    email
  }
}
```

Variables:

```
{
    "user": {
        "firstName": "Ivan",
        "lastName": "Ivanov",
        "email": "ivanov.ivan@gmail.com"
    }
}
```

2. Copy user id for further requests

3. Create a profile

```
mutation CreateProfile($profile: ProfileInput!) {
  createProfile(data: $profile) {
      birthday
      userId
      memberTypeId
  }
}
```

```
{
    "profile": {
        "avatar": "http://placekitten.com/200/300",
        "sex": "male",
        "birthday": "1043927212466",
        "country": "Belarus",
        "street": "street",
        "city": "Minsk",
        "memberTypeId": "basic",
        "userId": <<userId>>
    }
}
```

4. Create a post

```
mutation CreatePost($post: PostInput!) {
  createPost(data: $post) {
      id
      title
      content
      userId
  }
}
```

```
{
    "post": {
        "title": "My first post",
        "content": "Lorem ipsum",
        "userId": <<userId>>
    }
}
```

5. Check 2.1

```
query getAllEntities {
    users {
        id firstName lastName email subscribedToUserIds
    }
    profiles {
        id avatar sex birthday country street city memberTypeId userId
    }
    posts {
        id title content userId
    }
    memberTypes {
        id discount monthPostsLimit
    }
}
```

6. Check 2.2

```
query GetEntitiesByItsId(
    $userId: ID!,
    $profileId: ID!,
    $postId: ID!,
    $memberTypeId: ID!
) {
    user(id: $userId) {
        id firstName lastName email subscribedToUserIds
    }
    profile(id: $profileId) {
        id avatar sex birthday country street city memberTypeId userId
    }
    post(id: $postId) {
        id title content userId
    }
    memberType(id: $memberTypeId) {
        id discount monthPostsLimit
    }
}
```

7. Check 2.3

```
query getExtendedUsers {
    users {
        firstName
        lastName
        posts {
            id title content
        }
        profile {
            id avatar sex birthday country street city memberTypeId
        }
        memberType {
            id discount monthPostsLimit
        }
    }
}
```

8. Check 2.4

```
query getExtendedUser($userId: ID!){
    user(id: $userId) {
        firstName
        lastName
        posts {
            id title content
        }
        profile {
            id avatar sex birthday country street city memberTypeId
        }
        memberType {
            id discount monthPostsLimit
        }
    }
}
```

9. Check 2.5

```
query getUsersWithUserSubscribed {
    users {
        id firstName lastName
        profile {
           id avatar sex birthday country street city memberTypeId
        }
        userSubscribedTo {
            id firstName lastName
        }
    }
}
```

10. Check 2.6

```
query getUserWithsubscribedToUser($userId: ID!){
    user(id: $userId) {
        id firstName lastName
        posts {
            id title content
        }
        subscribedToUser {
            id firstName lastName
        }
    }
}
```

11. Check 2.7

```
query getUsersWithSubscritions {
    users {
        id firstName lastName
        subscribedToUser {
            id firstName lastName
        }
        userSubscribedTo {
            id firstName lastName
        }
    }
}
```

12. Update user

```
mutation UpdateUser($id: ID!, $user: UserUpdateInput!) {
  updateUser(id: $id, data: $user) {
    id
    firstName
    lastName
    email
  }
}
```

```
{   "id": <<userId>>,
    "user": {
        "firstName": "NewName",
        "email": "ivanov.ivan@gmail.com"
    }
}
```

13. Update profile

```
mutation UpdateProfile($id: ID!, $profile: ProfileUpdateInput!) {
  updateProfile(id: $id, data: $profile) {
      birthday
      userId
      memberTypeId
  }
}
```

```
{
    "id": <<profileId>>,
    "profile": {
        "city": "Grodno",
    }
}
```

14. Update post

```
mutation UpdatePost($id: ID!, $post: PostUpdateInput!) {
  updatePost(id: $id, data: $post) {
      title
      content
      userId
  }
}
```

```
{
    "id": <<postId>>,
    "post": {
        "title": "My updated post",
    }
}
```

15. Update member type

```
mutation UpdateMemberType($id: String!, $memberType: MemberTypeUpdateInput!) {
  updateMemberType(id: $id, data: $memberType) {
      discount
      monthPostsLimit
  }
}
```

```
{
    "id": "basic",
    "memberType": {
        "discount": 100
    }
}
```

16. Subscribe to user

```
mutation SubscribeTo($id: ID!, $subscriberId: ID!) {
  subscribeUserTo(id: $id, subscriberId: $subscriberId) {
        id firstName lastName
        subscribedToUser {
            id firstName lastName
        }
  }
}
```

```
mutation SubscribeTo($id: ID!, $subscriberId: ID!) {
  subscribeUserTo(id: $id, subscriberId: $subscriberId) {
        id firstName lastName
        subscribedToUser {
            id firstName lastName
        }
  }
}
```

```
{
    "id": <<userId>>,
    "subscriberId": <<subscriberId>>
}
```

17. Limit the complexity of the graphql queries
    [Link to code](./src/routes/graphql/index.ts#L30)

```
query getUsersWithSubscritions {
    users {
        subscribedToUser {
            subscribedToUser {
                subscribedToUser {
                    subscribedToUser {
                        subscribedToUser {
                            subscribedToUser {
                                subscribedToUser {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```
