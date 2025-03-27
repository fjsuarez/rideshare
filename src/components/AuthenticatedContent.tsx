import Grid from "@mui/material/Grid2";
import ProfilePanel from "./ProfilePanel/ProfilePanel";
import RidePanel from "./RidePanel";
import MapPanel from "./MapPanel";
import ListDrawer from "./ListDrawer";

import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import notificationApi from "../services/api/endpoints/notificationApi";
import { useAuth } from "../context/auth";

interface AuthenticatedContentProps {
  isSmallScreen: boolean;
}

function AuthenticatedContent({ isSmallScreen }: AuthenticatedContentProps) {
  const { userProfile } = useAuth();
  const { VITE_APP_VAPID_KEY } = import.meta.env;

  async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
      });
      if (userProfile?.id) {
        notificationApi.registerToken(userProfile.id, token);
        console.log("Token generated : ", token);
      } else {
        console.warn("Cannot register notification token: user ID is undefined");
      }

      console.log("Token generated : ", token);
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    requestPermission();
    console.log("Mounting AuthenticatedContent");
    enqueueSnackbar("Welcome to RideShare!");
  }, []);

  return (
    <>
      <SnackbarProvider
        autoHideDuration={2000}
        variant="info"
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <ProfileSection />
        <ListSection />
        <MapSection />
        {isSmallScreen && <ListDrawer />}
      </SnackbarProvider>
    </>
  );
}

function ProfileSection() {
  return (
    <Grid
      size={{ xs: 12, md: 6, lg: 4 }}
      sx={{ display: { xs: "none", lg: "block" } }}
    >
      <ProfilePanel />
    </Grid>
  );
}

function ListSection() {
  return (
    <Grid
      size={{ xs: 12, md: 6, lg: 4 }}
      sx={{ display: { xs: "none", md: "block" } }}
    >
      <RidePanel />
    </Grid>
  );
}

function MapSection() {
  return (
    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
      <MapPanel />
    </Grid>
  );
}

export default AuthenticatedContent;
