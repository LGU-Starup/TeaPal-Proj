import React from 'react'
import './ActivityGroup.css'
import { Tabs, Col, Row } from 'antd'
import jerry from '../pal-space/jerry.jpg'
import tom from '../pal-space/tom.jpg'
import {PRE} from '../../App'
const activity=[
    {
        name:"猫捉老鼠",
        period:"2020年9月-10月",
        identity:"猫",
        img: jerry
    },
    {
        name:"老鼠捉猫",
        period:"2020年9月-10月",
        identity:"老鼠",
        img: tom
    },
]
const members=[
    {
        name:"汤姆",
        identity:"队长",
        img: null,
    },
    {
        name:"泰罗",
        identity:"组员",
        img: null,
    },
    {
        name:"迪迦",
        identity:"组员",
        img: null,
    },
    {
        name:"杰瑞",
        identity:"组员",
        img: null,
    },
]

function ActivityGroup() {
    const {TabPane} = Tabs;
    return(
        <div className="activity-group">
            <Tabs size="large" tabPosition="left">
                <TabPane key="1" tab="我的活动">
                    {activity.map(item=>(
                        <Row className="activity-content heavy-shadow">
                            <Col><img style={{width:"150px",height:"150px"}} src={item.img}/></Col>
                            <Col>
                                <Row style={{marginTop:"10px",marginLeft:"10px",fontSize:"20px"}}>
                                    {item.name}
                                </Row>
                                <Row style={{marginTop:"10px",marginLeft:"10px"}}>
                                    {item.period}
                                </Row>
                                <Row style={{marginTop:"10px",marginLeft:"10px"}}>
                                    {"参赛身份："+item.identity}
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </TabPane>
                <TabPane key="2" tab="我的小组">
                    {members.map(item=>(
                        <Row style={{marginTop:"10px"}}>
                            <Col><img style={{width:"100px",height:"100px"}} src={item.img}/></Col>
                            <Col>
                                <Row style={{marginTop:"10px",marginLeft:"10px",fontSize:"20px"}}>
                                    {item.name}
                                </Row>
                                <Row style={{marginTop:"10px",marginLeft:"10px"}}>
                                    {"身份："+item.identity}
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </TabPane>
            </Tabs>
        </div>
    )
}

export default ActivityGroup