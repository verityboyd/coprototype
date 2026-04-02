//display by default
"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../contexts/AuthContext";
import { useState } from "react";

//header with logo and title
//email
//first name
//last name
//password
//re enter
//yup schema: in theory must fit regex @calgaryopera.com
//password must be at least x length
//use object type of for re-enter

/*
const { user: newUser, error } = await signUp(
      email,
      password,
      firstName,
      lastName,
    );
    if (error) {
      setError(error);
      return;
    }
    console.log("user created:", newUser);
  }
*/

export default function SignUpForm() {
  const { signUp } = useUserAuth();
  const [error, setError] = useState(null);

  const SignUpSchema = Yup.object({
    email: Yup.string().email("Must be a valid Calgary Opera email"),
    firstName: Yup.string().required("First name cannot be blank"),
    lastName: Yup.string().required("Last name cannot be blank"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Re-enter password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      console.log("created", values);
    },
  });

  return (
    <section>
      <div>Calgary Opera Archive Sign Up</div>
      <div>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </form>
        <div>
          <button type="submit">Sign Up</button>
        </div>
      </div>
    </section>
  );
}
