import React from 'react'

import './Discovery.css'
import { List, Carousel, Card, Button, Tooltip, Modal, Input, message, Alert } from 'antd'
import { SmileOutlined, HighlightOutlined, UserOutlined } from '@ant-design/icons';
import { recommendation, pal_recommendation } from '../../data';
import Avatar from 'antd/lib/avatar/avatar';
import {PRE} from '../../App'
import { getLoginUsername } from '../../core/login';
const { Meta } = Card;
const { TextArea, Search } = Input;
const PLACEHOLDER = "https://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/placeholder.png"


const Discovery = () => {
    let user_name = getLoginUsername()
    const [ current_carousel, setCurrentCarousel ] = React.useState(1)
    const [ moment, setMoment ] = React.useState(undefined)
    const [ page, setPage ] = React.useState(1)
    const [ visibility, setVisibility ] = React.useState(false)
    const [ content, setContent ] = React.useState(undefined)
    const [ pare_result, setPareResult ] = React.useState([])
    console.log(content)
    // console.log(PRE+"/moment/lattest/"+page+"/")

    const followUser = (follow_user_name) => {
        fetch(PRE+'/friendship/follow/',{
            method:'POST',
            body:JSON.stringify({
                user_name:getLoginUsername(),
                follow_user_name,
            })
        }).then(res=>{
            if(res.status===200){
                //window.location.href='/teapal/pal-list'
                message.success("成功关注！")
            }
        })
    }

    const getMoment=()=>{
        fetch(PRE+"/moment/lattest/"+page,{method:"GET"})
        .then(response=>{
            if (response.status===200) {
                return response.json()
            }
        })
        .then(data=>{
            if (data) {
                setMoment(data.result)
                console.log(data)
            }
        })
    }

    const postMoment=()=>{
        let bodyData={
            user_name,
            content
        };
        fetch(PRE+"/moment/", {method:"POST",body:JSON.stringify(bodyData)})
        .then(response=>{
            if (response.status===200) {
                return response.json()
            }
        })
        .then(data=>{
            alert("成功发布动态！")
        })
    }

    const getSuggestedUsers = () => {
        fetch(PRE+'/pair/'+getLoginUsername())
        .then(res=>{
            if(res.status===200){
                return res.json()
            }
        }).then(data=>{
            if(data){
                setPareResult(data.result)
            }
        })
    }

    React.useEffect(()=>{
        getMoment()
        getSuggestedUsers()
    },[])

    const searchUser = (text) => {
        fetch(PRE+'/search/user/'+text)
        .then(res=>{
            if(res.status===200){
                return res.json()
            }
        }).then(data=>{
            if(data){
                setPareResult(data.result)
            }
        })
    }

    return (
        <div className="Discovery">
            
            <div className="Discovery-title">
                互动广场
                <hr/>
            </div>

            <div className="Discovery-activities heavy-shadow">
                <div className="Carousel-container">
                    <Carousel afterChange={index=>setCurrentCarousel(index)} className="Carousel">
                        <img alt="banner" src="https://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/banner-terialer.jpeg" onClick={()=>window.location.href="/handbook/official/15"}/>
                    </Carousel>
                </div>
                <div className="Activity-menu">这是活动的描述文字<br/>哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
            </div>

            <div className="Discovery-section-title">
                新朋友
            </div>
            <Search
                placeholder="搜索茶友"
                size="large"
                style={{marginTop:'15px',marginBottom:'20px'}}
                onSearch={value => searchUser(value)}
                enterButton
            />
            <span className="Recommendation-indicator"><SmileOutlined /> 为您进行智能推荐用户</span>

            <div className="Pal-recommendation">
                {pare_result.map(item=>(
                    <div className="Pal-recommendation-item">
                        <Avatar size={64} style={{minWidth:64}} icon={item.avatar?null:<UserOutlined/>} src={item.avatar||undefined}></Avatar>
                        <div className="Pal-recommendation-item-discription">
                            <span>{item.user_name?item.user_name:"无用户名"}</span>
                            <span>{"学院："+item.school+"， 书院："+item.college}</span>
                            <span>{"个人简介"+item.intro}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="Discovery-section-title">
                好友动态
                <Button size="large" type="link" href={`/teapal/pal-space`}>查看全部好友动态</Button>
            </div>

            <List
                grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                dataSource={moment}
                renderItem={item =>
                    <List.Item >
                        <Card
                            className="shadow discovery-card"
                            hoverable 
                            cover={
                                <img
                                    alt="example"
                                    height={'150px'}
                                    src={item.poster===undefined?PLACEHOLDER:item.poster}
                                />
                            }
                        >
                            <Meta
                                avatar={<Avatar style={{cursor:'pointer'}} onClick={()=>window.location.href='/teapal/teapal-profile/'+item.user_name}/>}
                                title={<div>
                                    <span style={{cursor:'pointer'}} onClick={()=>window.location.href='/teapal/teapal-profile/'+item.user_name}>{item.user_name}</span>
                                    <Button size="small" style={{marginLeft:'10px'}} onClick={()=>followUser(item.user_name)}>关注</Button>
                                </div>}
                                description={item.content}
                                
                            />
                            
                        </Card>
                    </List.Item>
                }
            />

            

            <div className="Discovery-section-title">
                新发现
                <Button size="large" type="link">查看更多</Button>
            </div>
            
            <span className="Recommendation-indicator"><SmileOutlined /> 为您进行智能推荐的动态</span>
            <List
                grid={{ gutter: 16, xs: 2, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                dataSource={recommendation.slice(0,9)}
                renderItem={item =>
                    <List.Item style={{cursor:'pointer'}}>
                        <Card
                            className="shadow discovery-card"
                            hoverable 
                            cover={
                                <img
                                    alt="example"
                                    height={'150px'}
                                    src={item.poster===undefined?PLACEHOLDER:item.poster}
                                />
                            }
                        >
                            <Meta
                                avatar={<Avatar/>}
                                title={item.title}
                                description={item.description}
                            />
                        </Card>
                    </List.Item>
                }
            />

            <div className="Discovery-section-end">
                <Button size="large" type="link" >查看更多推荐个性推荐内容</Button>
            </div>

            <Tooltip className="post-moment" title="发表动态">
                <Button size="large" type="primary" shape="circle" icon={<HighlightOutlined style={{fontSize:"25px"}} />} onClick={()=>{setVisibility(true)}}/>
            </Tooltip>

            <Modal title="发表动态" visible={visibility} closable={false} okText="发表" onCancel={()=>{setVisibility(false)}} onOk={()=>{postMoment()}}>
                <TextArea value={content} onChange={e=>{setContent(e.target.value)}} rows={4}/>
            </Modal>
        </div>
    )
}

export default Discovery