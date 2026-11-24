export interface FollowState {
  userId: string;
  isFollowing: boolean;
  followersCount: number;
}

export interface SetFollowArgs {
  userId: string;
  // The signed-in user, whose following list changes too
  viewerId: string;
  follow: boolean;
}

// Anything with an id and a follow state: a profile or a list row
export interface FollowTarget {
  id: string;
  isFollowing: boolean;
}
