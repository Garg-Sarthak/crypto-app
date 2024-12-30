'use client'

import { useEffect, useState } from 'react'

// Define a type for the order tuple
type OrderTuple = [number, number]


interface Order {
  symbol : String
}
interface OrderBookProps {
  bids: OrderTuple[]
  asks: OrderTuple[]
  currentPrice: number
}

export default function OrderBook(props : Order) {
  const { symbol } = props
  const [price, setPrice] = useState(0);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  
  useEffect(() => {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL as string}${symbol}`);
      const handleMessage = (msg: MessageEvent) => {
        if (msg.data === "Connected to server") return
        const dataObj = JSON.parse(msg.data)
        setPrice(dataObj.price)
        setAsks(dataObj.asks.slice(0, 10).reverse())
        setBids(dataObj.bids.slice(0, 10))
      }
      ws.onmessage = handleMessage
      return () => {
          ws.close();
      }
  },[symbol])

  return (
    <div>
      <BookMaker currentPrice={price} bids={bids} asks={asks} />
    </div>
  )
}

function BookMaker({ bids, asks, currentPrice }: OrderBookProps) {
  return (
    <div className="w-full max-w-xs h-full bg-gray-900 text-white p-4 font-mono">
      {/* Asks (Sell) Orders */}
      <div className="space-y-1">
        {asks.map(([price, quantity]) => (
          <div key={price} className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-red-500">{price}</div>
            <div className="text-right">{quantity}</div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="my-4 text-center border-y border-gray-700 py-2">
        <span className="text-xl">{currentPrice} USD</span>
      </div>

      {/* Bids (Buy) Orders */}
      <div className="space-y-1">
        {bids.map(([price, quantity]) => (
          <div key={price} className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-green-500">{price}</div>
            <div className="text-right">{quantity}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrderBook2(props : OrderBookProps) {

  const { asks, bids, currentPrice: price } = props

  return (
    <div>
      <BookMaker currentPrice={price} bids={bids} asks={asks} />
    </div>
  )
}
