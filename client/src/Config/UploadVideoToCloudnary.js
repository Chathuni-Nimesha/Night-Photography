import { cloudinaryUploadUrl, getCloudinaryCloudName, getCloudinaryPreset } from "./cloudinary";

export const uploadMediaToCloudinary = async (media) => {
  if (!media) return null;

  try {
    const data = new FormData();
    data.append("file", media);
    data.append("upload_preset", getCloudinaryPreset(true));
    data.append("cloud_name", getCloudinaryCloudName());

    const res = await fetch(cloudinaryUploadUrl(true), {
      method: "POST",
      body: data,
    });

    if (!res.ok) return null;
    const fileData = await res.json();
    return fileData.url ? String(fileData.url) : null;
  } catch (error) {
    return null;
  }
};
