import { Box, Typography } from "@mui/material";
import Link from "next/link";
import Navigation from "./navigation";

const Header = () => {
  return (
    <header className="flex flex-row justify-between p-5 items-center">
      <Link href="/">
        <h1>N式家計簿</h1>
      </Link>
    </header>
  );
};

export default Header;
