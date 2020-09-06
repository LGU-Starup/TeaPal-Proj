import React from 'react';

import { Context, PRE } from '../../App'

import { Button, Carousel, Card, List, message} from 'antd';

//import PassageList from '../../components/PassageList/PassageList'
import { recommendation, pal_recommendation } from '../../data';

import './TeapalFrontpage.css'


const TeapalFrontpage = () => {
    
  const [ hottest_questions, setHottestQuestions ] = React.useState([])
  const getHottestQuestions = () => {
    fetch(PRE+'/questions/hottest/',{method:'GET'})
    .then(response => {
        return response.json()
    })
    .then(data => {
        console.log(data)
        setHottestQuestions(data.result.slice(0,3))
    })
    .catch(error => {
        message.error(error.message)
    })
  }

  React.useEffect(()=>{
    getHottestQuestions()
  },[])

    return (
        <Context.Consumer>
        {context=>
            <div className="Home">
            <Carousel className='Lamp' autoplay >
                <img alt="banner" src="https://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/WechatIMG1527.jpeg"/>
            </Carousel>

            <div className="Home-section-title">
                <h2 style={{color:"white"}}>茶室交友功能正式开放使用</h2>
                <p>我们提供交互式的交友平台，便于学生之间交流合作</p>
            </div>

            <div className='Home-section'>
                <div className='Home-content'>
                <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 3 }}
                    dataSource={recommendation.slice(0,3)}
                    footer={
                    <Button className="shadow" style={{marginTop:'20px',marginBottom:'30px',width:'120px'}} size='large' type='primary' onClick={()=>{window.location.href="/teapal/discovery"}}>进入互动广场</Button>
                    }
                    renderItem={item => (
                    <List.Item style={{cursor:'pointer'}} onClick={()=>{}}>
                        <Card className="heavy-shadow" hoverable style={{height:'200px'}} title={item.title}>{item.description.slice(0,70)}</Card>
                    </List.Item>
                    )}
                />
                </div>
            </div>
                
            <div className="Home-section-title">
                <h2 style={{color:"white"}}>茶侣平台策划的活动</h2>
                <p>我们精心准备了一系列趣味而有意义的活动，你可以在互动广场报名参加你感兴趣的活动</p>
                <p>同时我们也会为活动的积极参与者提供丰厚的奖品</p>
            </div>
            <div>
                <div className="home-text ">
                欢迎来到美丽的香港中文大学深圳<br/>
                无论你来自何方,为了追寻人生的价值已及对学问的向往,在因缘际会下,我们有幸在这里一聚<br/>
                无论你是家长陪同还是独自一人来报到,来到校园里,请你尽管放宽心,迎接你们的是精彩的生活<br/>
                学长学姐们会为你提供热情周到的服务,无论你碰到任何困难,问题或者是有好的心情,都可以在这里及时得告诉他们<br/>
                在这里,不仅在生活上可以得心应手,在繁重的课业上,也必能游刃有余,能在这里享受充实而愉悦的大学四年<br/>
                </div>
                <img className="home-img" src="http://ciwk-1301216399.cos.ap-guangzhou.myqcloud.com/post-img-1596682483650"/>
            </div>
            </div>
        }
    </Context.Consumer>
    )
}

export default TeapalFrontpage