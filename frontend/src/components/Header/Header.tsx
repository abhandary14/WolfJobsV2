import { useState } from "react";
import { useUserStore } from "../../store/UserStore";
import NavBar from "./NavBar";
import NavBarItem from "./NavBarItem";

const Header = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const role = useUserStore((state) => state.role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 w-full bg-white backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-200 supports-backdrop-blur:bg-white/95">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-between py-4 border-b border-gray-200 lg:px-8 lg:border-0 mx-4 lg:mx-0">
            {/* Logo */}
            <a className="flex-none" href={isLoggedIn ? "/dashboard" : "/"}>
              <img
                alt="logo"
                src="/images/wolfjobs-logo.png"
                className="h-10"
              />
            </a>

            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              <ul className="flex space-x-8">
                {role === "Manager" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Listings" />
                )}
                {role === "Applicant" && isLoggedIn && (
                  <NavBarItem link="/dashboard" text="My Applications" />
                )}
                {isLoggedIn && <NavBarItem link="/explore" text="All Jobs" />}
              </ul>
              <NavBar />
            </div>

            
  );
};

export default Header;