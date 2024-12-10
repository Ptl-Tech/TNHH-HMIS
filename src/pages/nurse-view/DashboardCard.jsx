
import { Card, Typography } from 'antd'
import PropTypes from 'prop-types';
import CountUp from 'react-countup';

const DashboardCard = ({card}) => {
  return (

    <Card style={{ flex: 1, padding: '10px 16px'}} >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            
            <div>
                <Typography.Title level={5} style={{color: 'gray'}}>
                    {card?.title}
                </Typography.Title>
                <Typography.Text style={{ fontSize: '20px', fontWeight: 600}}>
                    <CountUp start={0} 
                    end={card?.value} 
                    duration={1} 
                    />
                </Typography.Text>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {
                    card?.icon
                }
            </div>
            
        </div>
    </Card>
  )
}

export default DashboardCard

// propTypes validation
DashboardCard.propTypes = {
    card: PropTypes.shape({
        title: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        subtitle: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired
    })
}