import React from 'react'
import './Questionaire.css'
import { Carousel, /*Form,*/ Input, Button, Spin, message,Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import {PRE} from '../../App'
import { getLoginUsername } from '../../core/login'

function Questionaire() {
    //const [ login_form ] = Form.useForm();
    const ref_1=React.createRef()
    const [ gender, setGender ] = React.useState(undefined)
    const [ school, setSchool ] = React.useState(undefined)
    const [ college, setCollege ] = React.useState(undefined)
    const [ intro, setIntro ] = React.useState(undefined)
    const [ year, setYear ] = React.useState(undefined)
    const [ done, setDone ] = React.useState(false)
    const [ pare_result, setPareResult ] = React.useState([])

    console.log(school)
    
    const postProfile=()=>{
        const bodyData={
            user_name:getLoginUsername(),
            gender,
            school,
            college,
            year:parseInt(year),
            intro
        }
        fetch(PRE+"/alter-user-info/",{method:"POST",body:JSON.stringify(bodyData)})
        .then(response=>{
            if (response.status===200) {
                return response.text()
            }
        })
        .then(data=>{
            if(data){
                console.log(data)
                message.success("成功更新个人信息！")
                //window.location.href="/teapal"
                fetch(PRE+'/pair/'+getLoginUsername())
                .then(res=>{
                    if(res.status===200){
                        return res.json()
                    }
                }).then(data=>{
                    if(data){
                        setPareResult(data.result)
                        setDone(true)
                    }
                })
                
            }
        })
    }

    let ref_2 = React.createRef()
    let ref_3 = React.createRef()
    let ref_4 = React.createRef()
    let ref_5 = React.createRef()
    let ref_6 = React.createRef()

    //let refs = [ref_2,ref_3,ref_4,ref_5,ref_6]

    //const onChange = c => {
    //    refs[c].current.focus()
    //}

    //React.useEffect(()=>{
    //    if(ref_2.current){ref_2.current.focus()}
    //},[])

    return(
        <div>
            <img alt="bg" className="bg-img" src="http://106.52.96.163/img/20010819001_40.jpg"/>
            <Carousel ref={ref_1} className="background" dots={false} autoplay={false} >
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>你的学院是:</h1>
                    <div className="input-wrapper">
                        <Input ref={ref_2} onPressEnter={()=>{if (school) {ref_1.current.next()}} } value={school} onChange={e=>{setSchool(e.target.value)}} bordered={false}/>
                    </div><br/>
                    <Button onClick={()=>{if (school) {ref_1.current.next()}} } type="primary" >下一个</Button>
                </div>
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>你的书院是:</h1>
                    <div className="input-wrapper">
                        <Input ref={ref_3} onPressEnter={()=>{if (college) {ref_1.current.next()}} } value={college} onChange={e=>{setCollege(e.target.value)}} bordered={false}/>
                    </div><br/>
                    <Button onClick={()=>{if (college) {ref_1.current.next()}} } type="primary" >下一个</Button>
                </div>
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>你的年级是:</h1>
                    <div className="input-wrapper">
                        <Input ref={ref_4} onPressEnter={()=>{if (year) {ref_1.current.next()}} } value={year} onChange={e=>{setYear(e.target.value)}} bordered={false}/>
                    </div><br/>
                    <Button onClick={()=>{if (year) {ref_1.current.next()}} } type="primary" >下一个</Button>
                </div>
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>你的性别是:</h1>
                    <div className="input-wrapper">
                        <Input ref={ref_5} onPressEnter={()=>{if (gender) {ref_1.current.next()}} } value={gender} onChange={e=>{setGender(e.target.value)}} bordered={false}/>
                    </div><br/>
                    <Button onClick={()=>{if (gender) {ref_1.current.next()}} } type="primary" >下一个</Button>
                </div>
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>写个简单的自我介绍吧:</h1>
                    <div className="input-wrapper">
                        <Input ref={ref_6} onPressEnter={()=>{if (intro) {postProfile();ref_1.current.next()}} } value={intro} onChange={e=>{setIntro(e.target.value)}} bordered={false}/>
                    </div><br/>
                    <Button onClick={()=>{if (intro) {postProfile();ref_1.current.next()}} } type="primary" >提交</Button>
                </div>
                <div className="question-page">
                    <h1 style={{color:"#73389b"}}>智能推荐好友</h1>
                    <span style={{color:"#73389b"}}>恭喜你完成了个人信息的填写！请稍等片刻，茶侣平台将使用智能算法来为您推荐与您志同道合的朋友</span>
                    
                    {done?
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            alignItems:'center',
                            marginTop:'20px',
                            color:"#73389b"
                        }}>推荐结果
                            <div className="Pal-recommendation">
                                {pare_result.map(item=>(
                                    <div className="Pal-recommendation-item">
                                        <Avatar size={64} style={{minWidth:64}} icon={item.avatar?null:<UserOutlined/>} src={item.avatar||undefined}></Avatar>
                                        <div className="Pal-recommendation-item-discription">
                                            <span>{item.user_name}</span>
                                            <span>{"学院："+item.school+"， 书院："+item.college}</span>
                                            <span>{"个人简介"+item.intro}</span>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                            <Button onClick={()=>{if (intro) {postProfile()}} } type="primary">一键关注</Button>
                        </div>
                    :
                        <Spin></Spin>
                    }
                </div>
            </Carousel>
        </div>
    )
}

export default Questionaire
