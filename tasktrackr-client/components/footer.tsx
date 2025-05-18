import React from "react";
import { APP_NAME } from "@/lib/constants";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {currentYear} {APP_NAME}.All Right Reserved
      </div>
    </footer>
  );
}

export default Footer;
