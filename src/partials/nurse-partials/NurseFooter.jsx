import { Footer } from 'antd/es/layout/layout'

const NurseFooter = () => {
  return (
    
    <Footer
    style={{
      textAlign: "center",
      color: "#67336d"
    }}
    >
        HMIS @ {new Date().getFullYear()} Created by potestastechnologies
    </Footer>
  )
}

export default NurseFooter