import { Formik, Form, Field } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupAction } from "../../Redux/Auth/Action";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../Brand/BrandMark";
import nightlifeMark from "../../assets/IMG_5544.png";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").required("Email is required"),
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
});

const Signup = () => {
  const initialValues = { email: "", username: "", password: "", name: "" };
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values, actions) => {
    const result = await dispatch(signupAction(values));
    if (!result?.ok) {
      toast({
        title: "Could not create the account",
        description: "Try a different email or username.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (auth.signup?.username) {
      navigate("/login");
      toast({
        title: "Account created. Sign in to continue.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [auth.signup, navigate, toast]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <img className="nl-auth-logo" src={nightlifeMark} alt="Nightlife Photography" />
      <BrandMark />
      <p className="nl-auth-kicker">Night photography, shared</p>
      <h1 id="auth-title" className="nl-auth-title">
        Join Nightlife
      </h1>
      <p className="nl-auth-copy">Long exposure, city light, quiet frames.</p>

      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {(formikProps) => (
          <Form className="w-full">
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.email && form.touched.email} mb={4}>
                  <FormLabel htmlFor="signup-email">Email</FormLabel>
                  <Input {...field} id="signup-email" type="email" autoComplete="email" placeholder="you@email.com" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="username">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.username && form.touched.username} mb={4}>
                  <FormLabel htmlFor="signup-username">Username</FormLabel>
                  <Input {...field} id="signup-username" autoComplete="username" placeholder="Choose a username" />
                  <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="name">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name} mb={4}>
                  <FormLabel htmlFor="signup-name">Name</FormLabel>
                  <Input {...field} id="signup-name" autoComplete="name" placeholder="Your name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="password">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.password && form.touched.password} mb={4}>
                  <FormLabel htmlFor="signup-password">Password</FormLabel>
                  <Input
                    {...field}
                    type="password"
                    id="signup-password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
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
              Create account
            </Button>
          </Form>
        )}
      </Formik>

      <p className="nl-auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="nl-link">
          Sign in
        </Link>
      </p>
    </Box>
  );
};

export default Signup;
