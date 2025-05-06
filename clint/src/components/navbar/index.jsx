import { useLogoutMutation } from "@/features/auth/authApi";
import { clearUser, setMessage } from "@/features/auth/authSlice";
import Link from "next/link";
import React, { useState } from "react";
import style from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    let res = await logout().unwrap();
    dispatch(clearUser());
    dispatch(setMessage(res.message));
    router.push("/login");
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className={style.navbar}>
      <div className={style.logo}>Task Management</div>

      <button className={style.hamburger} onClick={toggleMenu}>
        ☰
      </button>

      <div className={`${style.navMenu} ${isOpen ? style.show : ""}`}>
        {!user ? (
          <Link href="/login">Login</Link>
        ) : (
          <>
            <Link
              href="/"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Home
            </Link>
            <Link
              href="/dashbord"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/tasks"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Tasks
            </Link>
            <span className={style.username}>Hi, {user.name}</span>
            <button className={style.logout} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
