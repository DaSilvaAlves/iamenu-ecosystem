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

// ==================== DAILY SPECIALS ROUTES ====================

// GET all daily specials
// Returns items marked as daily specials, optionally filtered by date
router.get("/daily-specials", async (req, res) => {
    try {
        const { date } = req.query;

        let query = supabase
            .from("menu_items")
            .select("*, categories(name)")
            .eq("is_daily_special", true)
            .eq("available", true);

        // Se uma data for fornecida, filtra por essa data
        if (date) {
            query = query.eq("special_date", date);
        } else {
            // Se não for fornecida data, retorna os pratos do dia de hoje
            const today = new Date().toISOString().split('T')[0];
            query = query.eq("special_date", today);
        }

        const { data, error } = await query.order("name");

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST mark menu item as daily special
// Body: { special_date: "2026-01-11", special_price?: 10.50 }
router.post("/menu-items/:id/set-daily-special", async (req, res) => {
    const { id } = req.params;
    const { special_date, special_price } = req.body;

    try {
        // Validar que special_date foi fornecida
        if (!special_date) {
            return res.status(400).json({ error: "O campo 'special_date' é obrigatório." });
        }

        // Verificar se o item existe
        const { data: item, error: fetchError } = await supabase
            .from("menu_items")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !item) {
            return res.status(404).json({ error: "Item de menu não encontrado." });
        }

        // Atualizar o item para ser prato do dia
        const updateData: any = {
            is_daily_special: true,
            special_date: special_date
        };

        // Se special_price for fornecido, adiciona ao update
        if (special_price !== undefined) {
            updateData.special_price = parseFloat(special_price);
        }

        const { data, error } = await supabase
            .from("menu_items")
            .update(updateData)
            .eq("id", id)
            .select();

        if (error) throw error;

        res.json({
            message: "Prato marcado como prato do dia com sucesso.",
            data: data[0]
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE remove menu item from daily specials
router.delete("/menu-items/:id/remove-daily-special", async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se o item existe
        const { data: item, error: fetchError } = await supabase
            .from("menu_items")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError || !item) {
            return res.status(404).json({ error: "Item de menu não encontrado." });
        }

        // Remover flags de prato do dia
        const { data, error } = await supabase
            .from("menu_items")
            .update({
                is_daily_special: false,
                special_date: null,
                special_price: null
            })
            .eq("id", id)
            .select();

        if (error) throw error;

        res.json({
            message: "Prato removido dos pratos do dia com sucesso.",
            data: data[0]
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


// ==================== ORDERS ROUTES ====================

// GET all orders with optional filters
router.get("/orders", async (req, res) => {
  try {
    const { status, type, date } = req.query;

    let query = supabase
      .from("orders")
      .select(`
        *,
        customer:customers(*),
        items:order_items(*),
        delivery_address:delivery_addresses(*)
      `)
      .order("created_at", { ascending: false });

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);

      query = query
        .gte("created_at", startOfDay.toISOString())
        .lte("created_at", endOfDay.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET dashboard statistics
router.get("/orders/stats/dashboard", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total orders today
    const { count: todayCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Orders by status
    const { data: statusData } = await supabase
      .from("orders")
      .select("status")
      .gte("created_at", today.toISOString());

    const statusCounts = {
      NEW: 0,
      IN_PREP: 0,
      READY: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };

    statusData?.forEach((order: any) => {
      if (statusCounts.hasOwnProperty(order.status)) {
        statusCounts[order.status as keyof typeof statusCounts]++;
      }
    });

    // Revenue today
    const { data: revenueData } = await supabase
      .from("orders")
      .select("total_amount")
      .gte("created_at", today.toISOString())
      .neq("status", "CANCELLED");

    const totalRevenue = revenueData?.reduce((sum, order) =>
      sum + parseFloat(order.total_amount), 0
    ) || 0;

    // Average order value
    const avgOrderValue = revenueData && revenueData.length > 0
      ? totalRevenue / revenueData.length
      : 0;

    res.json({
      today: {
        total_orders: todayCount || 0,
        revenue: totalRevenue,
        avg_order_value: avgOrderValue
      },
      by_status: statusCounts
    });

  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// GET single order by ID
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        customer:customers(*),
        items:order_items(*),
        delivery_address:delivery_addresses(*),
        courier:couriers(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// CREATE new order
router.post("/orders", async (req, res) => {
  try {
    const {
      customer,
      items,
      type,
      delivery_address,
      payment_method,
      notes
    } = req.body;

    // Validate required fields
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: customer and items are required"
      });
    }

    // 1. Create or get customer
    let customerId;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", customer.phone)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null
        })
        .select()
        .single();

      if (customerError) throw customerError;
      customerId = newCustomer.id;
    }

    // 2. Calculate totals
    let subtotal = 0;
    items.forEach((item: any) => {
      const itemPrice = parseFloat(item.price) * parseInt(item.quantity);
      const extrasPrice = (item.extras || []).reduce((sum: number, extra: any) =>
        sum + parseFloat(extra.price), 0
      );
      subtotal += itemPrice + extrasPrice;
    });

    const deliveryFee = type === 'DELIVERY' ? parseFloat(delivery_address?.fee || 0) : 0;
    const totalAmount = subtotal + deliveryFee;

    // 3. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        type,
        status: 'NEW',
        subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        delivery_distance_km: delivery_address?.distance_km || null,
        delivery_eta_minutes: delivery_address?.eta_minutes || null,
        payment_method,
        payment_status: payment_method === 'CASH' ? 'PENDING' : 'PENDING',
        notes
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. Create order items
    const orderItems = items.map((item: any) => {
      const itemPrice = parseFloat(item.price);
      const quantity = parseInt(item.quantity);
      const extrasPrice = (item.extras || []).reduce((sum: number, extra: any) =>
        sum + parseFloat(extra.price), 0
      );

      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id || null,
        name: item.name,
        price: itemPrice,
        quantity,
        extras: item.extras || [],
        special_instructions: item.special_instructions || null,
        subtotal: (itemPrice * quantity) + extrasPrice
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 5. Create delivery address if DELIVERY
    if (type === 'DELIVERY' && delivery_address) {
      const { error: addressError } = await supabase
        .from("delivery_addresses")
        .insert({
          order_id: order.id,
          address_line: delivery_address.address_line,
          postal_code: delivery_address.postal_code || null,
          city: delivery_address.city || null,
          lat: delivery_address.lat || null,
          lng: delivery_address.lng || null,
          delivery_instructions: delivery_address.instructions || null
        });

      if (addressError) throw addressError;
    }

    // 6. Return complete order
    const { data: completeOrder } = await supabase
      .from("orders")
      .select(`
        *,
        customer:customers(*),
        items:order_items(*),
        delivery_address:delivery_addresses(*)
      `)
      .eq("id", order.id)
      .single();

    res.status(201).json({
      message: "Order created successfully",
      data: completeOrder
    });

  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// UPDATE order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['NEW', 'IN_PREP', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update order with appropriate timestamp
    const updateData: any = { status };

    switch (status) {
      case 'IN_PREP':
        updateData.accepted_at = new Date().toISOString();
        break;
      case 'READY':
        updateData.ready_at = new Date().toISOString();
        break;
      case 'OUT_FOR_DELIVERY':
        updateData.out_for_delivery_at = new Date().toISOString();
        break;
      case 'DELIVERED':
        updateData.delivered_at = new Date().toISOString();
        break;
      case 'CANCELLED':
        updateData.cancelled_at = new Date().toISOString();
        break;
    }

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        customer:customers(*),
        items:order_items(*),
        delivery_address:delivery_addresses(*)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: `Order status updated to ${status}`,
      data
    });

  } catch (error: any) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// ASSIGN courier to order
router.put("/orders/:id/courier", async (req, res) => {
  try {
    const { id } = req.params;
    const { courier_id } = req.body;

    if (!courier_id) {
      return res.status(400).json({ error: "courier_id is required" });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ courier_id })
      .eq("id", id)
      .select(`
        *,
        customer:customers(*),
        courier:couriers(*)
      `)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Courier assigned successfully",
      data
    });

  } catch (error: any) {
    console.error("Error assigning courier:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
