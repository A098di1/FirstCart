import { clerkClient } from '@clerk/nextjs/server';

/**
 * Check if the user is a seller based on Clerk publicMetadata.
 * @param {string} userId - The Clerk user ID.
 * @returns {Promise<boolean>} - Returns true if user is a seller, else false.
 */
const authSeller = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);

    // Safely access publicMetadata
    const role = user.publicMetadata?.role;

    return role === 'seller';
  } catch (error) {
    console.error("authSeller error:", error.message);
    return false;
  }
};

export default authSeller;
