import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "./config";

function RegisterPage() {
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
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!email) {
        setEmailError(true);
        setTimeout(() => {
          setEmailError(false);
        }, 1000);
        return;
      }
      if (passwordCheck !== password) {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 1000);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Register Successful");
        navigate("/login");
      } else {
        console.error("register failed:", data.detail || data);
        setEmailError(true);
        setTimeout(() => {
          setEmailError(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error registering in:", error);
      setEmailError(true);
      setTimeout(() => {
        setEmailError(false);
      }, 1000);
    }
  };

  return (
    <div className="mt-[-8px] min-h-screen w-full flex justify-center items-center bg-blue-300 overflow-hidden">
      <div>
        <div className="h-[470px] w-[550px] bg-white rounded-xl border-2 border-white">
          <div>
            <div className="flex justify-center items-center mt-4 text-2xl">
              <h2 className="font-lato font-bold flex justify-center">
                Register
              </h2>
            </div>
            <div className="flex justify-center text-gray-500 mt-1 text-sm">
              <p>Enter your credentials to create new account</p>
            </div>
          </div>
          <div className="flex justify-center items-center mt-6">
            <div className="w-[450px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`h-14 w-full mt-6 p-2 rounded ${emailError ? "border-2 border-red-500 animate-shake_r" : "border border-gray-300"}`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`h-14 w-full mt-6 p-2 rounded ${error ? "border-2 border-red-500 animate-shake_r" : "border border-gray-300"}`}
              />
              <input
                type="password"
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="Re-Enter Password"
                className={`h-14 w-full mt-6 p-2 rounded ${error ? "border-2 border-red-500 animate-shake" : "border border-gray-300"}`}
              />
              <button
                onClick={handleRegister}
                className="h-14 w-full bg-blue-500 text-white p-2 rounded mt-6"
              >
                Register
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="mt-2">
            You have account ?{" "}
            <Link to="/login" className="text-blue-800">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
