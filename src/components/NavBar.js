import { NavLink, Link } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import Logo from "../assets/Logo.png";

import {
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaHome,
  FaBook,
  FaHistory,
  FaStore,
  FaUsers,
} from "react-icons/fa";

import { logout } from "../utils/AuthFetch";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
  },
  {
    name: "ADA Store",
    href: "/ada-store",
    icon: FaStore,
  },
  {
    name: "Materials",
    href: "/materials",
    icon: FaBook,
  },
  {
    name: "ADA History",
    href: "/ada-history",
    icon: FaHistory,
  },
  {
    name: "Alumni Hub",
    href: "/alumni-hub",
    icon: FaUsers,
  },
];

function NavBar({ user, setUser }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const username = user?.email?.split("@")[0] || "Guest";

  return (
    <>
      <motion.nav
        initial={{ y: -70 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200"
            : "bg-white/80 backdrop-blur-lg",
        )}
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="h-16 flex items-center justify-between">
            {/* ============================= */}
            {/* Logo */}
            {/* ============================= */}

            <Link to="/" className="flex items-center gap-1 group">
              <Link to="/" className="flex items-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-16 w-16 object-contain"
                />
              </Link>

              <div className="hidden sm:block">
                <h1 className="font-bold text-gray-900 leading-none">
                  ADA Hub
                </h1>

                <p className="text-xs text-gray-500">AIESEC in Baku ADA</p>
              </div>
            </Link>

            {/* ============================= */}
            {/* Desktop Navigation */}
            {/* ============================= */}

            <div className="hidden lg:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        "relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium",

                        isActive
                          ? "text-blue-600"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="text-sm" />

                        <span>{item.name}</span>

                        {isActive && (
                          <motion.div
                            layoutId="navbar-indicator"
                            className="absolute left-3 right-3 -bottom-1 h-[3px] rounded-full bg-blue-600"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* ============================= */}
            {/* Right Section */}
            {/* ============================= */}

            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:flex px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Menu as="div" className="relative hidden lg:block">
                  <Menu.Button className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 hover:border-blue-300 transition-all shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {username}
                      </p>

                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>

                    <FaChevronDown className="text-gray-500" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden focus:outline-none">
                      <div className="px-5 py-4 border-b">
                        <p className="font-semibold text-gray-900">
                          {username}
                        </p>

                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={clsx(
                              "flex items-center gap-3 px-5 py-3 text-sm transition-all",
                              active
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700",
                            )}
                          >
                            <FaUser />
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>

                      {/* Future Features */}

                      {/*
                      <Menu.Item>
                          My Orders
                      </Menu.Item>

                      <Menu.Item>
                          Wishlist
                      </Menu.Item>

                      <Menu.Item>
                          Settings
                      </Menu.Item>

                      <Menu.Item>
                          Admin Panel
                      </Menu.Item>
                      */}

                      <div className="border-t">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={clsx(
                                "w-full flex items-center gap-3 px-5 py-3 text-left transition-all",
                                active
                                  ? "bg-red-50 text-red-600"
                                  : "text-red-500",
                              )}
                            >
                              <FaSignOutAlt />
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}
              {/* ============================= */}
              {/* Right Section */}
              {/* ============================= */}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-11 h-11 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <FaTimes className="text-xl text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <FaBars className="text-xl text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* Mobile Navigation */}
        {/* ================================= */}

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-5 py-5">
                {user && (
                  <div className="flex items-center gap-4 pb-5 border-b">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {username}
                      </h3>

                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col mt-5">
                  {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center gap-4 rounded-2xl px-4 py-4 mb-2 transition-all duration-300",

                            isActive
                              ? "bg-blue-600 text-white shadow-lg"
                              : "text-gray-700 hover:bg-gray-100",
                          )
                        }
                      >
                        <Icon className="text-lg" />

                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>

                {!user ? (
                  <div className="mt-6 flex flex-col gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-2xl border border-gray-300 py-3 text-center font-medium hover:bg-gray-100 transition"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full rounded-2xl bg-blue-600 py-3 text-center text-white font-semibold shadow-md hover:bg-blue-700 transition"
                    >
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-4 rounded-2xl px-4 py-4 hover:bg-gray-100 transition"
                    >
                      <FaUser />
                      My Profile
                    </Link>

                    {/* ===================================== */}
                    {/* Future Mobile Features */}
                    {/* ===================================== */}

                    {/*
                      <Link to="/orders">
                        My Orders
                      </Link>

                      <Link to="/wishlist">
                        Wishlist
                      </Link>

                      <Link to="/settings">
                        Settings
                      </Link>

                      <Link to="/admin">
                        Admin Panel
                      </Link>
                    */}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 text-red-500 hover:bg-red-50 transition"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer */}
      <div className="h-16" />{" "}
    </>
  );
}

export default NavBar;
