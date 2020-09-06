import React from 'react'

import './Chat.css'

import InfiniteScroll from 'react-infinite-scroller';

import ChatFlowItem from './ChatFlowItem'
import { getQuote, getSendType, clearQuote } from '../../core/quote';

import { Input, Button, Tooltip, Spin, message } from 'antd'
import { EllipsisOutlined, PictureOutlined, UserOutlined } from '@ant-design/icons';

import { Context } from '../../App'
import Avatar from 'antd/lib/avatar/avatar';

import { useLocation } from "react-router-dom";
import { PRE } from '../../App'
import { getLoginUsername } from '../../core/login';
import { chatData } from '../../data';



const { TextArea } = Input;

const Chat = () => {

    let ref = React.useRef()
    let input_ref = React.useRef()

    const [ chat_id, setChatId ] = React.useState(new URLSearchParams(useLocation().search).get('chat_id'))
    const [ to_user, setToUser ] = React.useState(undefined)
    const [ has_more, setHasMore ] = React.useState(false)
    const [ loading, setLoading ] = React.useState(false)
    const [ messages, setMessages ] = React.useState([])
    const [ recall_cache, setRecallCache ] = React.useState('')
    const [ quote, setQuote ] = React.useState(getQuote())
    const [ content, setContent ] = React.useState("")
    const [ sending, setSending ] = React.useState(false)

    const [ all_chat, setChats ] = React.useState([])

    const [ timers, setTimer ] = React.useState([])
    const [ ready, setReady ] = React.useState(false)
    const [ current_pages, setCurrentPages] = React.useState(0)

    const [ ano_avatar, setAnoAvatar ] = React.useState(null)
    const [ avatar, setAvatar ] = React.useState(null)

    const REFRESH = 5000 // 每5000毫秒刷新一次消息
    const PAGE = 30 //每次加载30条消息

    const getLatestMessages = (scroll=false) => {
        // 为了以防万一，再次清除全部停止定时器
        for(let i in timers){ clearInterval(timers[i])}
        if(chat_id){
            fetch(PRE+"/chat-message/"+chat_id+"/", { method:'GET' })
            .then(response => {
                if (response.status===200) {
                    return response.json()
                }else{
                    message.error("发生未知错误")
                }
            })
            .then(data=>{
                // console.log("Latest Messages：",data) //去掉此注释可以看到每6秒一次的刷新
                setMessages(messages.reverse().slice(PAGE).reverse().concat(data.result.reverse()))
                setCurrentPages(current_pages+1)
                if(scroll&&ref.current!=null){ref.current.scrollIntoView({behavior: ready?"smooth":"auto"})}//初次加载时还要将页面滚动至底端
            })
            .catch(error => {
                message.error(error.message)
            })
        }
    }

    React.useEffect(()=>{
        // 页面初次加载时，载入最新消息一次
        //for(let i in timers){ clearInterval(timers[i]) }
        getLatestMessages(true)
        getChats()
        
        // eslint-disable-next-line
    },[])

    let chat = true

    /* 每次消息列表更新时 */
    React.useEffect(()=>{
        // 清除全部定时器
        for(let i in timers){ clearInterval(timers[i]) }
        // 设置新定时器
        setTimer(timers.concat([setInterval(() => {
            if(chat){ // 确保页面离开后不会继续定时
                getLatestMessages()
            }
        }, REFRESH)]))
        // 允许载入新页面
        setReady(true)
        // eslint-disable-next-line
    },[messages])

    const getNextMessages = () => {
        if(ready){
            setLoading(true)
            fetch(PRE+"/messages/"+(current_pages+1), { method:'GET' })
            .then(response => {
                if (response.status===200) {
                return response.json()
                }else{
                    message.error("服务器响应错误，请检查网络连接！")
                    return {result:[]}
                }
            })
            .then(data=>{
                console.log("Next Question",data)
                if(data.result.length===0){
                setHasMore(false)
                }else{
                setMessages(data.result.reverse().concat(messages))
                setCurrentPages(current_pages+1)
                }
                setLoading(false)
            })
            .catch(error => {
                message.error(error.message)
            })
        }
    }

    const deleteChatMessage = () => {
        console.log("Recall chat message")
    }

    const postChatMessage = () => {
        setSending(true)
        fetch(PRE+'/chat-message/',{
            method:'POST',
            body:JSON.stringify({
                user_name:getLoginUsername(),
                chat_id:parseInt(chat_id),
                to_user,
                content
            })
        }).then(res=>{
            if(res.status===200){
                setContent("")
            }else{
                message.error("消息发送失败")
            }
            setSending(false)
            getLatestMessages(true)
        })
    }

    const getChats = () => {
        fetch(PRE+'/chat/'+getLoginUsername()+'/')
        .then(response=>{
            if(response.status===200){
                return response.json()
            }else{
                message.error("发生了未知错误")
            }
        }).then(data=>{
            if (data!==undefined) {
                setChats(data.result)
                console.log(data)
                setToUser( chat_id?data.result.find(chat=>(chat.chat_id.toString() === chat_id)).ano_user:undefined )
                setAvatar( chat_id?data.result.find(chat=>(chat.chat_id.toString() === chat_id)).avatar:undefined )
                setAnoAvatar( chat_id?data.result.find(chat=>(chat.chat_id.toString() === chat_id)).ano_avatar:undefined )
                if(!chat_id){window.location.href='/teapal/chat?chat_id='+data.result[0].chat_id}
            }
        })
    }
    
    return (
        <Context.Consumer>{context=>
            <div className="Chat">

                <div className="Chat-list">
                    <div className="Chat-list-title">
                        {"全部会话"}
                    </div>
                    <div className="Chat-list-content">
                        {all_chat.map(item=>(
                            <div
                                className="Chat-list-item hoverable"
                                style={chat_id===item.chat_id.toString()?{backgroundColor:"#00000022",cursor:'pointer'}:{cursor:'pointer'}}
                                onClick={()=>{window.location.href="/teapal/chat?chat_id="+item.chat_id}}
                            >
                                <Avatar icon={item.ano_avatar?null:<UserOutlined/>} src={item.ano_avatar}></Avatar>
                                <div className="Chat-list-item-content">
                                    <span className="Chat-list-item-title-text">{item.ano_user}</span>
                                    <span className="Chat-list-item-latest-text">{item.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="Chat-detail">
                    <div className="Chat-title">
                        {to_user}
                        <Button icon={<EllipsisOutlined />} type="text"></Button>
                    </div>
                    <div className="Chat-flow" style={{overflowY:"scroll"}}>
                        <InfiniteScroll
                            initialLoad={false}
                            isReverse
                            loadMore={getNextMessages}
                            hasMore={!loading && has_more}
                            useWindow={false}
                            threshold={10}
                        >
                            <div className="Chat-flow-content">
                                <div className="Chat-flow-header">{has_more?loading?<Spin></Spin>:"滚动显示更多":"已显示全部消息"}</div>
                                {messages.map(item =>
                                    <ChatFlowItem 
                                        item={item}
                                        key={item.message_id}
                                        deleteChatMessage={deleteChatMessage}
                                        setRecallCache={setRecallCache}
                                        avatar={avatar}
                                        ano_avatar={ano_avatar}
                                    />
                                )}
                                <div className="Chat-flow-footer" ref={ref}><label>已显示最新消息</label></div>
                            </div>
                        </InfiniteScroll>
                    </div>
                    <div className="Chat-input">
                        <div className="Chat-input-menu">
                            <Tooltip title="功能开发中">
                                <Button type="text" icon={<PictureOutlined />} size="large"></Button>
                            </Tooltip>
                            <div className="Chat-input-menu-right"></div>
                        </div>
                        <TextArea 
                            ref={input_ref}
                            className="Qflow-interaction-input"
                            autoSize={{ minRows: (recall_cache||quote)?3:5, maxRows: (recall_cache||quote)?3:5 }}
                            value={content}
                            onChange={e=>{setContent(e.target.value)}}
                            onPressEnter={postChatMessage}
                            bordered={false}
                        />
                        <div className="Chat-input-action">
                            <div className="Chat-input-action-left"></div>
                            <Button type="primary" onClick={postChatMessage} loading={sending}>发送</Button>
                        </div>
                    </div>
                </div>
            </div>
        }</Context.Consumer>
    )
}

export default Chat