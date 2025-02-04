"use strict"
import {useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import axios from "axios"
import { SignedIn, SignedOut, SignInButton, useSession } from "@clerk/nextjs";


interface orderPlaceProps {
    symbol : string,
    symbolPrice : number
}

export default function OrderPlace(props : orderPlaceProps) {
    const session = useSession();
    const userId = useMemo(() => {
        if (session.isLoaded && session.isSignedIn) {
            return session.session.user.id
        }
        return "loggedOutUser"
    },[props.symbolPrice])
    const minPrice = useMemo(() => {
        return props.symbolPrice * 0.95
    },[props.symbolPrice])
    const maxPrice = useMemo(() => {
        return props.symbolPrice * 1.05
    },[props.symbolPrice])
    const maxQuantity = useMemo(() => {
        return 1000000/props.symbolPrice
    },[props.symbolPrice])
    const currPrice = useMemo(() => {
        return props.symbolPrice
    },[props.symbolPrice])

    
    const [side,setSide] = useState("BUY");
    const [type,setType] = useState("LIMIT");
    const [price,setPrice] = useState(0);
    const [quantity,setQuantity] = useState(0);

    return (
        <div >
            <div className="grid grid-cols-2">
                <Button className={`text-black rounded-xl mx-1 ${side==="BUY"?"bg-green-400" : "bg-white"} hover:bg-green-100`} onClick={() => setSide("BUY")}>BUY</Button>
                <Button className={`text-black rounded-xl mx-1 ${side==="SELL"?"bg-red-400" : "bg-white"} hover:bg-red-100`} onClick={() => setSide("SELL")}>SELL</Button>
            </div>
            <Separator className=" my-2 bg-gray-600"/>
            <div className="grid grid-cols-2 mt-5 text-lg">
                <div className="colspan-1 grid grid-cols-2 ">
                    <text className={`hover:underline cursor-pointer underline-offset-4 ${type === "LIMIT"? "underline text-xl italic" : ""}`} onClick={() => setType("LIMIT")}>Limit</text>
                    <text className={`hover:underline cursor-pointer underline-offset-4 ${type === "MARKET"? "underline text-xl italic" : ""} `} onClick={() => setType("MARKET")}>Market</text>
                </div>
            </div>
            <div className="grid grid-cols-3 mt-6">
                <div className="colspan-1 text-gray-300">
                    Price
                </div>
            </div>
            <div>
                <Input className={`${type === "MARKET"? "cursor-not-allowed" : ""}`} disabled={type === "MARKET"} type="number" min={minPrice} max={maxPrice} step={0.1} placeholder="Enter Price" onChange={(e) => {setPrice(parseFloat(e.target.value) || 0);}}>
                </Input>
            </div>
            <div className="grid grid-cols-3 mt-6">
                <div className="colspan-1 text-gray-300">
                    Quantity
                </div>
            </div>
            <div>
                <Input type="number" min={0.001} max={maxQuantity} placeholder="Enter Quantity" onChange={(e) => {setQuantity(parseFloat(e.target.value) || 0) ;} }>
                </Input>
            </div>
            <div className="grid grid-cols-3">
                <div className="items-center mt-16">
                    <SignedIn>
                        <Button onClick={() => makeDbCall(userId,price,quantity,maxPrice,minPrice,maxQuantity,type,side,props.symbol,props.symbolPrice)} className={`${side === "BUY"? "bg-green-300 hover:bg-green-300" : "bg-red-300 hover:bg-red-300"} py-10 text-md text-black`}>
                            Place {`${side}`} Order for {((type === "MARKET"? currPrice : price)*quantity).toFixed(3) } USD
                        </Button>
                    </SignedIn>
                    <SignedOut>
                        <Button onClick = {() => {window.alert("You must be logged in to place an order")}} className={`${side === "BUY"? "bg-green-300 hover:bg-green-300" : "bg-red-300 hover:bg-red-300"} mb-10 py-10 text-md text-black`}>
                            Place {`${side}`} Order for {((type === "MARKET"? currPrice : price)*quantity).toFixed(3) } USD
                        </Button>
                        <SignInButton><Button className="text-black bg-yellow-500">Log In to Place Order</Button></SignInButton>
                    </SignedOut>
                </div>

            </div>
        </div>
    )
}

async function makeDbCall(userId:string,userPrice : number, userQuantity : number, maxPrice : number, minPrice : number, maxQuantity : number,type : string, side : string,symbol:string,symbolPrice : number) {
    console.log("made calls")
    if (type == "LIMIT" ){if (userPrice > maxPrice){
        window.alert("Price must be within 5% of Last Traded Price (LTP)")
        return 
    }else if (userPrice < minPrice){
        window.alert("Price must be within 5% of Last Traded Price (LTP)")
        return 
    }}
    else if (userPrice == 0 || symbolPrice == 0){
        window.alert("Invalid Price Entered, or wait for data to load")
    }

    if (userQuantity > maxQuantity){
        window.alert("Order Value can't exceed 1,000,000 USD")
        return 
    }else if (userQuantity <= 0.00000001 || (type == "LIMIT" && userQuantity * userPrice < 1)){
        window.alert("Order Value can't be less than 1 USD")
        return 
    }
    
    window.alert("order registered, wait few second for registration")
    const res = await axios.post("/api/order",{
        userId,
        side,
        orderType : type,
        price : type == "LIMIT"?userPrice:side=="BUY"?symbolPrice*1.05:symbolPrice*0.95,
        quantity : userQuantity,
        symbol : symbol.toUpperCase().slice(0,3)
        
    })
    console.log(res);
    if (res.data.status === "success"){
        window.alert("Order Placed Successfully, check orders page for details")
        console.log(res);
    }
    const trs = await axios.get("/api/transactions",{
        headers : {"user" : userId}
    })
    console.log(trs);



}