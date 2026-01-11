import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import supabaseRouter from "./supabaseRoutes";

const app = express();
app.set('json spaces', 2);
const port = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
    status: "online",
    message: "iaMenu Takeway Proxy is running",
    endpoints: {
      test: "/api/test-proxy",
      supabase: "/api/supabase"
    }
  });
});

app.get("/api/test-proxy", (req, res) => {
  res.json({ message: "Proxy is working!" });
});

app.use("/api/supabase", supabaseRouter);

app.listen(port, () => {
  console.log(`iaMenu Takeway Proxy Backend listening on port ${port}`);
});