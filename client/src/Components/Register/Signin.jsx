import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { signinAction } from "../../Redux/Auth/Action";
import { getUserProfileAction } from "../../Redux/User/Action";
import { BASE_URL } from "../../Config/api";
import { getAuthToken } from "../../Config/auth";
import BrandMark from "../Brand/BrandMark";
import nightlifeMark from "../../assets/IMG_5544.png";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const Signin = () => {
  const initialValues = { email: "", password: "" };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, signin } = useSelector((store) => store);
  const toast = useToast();
  const token = getAuthToken();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error")) {
      toast({
        title: "Google sign-in could not be completed",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    if (token) dispatch(getUserProfileAction(token || signin));
  }, [signin, token, dispatch]);

  useEffect(() => {
    if (user?.reqUser?.username && token) {
      navigate("/");
      toast({
        title: "Signed in",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [user.reqUser, token, navigate, toast]);

  const handleSubmit = async (values, actions) => {
    const result = await dispatch(signinAction(values));
    if (!result?.ok) {
      toast({
        title: "Sign in failed",
        description: "Check your email and password.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    actions.setSubmitting(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img className="nl-auth-logo" src={nightlifeMark} alt="Nightlife Photography" />
      <BrandMark />
      <p className="nl-auth-kicker">Night photography, shared</p>
      <h1 id="auth-title" className="nl-auth-title">
        Welcome back
      </h1>
      <p className="nl-auth-copy">Long exposure, city light, quiet frames.</p>

      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {(formikProps) => (
          <Form className="w-full">
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.email && form.touched.email} mb={4}>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input {...field} id="email" type="email" autoComplete="email" placeholder="you@email.com" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Field name="password">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.password && form.touched.password} mb={4}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    {...field}
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                  />
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              className="nl-btn-primary"
              width="100%"
              mt={2}
              type="submit"
              isLoading={formikProps.isSubmitting}
              bg="nightlife.accent"
              color="nightlife.bg"
              _hover={{ bg: "#d4b27c" }}
              borderRadius="2px"
            >
              Sign in
            </Button>

            <Button
              as="a"
              href={`${BASE_URL}/oauth2/authorization/google`}
              className="nl-btn-ghost"
              mt={3}
              width="100%"
              variant="outline"
              borderColor="var(--nl-border)"
              color="var(--nl-text)"
              borderRadius="2px"
              _hover={{ borderColor: "nightlife.accent", color: "nightlife.accent", bg: "transparent" }}
            >
              Continue with Google
            </Button>
          </Form>
        )}
      </Formik>

      <p className="nl-auth-switch">
        New to Nightlife?{" "}
        <Link to="/signup" className="nl-link">
          Create an account
        </Link>
      </p>
    </Box>
  );
};

export default Signin;
