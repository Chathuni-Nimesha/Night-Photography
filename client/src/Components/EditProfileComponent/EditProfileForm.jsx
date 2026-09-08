import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  editUserDetailsAction,
  getUserProfileAction,
} from "../../Redux/User/Action";
import { useToast } from "@chakra-ui/react";
import ChangeProfilePhotoModal from "./ChangeProfilePhotoModal";
import { uploadToCloudinary } from "../../Config/UploadToCloudinary";

const EditProfileForm = () => {
  const { user } = useSelector((store) => store);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageFile, setImageFile] = useState(null);

  const initialValues = {
    name: "",
    username: "",
    email: "",
    bio: "",
    mobile: "",
    gender: "",
    website: "",
    private: false,
  };

  useEffect(() => {
    dispatch(getUserProfileAction(token));
  }, [token, dispatch]);

  const formik = useFormik({
    initialValues: { ...initialValues },
    onSubmit: async (values) => {
      const data = {
        jwt: token,
        data: { ...values, id: user.reqUser?.id },
      };
      const result = await dispatch(editUserDetailsAction(data));
      if (!result?.ok) {
        toast({
          title: "Could not update profile",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Profile updated",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      const username = values.username || user.reqUser?.username;
      if (username) navigate(`/${username}`);
    },
  });

  useEffect(() => {
    const newValue = {};
    for (let item in initialValues) {
      if (user.reqUser && user.reqUser[item]) {
        newValue[item] = user.reqUser[item];
      }
    }
    formik.setValues(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.reqUser]);

  async function handleProfileImageChange(event) {
    const selectedFile = event.target.files[0];
    const image = await uploadToCloudinary(selectedFile);
    setImageFile(image);
    const data = {
      jwt: token,
      data: { image, id: user.reqUser?.id },
    };
    dispatch(editUserDetailsAction(data));
    onClose();
  }

  return (
    <div className="nl-card p-6 md:p-10 overflow-x-hidden">
      <p className="nl-auth-kicker" style={{ textAlign: "left" }}>
        Account
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="nl-serif text-3xl mb-0">Edit profile</h1>
        <button
          type="button"
          className="nl-btn-ghost"
          aria-label="Back to profile"
          onClick={() => {
            const username = user.reqUser?.username;
            if (username) navigate(`/${username}`);
            else navigate("/");
          }}
        >
          ← Back to profile
        </button>
      </div>
      <div className="flex items-center gap-4 pb-7">
        <img
          className="w-14 h-14 rounded-full object-cover"
          src={
            imageFile ||
            user.reqUser?.image ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={user.reqUser?.username ? `${user.reqUser.username} profile` : "Your profile"}
          decoding="async"
        />
        <div>
          <p>{user.reqUser?.username}</p>
          <button type="button" className="nl-link" onClick={onOpen}>
            Change profile photo
          </button>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing="6">
          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="name">
            <FormLabel className="md:w-[15%]">Name</FormLabel>
            <div className="w-full">
              <Input placeholder="Name" type="text" {...formik.getFieldProps("name")} />
              <FormHelperText className="text-xs">
                Use the name you want other photographers to recognize.
              </FormHelperText>
            </div>
          </FormControl>
          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="username">
            <FormLabel className="md:w-[15%]">Username</FormLabel>
            <div className="w-full">
              <Input placeholder="Username" type="text" {...formik.getFieldProps("username")} />
            </div>
          </FormControl>
          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="website">
            <FormLabel className="md:w-[15%]">Website</FormLabel>
            <div className="w-full">
              <Input placeholder="Website" type="text" {...formik.getFieldProps("website")} />
            </div>
          </FormControl>
          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="bio">
            <FormLabel className="md:w-[15%]">Bio</FormLabel>
            <div className="w-full">
              <Textarea placeholder="Bio" {...formik.getFieldProps("bio")} />
            </div>
          </FormControl>

          <div className="py-4">
            <p className="font-medium text-sm">Personal information</p>
            <p className="text-xs text-night-muted mt-1">
              This stays on your account and is not shown as public photography credits.
            </p>
          </div>

          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="email">
            <FormLabel className="md:w-[15%]">Email address</FormLabel>
            <div className="w-full">
              <Input placeholder="Email" type="email" {...formik.getFieldProps("email")} />
            </div>
          </FormControl>

          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="mobile">
            <FormLabel className="md:w-[15%]">Phone number</FormLabel>
            <div className="w-full">
              <Input placeholder="Phone" type="tel" {...formik.getFieldProps("mobile")} />
            </div>
          </FormControl>
          <FormControl className="flex flex-col md:flex-row md:items-start gap-2" id="gender">
            <FormLabel className="md:w-[15%]">Gender</FormLabel>
            <div className="w-full">
              <Input placeholder="Gender" type="text" {...formik.getFieldProps("gender")} />
            </div>
          </FormControl>

          <div>
            <button type="submit" className="nl-btn-primary">
              Save
            </button>
          </div>
        </Stack>
      </form>

      <ChangeProfilePhotoModal
        handleProfileImageChange={handleProfileImageChange}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      />
    </div>
  );
};

export default EditProfileForm;
