import { Line } from '@ant-design/charts'
import { Card, Space, Typography } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'; 
import PropTypes from 'prop-types';

const DashboardCard = ({card}) => {
  return (

    <Card style={{ flex: 1, padding: '10px 16px'}} >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <div>
                <Typography.Title level={5} style={{color: 'gray'}}>
                    {card?.title}
                </Typography.Title>
                <Typography.Text style={{ fontSize: '20px', fontWeight: 600}}>
                    {card?.value}
                </Typography.Text>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography.Text style={{ fontSize: '14px', color: '#0d6efd', fontWeight: 600}}>+12%</Typography.Text>
                <Line {...card?.lineGraphConfig} />
            </div>
            
        </div>

        <Space style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{display: 'grid', placeItems: 'center', backgroundColor: 'green', borderRadius: '50%', width: '18px', height: '18px'}}>
                    <ArrowUpOutlined style={{ color: 'white', fontSize: '10px' }} />
                </div>
                <Typography.Text style={{ fontSize: '12px', color: 'green', fontWeight: 'bold'}}>
                    {card.increasePercentage}
                </Typography.Text>
                <Typography.Text style={{ fontSize: '12px', color:'gray' }}>
                    {card?.subtitle}
                </Typography.Text>
        </Space>
    </Card>
  )
}

export default DashboardCard

// propTypes validation
DashboardCard.propTypes = {
    card: PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        increasePercentage
        : PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
        lineGraphConfig: PropTypes.object.isRequired,
    })
}