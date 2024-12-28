"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import {config} from "dotenv"
config()


const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string);

export default function Home() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    ws.onmessage = (msg) => {
      if (msg.data === "Connected to server") return
      const dataObj= JSON.parse(msg.data);
      setPrice(dataObj.price);
    }
  },[]);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Price : {price}
      <button onClick={() => 
        axios.post("/api/user", { name : "test" })
      }>
        Hello
      </button>
    </div>
  );
}