// /terms-conditions/page.jsx
import React from "react";
import ReusablePageLayout from "@/components/ReusablePageLayout";

const TermsConditionsPage = () => (
  <ReusablePageLayout title="Terms & Conditions">
    <p>
      By accessing QuickCart, you agree to abide by our terms. All products listed are subject to availability. Prices may change without prior notice.
    </p>
    <p>
      Users are responsible for maintaining account confidentiality. We reserve the right to modify or terminate services at any time.
    </p>
  </ReusablePageLayout>
);

export default TermsConditionsPage;