import { NextRequest, NextResponse } from "next/server";
import client from "@/db"

export async function GET(req : NextRequest){

    const userId = req.headers.get("User");
    if (userId){
    try{
        const orders = await client.order.findMany({
            where : {
                userId : userId
            }
        })
        if (orders){
            for (const order of orders){
                await client.transaction.updateMany({
                    where : {
                        userId : "null",
                        orderId : order.id
                    },
                    data : {
                        userId : userId
                    }
                })
            }
        }
        const transactions = await client.transaction.findMany({
            where : {
                userId : userId
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

}