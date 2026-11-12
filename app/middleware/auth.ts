export default defineNuxtRouteMiddleware(() => {
  const {isLogin}=useAuth()
  if(!isLogin.value){
    return navigateTo('/login')
  }
})
