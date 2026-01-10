import { Router } from "express";
import { createClient } from "@supabase/supabase-js";


const router = Router();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET all categories
router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all menu items with categories
router.get("/menu-items", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, categories(name)")
      .order("name");
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST new menu item
router.post("/menu-items", async (req, res) => {
  try {
    const { data, error } = await supabase.from("menu_items").insert(req.body).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update menu item
router.put("/menu-items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from("menu_items").update(req.body).eq("id", id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE menu item
router.delete("/menu-items/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
