import { useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import Stock from "./components/Stock";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Stock />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
