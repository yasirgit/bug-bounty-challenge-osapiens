import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguages } from "../../i18n/i18n";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Select
      value={defaultLanguages.includes(current) ? current : "en"}
      onChange={handleChange}
      variant="standard"
      disableUnderline
      inputProps={{ "aria-label": "Language" }}
      sx={{
        color: "inherit",
        ".MuiSelect-icon": { color: "inherit" },
        mr: 1
      }}
    >
      {defaultLanguages.map((lng) => (
        <MenuItem key={lng} value={lng}>
          {lng.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LanguageSwitcher;
