import { Spin } from 'antd'

const Loading = () => {
  return (
    //display at the center of the screen
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Spin size="small" tip="Loading"/>
    </div>
  )
}

export default Loading