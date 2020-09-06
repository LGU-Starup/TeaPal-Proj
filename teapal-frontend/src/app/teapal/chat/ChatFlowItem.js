import React from 'react';

import { List, Avatar } from 'antd';

import { UserOutlined } from '@ant-design/icons';

import './Chat.css'

import QuoteBlock from './QuoteBlock'

import { Menu, Dropdown } from 'antd';
import { getLoginUsername } from '../../core/login';
import { isMobile } from '../../core/platformInfo'

const ChatFlowItem = ({ item, setReply, deleteQuestion, deleteAnswer, reply, setRecallCache, avatar, ano_avatar }) => {

    //console.log(avatar, ano_avatar)
    return(
        <List.Item>    
            <div className="Qflow-item" style={{flexDirection:item.from_user===getLoginUsername()?"row-reverse":"row"}}>
                {item.from_user===getLoginUsername()?
                    <Avatar size="large" icon={avatar?null:<UserOutlined/>} src={avatar} style={{minWidth:'40px'}}/>
                    :
                    <Avatar size="large" icon={ano_avatar?null:<UserOutlined/>} src={ano_avatar} style={{minWidth:'40px'}}/>
                }
                <div style={{display:"flex",flexDirection:"column"}}>
                    <label style={{marginLeft:10,marginRight:10,alignSelf:item.from_user===getLoginUsername()?"flex-end":"flex-start"}}>{item.from_user?item.from_user===getLoginUsername()?null:item.from_user:"Username"}</label>
                    <Dropdown 
                        overlay={
                            <Menu>
                                {item.from_user!==getLoginUsername()?null:
                                    <Menu.Item key="2" onClick={()=>{
                                        if(item.type==='Q'){
                                            if(reply){
                                                if(reply.type==='Q'||reply.question_id===item.question_id){
                                                    setReply(undefined)
                                                }
                                            }
                                            deleteQuestion(item.question_id)
                                        }else{
                                            deleteAnswer(item.answer_id)
                                        }
                                        setRecallCache(item.content)
                                    }}>
                                        撤回
                                    </Menu.Item>
                                }
                            </Menu>
                        }
                        trigger={isMobile()?['click','contextMenu']:['contextMenu']}
                    >
                    <div>
                        <div
                            className="Qflow-item-bubble"
                            style={{backgroundColor:item.type==='Q'?'#eea333':'#f0f0f0'}} 
                        >
                            <label
                                style={{cursor:'pointer'}}
                                className="Qflow-item-bubble-text"
                                onClick={isMobile()?undefined:()=>window.location.href="qwall/question/"+(item.type==='Q'?item.question_id:item.re.question_id)}
                            >
                                {item.type==="A"?<p className="response" style={{height:"15px"}}>{item.re.user_name}: {item.re.content.slice(0,10)}{item.re.content.length>10?'...':''}</p>:null}
                                {/*item.type==="A"?<hr className="response"/>:null*/}
                                {item.content}
                            </label>
                            {item.quote!==null?<QuoteBlock quote_info={JSON.parse(item.quote)} style={{margin:'10px',marginTop:'0px'}}/>:null}
                        </div>
                    </div>
                    </Dropdown>
                </div>
            </div>
        </List.Item>
    )
}

export default ChatFlowItem