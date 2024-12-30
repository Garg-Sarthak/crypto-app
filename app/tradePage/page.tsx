"use client"
import OrderBook, { OrderBook2 } from "@/components/orderBook";
import OrderPlace from "@/components/orderPlace";
import TradingView from "@/components/tradingView";
import { useEffect, useState } from "react";

export default function TradePage() {
    const [symbol, setSymbol] = useState("BTC");
    const [price, setPrice] = useState(0); // here 
    const [asks, setAsks] = useState([]);
    const [bids, setBids] = useState([]);

    useEffect(() => {
          const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL as string}${symbol.toLowerCase() + "usdt"}`); // here
          const handleMessage = (msg: MessageEvent) => {
            if (msg.data === "Connected to server") return
            const dataObj = JSON.parse(msg.data)
            setPrice(dataObj.price)
            setAsks(dataObj.asks.slice(0, 10).reverse())
            setBids(dataObj.bids.slice(0, 10))
          }
          console.log("sent request to ",ws.url);
          ws.onmessage = handleMessage
          return () => {
              ws.close();
          }
      },[symbol])
    return (
        <div>
                <select
                    defaultValue={symbol}
                    className="bg-gray-900 ml-14 mt-4 text-white p-2 rounded"
                    onChange={(e) => {
                        const newSymbol = e.target.value;
                        setSymbol(newSymbol);
                        console.log(newSymbol);
                    }}
                >
                    <option value="BTC">BTC/USDT</option>
                    <option value="ETH">ETH/USDT</option>
                    <option value="SOL">SOL/USDT</option>
                    <option value="DOGE">DOGE/USDT</option>
                </select>
            <div className="grid grid-cols-12 text-white ml-10">
              <div className="col-span-6 m-3 min-h-[640px] max-h-[640px]"><TradingView symbol={symbol.toLowerCase() + "usdt"} /></div>
              
              {/* <div className="col-span-3 m-4 "><OrderBook symbol={symbol.toLowerCase() + "usdt"} /></div> */}
              <div className="col-span-3 m-4 "><OrderBook2 currentPrice={price} asks={asks} bids={bids} /> </div>
              <div className="col-span-3 m-4 "><OrderPlace symbol={symbol.toLowerCase() + "usdt"} symbolPrice={price}/></div>
            </div>


        </div>
    );
}


