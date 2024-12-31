"use client";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

// A functional component to display each transaction row
interface TransactionRowProps {
    transaction: any;
    index: number;
}
function TransactionRow({ transaction, index }: TransactionRowProps) {
  return (
    <tr className="hover:bg-gray-700">
      <td className="p-2 text-center">{index + 1}</td>
      <td className="p-2 text-center">{new Date(transaction.time).toLocaleString()}</td>
      <td className="p-2 text-center">{transaction.orderId}</td>
      <td className="p-2 text-center">{transaction.symbol}</td>
      <td className="p-2 text-center">{transaction.price}</td>
      <td className="p-2 text-center">{transaction.quantity}</td>
      <td className="p-2 text-center">{transaction.totalAmount}</td>
    </tr>
  );
}

// The main Transactions component
export default function Transactions() {
    const [trsns, setTrsns] = useState([]);
    const [user, setUser] = useState("");
    
    const session = useSession();
    useEffect(() => {
        if (session.isLoaded && session.isSignedIn) {
            setUser(session.session.user.id);
        }
    }, [session]);
    useEffect(() => {
        const fetchTrans = async () => {
            try {
                const response = await axios.post("/api/transactions", {
                    userId: user,
                });
                if (response) {
                    setTrsns(response.data.transactions);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };
        if (user)fetchTrans();
    }, [user]);


    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-6">Transactions</h1>
            {(trsns.length == 0) && <h1 className="text-3xl font-bold mb-6">No transactions found yet. (Try relaoding the page)</h1>}
            {trsns.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="p-2 border border-gray-700">S.No</th>
                                <th className="p-2 border border-gray-700">Time</th>
                                <th className="p-2 border border-gray-700">Order ID</th>
                                <th className="p-2 border border-gray-700">Symbol</th>
                                <th className="p-2 border border-gray-700">Price</th>
                                <th className="p-2 border border-gray-700">Quantity</th>
                                <th className="p-2 border border-gray-700">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trsns.map((transaction, index) => (
                                <TransactionRow
                                    transaction={transaction}
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400">Fetching transactions...</p>
            )}
        </div>
    );
}
