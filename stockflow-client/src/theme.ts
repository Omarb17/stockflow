
"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563EB",
      dark: "#1D4ED8",
      light: "#DBEAFE",
    },
    secondary: {
      main: "#64748B",
    },
    background: {
      default: "#F6F8FC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#172033",
      secondary: "#667085",
    },
    success: {
      main: "#16A34A",
    },
    warning: {
      main: "#D97706",
    },
    error: {
      main: "#DC2626",
    },
    divider: "#E8ECF3",
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.8px",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.4px",
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#E8ECF3",
        },
        head: {
          color: "#667085",
          fontWeight: 600,
          backgroundColor: "#F8FAFC",
        },
      },
    },
  },
});

export default theme;
