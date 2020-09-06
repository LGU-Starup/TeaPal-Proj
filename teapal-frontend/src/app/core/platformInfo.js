export const isMobile = () => {
    let info = navigator.userAgent;
    let agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
    for(let i = 0; i < agents.length; i++){
        if(info.indexOf(agents[i]) >= 0) return true;
    }
    return false;
}

export const isWeixin = function () { //判断是否是微信
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i) === "micromessenger";
};