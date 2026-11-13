import {readFileSync,writeFileSync} from 'node:fs'
import type {CartItem} from '~/types/cart'

const file='db.json'

export interface Db{
    cart:CartItem[]
}

export function readDb():Db{
    const text=readFileSync(file,'utf-8')
    return JSON.parse(text)
}

export function writeDb(db:Db){
    writeFileSync(file,JSON.stringify(db,null,2))
}
