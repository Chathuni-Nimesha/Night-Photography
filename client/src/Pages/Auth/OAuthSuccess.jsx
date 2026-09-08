import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../../Config/api";
import { handleUnauthorized } from "../../Config/auth";
import { getUserProfileAction } from "../../Redux/User/Action";

const readOAuthToken = () => {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(window.location.search);
  return hashParams.get("token") || queryParams.get("token");
};

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storeTokenAndEnter = (rawToken) => {
      const token = String(rawToken || "").replace(/^Bearer\s+/i, "");
      if (!token) {
        navigate("/login?error=true", { replace: true });
        return;
      }
      localStorage.setItem("token", token);
      window.history.replaceState(null, "", "/oauth-success");
      dispatch(getUserProfileAction(token));
      navigate("/", { replace: true });
    };

    const tokenFromRedirect = readOAuthToken();
    if (tokenFromRedirect) {
      storeTokenAndEnter(tokenFromRedirect);
      return;
    }

    axios
      .get(`${BASE_URL}/oauth-user`, { withCredentials: true })
      .then((res) => {
        const headerToken = res.headers.authorization || res.headers.Authorization;
        storeTokenAndEnter(headerToken);
      })
      .catch((error) => {
        if (handleUnauthorized(error?.response)) return;
        navigate("/login?error=true", { replace: true });
      });
  }, [navigate, dispatch]);

  return (
    <main className="nl-auth">
      <div className="nl-auth-sky" aria-hidden="true" />
      <p className="nl-auth-copy" style={{ position: "relative", zIndex: 1 }}>
        Signing you in…
      </p>
    </main>
  );
};

export default OAuthSuccess;
