// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Container } from "@mui/material";
import "./App.css";
import MainContent from "./components/MainContent";
function App() {
  return (
    <>
      <div>
        <Container maxWidth="xl">
        <MainContent />
        </Container>
      </div>
    </>
  );
}

export default App;
