export function telegram(method:string,body:object={}){
    const config=useRuntimeConfig()
    return $fetch<any>(`https://api.telegram.org/bot${config.tgToken}/${method}`,{method:'POST',body})
}
