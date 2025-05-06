import React, { useState } from "react";
import style from "./style.module.css";
import { useRouter } from "next/router";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/features/auth/authApi.js";
import { useDispatch, useSelector } from "react-redux";
import { setMessage, setUser } from "@/features/auth/authSlice.js";

export default function login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();
  const [register, { isLoading: isLoading2, error: error2 }] =
    useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  console.log(error2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegister) {
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setUser(res.user));
        router.push("/");
        // setIsRegister(false);

        dispatch(setMessage(res.message));
      } catch (error) {
        dispatch(setMessage(error.data.message));
        console.log(error.message);
      }
    } else {
      try {
        const res = await register({
          name,
          password,
          email,
        }).unwrap();
        dispatch(setUser(res.user));
        // router.push("/");
        setIsRegister(false);
        setEmail("");
        setName("");
        setPassword("");

        dispatch(setMessage(res.message));
      } catch (error) {
        dispatch(setMessage(error.data.message));
        console.log(error.message);
      }
    }
  };

  return (
    <div className={style.login}>
      <h2>{isRegister ? "Register" : " Login"} </h2>
      <form
        action=""
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {isRegister && (
          <div>
            <label htmlFor="">name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        )}
        <div>
          <label htmlFor="">email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor="">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isRegister
            ? `${isLoading2 ? "register..." : "Register"}`
            : `${isLoading ? "Logging in..." : "Login"}`}
        </button>
        <p>
          {isRegister
            ? "you have already have an Account"
            : "if dont an Account.please"}{" "}
          {isRegister ? (
            <span
              href=""
              onClick={() => {
                setIsRegister(false);
              }}
            >
              Login
            </span>
          ) : (
            <span
              href=""
              onClick={() => {
                setIsRegister(true);
              }}
            >
              Register
            </span>
          )}
        </p>
        {error && <p style={{ color: "red" }}>{error.error}</p>}
      </form>
    </div>
  );
}
