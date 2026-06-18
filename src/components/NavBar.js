import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { logout } from "../utils/AuthFetch";

function NavBar({ user, setUser }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-blue-500 font-lato font-extrabold text-white z-50 shadow-md">
      <div className="flex items-center h-12 px-4">
        {/* Hamburger for mobile */}
        <button
          className="mr-3 md:hidden flex flex-col gap-1"
          onClick={() => setDropdownOpen((p) => !p)}
        >
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
          <span className="block w-5 h-0.5 bg-white"></span>
        </button>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-4">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/ada-store" className="hover:underline">
              ADA Store
            </Link>
          </li>
          <li>
            <Link to="/materials" className="hover:underline">
              Materials
            </Link>
          </li>
          <li>
            <Link to="/ada-history" className="hover:underline">
              ADA History
            </Link>
          </li>
          <li>
            <Link to="/alumni-hub" className="hover:underline">
              Alumni Hub
            </Link>
          </li>
        </ul>

        {/* Right side */}
        <div className="ml-auto flex gap-4 items-center">
          {!user ? (
            <>
              <Link to="/login" className="hover:underline text-sm">
                Login
              </Link>
              <Link to="/register" className="hover:underline text-sm">
                Register
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                  {user.email?.[0]?.toUpperCase() || "?"}
                </div>
                <span className="text-sm hidden sm:inline">{user.email}</span>
                <svg
                  className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    My Profile
                  </Link>
                  <hr className="border-gray-100 mx-2 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {dropdownOpen && (
        <div className="md:hidden bg-blue-600 px-4 py-3 flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setDropdownOpen(false)}
            className="py-1 hover:underline"
          >
            Home
          </Link>
          <Link
            to="/ada-store"
            onClick={() => setDropdownOpen(false)}
            className="py-1 hover:underline"
          >
            ADA Store
          </Link>
          <Link
            to="/materials"
            onClick={() => setDropdownOpen(false)}
            className="py-1 hover:underline"
          >
            Materials
          </Link>
          <Link
            to="/ada-history"
            onClick={() => setDropdownOpen(false)}
            className="py-1 hover:underline"
          >
            ADA History
          </Link>
          <Link
            to="/alumni-hub"
            onClick={() => setDropdownOpen(false)}
            className="py-1 hover:underline"
          >
            Alumni Hub
          </Link>
        </div>
      )}
    </div>
  );
}

export default NavBar;
