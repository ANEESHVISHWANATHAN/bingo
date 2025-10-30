import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readFileSync } from "fs";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Load products from JSON file on startup
  try {
    const productsPath = join(process.cwd(), "public", "data", "products.json");
    const productsData = JSON.parse(readFileSync(productsPath, "utf-8"));
    for (const product of productsData) {
      await storage.createProduct(product);
    }
    console.log(`Loaded ${productsData.length} products from products.json`);
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  // Products API
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    // TODO: Add authentication middleware to verify seller role
    // TODO: Validate request body with Zod schema
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    // TODO: Add authentication middleware
    // TODO: Validate request body
    try {
      const order = await storage.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    // TODO: Filter by authenticated user
    const orders = await storage.getOrders();
    res.json(orders);
  });

  // Config API (Admin only)
  app.get("/api/config", async (_req, res) => {
    try {
      const configPath = join(process.cwd(), "public", "config.json");
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      res.json(config);
    } catch (error) {
      res.status(500).json({ error: "Failed to load config" });
    }
  });

  app.put("/api/config", async (req, res) => {
    // TODO: Add admin authentication middleware
    // TODO: Save config to file or database
    res.json({ message: "Config updated successfully" });
  });

  // Authentication endpoints (placeholders)
  app.post("/api/login", async (req, res) => {
    // TODO: Implement authentication
    // const { email, password } = req.body;
    // Verify credentials, generate JWT token
    res.json({ token: "placeholder_token", user: { id: "1", email: req.body.email } });
  });

  app.post("/api/signup", async (req, res) => {
    // TODO: Implement user creation
    // const user = await storage.createUser(req.body);
    // Generate JWT token
    res.json({ token: "placeholder_token", user: { id: "1", email: req.body.email } });
  });

  // Payment gateway endpoints (placeholders)
  app.post("/api/create-stripe-session", async (req, res) => {
    // TODO: Initialize Stripe checkout session
    // const session = await stripe.checkout.sessions.create({...});
    res.json({ sessionId: "placeholder_session_id" });
  });

  app.post("/api/create-paypal-order", async (req, res) => {
    // TODO: Create PayPal order
    // const order = await paypal.orders.create({...});
    res.json({ orderId: "placeholder_order_id" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
