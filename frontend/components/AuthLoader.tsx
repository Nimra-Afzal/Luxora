"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setUserFromStorage } from "@/redux/features/authSlice";

export default function AuthLoader() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return null;
}