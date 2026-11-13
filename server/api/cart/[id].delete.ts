export default defineEventHandler((event) => {
    const id=Number(getRouterParam(event,'id'))
    const db=readDb()

    db.cart=db.cart.filter(item => item.id !== id)
    writeDb(db)

    return db.cart
})
