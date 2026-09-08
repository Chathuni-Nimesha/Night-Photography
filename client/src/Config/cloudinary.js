// Unsigned Cloudinary upload config. Set values in client/.env only.
// Unsigned presets are public upload names, not API secrets.

export const getCloudinaryCloudName = () => {
  const cloud = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  if (!cloud) {
    throw new Error("Cloudinary is not configured");
  }
  return cloud;
};

export const getCloudinaryPreset = (isVideo) => {
  const preset = isVideo
    ? process.env.REACT_APP_CLOUDINARY_PRESET_VIDEO
    : process.env.REACT_APP_CLOUDINARY_PRESET_IMAGE;
  if (!preset) {
    throw new Error("Cloudinary is not configured");
  }
  return preset;
};

export const cloudinaryUploadUrl = (isVideo = false) => {
  const cloud = getCloudinaryCloudName();
  return isVideo
    ? `https://api.cloudinary.com/v1_1/${cloud}/video/upload`
    : `https://api.cloudinary.com/v1_1/${cloud}/upload`;
};
