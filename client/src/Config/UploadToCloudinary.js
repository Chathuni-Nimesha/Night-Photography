import { cloudinaryUploadUrl, getCloudinaryCloudName, getCloudinaryPreset } from "./cloudinary";

export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  try {
    const isVideo = file.type.startsWith("video/");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", getCloudinaryPreset(isVideo));
    data.append("cloud_name", getCloudinaryCloudName());

    const res = await fetch(cloudinaryUploadUrl(isVideo), {
      method: "POST",
      body: data,
    });

    if (!res.ok) return null;
    const fileData = await res.json();
    return fileData.url || null;
  } catch (error) {
    return null;
  }
};
