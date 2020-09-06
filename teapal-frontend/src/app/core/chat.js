import { PRE } from '../App'
import { getLoginUsername } from './login'
import { message } from 'antd'

export const startChat = (to_user_name) => {
    fetch(PRE+'/chat/',{
        method:'POST',
        body:JSON.stringify({
            user_name: getLoginUsername(),
            to_user_name,
        })
    }).then(response=>{
        if(response.status===200){
            return response.json()
        }else{
            message.error("发生了未知错误")
        }
    }).then(data=>{if(data){
        var exp = new Date();
        exp.setTime(exp.getTime() + 30*24*60*60*1000);
        document.cookie = 'quote=;expires='+exp.toGMTString()+";path=/teapal";
        window.location.href = "/teapal/chat?chat_id="+data.chat_id
    }})
}