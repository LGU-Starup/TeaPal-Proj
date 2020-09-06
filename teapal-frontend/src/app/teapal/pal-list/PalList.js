import React from 'react'
import './PalList.css'
import { List, Avatar, Tabs, Button } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

import {PRE} from '../../App'
import { getLoginUsername } from '../../core/login';
import { startChat } from '../../core/chat';
const {TabPane} = Tabs

const data = [
  {
    title: 'Tom',
  },
  {
    title: 'Jason',
  },
  {
    title: 'YHWH',
  },
  {
    title: '小明',
  },
];



const PalList = () => {

  const [ follow, setFollow ] = React.useState([])
  const [ follower, setFollower ] = React.useState([])
  
  const getFollow = () => {
    fetch(PRE+'/friendship/follow/'+getLoginUsername()+'/')
    .then(res=>{
      if (res.status===200){
        return res.json()
      }
    }).then(data=>{
      if(data){
        setFollow(data.result)
      }
    })
  }
  
  const getFollower = () => {
    fetch(PRE+'/friendship/follower/'+getLoginUsername()+'/')
    .then(res=>{
      if (res.status===200){
        return res.json()
      }
    }).then(data=>{
      if(data){
        setFollower(data.result)
      }
    })
  }

  
  
  React.useEffect(()=>{
    getFollow()
    getFollower()
  },[])


    return (
        <div className="pal-list">
            <Tabs>
                <TabPane key="1" tab="我关注的">
                    <List
                        itemLayout="horizontal"
                        dataSource={follow}
                        renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                              title={item.user_name}
                            />
                            <Button type="text" onClick={()=>startChat(item.user_name)}><CommentOutlined/>私信</Button>
                        </List.Item>
                        )}
                    />
                </TabPane>
                <TabPane key="2" tab="关注我的">
                    <List
                        itemLayout="horizontal"
                        dataSource={follower}
                        renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={item.user_name}
                            />
                            <Button type="text" onClick={()=>startChat(item.user_name)}><CommentOutlined/>私信</Button>
                        </List.Item>
                        )}
                    />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default PalList