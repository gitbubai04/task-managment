"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt="logo"
        width={50}
        height={50}
        priority={true}
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-cente justify-center items-center flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not find requsted page</p>
        <Button
          variant="outline"
          className="mt-4 ml-2 "
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
