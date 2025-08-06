import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const rawUser = searchParams.get("user");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    if (token && rawUser) {
      try {
        const user = JSON.parse(decodeURIComponent(rawUser));

        const authData = { token, user };
        localStorage.setItem("auth", JSON.stringify(authData));
        setAuth(authData);

        navigate("/");
      } catch (err) {
        console.error("Error parsing user from query string:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [token, rawUser]);

  return <p>Logging you in...</p>;
}
