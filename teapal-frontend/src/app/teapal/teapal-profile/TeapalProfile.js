import React from'react';
import './TeapalProfile.css';

import {
  Switch,
  Route,
  useRouteMatch,
  useParams
} from "react-router-dom";

import { Button, Row, Avatar, Tabs, List, message, Modal, Upload } from 'antd';
import { EditOutlined, LoadingOutlined, PlusOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons'
import EditInfo from '../../profile/editUserInfo/EditInfo';
import { getLoginUsername } from '../../core/login';
// import Menu, { MenuItem } from 'rc-menu';
import { Context,PRE } from '../../App'
import { beforeUpload, uploadAvator } from '../../core/profile'

import { startChat } from '../../core/chat'

const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

const { TabPane } = Tabs;

function UserInfo() {

    let match = useRouteMatch();
    let {user_name} = useParams()

    const [ user_publish, setUserPublish ] = React.useState(undefined)
    const [ answers, setAnswers ] = React.useState(undefined)
    const [ questions, setQuestions ] = React.useState(undefined)
    const [ page, setPage ] = React.useState(1)


    const getUserPublish = () => {
        fetch(PRE+'/handbook/user/'+user_name+'/',{ method:"GET" }).then(response => {
            if (response.status===200) {
              return response.json()
            } else if (response.status===500){
                message.error("服务器端发生了一些未知错误……")
            } else if (response.status===404){
                message.error("相关文章不存在！")
            } else if (response.status===502){
                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
            } else {
                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
            }
        })
        .then(data => {
            if(data){
                console.log(data)
                setUserPublish(data.result)
            }else{
                setUserPublish([])
            }
        })
        .catch(error => {
            message.error(error.message)
        })
    }

    const getQuestions = ()=>{
        fetch(PRE+'/questions/user/'+user_name+'/'+page, {method:"GET"})
        .then(response=>{
            if (response.status===200) {
                return response.json()
            } else if (response.status===500){
                message.error("服务器端发生了一些未知错误……")
            } else if (response.status===404){
                message.error("您将要查看的用户似乎已经不存在了！")
            } else if (response.status===502){
                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
            } else {
                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
            }
        })
        .then(data=>{
            if(data){
                console.log(data)
                setQuestions(data.result)
                setPage(data.current_page)
            }
        })
        .catch(error => {
            message.error(error.message)
        })
    }

    const getAnswers = ()=>{
        fetch(PRE+'/answers/question/user/'+user_name+'/', {method:"GET"})
        .then(response=>{
            if (response.status===200) {
                return response.json()
            } else if (response.status===500){
                message.error("服务器端发生了一些未知错误……")
            } else if (response.status===404){
                message.error("您将要查看的用户似乎已经不存在了！")
            } else if (response.status===502){
                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
            } else {
                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
            }
        })
        .then(data=>{
            if(data){
                console.log(data)
                setAnswers(data.result)
                setPage(data.current_page)
            }
        })
        .catch(error => {
            message.error(error.message)
        })
    }

    React.useEffect(()=>{
        getUserPublish()
        getQuestions()
        getAnswers()
        // eslint-disable-next-line
    },[])

    const followUser = () => {
        fetch(PRE+'/friendship/follow/',{
            method:'POST',
            body:JSON.stringify({
                user_name:getLoginUsername(),
                follow_user_name:user_name,
            })
        }).then(res=>{
            if(res.status===200){
                //window.location.href='/teapal/pal-list'
                message.success("成功关注！")
            }
        })
    }

    const deleteHandbook = handbook_id => {
        fetch(PRE+"/handbook/delete/",{
            method:'POST',
            body:JSON.stringify({
                user_name:getLoginUsername(),
                handbook_id,
            })
        }).then(response=>{
            if(response.status===200){
                message.success("文章已成功删除")
                getUserPublish()
            }else{
                message.error("删除文章失败")
            }
        })
    }

    return(
        <Context.Consumer>{context=>
            <div className="Profile-page">
                
                <Switch>
                    <Route path={`${match.path}/edit`}>
                        <EditInfo/>
                    </Route>
                    <Route path={`${match.path}`}>
                        <ShowProfile/>
                    </Route>
                </Switch>
                
                <div className="select-tool">
                    <Tabs size="large" tabBarGutter={30} type="line" style={{overflow: 'visible'}}>
                        <TabPane tab="文章" key="1">
                            <List
                                size="large"
                                dataSource={user_publish}
                                renderItem={item =>
                                    <List.Item
                                        className="hoverable"
                                        key={item.title}
                                        extra={
                                            <img
                                                width={220}
                                                alt="logo"
                                                src={item.images?item.images.length>0?item.images[0]:"https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png":"https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"}
                                            />
                                        }
                                    >
                                        <div>
                                            <List.Item.Meta
                                                title={<h2>{item.title}</h2>}
                                                description={item.user_name}
                                            />
                                            <p style={{marginTop:'10px'}}>{item.brief_content}</p>
                                        </div>
                                        <div>
                                        <Button type="link" href={"/handbook/edit/"+item.handbook_id}>
                                            编辑文章
                                        </Button>
                                        <Button type="link" onClick={()=>deleteHandbook(item.handbook_id)}>
                                            删除
                                        </Button>
                                        </div>
                                    </List.Item>
                                }
                            />
                        </TabPane>
                        <TabPane tab="回答" key="2">
                            {answers?answers.map(item=>(
                                <List
                                    className="hoverable"
                                    size="large"
                                    key={item.question_id+''}
                                    header={<h3 style={{marginLeft:'10px'}}>{"回答 "+item.user_name+" 的问题："+item.content}</h3>}
                                    style={{cursor:'pointer'}} 
                                    onClick={()=>{window.location.href=("/qwall/question/"+item.question_id)}}
                                    dataSource={item.answers}
                                    renderItem={item => 
                                        <List.Item onClick={()=>{window.location.href="/qwall/question/"+item.question_id}}>
                                            <List.Item.Meta
                                                title={<h4>{item.content}</h4>}
                                                description={"获赞数:"+item.like_cnt+"  被踩:"+item.dislike_cnt+"  发布日期:"+item.updated_time.slice(0,10)}
                                            />
                                        </List.Item>
                                    }
                                />
                            )):<List/>}
                        </TabPane>
                        <TabPane tab="提问" key="3">
                            <List
                                size="large"
                                header={<div>按提问日期排序</div>}
                                dataSource={questions}
                                renderItem={item => 
                                    <List.Item className="hoverable" style={{cursor:'pointer'}} onClick={()=>{window.location.href="/qwall/question/"+item.question_id}}>
                                        <List.Item.Meta
                                            title={<h2>{item.content}</h2>}
                                            description={"回答数:"+item.answer_cnt+" 发布日期:"+item.updated_time.slice(0,10)}
                                        />
                                    </List.Item>
                                }
                            />
                        </TabPane>
                        {user_name===getLoginUsername()?<TabPane tab="消息" key="4">
                            <Tabs size="small" type="line" tabPosition={'left'} style={{overflow: 'visible', width:"100%"}}>
                                <TabPane key="1" tab="点赞">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                            />
                                        </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane key="2" tab="评论">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                            />
                                        </List.Item>
                                        )}
                                    />
                                </TabPane>
                                <TabPane key="3" tab="私信">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.title}</a>}
                                            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                            />
                                        </List.Item>
                                        )}
                                    />
                                    <Button type="link">查看我的全部私信</Button>
                                </TabPane>
                            </Tabs>
                        </TabPane>:null}
                    </Tabs>
                </div>
                    
                <footer className="handbook-footer">
                    <Row style={{display:'flex',justifyContent:'center'}}>
                        <p style={{marginTop:20, color:"white"}}>@copyright TeaBreak Team 2020</p>
                    </Row>
                </footer>

            </div>
        }</Context.Consumer>
    )
}

function ShowProfile() {
    let match = useRouteMatch()
    let {user_name} = useParams()

    const [ user_info, setUserInfo ] = React.useState(undefined)

    const [ edit_avatar_modal, setShowEditAvatarModal ] = React.useState(false)

    const getUserInfo=()=>{
        fetch(PRE+'/user/'+user_name+'/',{method:"GET"})
        .then(response => {
            if (response.status===200) {
              return response.json()
            }
        })
        .then(data => {
            console.log(data)
            setUserInfo(data);
        })
        .catch(error => {
            message.error(error.message)
        })
    }

    React.useEffect(()=>{
        if (user_info===undefined){
            getUserInfo()
        }
    })

    const [ imageUrl, setImageUrl ] = React.useState()
    const [ loading, setLoading ] = React.useState(false)

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            /*getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );*/
            uploadAvator(info.file.originFileObj, url=>{
                setImageUrl(url)
                setLoading(false)
            })
        }
    };

    return(
        <div className="Profile">

            <Modal
                visible={edit_avatar_modal}
                onCancel={()=>{setShowEditAvatarModal(false)}}
                onOk={()=>{setShowEditAvatarModal(false);getUserInfo()}}
            >
                设置头像
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Modal>

            <Avatar
                shape="square"
                icon={user_info&&user_info.avatar?null:<UserOutlined/>}
                src={user_info&&user_info.avatar?user_info.avatar:undefined}
                size={100}
                onClick={()=>{
                    if(getLoginUsername()===user_name){
                        setShowEditAvatarModal(true);
                        setImageUrl(user_info.avatar)
                    }
                }}
            />

            <div className="Profile-info">
                
                <h1>{user_name?user_name:"Loading..."}</h1>
                
                <span >{user_info?user_info.year+"届":"Loading..."}</span>
                <span style={{marginLeft:20}}>性别：{user_info?user_info.gender?user_info.gender:"未知":"Loading..."}</span>
                <span style={{marginLeft:20}}>学院：{user_info?user_info.scholl?user_info.scholl:"未知":"Loading..."}</span>
                <span style={{marginLeft:20}}>书院：{user_info?user_info.college?user_info.college:"未知":"Loading..."}</span>
                <br/><br/>
                <span >{user_info?user_info.intro:"Loading..."}</span>
            </div>
            
            {getLoginUsername()===user_name?
                <Button type="link" href={`${match.url}/edit`} icon={<EditOutlined style={{fontSize:"large",color:"black"}}/>}>编辑个人信息</Button>
                :
                <Button type="primary" onClick={()=>{
                    startChat(user_name)
                }}><CommentOutlined/>私信</Button>
            }
            
        </div>
    )
}

export default UserInfo