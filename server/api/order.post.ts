export default defineEventHandler(async (event) => {
    const config=useRuntimeConfig(event)
    const db=readDb()

    if(db.cart.length === 0){
        throw createError({statusCode:400,statusMessage:'Корзина пуста'})
    }

    if(!config.tgToken || !config.tgChat){
        throw createError({statusCode:500,statusMessage:'Telegram не настроен: нужны NUXT_TG_TOKEN и NUXT_TG_CHAT в .env'})
    }

    const lines=db.cart.map(item => `${item.title} - ${item.quantity} шт`)
    const text=`Добрый день!\n\nХотим заказать следующие товары:\n\n${lines.join('\n')}`

    const allowed=db.subscribers.filter(item => isAllowedPhone(item.phone))
    const recipients=[...new Set([Number(config.tgChat),...allowed.map(item => item.chatId)])]
    const results=await Promise.allSettled(
        recipients.map(chatId => telegram('sendMessage',{chat_id:chatId,text}))
    )

    if(!results.some(result => result.status === 'fulfilled')){
        throw createError({statusCode:502,statusMessage:'Telegram не принял сообщение'})
    }

    db.cart=[]
    writeDb(db)

    return {text}
})
