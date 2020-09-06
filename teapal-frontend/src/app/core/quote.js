export const quoteForQuestion = (content) => {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30*24*60*60*1000);
    let type = 'Q'
    document.cookie = 'quote='+escape(content)+';expires='+exp.toGMTString()+";path=/qwall";
    document.cookie = "send_type="+type+";expires=" + exp.toGMTString()+";path=/qwall";
    window.location.href = "/qwall"
}

// quoteForQuestion函数一定要与getQuote同时使用
export const getQuote = () => {
    let try_quote = null
    //console.log(document.cookie)
    document.cookie.split(';').forEach((item, index)=>{
        if(item.replace(' ','').split('=')[0]==='quote'){
            try_quote = item.split('=')[1]
        }
    })
    // alert(try_send_type+' and '+unescape(try_quote))
    // 清除cookie
    if(try_quote&&try_quote!==""){
        //console.log('got quote info',try_send_type,try_quote)
        let raw_quote = unescape(try_quote)
        let title = raw_quote.slice(raw_quote.indexOf(':')+1)
        let uri = raw_quote.slice(0,raw_quote.indexOf(':'))
        //console.log('quote:',{title,uri})
        return {type:'H',title,uri}
    }else{
        return null
    }
}

export const clearQuote = () => {
    var exp = new Date();
    exp.setTime(exp.getTime()-1);
    document.cookie = 'quote=;expires='+exp.toGMTString()+";path=/qwall";
}

export const getSendType = () => {
    let try_send_type = null
    //console.log(document.cookie)
    document.cookie.split(';').forEach((item, index)=>{
        if(item.replace(' ','').split('=')[0]==='send_type'){
            try_send_type = item.split('=')[1]
        }
    })
    // alert(try_send_type+' and '+unescape(try_quote))
    // 清除cookie
    var exp = new Date();
    exp.setTime(exp.getTime()-1);
    document.cookie = "send_type=;expires=" + exp.toGMTString()+";path=/qwall";
    if(try_send_type){
        return try_send_type
    }else{
        return 'Q'
    }
}