import { Box, Container, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Trans, useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation("app");
  const issueKeys = [
    { id: "missingKey", icon: "🐞" },
    { id: "boldKnown", icon: "🐞" },
    { id: "missingAvatar", icon: "🐞" },
    { id: "countdownGlitch", icon: "🐞" },
    { id: "languageSwitch", icon: "⭐️" }
  ];
  const issues = issueKeys.map(({ id, icon }) => ({
    id,
    icon,
    title: t(`home.issues.${id}.title`),
    description: t(`home.issues.${id}.description`)
  }));

  return (
    <Box p={2} maxHeight="calc(100vh - 64px)" overflow={["auto", "auto"]}>
      <Container>
        <Typography variant="h1" textAlign="center">
          {t("home.welcome")}
        </Typography>
        <Typography variant="subtitle1" textAlign="center">
          <Trans i18nKey="app:home.intro" components={{ b: <b /> }} />{" "}
        </Typography>
        <Typography variant="body2" textAlign="center" color="textSecondary">
          {t("home.sidenote")}
        </Typography>
        <List>
          {issues.map((issue) => (
            <ListItem key={issue.id}>
              <Typography variant="h5" sx={{ p: 2 }}>
                {issue.icon}
              </Typography>
              <ListItemText
                primary={issue.title}
                secondary={issue.description}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default observer(Home);
