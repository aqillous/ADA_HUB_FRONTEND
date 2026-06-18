import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authFetch } from "./utils/AuthFetch";

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
      const response = await fetch("http://127.0.0.1:8000/login", {
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
        const meRes = await authFetch("http://127.0.0.1:8000/me");
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
    <div className="mt-[-8px] min-h-screen w-full flex justify-center items-center bg-blue-300 overflow-hidden">
      <div>
        <div className="h-[390px] w-[550px] bg-white rounded-xl border-2 border-white">
          <div>
            <div className="flex justify-center mt-4 text-2xl">
              <h2 className="font-lato font-bold flex justify-centermb-4">
                Login
              </h2>
            </div>
            <div className="flex justify-center text-gray-500 mt-1 text-sm">
              <p>Enter your credentials to access your account</p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-6">
            <div className="w-[450px]">
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
              <p></p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="mt-2">
            You don't have account ?{" "}
            <Link to="/register" className="text-blue-800">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
