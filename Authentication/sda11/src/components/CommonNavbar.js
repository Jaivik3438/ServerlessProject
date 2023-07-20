import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CommonNavbar() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, [])

  return (
    <AppBar position="fixed" color="default" style={{ marginBottom: "20px" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            component={Link}
            to="/dashboard"
          >
            <MenuIcon />
          </IconButton>
          <Button
            // component={Link}
            // to="/dashboard"
            sx={{ color: "#1e69ba", fontWeight: "bold", marginRight: "10px" }}
            href="https://sda11serverlessproject.auth.us-east-1.amazoncognito.com/login?client_id=4is01usckduv6qbvrn76c6em3v&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000"
          >

            Login
          </Button>
          {/* Login  */}
          <Button
            component={Link}
            to="/"
            sx={{ color: "#1e69ba", fontWeight: "bold" }}
            onClick={() => {
              localStorage.clear();
              setIsLoggedIn(false);
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default CommonNavbar;
