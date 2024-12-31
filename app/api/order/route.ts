import { NextRequest, NextResponse } from "next/server";
import client from "@/db"
import { createClient } from 'redis';


export async function GET(req : NextRequest){
    const userId = req.headers.get("User");
    if (userId){
        try
        {const orders = await client.order.findMany({
            where : {
                userId
            }, orderBy : {
                time : "desc"
            }
        })
        return NextResponse.json({
            orders
        })
        }catch(e){
            return NextResponse.json({
                error : e
            })
        }
    }

}

export async function POST(req : NextRequest){

    const body = await req.json();

    const dbData = {
        userId : body.userId,
        time : new Date().toISOString(),
        side : body.side,
        orderType : body.orderType,
        price : body.price,
        quantity : body.quantity,
        symbol : body.symbol
    }
    try{
        const order = await client.order.create({
            data : dbData
        })
        try{
            const redisClient = createClient({url : process.env.REDIS_URL as string});
            await redisClient.connect();
            if (!redisClient.isOpen) console.log("not connected to redis");
            else console.log("connected to redis");
            const rediSymbol = order.symbol.toLowerCase()+"usdt";
            const side = order.side.toLowerCase();
            const price = Number(order.price);
            const qty = order.quantity;
            const id = order.id;
            const rediVal = JSON.stringify({oid : id, qty}) || ""
            console.log(`${rediSymbol}_${side}`,rediVal,price);
            await redisClient.zAdd(`${rediSymbol}_${side}`, {score : price, value : rediVal})
            redisClient.quit().then(() => console.log("disconnected from redis"))
        }catch(e){
            return NextResponse.json({
                error : e,
                "order" : order
            })
        }
        return NextResponse.json({
            status : "success",
            order
        })
    }catch(e){
        return NextResponse.json({
            error : e
        })
    }
}