import { Router, Request, Response } from "express";
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

// POST new category
router.post("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase.from("categories").insert(req.body).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error: any) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: error.message });
  }
});

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post("/menu-items", (upload.single('image') as any), async (req: any, res: Response) => {
  try {
    // 1. Fazer o upload da imagem para o Supabase Storage
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum ficheiro de imagem enviado.' });
    }

    const file = req.file;
    const filePath = `menu-items/${Date.now()}.${file.originalname.split('.').pop()}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-items')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Obter o URL público da imagem
    const { data: publicUrlData } = supabase.storage
      .from('menu-items')
      .getPublicUrl(filePath);
      
    const imageUrl = publicUrlData.publicUrl;

    // 3. Preparar os dados para inserir na tabela menu_items
    const menuItemData = {
      ...req.body,
      price: parseFloat(req.body.price), // Garantir que o preço é um número
      image_url: imageUrl,
    };

    // 4. Inserir os dados do prato na base de dados
    const { data, error } = await supabase.from("menu_items").insert(menuItemData).select().single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
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

// PUT update category
router.put("/categories/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from("categories").update(req.body).eq("id", id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE category
router.delete("/categories/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Primeiro, verifique se algum item de menu está a usar esta categoria
        const { data: menuItems, error: menuItemsError } = await supabase
            .from("menu_items")
            .select("id")
            .eq("category_id", id);

        if (menuItemsError) throw menuItemsError;

        if (menuItems && menuItems.length > 0) {
            // Se existirem, retorne um erro informando que a categoria está em uso
            return res.status(409).json({ error: "Esta categoria não pode ser eliminada porque está a ser utilizada por um ou mais itens do menu." });
        }
        
        // Se não houver itens de menu a usar a categoria, pode eliminá-la
        const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
        if (deleteError) throw deleteError;

        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
