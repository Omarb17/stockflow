"use client";

import {
  MenuRounded,
  NotificationsNoneOutlined,
  SearchRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        height: 76,
        px: { xs: 2, md: 4 },
        bgcolor: "#fff",
        borderBottom: "1px solid #E8ECF3",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <MenuRounded />
        </IconButton>

        <TextField
          size="small"
          placeholder="Search anything..."
          sx={{
            maxWidth: 350,
            width: "100%",
            "& .MuiOutlinedInput-root": {
              bgcolor: "#F8FAFC",
              borderRadius: 2,
              fontSize: 13,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box
        sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}
      >
        <IconButton aria-label="Notifications">
          <Badge variant="dot" color="error">
            <NotificationsNoneOutlined />
          </Badge>
        </IconButton>

        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            width: "1px",
            height: 32,
            bgcolor: "divider",
          }}
        />

        <Avatar
          sx={{
            width: 38,
            height: 38,
            bgcolor: "#DBEAFE",
            color: "#1D4ED8",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          AD
        </Avatar>

        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography fontWeight={700} fontSize={13}>
            Administrator
          </Typography>
          <Typography color="text.secondary" fontSize={11}>
            StockFlow account
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
