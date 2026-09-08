export const optimizedMediaUrl = (url, { width } = {}) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/(?:[^/]*?(?:f_auto|q_auto|w_\d+))/i.test(url)) return url;
  const w = width || 1080;
  return url.replace("/upload/", `/upload/f_auto,q_auto,c_limit,w_${w}/`);
};

export const getPostMedia = (post) => {
  if (Array.isArray(post?.mediaUrls) && post.mediaUrls.length > 0) {
    return post.mediaUrls.filter(Boolean);
  }
  if (post?.image) return [post.image];
  return [];
};

export const isVideoUrl = (url) => Boolean(url?.match(/\.(mp4|webm|ogg)(\?|$)/i));

export const postAltText = (post, index = 0) => {
  const caption = post?.caption?.trim();
  const photographer = post?.user?.username;
  if (caption) return caption;
  if (photographer) return `${photographer} night photograph`;
  return index > 0 ? `Night photograph ${index + 1}` : "Night photograph";
};
