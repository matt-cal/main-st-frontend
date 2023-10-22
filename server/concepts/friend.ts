import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface FriendshipDoc extends BaseDoc {
  owner: ObjectId;
  target: ObjectId;
}

export interface FriendRequestDoc extends BaseDoc {
  from: ObjectId;
  to: ObjectId;
  status: "pending" | "rejected" | "accepted";
}

export default class FriendConcept {
  public readonly friends = new DocCollection<FriendshipDoc>("friends");
  public readonly requests = new DocCollection<FriendRequestDoc>("friendRequests");

  async removeFriend(owner: ObjectId, target: ObjectId) {
    const friendship = await this.friends.popOne({
      owner,
      target,
    });
    if (friendship === null) {
      throw new FriendNotFoundError(owner, target);
    }
    return { msg: "Unfriended!" };
  }

  async getFriends(user: ObjectId) {
    const friendships = await this.friends.readMany({
      owner: user,
    });
    return friendships.map((friendship) => friendship.target);
  }

  async getFollowers(user: ObjectId) {
    const followers = await this.friends.readMany({ target: user });
    return followers.map((f) => f.owner);
  }

  async addFriend(owner: ObjectId, target: ObjectId) {
    await this.isNotFriends(owner, target);
    await this.friends.createOne({ owner, target });
    return { msg: "Followed Successfully!" };
  }

  /**
   * return true if owner is following target, false otherwise
   */
  async checkFriends(owner: ObjectId, target: ObjectId) {
    const friendship = await this.friends.readOne({
      owner,
      target,
    });
    return friendship !== null;
  }

  /**
   * assert owner is not following target already
   */
  private async isNotFriends(owner: ObjectId, target: ObjectId) {
    const friendship = await this.friends.readOne({
      owner,
      target,
    });
    if (friendship !== null || owner.toString() === target.toString()) {
      throw new AlreadyFriendsError(owner, target);
    }
  }

  private async canSendRequest(u1: ObjectId, u2: ObjectId) {
    await this.isNotFriends(u1, u2);
    // check if there is pending request between these users
    const request = await this.requests.readOne({
      from: { $in: [u1, u2] },
      to: { $in: [u1, u2] },
      status: "pending",
    });
    if (request !== null) {
      throw new FriendRequestAlreadyExistsError(u1, u2);
    }
  }
}

export class FriendRequestNotFoundError extends NotFoundError {
  constructor(
    public readonly from: ObjectId,
    public readonly to: ObjectId,
  ) {
    super("Friend request from {0} to {1} does not exist!", from, to);
  }
}

export class FriendRequestAlreadyExistsError extends NotAllowedError {
  constructor(
    public readonly from: ObjectId,
    public readonly to: ObjectId,
  ) {
    super("Friend request between {0} and {1} already exists!", from, to);
  }
}

export class FriendNotFoundError extends NotFoundError {
  constructor(
    public readonly user1: ObjectId,
    public readonly user2: ObjectId,
  ) {
    super("{0} is not following {1}!", user1, user2);
  }
}

export class AlreadyFriendsError extends NotAllowedError {
  constructor(
    public readonly user1: ObjectId,
    public readonly user2: ObjectId,
  ) {
    super("{0} is already following {1}!", user1, user2);
  }
}
