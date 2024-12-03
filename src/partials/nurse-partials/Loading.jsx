import { Spin } from 'antd'

const Loading = () => {
  return (
    //display at the center of the screen
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '60px', marginBottom: '60px'}}>
        <Spin />
    </div>
  )
}

export default Loading