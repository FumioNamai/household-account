"use client"
import { Alert, Snackbar } from "@mui/material";
import React, { FC, ReactFragment, createContext, useContext, useState } from "react";

type SnackbarSeverity = "error" | "warning" | "info" | "success";

interface ISnackbarContext {
  showSnackbar:((type: SnackbarSeverity, message: string) => void) | undefined;
}

const SnackbarContext = createContext<ISnackbarContext>({showSnackbar:undefined});

export function useSnackbarContext() {
  return useContext(SnackbarContext)
}

export const SnackbarProvider:FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<SnackbarSeverity>("info");
  const [message, setMessage] = useState("")

  const showSnackbar = (type: SnackbarSeverity, message: string): void => {
    setOpen(true);
    setSeverity(type);
    setMessage(message);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if(reason === 'clickaway') {
      return;
    }
    setOpen(false)
  };

  return (
    <>
    <SnackbarContext.Provider value={{showSnackbar: showSnackbar}}>
      {children}
      </SnackbarContext.Provider>
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
            {message}
        </Alert>
    </Snackbar>
    </>
  )

}
