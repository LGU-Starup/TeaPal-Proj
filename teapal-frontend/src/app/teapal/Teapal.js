import React from 'react'
import './Teapal.css'
import SiteHeader from '../components/SiteHeader/SiteHeader'
import { Button, Row, Dropdown, Modal } from 'antd'

import { Context } from '../App'
import { getLoginUsername, checkLogin } from '../core/login'

import {
    Switch,
    Route,
    useRouteMatch
} from "react-router-dom";

import Loading from '../Loading';
import Loadable from 'react-loadable';
import Discovery from './discovery/Discovery'
import PalSpace from './pal-space/PalSpace'
import ActivityGroup from './activity-group/ActivityGroup'
import Questionaire from './questionaire/Questionaire'
import { PRE } from '../App'


const Chat = () => {

    let match = useRouteMatch();

    const [ show_modal, setModal ] = React.useState(false)

    const TeapalProfile = Loadable({
        loader: () => import('./teapal-profile/TeapalProfile'),
        loading: Loading,
    });

    const Chat = Loadable({
        loader: () => import('./chat/Chat'),
        loading: Loading,
    });

    const PalList = Loadable({
        loader: () => import('./pal-list/PalList'),
        loading: Loading,
    });
    
    const TeapalFrontpage = Loadable({
        loader: () => import('./teapal-frontpage/TeapalFrontpage'),
        loading: Loading,
    });

    const checkComplet = () => {
        fetch(PRE+"/user-info-completeness/")
          .then(response=>{
              if (response.status===200) {
                  return response.json()
              }
          })
          .then(data=>{
              if(data){
                  if(data.completeness<0.5&&(!window.location.href.endsWith('questionaire'))){
                    //alert("请完善用户信息"+window.location.href)
                    window.location.href="/teapal/questionaire"
                  }
                 
              }
          })
      }

    React.useEffect(()=>{
        if(checkLogin()===false){
            setModal(true)
        }
        checkComplet()
    },[])

    return(
        <Context.Consumer>{context=>
            <div className="Teapal">
                
                <Modal
                    centered
                    visible={show_modal}
                    closable={false}
                    keyboard={false}
                    footer={null}
                >
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                        <h2>{context.locale.locale==='en'?'Welcome to TeaPal!':'欢迎来到TeaPal-茶侣校园交友平台!'}</h2>
                        <p>{context.locale.locale==='en'?'For better user experience, please log in ~':'为了获得更好的用户体验，请先登录～'}</p>
                        <Button type="primary" onClick={()=>{window.location.href="/login"}}>去登陆/注册</Button>
                    </div>
                </Modal>
                
                <SiteHeader
                    title={context.locale.locale==='en'?'TeaPal - Online Social':'茶侣-结识挚友'}
                >
                    <Button href={`${match.path}/chat`} type="link" size={"large"} ghost className="Menu-item">
                        {context.locale.locale==='en'?'Chat Box':'私信'}
                    </Button>
                    <Dropdown trigger={['click']} overlay={
                        <div style={{ display:'flex',flexDirection:'column',backgroundColor:" #5b2082",padding:'10px',borderRadius:'10px'}}>
                            
                            <Button href={`${match.path}/activity-group`} ghost type="link" size={"large"} className="Menu-item">
                                {context.locale.locale==='en'?'activity group':'活动小组'}
                            </Button>

                            <Button href={`${match.path}/pal-list`} ghost type="link" size={"large"} className="Menu-item">
                                {context.locale.locale==='en'?'Pal List':'好友列表'}
                            </Button>
                            
                        </div>
                    }>
                        <Button type="link" size="large" ghost className="Menu-item">
                            {context.locale.locale==='en'?'Pal':'我的好友'}
                        </Button>
                    </Dropdown>
                    <Button href={`${match.path}/discovery`} type="link" size={"large"} ghost className="Menu-item">
                        {context.locale.locale==='en'?'Discovery':'互动广场'}
                    </Button>
                    <Button href={`${match.path}/teapal-profile/${getLoginUsername()}`} type="link" size={"large"} ghost className="Menu-item">
                        {context.locale.locale==='en'?'Profile':'个人主页'}
                    </Button>
                </SiteHeader>

                <div style={{flex:1,display:'flex',flexDirection:'column',alignSelf:'center' }}>
                    <Switch>
                        <Route path={`${match.path}/teapal-profile/:user_name`}>
                            <TeapalProfile/>
                        </Route>
                        <Route path={`${match.path}/questionaire`}>
                            <Questionaire/>
                        </Route>
                        <Route path={`${match.path}/pal-list`}>
                            <PalList/>
                        </Route>
                        <Route path={`${match.path}/activity-group`}>
                            <ActivityGroup/>
                        </Route>
                        <Route path={`${match.path}/pal-space`}>
                            <PalSpace/>
                        </Route>
                        <Route path={`${match.path}/discovery`}>
                            <Discovery/>
                        </Route>
                        <Route path={`${match.path}/chat`}>
                            <Chat/>
                        </Route>
                        <Route path={`${match.path}`}>
                            <TeapalFrontpage/>
                        </Route>
                    </Switch>
                </div>

                <footer className="Home-footer">
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <p style={{marginTop:10}}>@copyright TeaBreak Team 2020</p>
                    </Row>
                </footer>
            </div>
        }</Context.Consumer>
    )
}

export default Chat