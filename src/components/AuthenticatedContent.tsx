import Grid from "@mui/material/Grid2";

import ProfilePanel from "./ProfilePanel/ProfilePanel";
import RidePanel from "./RidePanel";
import MapPanel from "./MapPanel";
import ListDrawer from "./ListDrawer";

interface AuthenticatedContentProps {
  isSmallScreen: boolean;
}

function AuthenticatedContent({ isSmallScreen }: AuthenticatedContentProps) {
  return (
    <>
      <ProfileSection />
      <ListSection />
      <MapSection />
      {isSmallScreen && <ListDrawer />}
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