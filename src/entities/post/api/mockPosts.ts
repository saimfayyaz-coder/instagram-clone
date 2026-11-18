import { Post, PostAuthor } from '../model/types';
import { POST_ASPECT_RATIOS } from '../model/constants';

const IMAGE_WIDTH = 1080;
const MINUTE_MS = 60_000;

const author = (id: string, username: string, avatarNumber: number): PostAuthor => ({
  id,
  username,
  avatarUrl: `https://i.pravatar.cc/150?img=${avatarNumber}`,
});

const AUTHORS = {
  ALEX: author('u1', 'alex.travels', 12),
  MAYA: author('u2', 'maya.eats', 5),
  SAM: author('u3', 'sam_codes', 33),
  NOOR: author('u4', 'noor.studio', 47),
  LEO: author('u5', 'leo.outdoors', 59),
  ZARA: author('u6', 'zara.daily', 25),
};

interface MockPostSeed {
  author: PostAuthor;
  location?: string;
  // Unsplash photo ids, one per image
  imageIds: string[];
  aspectRatio: number;
  caption: string;
  likeCount: number;
  commentCount: number;
  minutesAgo: number;
}

const SEEDS: MockPostSeed[] = [
  { author: AUTHORS.ALEX, location: 'Swiss Alps', imageIds: ['1506905925346-21bda4d32df4', '1464822759023-fed622ff2c3b', '1454496522488-7a8e488e8606'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'Woke up to this view and forgot about the cold for a minute. Three days of hiking, zero regrets.', likeCount: 1284, commentCount: 46, minutesAgo: 12 },
  { author: AUTHORS.MAYA, location: 'Lisbon', imageIds: ['1495474472287-4d71bcdd2085'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Coffee first, plans later.', likeCount: 342, commentCount: 8, minutesAgo: 55 },
  { author: AUTHORS.SAM, imageIds: ['1498050108023-c5249f4df085', '1517694712202-14dd9538aa97'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'New desk setup is finally done. Swipe for the before photo, it was not pretty.', likeCount: 908, commentCount: 31, minutesAgo: 140 },
  { author: AUTHORS.NOOR, location: 'Studio', imageIds: ['1544005313-94ddf0286df2'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'Portrait session from last weekend.', likeCount: 2210, commentCount: 102, minutesAgo: 300 },
  { author: AUTHORS.LEO, location: 'Lake Tahoe', imageIds: ['1501785888041-af3ef285b470', '1470071459604-3b5ec3a7fe05', '1469474968028-56623f02e42e', '1476514525535-07fb3b4ae5f1'], aspectRatio: POST_ASPECT_RATIOS.LANDSCAPE, caption: 'Sunrise paddle before anyone else was awake. The lake was glass the whole morning and we had it all to ourselves.', likeCount: 1876, commentCount: 54, minutesAgo: 480 },
  { author: AUTHORS.ZARA, imageIds: ['1512820790803-83ca734da794'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Sunday reading list.', likeCount: 129, commentCount: 4, minutesAgo: 720 },
  { author: AUTHORS.ALEX, location: 'Kyoto', imageIds: ['1493976040374-85c8e12f0c0e', '1528360983277-13d401cdc186'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'Quiet streets after the rain.', likeCount: 3410, commentCount: 88, minutesAgo: 1_500 },
  { author: AUTHORS.MAYA, imageIds: ['1509042239860-f550ce710b93', '1504674900247-0877df9cc836', '1540189549336-e6e99c3679fe'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Tried three bakeries in one afternoon so you don\'t have to. Number two wins, no contest.', likeCount: 756, commentCount: 27, minutesAgo: 2_100 },
  { author: AUTHORS.SAM, location: 'Berlin', imageIds: ['1519389950473-47ba0277781c'], aspectRatio: POST_ASPECT_RATIOS.LANDSCAPE, caption: 'Conference week. Too much coffee, great talks.', likeCount: 402, commentCount: 12, minutesAgo: 2_900 },
  { author: AUTHORS.NOOR, imageIds: ['1534528741775-53994a69daeb', '1529626455594-4ff0802cfb7e'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'Behind the scenes.', likeCount: 1543, commentCount: 39, minutesAgo: 4_300 },
  { author: AUTHORS.LEO, location: 'Yosemite', imageIds: ['1426604966848-d7adac402bff'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'Half Dome from the valley floor. Photos never get the scale right.', likeCount: 4120, commentCount: 140, minutesAgo: 5_800 },
  { author: AUTHORS.ZARA, location: 'Home', imageIds: ['1481627834876-b7833e8f5570', '1495446815901-a7297e633e8d'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Small things that made this week better.', likeCount: 287, commentCount: 9, minutesAgo: 7_200 },
  { author: AUTHORS.ALEX, imageIds: ['1503220317375-aaad61436b1b'], aspectRatio: POST_ASPECT_RATIOS.LANDSCAPE, caption: 'Road trip, day four.', likeCount: 1102, commentCount: 22, minutesAgo: 9_000 },
  { author: AUTHORS.MAYA, location: 'Naples', imageIds: ['1565299624946-b28f40a0ae38', '1513104890138-7c749659a591', '1555396273-367ea4eb4db5', '1517248135467-4c7edcad34c4', '1488646953014-85cb44e25828'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'A whole week of eating our way through Naples. Swipe to the end for the best pizza of my life.', likeCount: 2650, commentCount: 75, minutesAgo: 11_500 },
  { author: AUTHORS.SAM, imageIds: ['1461749280684-dccba630e2f6'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Ship it.', likeCount: 512, commentCount: 18, minutesAgo: 14_000 },
  { author: AUTHORS.NOOR, location: 'Gallery opening', imageIds: ['1494790108377-be9c29b29330', '1438761681033-6461ffad8d80'], aspectRatio: POST_ASPECT_RATIOS.SQUARE, caption: 'Thank you to everyone who came out last night.', likeCount: 1980, commentCount: 63, minutesAgo: 18_000 },
  { author: AUTHORS.LEO, imageIds: ['1504280390367-361c6d9f38f4', '1478131143081-80f7f84ca84d'], aspectRatio: POST_ASPECT_RATIOS.LANDSCAPE, caption: 'Camp spot for the night.', likeCount: 860, commentCount: 15, minutesAgo: 25_000 },
  { author: AUTHORS.ZARA, location: 'Paris', imageIds: ['1502602898657-3e91760cbb34'], aspectRatio: POST_ASPECT_RATIOS.PORTRAIT, caption: 'First time here and already planning the next trip.', likeCount: 1720, commentCount: 41, minutesAgo: 32_000 },
];

// Unsplash crops each photo to the post shape
const imageUrl = (imageId: string, aspectRatio: number) =>
  `https://images.unsplash.com/photo-${imageId}?w=${IMAGE_WIDTH}&h=${Math.round(IMAGE_WIDTH / aspectRatio)}&fit=crop&q=80`;

export const createMockPosts = (now: number = Date.now()): Post[] =>
  SEEDS.map((seed, index) => ({
    id: `post-${index + 1}`,
    author: seed.author,
    location: seed.location,
    images: seed.imageIds.map(imageId => ({
      id: `image-${imageId}`,
      uri: imageUrl(imageId, seed.aspectRatio),
    })),
    aspectRatio: seed.aspectRatio,
    caption: seed.caption,
    likeCount: seed.likeCount,
    commentCount: seed.commentCount,
    createdAt: new Date(now - seed.minutesAgo * MINUTE_MS).toISOString(),
    isLiked: false,
    isSaved: false,
  }));
