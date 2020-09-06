export const goBack = (url="/") => {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){ // IE
        if(window.history.length > 0){
            window.history.go( -1 );
        }else{
            window.location.href = url;
        }
    }else{ //非IE浏览器
        if (navigator.userAgent.indexOf('Firefox') >= 0 ||
            navigator.userAgent.indexOf('Opera') >= 0 ||
            navigator.userAgent.indexOf('Safari') >= 0 ||
            navigator.userAgent.indexOf('Chrome') >= 0 ||
            navigator.userAgent.indexOf('WebKit') >= 0){
 
            if(window.history.length > 1){
                window.history.go( -1 );
            }else{
                window.location.href = url;
            }
        }else{ //未知的浏览器
            window.location.href = url;
        }
    }
}