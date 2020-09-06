import React from 'react'
import { Button, Menu, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

export const saveLocaleToCookie = (locale) => {
    let exp = new Date();
    exp.setTime(exp.getTime() + 30*24*60*60*1000);
    document.cookie = 'locale='+locale+";expires=" + exp.toGMTString()+";path=/";
}

export const getLocaleFromCookie = () => {
    let try_locale = 'ch'
    //console.log(document.cookie)
    document.cookie.split(';').forEach((item, index)=>{
        if(item.replace(' ','').split('=')[0]==='locale'){
            try_locale = item.split('=')[1]
        }
    })
    return try_locale
}

const ChangeLocaleComponent = ({changeLocale, locale}) => {

    React.useEffect(()=>{
        changeLocale(getLocaleFromCookie())
    })
    
    return(
        <Dropdown className="Header-language" overlay={
            <Menu onClick={e=>{changeLocale(e.key);saveLocaleToCookie(e.key)}}>
                <Menu.Item key="en">English</Menu.Item>
                <Menu.Item key="ch">中文</Menu.Item>
            </Menu>}>
            <Button icon={<GlobalOutlined />} ghost>{locale.locale==='en'?'En':'中'}</Button>
        </Dropdown>
    )
}

export default ChangeLocaleComponent