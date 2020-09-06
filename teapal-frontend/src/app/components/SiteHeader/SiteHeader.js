import React from 'react'

import { useRouteMatch} from "react-router-dom";

import { Input, Button, Menu, Dropdown, Modal, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Context
import { Context, PRE } from '../../App'

// Style
import './SiteHeader.css';

// Components
import logo from './logo.png'

// Core
import { checkLogin, logout, getLoginUsername } from '../../core/login'
import ChangeLocaleComponent from '../../core/language';

const { Search } = Input;

const SiteHeader = ({children, show_search, title, handbook_search, question_search}) => {

    let match = useRouteMatch();

    const [ is_login, setIsLogin ] = React.useState(checkLogin())

    let user_name = getLoginUsername()
    const [ new_password, setNew_password ] = React.useState("")
    const [ old_password, setOld_password ] = React.useState("")
    const [ visibility, setVisibility] = React.useState(false)
    const [ search_value, setSearch ] = React.useState("")
    const [ search_type, setType ] = React.useState("")

    const bodyData={
        user_name:getLoginUsername(),
        new_password,
        password:old_password
    }

    const postPassword = () =>{
        fetch(PRE+'/alter-user-info/', 
            {
                method:"POST",
                body:JSON.stringify(bodyData)
            })
            .then(response=>{
                if (response.status===200) {
                    alert("成功修改密码！")
                    return response.json()
                }
                else{
                    message.error("对不起，修改密码失败")
                }
            })
            .then(data=>{
                console.log(data)
            })
        }

    React.useEffect(()=>{
    },[])


    function handleMenuClick(e) {
        switch (e.key){
            case 'profile':
                window.open('/teapal/teapal-profile/'+user_name)
                break
            case 'logout':
                logout()
                setIsLogin(checkLogin())
                break
            case 'editPassword':
                setVisibility(true)
                break
            default:
                console.log("Unknown Action")
        }
    }

    return (
        <Context.Consumer>{context=>
            <header className="Site-header">
                <div className="Home-header-center">
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center",Width:'500px',maxWidth:'80vw'}}>
                        
                        <div className="Home-title">
                            <a href="/teapal">
                                <div className="Home-logo-container">
                                    <img src={logo} className="Home-logo" alt="logo"/>
                                </div>
                            </a>
                            <Dropdown overlay={
                                <Menu style={{backgroundColor:'#5b2082'}}>
                                    <div className="Header-dropdown">
                                        <Button href={`${match.url}/`} type="link" size={"large"} ghost>
                                            {title}
                                        </Button>
                                        {children}
                                    </div>
                                </Menu>
                            } trigger={document.body.clientWidth<=600?['click']:[]}>
                                <a href={`${match.url}`}>
                                    <div className="Home-title-text">{title}</div>
                                </a>
                            </Dropdown>
                        </div>
                        
                        <div className="Header-children" style={{marginLeft:20,display:"flex",flexDirection:"row"}}>
                            {children}
                        </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center"}}>
                        
                        {show_search&&
                            <Search
                            className="Header-search"
                            style={{maxWidth:'20vw', marginRight:20, flex:1}}
                            value={search_value}
                            onChange={e=>{setSearch(e.target.value)}}
                            placeholder={context.locale.locale==='en'?'input search text':'全站搜索'}
                            onSearch={() => search_value===""?null:window.location.href=`/search/`+search_type+'/'+search_value}
                            enterButton />
                        }
                        {handbook_search&&setType("handbook")}
                        {question_search&&setType("question")}
                        
                        <ChangeLocaleComponent
                            changeLocale={context.changeLocale}
                            locale={context.locale}
                        />

                        <Dropdown overlay={
                            is_login?(
                                <Menu onClick={handleMenuClick}>
                                    <Menu.Item key="profile">{context.locale.locale==='en'?'Profile':'账号信息'}</Menu.Item><Menu.Divider />
                                    <Menu.Item key="editPassword">{context.locale.locale==='en'?'Edit Password':'修改密码'}</Menu.Item>
                                    <Menu.Item key="logout">{context.locale.locale==='en'?'Log Out':'登出'}</Menu.Item>
                                    
                                </Menu>
                            ):(
                                <Menu>
                                    <Menu.Item key="login">
                                        <a href="/login">
                                            {context.locale.locale==='en'?'Login / Sign up':'登陆或注册'}
                                        </a>
                                    </Menu.Item>
                                </Menu>
                            )}
                            >
                            <Button style={{marginLeft:'1vw'}} type="primary" shape="circle" icon={<UserOutlined />} size={'large'} />
                        </Dropdown>
                    </div>
                </div>
                <Modal 
                    title={context.locale.locale==='en'?'Edit Password':'修改密码'}
                    visible={visibility}
                    onOk={postPassword}
                    onCancel={()=>setVisibility(false)}
                >   
                    <div>{user_name?user_name:"Loading..."}</div>
                    <br/>
                    <Input style={{width:400}} placeholder="请输入旧密码" value={old_password} onChange={e=>{setOld_password(e.target.value)}}/>
                    <br/><br/>
                    <Input style={{width:400}} placeholder="请输入新密码" value={new_password} onChange={e=>{setNew_password(e.target.value)}}/>
                </Modal>
            </header>
        }</Context.Consumer>
    )
}

export default SiteHeader