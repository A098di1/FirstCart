'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SellerHome = () => {
  const router = useRouter();

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome Seller 👋</h1>
      <p>Manage your products and orders using the links on the left sidebar.</p>
      <div className="space-x-4">
        <Button onClick={() => router.push('/seller/add-product')}>Add Product</Button>
        <Button onClick={() => router.push('/seller/product-list')} variant="outline">View Product List</Button>
        <Button onClick={() => router.push('/seller/orders')} variant="outline">View Orders</Button>
      </div>
    </div>
  );
};

export default SellerHome;
