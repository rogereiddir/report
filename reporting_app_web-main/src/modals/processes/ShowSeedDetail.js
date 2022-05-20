import React, { useEffect , useState , useCallback } from 'react'
import { Modal , Card , Image , Typography, Row, Col , message , Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons'
import axios from 'axios';
const { Title , Text } = Typography;
const ShowSeedLog = ({toggleModal , seed , detail , id}) => {
   
    const [currentSeed, setSeed] = useState({})
    const [feeds, setFeeds] = useState([])
    const [loginPage, setInit] = useState('')
    const [inbox, setInbox] = useState('')
    const [spam, setSpam] = useState('')
    const [read, setRead] = useState('')
    const [finished, setFinished] = useState('')
    const [final, setUnexpected] = useState('')
    const [sync, onLoad] = useState(false)
    const isMounted = React.useRef(false)

    const resfresh = useCallback(() => {
      if(Object.keys(seed).length !== 0){
        setSeed(seed)
        onLoad(true)
        axios.get(`/api/v1/processes/one/${seed.id}/${id}`).then((seed) => {
         console.log(seed)
         onLoad(false)
         const feedbacks = seed.data.feedback.split(',')
         if(isMounted){
           setFeeds(feedbacks)
           if(feedbacks.every(f => f)){
             setInit(feedbacks.find(f => f.includes(`init-${id}`)))
             setInbox(feedbacks.find(f => f.includes(`inbox-${id}`)))
             setSpam(feedbacks.find(f => f.includes(`spam-${id}`)))
             setRead(feedbacks.find(f => f.includes(`read-${id}`)))
             setFinished(feedbacks.find(f => f.includes(`finished-${id}`)))
             setUnexpected(feedbacks.find(f => f.includes(`final-error-${id}`)))
           } 
         }
        }).catch((err)=>{
          console.log(err)
          message.error('Error While fetching the seed')
        })
      }
    },[seed,id])
   
    useEffect(()=>{
       isMounted.current = true
       resfresh()
       return () => {
         isMounted.current = false
       }
    },[resfresh])


    const handleCancel = () => {
      console.log('Clicked cancel button');
      toggleModal("detail")
    }

    const gridStyle = {
      textAlign: 'center',
      marginTop: 16
    };
    return (
    <Modal
      width={800}
      title={<Title level={3}>{currentSeed.email}  <Button onClick={()=> resfresh()} title="refresh" icon={<SyncOutlined spin={sync} />} /></Title>}
      visible={detail}
      bodyStyle={{
        textAlign:"center"
      }}
      footer={false}
      onCancel={handleCancel}>
      {
       feeds.every(f => f) ? (
           <>
            <Row gutter={16}>
             {  
              loginPage ?
              <Col span={12}>
                <Card 
                style={gridStyle} 
                cover={ <Image  src={`/${loginPage}`} />}  
                type="inner" title={<Title level={4}>Login Page</Title>} >
      
                </Card>
              </Col> : null
             }
             {
             inbox ? <Col span={12}>
                <Card 
                  style={gridStyle}  
                  title={<Title level={4}>After Login</Title>}  
                  cover={ <Image  src={`/${inbox}`} />}  
                  type="inner" >
          
                </Card>
              </Col> : null
            }
          </Row>
      
          <Row gutter={16}>
            {
             finished ? <Col span={12}>
                <Card 
                  style={gridStyle}  
                  title={<Title level={4}>Final</Title>}  
                  cover={ <Image  src={`/${finished}`} />}  
                  type="inner" >
          
                </Card>
              </Col> : null
            }     
            {
             spam ? <Col span={12}>
                <Card 
                  style={gridStyle}  
                  title={<Title level={4}>Spam</Title>}  
                  cover={ <Image  src={`/${spam}`} />}  
                  type="inner" >
          
                </Card>
              </Col> : null
            }     
          </Row>
          {
           read ? <Row>
              <Col>
                <Card 
                  style={gridStyle}  
                  title={<Title type="danger" level={4}><Text type="danger">Read Messages</Text></Title>}  
                  cover={ <Image  src={`/${read}`} />}  
                  type="inner" >
                  
                </Card>
              </Col>
            </Row> : null
           }
          {
           final ? <Row>
              <Col>
                <Card 
                  style={gridStyle}  
                  title={<Title type="danger" level={4}><Text type="danger">Last Screenshot</Text></Title>}  
                  cover={ <Image  src={`/${final}`} />}  
                  type="inner" >
                  
                </Card>
              </Col>
            </Row> : null
           }
           </>
        ) : <Title type="danger" level={4}> <Text type="warning">No Data Available</Text> </Title>
      }

    </Modal>
    )
}

export default ShowSeedLog