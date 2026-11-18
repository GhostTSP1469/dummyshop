import {readFileSync,writeFileSync} from 'node:fs'
import type {CartItem} from '~/types/cart'

const file='db.json'

export interface Subscriber{
    chatId:number,
    phone:string
}

export interface Db{
    cart:CartItem[],
    subscribers:Subscriber[]
}

export function readDb():Db{
    const text=readFileSync(file,'utf-8')
    const db=JSON.parse(text)
    const subscribers=(db.subscribers || []).filter((item:any) => typeof item === 'object')
    return {cart:db.cart || [],subscribers}
}

export function writeDb(db:Db){
    writeFileSync(file,JSON.stringify(db,null,2))
}
