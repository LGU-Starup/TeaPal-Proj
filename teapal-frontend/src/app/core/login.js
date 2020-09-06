import {PRE} from '../App'
export const checkLogin = () => {
    let try_token, try_user_name, try_is_login = null
    //console.log(document.cookie)
    document.cookie.split(';').forEach((item, index)=>{
        if(item.replace(' ','').split('=')[0]==='token'){
            try_token = item.split('=')[1]
        }
        if(item.replace(' ','').split('=')[0]==='user_name'){
            try_user_name = item.split('=')[1]
        }
        if(item.replace(' ','').split('=')[0]==='is_login'){
            try_is_login = item.split('=')[1]
        }
    })
    if(try_user_name!=null&&try_token!=null&&(try_is_login==="true"||try_is_login===true)){
        return true
    }else{
        return false
    }
}

export const getLoginUsername = () => {
    let try_user_name, try_is_login = null
    document.cookie.split(';').forEach((item, index)=>{
        if(item.replace(' ','').split('=')[0]==='user_name'){
            try_user_name = item.split('=')[1]
        }  
        if(item.replace(' ','').split('=')[0]==='is_login'){
            try_is_login = item.split('=')[1]
        }
    })
    if(try_user_name!=null&&(try_is_login==='true'||try_is_login===true)){
        return try_user_name
    }else{
        return null
    }
}

export const logout = () => {
    console.log('trying logout')
    var exp = new Date();
    exp.setTime(exp.getTime()-1);
    document.cookie = 'user_name=logout;expires='+exp.toGMTString()+";path=/";
    exp.setTime(exp.getTime() + 30*24*60*60*1000);
    document.cookie = "is_login=false;expires=" + exp.toGMTString()+";path=/";
    console.log(document.cookie)
    checkLogin()
}


export const getUserInfo = (user_name) => {
    return new Promise(resolve => {
        fetch(PRE+'/user/'+user_name,{method:'GET'})
        .then(response => {
            if(response.status===200){
                return response.json()
            }else{
                resolve(null)
            }
        })
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            console.log(error.message)
            resolve(null)
        })
    });
}