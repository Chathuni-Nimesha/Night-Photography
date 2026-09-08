import React from "react";
import { useLocation } from "react-router-dom";
import Signin from "../../Components/Register/Signin";
import Signup from "../../Components/Register/Singup";
import "./Auth.css";

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <main className="nl-auth">
      <div className="nl-auth-sky" aria-hidden="true" />
      <section className="nl-auth-panel" aria-labelledby="auth-title">
        {isLogin ? <Signin /> : <Signup />}
      </section>
    </main>
  );
};

export default Auth;
