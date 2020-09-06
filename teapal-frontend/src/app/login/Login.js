import React from 'react'
import { Form, Input, Checkbox, Card, Button, message, Result, Modal, Spin } from 'antd'
import { MailOutlined } from '@ant-design/icons';

import './Login.css'

import { getUserInfo } from '../core/login'
import { goBack } from '../core/navigation';
import {PRE} from '../App'
const Login = () => {

    const [ user_name, setUserName ] = React.useState("")
    const [ user_name_validate, setUserNameValidate ] = React.useState("normal")
    const [ user_name_help, setUserNameHelp ] = React.useState(undefined)

    const [ modal_status, setModalStatus ] = React.useState('success')
    const [ email_modal_shown, setEmailModalShown ] = React.useState(false)
    const [ reset_psw_modal_shown, setResetPswModalShown ] = React.useState(false)
    const [ email_sent, setEmailSent ] = React.useState(false)
    const [ validate_success, setValidateSuccess ] = React.useState(false)
    const [ reset_success, setResetSuccess ] = React.useState(false)
    const [ old_psw, setOldPsw ] = React.useState("")
    const [ reset_form ] = Form.useForm();
    const [ code, setCode ] = React.useState("")

    const [ login_form ] = Form.useForm();
    const [ signup_form ] = Form.useForm();

    const loginFormItemLayout = {
        labelCol: {
            sm: { span: 6 },
        },
        wrapperCol: {
            sm: { span: 16 },
        },
    };

    const signupFormItemLayout = {
        labelCol: {
            sm: { span: 5 },
        },
        wrapperCol: {
            sm: { span: 16 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            sm: { offset: 10 },
        },
    };

    const Login = (formData) => {
        console.log("Log in")
        let user_name = formData.user_name
        let password = formData.password
        //const Encryption = require('Encryption')
        //password = Encryption.encrypt(password)
        const crypto = require('crypto');
        password = crypto.createHmac('sha256', password).digest('hex');
        let bodyData = {user_name,password}
        console.log(bodyData)
        fetch(PRE+"/login/", {
            method:'POST',
            body: JSON.stringify(bodyData),
        })
	    .then(response => {
            if (response.status===200) {
                return response.json()
            }else if(response.status===404){
                return {message:"User Doesn't Exist"}
            }else{
                return {message:"Unknown Error happened."}
            } 
        })
	    .then(data => {
            if(data.message==="login successfully"){
                console.log(data)
                message.success("Welcome Back, "+user_name+" !")
                //let token = "fheiqpnfioj2o0rj-131"
                let exp = new Date();
                exp.setTime(exp.getTime() + 30*24*60*60*1000);
                document.cookie = 'user_name='+user_name+";expires=" + exp.toGMTString()+";path=/";
                document.cookie = 'identity='+data.identity+";expires=" + exp.toGMTString()+";path=/";
                document.cookie = "is_login=true;expires=" + exp.toGMTString()+";path=/";
                //document.cookie = 'token='+token+";expires=" + exp.toGMTString();
                goBack()
            }else{
                message.warn(data.message)
            }
        })
    }

    const Signup = (formData) => {
        setModalStatus('success')
        if (user_name_validate==="success"){
            setEmailModalShown(true)
            let user_name = formData.new_user_name
            let email = formData.new_email
            let password = formData.new_password
            const crypto = require('crypto');
            password = crypto.createHmac('sha256', password).digest('hex');
            let bodyData = {user_name,email,password}
            fetch(PRE+"/user/", {
                method:'POST',
                body: JSON.stringify(bodyData),
            })
            .then(response => {
                if (response.status===200) { return response.json() }
                if (response.status===403&&response.statusText==="N-UNI") {
                    
                }
                else{ return { message:"Unknown Error happened."} } 
            })
            .then(data => {
                if (data!==undefined) {
                    if(data.message==="User register successfully"){
                    
                        // 发送验证邮件
                        bodyData={user_name,email}
                        fetch(PRE+"/email/send/", {
                            method:'POST',
                            body: JSON.stringify(bodyData),
                        })
                        .then(response => {
                            if (response.status===200) {
                                return response.text()
                            }else{
                                setModalStatus('error')
                                message.error("发送邮件失败")
                            } 
                        })
                        .then(data=>{
                            if(data){
                                let exp = new Date();
                                exp.setTime(exp.getTime() + 30*24*60*60*1000);
                                document.cookie = 'user_name='+data.user_name+";expires=" + exp.toGMTString()+"path=/";
                                document.cookie = 'identity='+data.identity+";expires=" + exp.toGMTString()+"path=/";
                                document.cookie = "islogin=ture;expires=" + exp.toGMTString()+"path=/";
                                setEmailSent(true)
                            }else{
                                alert("nothing")
                            }
                        })
    
                    }else{
                        message.warn(data.message)
                    }
                }
                else{message.error("该邮箱已被注册");setTimeout(() => {
                    window.location.href="/login"
                }, 1000);}
            })
    }else{
        message.error("请使用其他用户名注册")
        }
    }

    const validateUsername = e => {
        setUserName(e.target.value)
        setUserNameValidate("validating")
        console.log(e.target.value)
        if(e.target.value===""){
            setUserNameValidate("error")
            setUserNameHelp("User name must be set!")
        }else{
            getUserInfo(e.target.value).then(res=>{
                if(res===null){
                    setUserNameValidate("success")
                    setUserNameHelp(undefined)
                }else{
                    setUserNameValidate("error")
                    setUserNameHelp("This user name has been taken, try another!")
                }
            })
        }
    }
    
    const fogetPassword=()=>{
        setResetPswModalShown(true)
        setModalStatus('success')
        let user = login_form.getFieldValue("user_name")
        // 判断是否为邮箱
        let bodyData
        var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
        if (!reg.test(user)){
            bodyData = {user_name:user}
        }else{
            bodyData = {email:user}
        }
        fetch(PRE+'/reset-psw-email/send/',
            {
                method:"POST",
                body:JSON.stringify(bodyData)
                
            })
        .then(response=>{
            if (response.status===200) {
                setEmailSent(true)
                return response.text()
            }else if(response.status===403) {
                setModalStatus('error')
                message.error("发送邮件失败")
            }
        })
        .then(data=>{
            console.log(data)
        })
    }

    const validate = () => {
        fetch(PRE+"/email/validate/",{
            method:'POST',
            body:JSON.stringify({
                user_name:user_name,
                email_code:code
            })
        })
        .then(response => {
            if (response.status===200) {
                return response.text()
            }else if(response.status===403){
                message.warn("验证码错误")
            }
        })
        .then(data=>{
            if(data){
                message.success("邮箱验证成功！")
                setValidateSuccess(true)
            }
        })
    }

    const reset_psw_validate = () => {
        fetch(PRE+"/reset-psw-email/validate/",{
            method:"POST",
            body:JSON.stringify({user_name,email_code:code})
        })
        .then(response => {
            if (response.status===200) {
                return response.json()
            }else if(response.status===403){
                message.warn("验证码错误")
            } 
        })
        .then(data=>{
            if(data){
                message.success("验证码正确！")
                setValidateSuccess(true)
                setOldPsw(data.old_password)
            }
        })
    }

    const resetPassword = (formData) =>{
        const crypto = require('crypto');
        let new_password = crypto.createHmac('sha256', formData.new_password).digest('hex');
        fetch(PRE+'/alter-user-info/',{
            method:"POST",
            body:JSON.stringify({
                password:old_psw,
                new_password,
                user_name
            })
        })
        .then(response=>{
            if (response.status===200) {
                message.success("恭喜您，密码已成功重置！")
                setResetSuccess(true)
                return response.json()
            }
            else{
                message.error("对不起，修改密码失败")
            }
        })
        .then(data=>{
            console.log(data)
        })
    }


    return(
        <div className="Login">
            <div className="Login-background">
                <div className="Login-forms-container">
                    <Card className="Login-form">
                        <div className="Login-block-title">
                            <span>Welcome Back:</span>
                            <hr/>
                        </div>
                        <Form
                            {...loginFormItemLayout}
                            form={login_form}
                            name="login"
                            initialValues={{ remember: true }}
                            onFinish={Login}
                        >
                            <Form.Item
                                label="Username"
                                name="user_name"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input onChange={e=>setUserName(e.target.value)}/>
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Button type="link" onClick={fogetPassword} style={{float:"right"}}>Foget your password?</Button>

                            <Form.Item name="remember">
                                <Checkbox defaultChecked={true} disabled>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    Log In
                                </Button>
                            </Form.Item>

                        </Form>
                    </Card>


                    <Card className="Signup-form">
                        <div className="Login-block-title">
                            <span>Or Sign Up:</span>
                            <hr/>
                        </div>
                        <Form
                            {...signupFormItemLayout}
                            form={signup_form}
                            name="signup"
                            initialValues={{ remember: true }}
                            onFinish={Signup}
                        >

                            <Form.Item
                                label="User Name"
                                name="new_user_name"
                                validateStatus={user_name_validate}
                                hasFeedback
                                help={user_name_help}
                                rules={[
                                    {
                                        required: true,
                                        message: 'User name must be set!',
                                    },
                                ]}
                            >
                                <Input onChange={validateUsername}/>
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="new_email"
                                rules={[
                                    { type: 'email', message: 'The input is not valid E-mail!' },
                                    { required: true, message: 'Please input your Email!' }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="new_password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Retype"
                                name="retype_password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('new_password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The two passwords that you entered do not match!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            

                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    Sign Up
                                </Button>
                            </Form.Item>

                        </Form>


                    </Card>
                </div>
            </div>
            <Modal
                title="邮件验证提醒"
                visible={email_modal_shown}
                onOk={()=>{}}
                onCancel={()=>{}}
                footer={null}
                closeIcon={" "}
            >
                <Result
                    status={modal_status}
                    icon={validate_success?null:email_sent?<MailOutlined />:<Spin/>}
                    title={
                        modal_status==='error'?"邮件发送失败":
                        validate_success?"验证成功！":
                        email_sent?"验证邮件已发送":
                        "验证邮件发送中..."}
                    subTitle={
                        <p>系统发送了一封验证邮件，请在邮箱内查收，完成邮箱验证.<br/>
                            完成邮件验证之后，您将可以参与提问与文章发布<br/>
                            请您在下方的输入框内输入邮件中的验证码：<br/><br/>
                            <Input value={code} onChange={e=>{setCode(e.target.value)}} style={{width:'100px'}}/>
                        </p>
                    }
                    extra={
                        modal_status==='error'?
                        [<Button type="primary" onClick={Signup}>重新尝试发送</Button>]:
                        validate_success?
                        [<Button type="primary" disabled={!validate_success} onClick={()=>window.location.href="/teapal/questionaire"}>完成</Button>]:
                        [
                            <Button type="primary" disabled={!email_sent} onClick={validate}>验证</Button>
                        ]
                        //<Button type="primary" onClick={()=>{validation()}}>提交</Button>,
                        //<Button disabled onClick={()=>{}}>修改邮箱</Button>,
                    }
                >
                </Result>

            </Modal>

            <Modal
                title="重置密码"
                visible={reset_psw_modal_shown}
                onOk={()=>{}}
                onCancel={()=>{}}
                footer={null}
                closeIcon={" "}
            >
                <Result
                    status={modal_status}
                    icon={(modal_status==='error'||validate_success)?null:email_sent?<MailOutlined />:<Spin/>}
                    title={
                        modal_status==='error'?"邮件发送失败":
                        validate_success?"验证成功！":
                        email_sent?"验证邮件已发送":"验证邮件发送中..."
                    }
                    subTitle={
                        <p>您正在重置您的账号密码，系统发送了一封验证邮件，<br/>
                            请查收验证码，以完成密码重置.<br/>
                            请您在下方的输入框内输入邮件中的验证码：<br/><br/>
                            {!validate_success?
                            <Input value={code} onChange={e=>{setCode(e.target.value)}} style={{width:'100px'}}/>:
                            <Form
                                name="reset"
                                form={reset_form}
                                onFinish={resetPassword}
                            >
                                <Form.Item
                                    label="Password"
                                    name="new_password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    label="&nbsp;Comfirm"
                                    name="retype_password"
                                    dependencies={['new_password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('new_password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('The two passwords that you entered do not match!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                                {reset_success?null:
                                <Form.Item >
                                    <Button type="primary" htmlType="submit">
                                    重置密码
                                    </Button>
                                </Form.Item>}
                            </Form>}
                        </p>
                    }
                    extra={
                        modal_status==='error'?
                        [<Button onClick={()=>setResetPswModalShown(false)}>关闭</Button>]:
                        reset_success?
                        [<Button type="primary" disabled={!reset_success} onClick={()=>setResetPswModalShown(false)}>返回登陆</Button>]:
                        validate_success?[]:
                        [<Button type="primary" disabled={!email_sent} onClick={reset_psw_validate}>验证</Button>]
                    }
                >
                </Result>

            </Modal>
        </div>
    )
}

export default Login