import { useCallback, useMemo, useState } from 'react';
import { Post } from './types';

interface Toggles {
  isLiked: boolean;
  isSaved: boolean;
}

// Likes and saves have no API yet, so they live only on this screen
export const useLocalPostToggles = (posts: Post[]) => {
  const [toggles, setToggles] = useState<Record<string, Toggles>>({});

  const postsWithToggles = useMemo(
    () =>
      posts.map(post => {
        const local = toggles[post.id];
        if (!local) return post;
        const likeDelta = Number(local.isLiked) - Number(post.isLiked);
        return { ...post, ...local, likeCount: post.likeCount + likeDelta };
      }),
    [posts, toggles],
  );

  const update = useCallback(
    (postId: string, key: keyof Toggles) => {
      setToggles(current => {
        const base = current[postId] ?? {
          isLiked: posts.find(post => post.id === postId)?.isLiked ?? false,
          isSaved: posts.find(post => post.id === postId)?.isSaved ?? false,
        };
        return { ...current, [postId]: { ...base, [key]: !base[key] } };
      });
    },
    [posts],
  );

  const toggleLike = useCallback((postId: string) => update(postId, 'isLiked'), [update]);
  const toggleSave = useCallback((postId: string) => update(postId, 'isSaved'), [update]);

  return { posts: postsWithToggles, toggleLike, toggleSave };
};
