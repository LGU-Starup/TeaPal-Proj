import React from 'react'
import { List } from 'antd';
import {PRE} from '../../App'
const PassageList = ({list}) => {

    const [passages, setPassages] = React.useState([])

    const DEFAULT = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"

    let new_passages = []
    const getSuggested=(i=0)=>{
        fetch(PRE+'/handbook/brief/'+list[i],{method:"GET"})
        .then(response => {
            if (response.status===200) {
                return response.json()
            }
        })
        .then(data => {
            if(data){
                new_passages = new_passages.concat([{...data,path:list[i]}]);
                console.log(data)
            }
            if (i+1<list.length){
                getSuggested(i+1)
            }else{
                setPassages(new_passages)
            }
        })
    }

    React.useEffect(()=>{
        getSuggested()
        // eslint-disable-next-line
    },[])

    return (
        <List
            dataSource={passages}
            renderItem={item => (
                <List.Item
                    className="hoverable"
                    onClick={()=>{window.location.href="/handbook/"+item.path}}
                    key={item.title}
                    extra={
                        <img
                            width={220}
                            style={{marginRight:'10px'}}
                            alt="logo"
                            src={item.images.length>0?item.images[0]:DEFAULT}
                        />
                    }
                >
                    <div style={{cursor:'pointer',marginLeft:'10px',marginRight:'10px',textAlign:'start'}}>
                        <List.Item.Meta
                            //avatar={<Avatar />}
                            title={<h2>{item.title}</h2>}
                            description={item.user_name}
                        />
                        <p style={{marginTop:'10px',cursor:'pointer'}}>{item.brief_content}</p>
                    </div>
                </List.Item>
            )}
        />
    )
}





export default PassageList