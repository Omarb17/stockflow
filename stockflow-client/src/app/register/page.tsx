"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import api from "@/app/lib/api";

export default function RegisterPage() {
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
      await api.post("/auth/register", {
        email,
        password,
      });

      router.push("/login");
    } catch {
      setError(
        "Registration failed. The email may already be registered, or the password may be invalid.",
      );
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
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Create account
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Get started with StockFlow.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
            inputProps={{ minLength: 8, maxLength: 72 }}
            autoComplete="new-password"
            margin="normal"
            helperText="Use at least 8 characters."
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, py: 1.4, textTransform: "none" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Already registered? <Link href="/login">Sign in</Link>
        </Typography>
      </Paper>
    </Container>
  );
}
