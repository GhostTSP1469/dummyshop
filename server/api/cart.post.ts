import type {CartItem} from '~/types/cart'

export default defineEventHandler(async (event) => {
    const body=await readBody<CartItem>(event)
    const db=readDb()
    const existing=db.cart.find(item => item.id === body.id)

    if(existing){
        existing.quantity=existing.quantity + body.quantity
    } else {
        db.cart.push(body)
    }

    writeDb(db)
    return db.cart
})
