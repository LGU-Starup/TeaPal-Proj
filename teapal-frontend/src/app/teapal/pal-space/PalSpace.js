import React from 'react'
import './palSpace.css'

import { /*Space,*/ Avatar, Row, Col, Breadcrumb, PageHeader} from 'antd'
import { LikeOutlined, QqOutlined, CommentOutlined, HomeOutlined } from '@ant-design/icons';
import jerry from './jerry.jpg'
import tom from './tom.jpg'
import {goBack} from '../../core/navigation'

const moment=[
    {
        user_name:"汤姆",
        content:"今天我暴打了杰瑞一顿",
        img:tom,
        update_time: "2020年9月5日",
        like:"3",
        comment:"13"
    },
    {
        user_name:"杰瑞",
        content:"今天我被汤姆暴打了一顿",
        img:jerry,
        update_time: "2020年9月5日",
        like:"3",
        comment:"13"
    },
    {
        user_name:"奥利给",
        content:"遇到STA考试不要害怕，战胜恐惧最好的办法就是直面恐惧！",
        img:null,
        update_time: "2020年9月4日",
        like:"4",
        comment:""
    }
]

function PalSpace() {
    /*const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
    );*/
    return(
        <div className="pal-space">
                <PageHeader
                    style={{width:'100%', alignSelf:"stretch"}}
                    onBack={()=>{goBack("/")}}
                    subTitle={
                        <Breadcrumb >
                            <Breadcrumb.Item href="/">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="/handbook">
                                <span>萌新手册</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    }
                />
            <div className="pal-space-content">
                <div className="ps-title heavy-shadow">
                    <span>好友动态</span>
                </div>
                {moment.map(item=>(
                    <div className="moment-content heavy-shadow">
                        <Row>
                            <Row className="avatar">
                                <Col><Avatar size="large" shape="square" icon={<QqOutlined/>}/></Col>
                                <Col>
                                    <Row>&nbsp;&nbsp;&nbsp;{item.user_name}</Row>
                                    <Row className="update-time">&nbsp;&nbsp;&nbsp;{item.update_time}</Row>
                                </Col>
                            </Row>
                        </Row>
                        <Row className="text-content">
                            {item.content}
                        </Row>
                        <Row className="moment-img">
                            <img style={{width:"500px"}} src={item.img}/>
                        </Row>
                        <Row className="actions">
                            <Col style={{marginLeft:"80px"}}>
                                <LikeOutlined onClick={()=>{}} style={{fontSize:"large"}} />&nbsp;{item.like}
                            </Col>
                            <Col style={{marginLeft:"30px"}}>
                                <CommentOutlined onClick={()=>{}} style={{fontSize:"large"}} />&nbsp;{item.comment}
                            </Col>
                        </Row>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PalSpace