import { Box, Typography } from "@mui/material";
import SupabaseListener from "./SupabaseListener";
import NextLink from "next/link";
import { Link } from "@mui/material";

const Header = () => {
  return (
    <header>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 2,
          mx: "auto",
          maxWidth: "sm",
          minWidth: 375,
        }}
      >
        <Link
          component={NextLink}
          href="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            N式家計簿
          </Typography>
        </Link>
        <SupabaseListener />
      </Box>
    </header>
  );
};

export default Header;
