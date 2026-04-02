//display if user clicks "akready have an acc? log in"

import { Formik } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../contexts/AuthContext";

//literally just email and pword
//on submit, call login()
//forget password but do not add reset functionality atp (can add popup success message)
//just realised will need to add user to database on submit also

export default function LogInForm() {
  const { user, signup } = useUserAuth();

  async function handleSubmit(email, password) {
    try {
      await signup(email, password);
    } catch (error) {
      return error;
    }
  }

  return (
    <section>
      <div>Calgary Opera Archive Sign Up</div>
      <div>
        <form>Form goes here</form>
        <div>
          <button>Sign Up</button>
        </div>
      </div>
    </section>
  );
}
