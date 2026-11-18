export function normalizePhone(phone:string){
    return String(phone || '').replace(/\D/g,'')
}

export function allowedPhones(){
    const config=useRuntimeConfig()
    return String(config.tgPhones || '').split(',').map(normalizePhone).filter(Boolean)
}

export function isAllowedPhone(phone:string){
    return allowedPhones().includes(normalizePhone(phone))
}
