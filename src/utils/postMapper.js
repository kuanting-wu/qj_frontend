import postStructure from "@/data/postStructure.json";

/**
 * Maps a backend post (snake_case) to the frontend post structure (camelCase).
 * @param {Object} backendPost - The post data from the backend.
 * @returns {Object} - The mapped post conforming to postStructure with camelCase keys.
 */
export function mapBackendPostToFrontend(backendPost) {
  // Generate a fallback ID if none is provided
  const generateFallbackId = () => {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Map backend snake_case fields to frontend camelCase fields
  const mappedPost = {
    ...postStructure,
    id: backendPost.id || generateFallbackId(),
    title: backendPost.title || postStructure.title,
    videoId: backendPost.video_id || postStructure.videoId,
    videoPlatform: backendPost.video_platform || postStructure.videoPlatform,
    movementType: backendPost.movement_type || postStructure.movementType,
    startingPosition: backendPost.starting_position || postStructure.startingPosition,
    endingPosition: backendPost.ending_position || postStructure.endingPosition,
    startingTopBottom: backendPost.starting_top_bottom || postStructure.startingTopBottom,
    endingTopBottom: backendPost.ending_top_bottom || postStructure.endingTopBottom,
    giNogi: backendPost.gi_nogi || postStructure.giNogi,
    practitioner: backendPost.practitioner || postStructure.practitioner,
    sequenceStartTime: backendPost.sequence_start_time || postStructure.sequenceStartTime,
    publicStatus: backendPost.public_status || postStructure.publicStatus,
    language: backendPost.language || postStructure.language,
    notesPath: backendPost.notes_path || postStructure.notesPath,
    updatedAt: backendPost.updated_at || postStructure.updatedAt,
    createdAt: backendPost.created_at || postStructure.createdAt,
    ownerName: backendPost.owner_name || postStructure.ownerName,
    avatarUrl: backendPost.avatar_url || postStructure.avatarUrl,
    belt: backendPost.belt || postStructure.belt,
    academy: backendPost.academy || postStructure.academy,
  };

  // Log a warning if the backend post is missing an ID
  if (!backendPost.id) {
    console.warn("Post from backend missing ID, using fallback:", mappedPost);
  }

  return mappedPost;
}

/**
 * Maps an array of backend posts to the frontend post structure.
 * @param {Array} backendPosts - Array of posts from the backend.
 * @returns {Array} - Array of mapped posts.
 */
export function mapBackendPostsToFrontend(backendPosts) {
  return (backendPosts || []).map(post => mapBackendPostToFrontend(post));
}