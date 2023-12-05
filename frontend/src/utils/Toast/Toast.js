import React, { useState, useEffect } from "react";
import "./Toast.css";
import { useDispatch, useSelector } from "react-redux";
import { getToastContent } from "helpers/selectors";
import { setToast } from "store/slices/toastSlice";

function Toast() {
  const { toastStatus, toastMessage } = useSelector(getToastContent);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastStatus && toastMessage) {
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        dispatch(setToast({status:null,displayMessage:null}))
      }, 3000);
    }
  }, [toastStatus, toastMessage]);

  return (
    <div className={`toast-container ${showToast ? "show" : ""} ${toastStatus}`}>
      <div className={`toast `}>{toastMessage}</div>
    </div>
  );
}

export default Toast;
