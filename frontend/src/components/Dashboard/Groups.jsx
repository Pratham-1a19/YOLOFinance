import * as React from "react";

import { alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar.jsx";
import Header from "./components/Header.jsx";
import MainGrid from "./components/MainGrid.jsx";
import SideMenu from "./components/SideMenu.jsx";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import GroupsMenu from "./components/GroupsMenu.jsx";
import GroupsDashboard from "./GroupsDashboard.jsx";
import GroupsInsuranceDashboard from "./GroupsInsuranceDashboard.jsx";

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};
import { Typography } from "@mui/material";

const SIDEMENU_WIDTH = 240;
const GROUPSMENU_WIDTH = 250;

export default function Groups(props) {
  const [userId, setUserId] = React.useState("");
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        <GroupsMenu userId={userId} setUserId={setUserId} />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header name="Home" />
            {userId ? (
              <>
                <Box>
                  <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 3 }}>
                    <i className="fa-solid fa-shield-halved"></i>Investments
                  </Typography>
                </Box>
                <GroupsDashboard userId={userId} />
                <Box>
                  <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 3 }}>
                    <i className="fa-solid fa-shield-halved"></i>Insurances
                  </Typography>
                </Box>
                <GroupsInsuranceDashboard userId={userId} />
              </>
            ) : (
              <></>
            )}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
