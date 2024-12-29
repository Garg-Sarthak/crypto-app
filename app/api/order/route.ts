import { NextRequest, NextResponse } from "next/server";
import client from "@/db"

export async function POST(req : NextRequest){
    const body = await req.json();
    const dbData = {
        userId : body.userId,
        time : new Date().toISOString(),
        side : body.side,
        orderType : body.orderType,
        price : body.price,
        quantity : body.quantity,
        avgPrice : body.avgPrice,
        symbol : body.symbol
    }
    try{
        await client.order.create({
            data : dbData
        })
        return NextResponse.json({
            body
        })
    }catch(e){
        return NextResponse.json({
            error : e
        })
    }
}