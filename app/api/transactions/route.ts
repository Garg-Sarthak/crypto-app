import { NextRequest, NextResponse } from "next/server";
import client from "@/db"

export async function POST(req : NextRequest){
    const body = await req.json();
 
    try{
        const orders = await client.order.findMany({
            where : {
                userId : body.userId
            }
        })
        if (orders){
            for (const order of orders){
                await client.transaction.updateMany({
                    where : {
                        orderId : order.id
                    },
                    data : {
                        userId : body.userId
                    }
                })
            }
        }
        const transactions = await client.transaction.findMany({
            where : {
                userId : body.userId
            },
            orderBy : {
                time : "desc"
            }
        })
        return NextResponse.json({
            transactions
        })
        
    }catch(e){
        return NextResponse.json({
            error : e
        })
    }

}