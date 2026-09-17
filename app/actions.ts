"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

const dataFilePath = path.join(process.cwd(), "data", "products.json");

export type Product = {
  id: string;
  name: string;
  description?: string;
  status: string;
  inventory: string;
  type: string;
  vendor: string;
  price: string;
  image: string;
  placement?: string[];
  sizes?: string[];
  colors?: string[];
  inventoryMatrix?: Record<string, number>;
};

export async function getProducts(): Promise<Product[]> {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading products:", error);
    return [];
  }
}

export async function addProduct(newProduct: Product) {
  try {
    const currentProducts = await getProducts();
    const updatedProducts = [newProduct, ...currentProducts];
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedProducts, null, 2));
    
    // Revalidate paths so the storefront updates
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Error adding product:", error);
    return { success: false, error: "Failed to save product" };
  }
}

export async function updateProduct(updatedProduct: Product) {
  try {
    const currentProducts = await getProducts();
    const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
    if (index === -1) {
      return { success: false, error: "Product not found" };
    }
    
    currentProducts[index] = updatedProduct;
    fs.writeFileSync(dataFilePath, JSON.stringify(currentProducts, null, 2));
    
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${updatedProduct.id}`);
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const currentProducts = await getProducts();
    const filteredProducts = currentProducts.filter(p => p.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredProducts, null, 2));
    
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/products");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}



const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

export type OrderProduct = {
  name: string;
  qty: number;
  price: string;
  image: string;
};

export type OrderTimelineEvent = {
  time: string;
  title: string;
  desc: string;
  icon: string;
};

export type Order = {
  id: string;
  date: string;
  customer: string;
  email: string;
  phone: string;
  total: string;
  payment: string;
  fulfillment: string;
  items: number;
  address: string;
  products: OrderProduct[];
  timeline: OrderTimelineEvent[];
};

export async function getOrders(): Promise<Order[]> {
  try {
    if (!fs.existsSync(ordersFilePath)) {
      fs.writeFileSync(ordersFilePath, '[]');
      return [];
    }
    const fileContents = fs.readFileSync(ordersFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading orders:", error);
    return [];
  }
}

export async function createOrderAction(newOrder: Order) {
  try {
    const orders = await getOrders();
    orders.unshift(newOrder);
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to save order" };
  }
}

export async function updateOrderAction(updatedOrder: Order) {
  try {
    const orders = await getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      orders[index] = updatedOrder;
      fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
      revalidatePath("/admin/orders");
      return { success: true };
    }
    return { success: false, error: "Order not found" };
  } catch (error) {
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteOrder(id: string) {
  try {
    const orders = await getOrders();
    const filteredOrders = orders.filter(o => o.id !== id);
    fs.writeFileSync(ordersFilePath, JSON.stringify(filteredOrders, null, 2));
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete order" };
  }
}

const shippingFilePath = path.join(process.cwd(), "data", "shipping.json");

export type ShippingRate = {
  id: number;
  name: string;
  price: number;
};

export async function getShippingRates(): Promise<ShippingRate[]> {
  try {
    if (!fs.existsSync(shippingFilePath)) {
      return [];
    }
    const fileContents = fs.readFileSync(shippingFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading shipping rates:", error);
    return [];
  }
}

export async function saveShippingRates(rates: ShippingRate[]) {
  try {
    fs.writeFileSync(shippingFilePath, JSON.stringify(rates, null, 2));
    revalidatePath("/admin/settings");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error) {
    console.error("Error saving shipping rates:", error);
    return { success: false, error: "Failed to save shipping rates" };
  }
}

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

export type StoreSettings = {
  name: string;
  contactEmail: string;
  supportEmail: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  currency: string;
  timezone: string;
};

const defaultSettings: StoreSettings = {
  name: "Tokyo Store",
  contactEmail: "hello@tokyostore.az",
  supportEmail: "support@tokyostore.az",
  phone: "+994 50 123 45 67",
  country: "Azərbaycan",
  city: "Bakı",
  address: "Nizami küçəsi 12",
  currency: "AZN",
  timezone: "Baku"
};

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
    const fileContents = fs.readFileSync(settingsFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading store settings:", error);
    return defaultSettings;
  }
}

export async function saveStoreSettings(settings: StoreSettings) {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error saving store settings:", error);
    return { success: false, error: "Failed to save store settings" };
  }
}

const customersFilePath = path.join(process.cwd(), "data", "customers.json");

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  orders: number;
  spent: string;
  status: string;
  joinDate: string;
};

export async function getCustomers(): Promise<Customer[]> {
  try {
    if (!fs.existsSync(customersFilePath)) {
      return [];
    }
    const fileContents = fs.readFileSync(customersFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading customers:", error);
    return [];
  }
}

export async function addCustomerAction(newCustomer: Customer) {
  try {
    const customers = await getCustomers();
    customers.unshift(newCustomer);
    fs.writeFileSync(customersFilePath, JSON.stringify(customers, null, 2));
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error adding customer:", error);
    return { success: false, error: "Failed to save customer" };
  }
}

export async function deleteCustomerAction(id: string) {
  try {
    const customers = await getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    fs.writeFileSync(customersFilePath, JSON.stringify(filtered, null, 2));
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}

