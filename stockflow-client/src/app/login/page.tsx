"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import api from "@/app/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.accessToken ?? response.data.token;

      if (typeof token !== "string" || !token) {
        throw new Error("The API response does not contain a JWT token.");
      }

      sessionStorage.setItem("stockflow_token", token);

      router.replace("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error &&
        err.message === "The API response does not contain a JWT token."
          ? err.message
          : "Invalid email or password. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F6F8FC",
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          p: { xs: 3, sm: 5 },
          border: "1px solid #E5E7EB",
          borderRadius: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              p: 1.5,
              mb: 2,
              borderRadius: 2,
              bgcolor: "#DBEAFE",
              color: "#2563EB",
            }}
          >
            <Inventory2OutlinedIcon fontSize="large" />
          </Box>

          <Typography variant="h4" fontWeight={700}>
            StockFlow
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Sign in to manage your inventory
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
            autoComplete="email"
            margin="normal"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
            autoComplete="current-password"
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.4, textTransform: "none" }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Sign in"
            )}
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 3 }}
        >
          Need an account? <Link href="/register">Create one</Link>
        </Typography>
      </Paper>
    </Container>
  );
}
