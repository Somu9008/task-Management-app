import React from "react";
import style from "./style.module.css";
import { useDispatch } from "react-redux";
import { closePopUp } from "@/features/task/taskSlice";
import { clearMessage } from "@/features/auth/authSlice";

export default function PopUp({ name, message }) {
  const dispatch = useDispatch();

  return (
    <div className={style.popUp}>
      {name && (
        <p>
          {" "}
          A New Task is assigned by {name}
          {"      "}
          <span
            onClick={() => {
              dispatch(closePopUp());
            }}
          >
            X
          </span>{" "}
        </p>
      )}
      {message && (
        <p>
          {" "}
          {message}
          {"      "}
          <span
            onClick={() => {
              dispatch(clearMessage());
            }}
          >
            X
          </span>{" "}
        </p>
      )}
    </div>
  );
}
