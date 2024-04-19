"use client";


import { Typography } from "@mui/material";

const Error = () => {
  return (
    <div>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", marginBottom: "12px" }}
      >
        500
      </Typography>

      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Server Error
      </Typography>
    </div>
  );
};

export default Error;
