import { NextRequest, NextResponse } from "next/server";


import client from "@/db"

export async function POST(req : NextRequest){
    const body = await req.json();

    try{
        await client.positions.create({
            data : {
                userId : "test",
                side : "BUY",
                price : 1,
                avgPrice : 1,
                quantity : 1,
                symbol : "BTC",
            }
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