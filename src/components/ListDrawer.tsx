import React from "react";
import { grey } from "@mui/material/colors";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import RidePanel from "./RidePanel";

export default function ListDrawer() {
  const [open, setOpen] = React.useState(false);
  const [drawerBleeding, setDrawerBleeding] = React.useState(0);

  React.useEffect(() => {
    const calculateDrawerBleeding = () => {
      setDrawerBleeding(window.innerHeight * 0.5);
    };

    calculateDrawerBleeding();
    window.addEventListener("resize", calculateDrawerBleeding);

    return () => {
      window.removeEventListener("resize", calculateDrawerBleeding);
    };
  }, []);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
        slotProps={{
          paper: {
            sx: {
              height: `calc(100% - ${drawerBleeding}px)`,
              overflow: "visible",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            height: "100%",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            p: 2,
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 6,
              backgroundColor: grey[300],
              borderRadius: 3,
              position: "absolute",
              top: 8,
              left: "calc(50% - 15px)",
            }}
          />
          <RidePanel />
        </Box>
      </SwipeableDrawer>
    </Box>
  );
}
