"use client"

// import { useSession } from "@clerk/nextjs";
// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function Order() {
//     const [user,setUser] = useState("");
//     const [orders, setOrders] = useState([]);

//     const session = useSession();
//     useEffect(() => {
//         if (session.isLoaded && session.isSignedIn) {
//             setUser(session.session.user.id);
//         }
//     }, [session]);
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try{
//                 const ords = await axios.get("/api/order",{headers : {
//                     "User" : user
//                 }});
//                 setOrders(ords.data.orders)
//             }catch(e){
//                 console.log(e);
//             }
//         }
//     },[session])

//     return (
//         <div>
//         </div>
//     );
// }

import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

// A functional component to display each order row
interface OrderRowProps {
    order: any;
    index: number;
}
function OrderRow({ order, index }: OrderRowProps) {
    return (
        <tr className="hover:bg-gray-700">
            <td className="p-2 text-center">{index + 1}</td>
            <td className="p-2 text-center">{order.id}</td>
            <td className="p-2 text-center">{order.symbol}</td>
            <td className="p-2 text-center">{order.side}</td>
            <td className="p-2 text-center">{order.orderType}</td>
            <td className="p-2 text-center">{order.price}</td>
            <td className="p-2 text-center">{order.quantity}</td>
            <td className="p-2 text-center">{order.status}</td>
            <td className="p-2 text-center">{new Date(order.time).toLocaleString()}</td>
        </tr>
    );
}

// Main Order Component
export default function Order() {
    const [user, setUser] = useState("");
    const [orders, setOrders] = useState([]);

    const session = useSession();
    useEffect(() => {
        if (session.isLoaded && session.isSignedIn) {
            setUser(session.session.user.id);
        }
    }, [session]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ords = await axios.get("/api/order", {
                    headers: {
                        User: user,
                    },
                });
                setOrders(ords.data.orders);
            } catch (e) {
                console.log("Error fetching orders:", e);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {orders.length === 0 && <p>No orders found yet. (Try Reloading the page)</p>}
            {orders.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="p-2 border border-gray-700">S.No</th>
                                <th className="p-2 border border-gray-700">Order ID</th>
                                <th className="p-2 border border-gray-700">Symbol</th>
                                <th className="p-2 border border-gray-700">Side</th>
                                <th className="p-2 border border-gray-700">Type</th>
                                <th className="p-2 border border-gray-700">Price</th>
                                <th className="p-2 border border-gray-700">Quantity</th>
                                <th className="p-2 border border-gray-700">Status</th>
                                <th className="p-2 border border-gray-700">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <OrderRow order={order} index={index} key={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400">Fetching orders ...</p>
            )}
        </div>
    );
}
