import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "./utils/AuthFetch";
import API_BASE_URL from "./config";

function LoginPage({ setUser }) {
  useEffect(() => {
    // Disable scroll
    document.body.style.overflow = "hidden";

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Login Successful");
        localStorage.removeItem("token");
        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh_token", data.refresh_token);
        const meRes = await authFetch(`${API_BASE_URL}/me`);
        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
        }
        navigate("/");
      } else {
        console.error("Login failed:", data.detail || data);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1000);
    }
  };

  return (
    <div className="mt-[-8px] min-h-screen w-full flex justify-center items-center bg-blue-300 overflow-hidden px-4">
      <div className="w-full max-w-[550px]">
        <div className="bg-white rounded-xl border-2 border-white py-8 px-6">
          <div className="flex justify-center mt-4 text-2xl">
            <h2 className="font-lato font-bold">Login</h2>
          </div>
          <div className="flex justify-center text-gray-500 mt-1 text-sm">
            <p>Enter your credentials to access your account</p>
          </div>
          <div className="mt-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`h-14 w-full mt-6 p-2 rounded ${error ? "border-2 border-red-500 animate-shake" : "border border-gray-300"}`}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`h-14 w-full mt-6 p-2 rounded ${error ? "border-2 border-red-500 animate-shake_r" : "border border-gray-300"}`}
            />
            <button
              onClick={handleLogin}
              className="h-14 w-full bg-blue-500 text-white p-2 rounded mt-6"
            >
              Login
            </button>
          </div>
        </div>
        <div className="flex justify-center items-center mt-2">
          You don't have account?{" "}
          <Link to="/register" className="text-blue-800 ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
