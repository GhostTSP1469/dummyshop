export default defineNitroPlugin(() => {
    const config=useRuntimeConfig()
    const state=globalThis as any

    if(!config.tgToken || state.tgPolling) return
    state.tgPolling=true

    let offset=0
    
    const DENIED='Бот не доступен для вас'
    const shareKeyboard={
        keyboard:[[{text:'Поделиться номером',request_contact:true}]],
        resize_keyboard:true,
        one_time_keyboard:true
    }
    const noKeyboard={remove_keyboard:true}

    function say(chatId:number,text:string,replyMarkup?:object){
        return telegram('sendMessage',{chat_id:chatId,text,reply_markup:replyMarkup})
    }

    function isSubscribed(chatId:number){
        return readDb().subscribers.some(item => item.chatId === chatId)
    }

    function subscribe(chatId:number,phone:string){
        const db=readDb()
        db.subscribers=db.subscribers.filter(item => item.chatId !== chatId)
        db.subscribers.push({chatId,phone})
        writeDb(db)
    }

    function unsubscribe(chatId:number){
        const db=readDb()
        db.subscribers=db.subscribers.filter(item => item.chatId !== chatId)
        writeDb(db)
    }

    async function handle(message:any){
        const chatId=message.chat.id

        if(message.contact){
            if(message.contact.user_id !== message.from.id){
                await say(chatId,'Нужен ваш собственный номер. Нажмите кнопку «Поделиться номером».',shareKeyboard)
                return
            }
            if(isAllowedPhone(message.contact.phone_number)){
                subscribe(chatId,message.contact.phone_number)
                await say(chatId,'Номер подтверждён. Сюда будут приходить новые заказы. Отписаться: /stop',noKeyboard)
            } else {
                await say(chatId,DENIED,noKeyboard)
            }
            return
        }

        const text=String(message.text || '').trim()

        if(text.startsWith('/stop')){
            unsubscribe(chatId)
            await say(chatId,'Вы отписались. Вернуться: /start',noKeyboard)
        } else if(isSubscribed(chatId)){
            await say(chatId,'Вы подписаны на заказы. Отписаться: /stop')
        } else {
            await say(chatId,'Чтобы получать заказы, подтвердите номер телефона.',shareKeyboard)
        }
    }

    async function loop(){
        while(true){
            try{
                const res=await telegram('getUpdates',{offset,timeout:25})
                for(const update of res.result){
                    offset=update.update_id + 1
                    if(update.message) await handle(update.message)
                }
            } catch (err) {
                await new Promise(resolve => setTimeout(resolve,5000))
            }
        }
    }

    console.log('telegram-бот: слушаю, белый список номеров:',allowedPhones().length)
    loop()
})
