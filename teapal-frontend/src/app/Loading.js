import React from 'react'
import './Loading.css'
import { Row } from 'antd'

const Loading = () => {
    return(
        <Row justify="center">
            <div className="Loading">
                <div className="dot1"/>
                <div className="dot2"/>
                <div className="dot3"/>
                <div className="dot4"/>
                <div className="dot5"/>
                <div className="dot6"/>
                <div className="dot7"/>
                <div className="dot8"/>
                <div className="text">Loading......</div>
            </div>
        </Row>
    )
}

export default Loading