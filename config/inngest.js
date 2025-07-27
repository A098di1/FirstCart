import { Inngest } from "inngest";
import connectDB from "./db"; // ✅ Ensure this path is correct
import User from "@/models/User";
import Order from "@/models/Order"; // ✅ You forgot to import this

// 1. ✅ Create Inngest client
export const inngest = new Inngest({ id: "quickcart-next" });

/**
 * 📥 Clerk User Created → Save to DB
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.create(userData);

    return { success: true };
  }
);

/**
 * ✏️ Clerk User Updated → Update DB
 */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
    } = event.data;

    const userData = {
      email: email_addresses[0]?.email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);

    return { success: true };
  }
);

/**
 * ❌ Clerk User Deleted → Remove from DB
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);

    return { success: true };
  }
);

/**
 * 📦 Order Created → Batch insert into DB
 */
export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 25,
      timeout: "5s",
    },
  },
  { event: "order/created" },
  async ({ events }) => {
    const orders = events.map(({ data }) => ({
      userId: data.userId,
      items: data.items,
      amount: data.amount,      // ❗️FIXED: was incorrectly set as address
      address: data.address,    // ✅ Added this back correctly
      date: data.date,
    }));

    await connectDB();
    await Order.insertMany(orders);

    return { success: true, processed: orders.length };
  }
);
