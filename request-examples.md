# Preparation

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
      title
      content
      userId
  }
}

```
{
    "post": {
        "title": "My first post",
        "content": "Lorem ipsum",
        "userId": "49b9a1f7-e447-44d2-aafe-7c053e725f32"
    }   
}
```
{
    "title": "My first post",
    "content": "Lorem ipsum",
    "userId": <<userId>>
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
