export default defineEventHandler(() => {
    const db=readDb()
    return db.cart
})
