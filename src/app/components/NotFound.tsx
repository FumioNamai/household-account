"use client";

import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <div>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", marginBottom: "12px" }}
      >
        404
      </Typography>

      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Not Found
      </Typography>
    </div>
  );
};

export default NotFound;
