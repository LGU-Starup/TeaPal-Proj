import React from 'react'
import './QuoteBlock.css'
import {PRE} from '../../App'
const QuoteBlock = ({quote_info, style}) => {

    const DEFAULT = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"

    const [handbook, setHandbook] = React.useState(null)

    const init = () => {
        if (quote_info&&quote_info.type==='H'){
            fetch(PRE+'/handbook/brief/'+quote_info.uri,{method:"GET",mode:'cors'})
            .then(response => {
                if (response.status===200) {
                    return response.json()
                }
            })
            .then(data => {
                setHandbook(data)
            })
            setHandbook({title:'aaaa',brief_content:'fhaijdioqjdsqdnioasdw',images:[]})
        }
    }

    React.useState(()=>init(),[quote_info])
    
    return handbook?(
        <div className="Quote-block-contianer" style={{cursor:'pointer',...style}} onClick={()=>window.location.href="/handbook/"+quote_info.uri}>
            
            <div className="Quote-block-text">
                <span>{handbook.title}</span>
                <span>{handbook.brief_content.slice(0,20)}...</span>
            </div>
            <img
                className="Quote-image"
                style={{marginLeft:'10px'}}
                alt="logo"
                src={handbook.images.length>0?handbook.images[0]:DEFAULT}
            />
        </div>
    ):(
        null
    )
}

export default QuoteBlock