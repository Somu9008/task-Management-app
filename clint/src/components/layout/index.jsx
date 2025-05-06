import React from "react";

import Navbar from "../navbar";
import PopUp from "../popUp";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const taskState = useSelector((state) => state.task);

  const authStete = useSelector((state) => state.auth);
  console.log(taskState, authStete);

  return (
    <>
      <Navbar />
      {children}
      {authStete.message ? <PopUp message={authStete.message} /> : <></>}
      {taskState.isPopUp ? <PopUp name={taskState.assignedName} /> : <></>}
    </>
  );
}
