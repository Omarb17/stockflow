"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AssessmentOutlined,
  CategoryOutlined,
  DashboardRounded,
  Inventory2Outlined,
  LocalShippingOutlined,
  LogoutOutlined,
  MoveToInboxOutlined,
  PeopleOutline,
  SettingsOutlined,
  WarehouseOutlined,
} from "@mui/icons-material";
import { logout } from "@/app/lib/auth";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const drawerWidth = 250;

const navigation = [
  { label: "Dashboard", href: "/", icon: DashboardRounded },
  { label: "Products", href: "/products", icon: Inventory2Outlined },
  { label: "Categories", href: "/categories", icon: CategoryOutlined },
  { label: "Inventory", href: "/inventory", icon: MoveToInboxOutlined },
  { label: "Warehouses", href: "/warehouses", icon: WarehouseOutlined },
  { label: "Suppliers", href: "/suppliers", icon: LocalShippingOutlined },
  {
    label: "Purchase orders",
    href: "/purchase-orders",
    icon: AssessmentOutlined,
  },
];

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#fff",
      }}
    >
      <Box
        sx={{ px: 3, py: 3, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "#fff",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Inventory2Outlined />
        </Box>
        <Box>
          <Typography fontWeight={800} fontSize={20} letterSpacing={-0.5}>
            StockFlow
          </Typography>
          <Typography color="text.secondary" fontSize={11}>
            INVENTORY MANAGEMENT
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2, pt: 3, pb: 1 }}>
        <Typography
          color="text.secondary"
          fontSize={11}
          fontWeight={700}
          letterSpacing={1}
          sx={{ px: 1.5 }}
        >
          WORKSPACE
        </Typography>
      </Box>

      <List sx={{ px: 1.5, py: 0, flex: 1 }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={onClose}
              selected={selected}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.2,
                color: selected ? "primary.main" : "text.secondary",
                "& .MuiListItemIcon-root": {
                  color: "inherit",
                  minWidth: 40,
                },
                "&.Mui-selected": {
                  bgcolor: "#EFF6FF",
                  fontWeight: 700,
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#E5EEFF",
                },
                "&:hover": {
                  bgcolor: "#F8FAFC",
                },
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: selected ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          component={Link}
          href="/settings"
          onClick={onClose}
          sx={{ borderRadius: 2, color: "text.secondary" }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <SettingsOutlined />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
          />
        </ListItemButton>

        <Button
          fullWidth
          color="inherit"
          startIcon={<LogoutOutlined />}
          sx={{
            justifyContent: "flex-start",
            mt: 0.5,
            px: 2,
            color: "text.secondary",
          }}
          onClick={logout}
        >
          Sign out
        </Button>

        <Typography
          color="text.secondary"
          fontSize={11}
          textAlign="center"
          sx={{ pt: 2 }}
        >
          StockFlow · Inventory made simple
        </Typography>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E8ECF3",
          },
        }}
      >
        <SidebarContent />
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <SidebarContent onClose={onClose} />
      </Drawer>
    </>
  );
}
