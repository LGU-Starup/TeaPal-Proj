import React from 'react'
import "./EditInfo.css"
import {PRE} from '../../App'
import {
    useParams
  } from "react-router-dom";

import { Button,Col, Row, Avatar,Input, Select, message } from 'antd';
import { CompassOutlined, PlusOutlined,UploadOutlined } from '@ant-design/icons'
function EditInfo() {

    const { Option } = Select;

    const {user_name} = useParams()
    console.log(user_name)

    
    const [gender, setGender] = React.useState("")
    const [school, setSchool] = React.useState("")
    const [college, setCollege] = React.useState("")
    const [intro, setIntro] = React.useState("")

    const getUserInfo=()=>{
        fetch(PRE+'/user/'+user_name+'/',{method:"GET"})
        .then(response => {
            if (response.status===200) {
              return response.json()
            } else if (response.status===500){
                message.error("服务器端发生了一些未知错误……")
            } else if (response.status===404){
                message.error("您将要改的用户已经不存在了！")
            } else if (response.status===502){
                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
            } else {
                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
            }
        })
        .then(data => {
            if(data){
                setCollege(data.college)
                setGender(data.gender)
                setIntro(data.intro)
                setSchool(data.school)
            }
        })
        .catch(error => {
            message.error(error.message)
        })
    }
    React.useEffect(()=>{
        getUserInfo()
        // eslint-disable-next-line
    },[])

    const postProfile=()=>{
        let bodyData={
            user_name,
            gender,
            school,
            college,
            intro
        }
        fetch(PRE+"/alter-user-info/",{
            method:"POST",
            body:JSON.stringify(bodyData)
        })
        .then(response=>{
            if (response.status===200) {
                return response.json()
            } else if (response.status===500){
                message.error("您处于未登录状态？")
            } else if (response.status===404){
                message.error("您修改的用户已经不存在了！")
            } else if (response.status===502){
                message.error("服务器被马虎的技术仔关闭了！是不是正在进行后台升级呢？")
            } else {
                message.error("对不起，似乎发生了未知的错误，快联系技术仔来修复吧！")
            }
        })
        .then(data=>{
            if(data){
                alert("成功修改信息！")
                window.location.href="/profile"
            }
        })
    }

    return(
        <Row justify="center">
            <Row className="UserInfo-body" style={{marginTop:20,maxWidth:"94%", width:'1000px'}}>
                    <Col className="avatar">
                        <Avatar shape="square" style={{width:100,height:100}}>
                            <Button type="ghost" icon={<PlusOutlined/>} style={{width:100,height:100}} onClick={()=>message.info("上传头像的功能正在全力开发中！")}/>
                        </Avatar>
                    </Col>
                    <Col className="basic-info">
                        <Row className="user-name">
                            {user_name?user_name:"loading..."}
                        </Row>
                        <br/>
                        <Row className="user-attached">
                            <CompassOutlined style={{fontSize:"large",marginTop:4, marginRight:10}} />
                            <div>
                                <Select value={gender} style={{ width: 120 }} onChange={value=>setGender(value)}>
                                    <Option value="M">男</Option>
                                    <Option value="F">女</Option>
                                    <Option value="U">未知</Option>
                                </Select>
                                <Input style={{width:150,marginLeft:20}} placeholder="学院" value={school} onChange={e=>{setSchool(e.target.value)}}/>
                                <Input style={{width:150,marginLeft:20}} placeholder="书院" value={college} onChange={e=>{setCollege(e.target.value)}}/>
                                <br/><br/>
                                <Input style={{width:500}} placeholder="自我介绍" value={intro} onChange={e=>{setIntro(e.target.value)}}/>
                            </div>
                        </Row>
                    </Col>
                    <Col style={{alignSelf:"right",marginTop:110}}>
                        <Button onClick={postProfile} type="link" icon={<UploadOutlined style={{fontSize:"large",color:"black"}}/>}>保存个人信息</Button>
                    </Col>
                </Row>
        </Row>
    )
}

export default EditInfo