import React from "react";
import Image from "next/image";
import Loader from "@/assets/loader.gif";

function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Image src={Loader} alt="loading-images" width={100} height={100} />
    </div>
  );
}

export default Loading;
