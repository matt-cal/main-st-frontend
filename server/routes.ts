import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Favorite, Friend, Like, Post, Tag, User, WebSession } from "./app";
import { LikeType } from "./concepts/like";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.patch("/users/:tag")
  async addUserTag(session: WebSessionDoc, tag: string) {
    const userId = WebSession.getUser(session);
    return await Tag.addItem(tag, userId);
  }

  @Router.delete("/users/:tag")
  async removeUserTag(session: WebSessionDoc, tag: string) {
    const userId = WebSession.getUser(session);
    return await Tag.removeItem(tag, userId);
  }

  @Router.get("/users/:username/tags")
  async getUserTags(username: string) {
    const userId = (await User.getUserByUsername(username))._id;
    const tags = await Tag.getTagsWithItem(userId);
    return tags.map((tag) => tag.name);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.patch("/posts/:_id/:tag")
  async addPostTag(session: WebSessionDoc, _id: ObjectId, tag: string) {
    const userId = WebSession.getUser(session);
    await Post.isAuthor(userId, _id);
    return await Tag.addItem(tag, _id);
  }

  @Router.delete("/posts/:_id/:tag")
  async removePostTag(session: WebSessionDoc, _id: ObjectId, tag: string) {
    const userId = WebSession.getUser(session);
    await Post.isAuthor(userId, _id);
    return await Tag.removeItem(tag, _id);
  }

  @Router.get("/posts/:_id/tags")
  async getPostTags(_id: ObjectId) {
    const tags = await Tag.getTagsWithItem(_id);
    return tags.map((tag) => tag.name);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, mediaLink: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, mediaLink, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  // get users that given user is following
  @Router.get("/friends/:username")
  async getFriends(username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  // get users that are following given user
  @Router.get("/users/:username/followers")
  async getFollowers(username: string) {
    const user = (await User.getUserByUsername(username))._id;
    return await User.idsToUsernames(await Friend.getFollowers(user));
  }

  // return true if current user is following given user
  @Router.get("/following/:username")
  async isFollowing(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const target = (await User.getUserByUsername(username))._id;
    return await Friend.checkFriends(user, target);
  }

  @Router.post("/friends/:username")
  async follow(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(username))._id;
    return await Friend.addFriend(user, friendId);
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/favorites")
  async getFavorites(owner?: string) {
    let favorites;
    if (owner) {
      const id = (await User.getUserByUsername(owner))._id;
      favorites = await Favorite.getByOwner(id);
    } else {
      favorites = await Favorite.getFavorites({});
    }
    return Responses.favorites(favorites);
  }

  // check if current user has favorited given user
  @Router.get("/favorites/:username")
  async checkFavorite(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const favorites = await Responses.favorites(await Favorite.getByOwner(user));
    const usernames = favorites.map((f) => f.target);
    return usernames.indexOf(username) > -1;
  }

  @Router.post("/favorites/:username")
  async createFavorite(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const targetId = (await User.getUserByUsername(username))._id;
    const created = await Favorite.create(user, targetId);
    return { msg: created.msg, favorite: await Responses.favorite(created.favorite) };
  }

  @Router.delete("/favorites/:username")
  async deleteFavorite(session: WebSessionDoc, username: string) {
    const user = WebSession.getUser(session);
    const targetId = (await User.getUserByUsername(username))._id;
    const favoriteId = (await Favorite.getFavorites({ owner: user, target: targetId }))[0]._id;
    await Favorite.isOwner(user, favoriteId);
    return await Favorite.delete(favoriteId);
  }

  @Router.get("/user/:username/likes")
  async getUserLikes(type: LikeType, username: string) {
    const id = (await User.getUserByUsername(username))._id;
    const likes = await Like.getByOwner(id, type);
    return Responses.likes(likes);
  }

  @Router.get("/post/:_id/likes")
  async getPostLikes(type: LikeType, _id: ObjectId) {
    const id = (await Post.getPosts({ _id }))[0]._id;
    const likes = await Like.getByPost(id, type);
    return Responses.likes(likes);
  }

  // see if logged in user has liked given post
  @Router.get("/user/liked/:_id")
  async didUserLike(session: WebSessionDoc, type: LikeType, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const postId = (await Post.getPosts({ _id }))[0]._id;
    return await Like.didUserLike(postId, user, type);
  }

  // create like on post with given id
  @Router.post("/likes/:_id")
  async createLike(session: WebSessionDoc, _id: ObjectId, type: LikeType) {
    const user = WebSession.getUser(session);
    const post = (await Post.getPosts({ _id }))[0]._id;
    const created = await Like.create(user, post, type);
    return { msg: created.msg, like: await Responses.like(created.like) };
  }

  // delete like on post with given id
  @Router.delete("/likes/:_id")
  async deleteLike(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    const post = (await Post.getPosts({ _id }))[0]._id;
    const likeId = (await Like.getByOwnerPost(post, user))._id;
    await Like.isOwner(user, likeId);
    return await Like.delete(likeId);
  }

  // update like on post with given id
  @Router.patch("/likes/:_id")
  async updateLike(session: WebSessionDoc, _id: ObjectId, type: LikeType) {
    const user = WebSession.getUser(session);
    const post = (await Post.getPosts({ _id }))[0]._id;
    const likeId = (await Like.getByOwnerPost(post, user))._id;
    await Like.isOwner(user, likeId);
    return await Like.update(likeId, type);
  }

  @Router.get("/tags")
  async getTags(name?: string) {
    let tags;
    if (name) {
      tags = [await Tag.getByName(name)];
    } else {
      tags = await Tag.getTags({});
    }
    return tags;
  }

  // use to see if tag exists
  @Router.get("/tags/:tag")
  async tagExists(tag: string) {
    return await Tag.tagExists(tag);
  }

  @Router.post("/tags")
  async createTag(name: string) {
    const created = await Tag.create(name);
    return { msg: created.msg, tag: created.tag };
  }

  @Router.delete("/tags/:_id")
  async deleteTag(_id: ObjectId) {
    return await Tag.delete(_id);
  }

  @Router.get("/tags/:tag/posts")
  async getTaggedPosts(tag: string) {
    const posts: PostDoc[] = [];
    const items = await Tag.getItemsByTag(tag);
    // get all items that are posts
    for (const id of items) {
      const post = await Post.getPost(id);
      if (post !== null) {
        posts.push(post);
      }
    }
    return Responses.posts(posts);
  }

  @Router.get("/tags/:tag/users")
  async getTaggedUsers(tag: string) {
    const users = [];
    const items = await Tag.getItemsByTag(tag);
    // get all items that are users
    for (const id of items) {
      const user = await User.getUser(id);
      if (user !== null) {
        users.push(user);
      }
    }
    return users;
  }
}

export default getExpressRouter(new Routes());
