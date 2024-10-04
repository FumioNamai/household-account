import { animateScroll as scroll } from "react-scroll";
import ArrowCircleUpTwoToneIcon from "@mui/icons-material/ArrowCircleUpTwoTone";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";

export const BackToTopButton = () => {
  const scrollToTop = () => {
    scroll.scrollToTop();
  };

  const [isButtonActive, setIsButtonActive] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", scrollWindow);
    return () => {
      window.removeEventListener("scroll", scrollWindow)
    };
  },[]);

  const scrollWindow = () => {
    const top = 100;
    let scroll = 0;
    scroll = window.scrollY;
    if (top <= scroll) {
      setIsButtonActive(true);
    } else {
      setIsButtonActive(false);
    }
  ;}

  const normalStyle = {
    opacity: 0,
    transition: "0.5s",
    pointerEvents: "none",
  }
  const activeStyle = {
    opacity: 1,
    transition: "0.5s",
  }
  const style = isButtonActive ? activeStyle : normalStyle ;

  return (
    <>
      <IconButton color="primary" onClick={scrollToTop} style={style}>
        <ArrowCircleUpTwoToneIcon
          fontSize="large"
          sx={{
            zIndex: 100,
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "5%",
          }}
        />
      </IconButton>
    </>
  );
};
