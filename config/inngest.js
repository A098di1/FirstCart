import { Inngest } from "inngest";
import connectDB from "./db"; // or "@/lib/db" depending on your structure
import User from "@/models/User"; // ✅ Make sure this path is correct

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// 🔄 Inngest function to save user data to the database
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
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
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB(); // ✅ Connect to DB
    await User.create(userData); // ✅ Create new user
  }
);

// ✏️ Update user data
export const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
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
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url,
    };

    await connectDB(); // ✅ Connect to DB
    await User.findByIdAndUpdate(id, userData); // ✅ Update user
  }
);

// ❌ Delete user
export const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB(); // ✅ Connect to DB
    await User.findByIdAndDelete(id); // ✅ Delete user
  }
);
