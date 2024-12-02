import { Button, Space, Table } from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import PropTypes from 'prop-types'
import { createStyles } from 'antd-style';
import Loading from '../../../../partials/nurse-partials/Loading';

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const AllergyAndMedicationTable = ({ handleOpenModal, allergyMedicationLoading, allergiesMedication }) => {

  const { styles } = useStyle();
    const allergyColumns =[
        {
          title: 'Observation No',
          dataIndex: 'observationNo',
          rowScope: 'row',
          fixed: 'left',
          width: 150,
        },
        {
          title: 'Complains',
          dataIndex: 'complains',
          rowScope: 'row',
        },
        {
          title: 'Reason for Visit',
          dataIndex: 'reasonForVisit',
          rowScope: 'row',
        },
    
        {
          title: 'Food Allergy',
          dataIndex: 'foodAllergy',
          rowScope: 'row',
        },
        {
          title: 'Drug Allergy',
          dataIndex: 'drugAllergy',
          rowScope: 'row',
        },
        {
          title: 'Assessed By',
          dataIndex: 'assessedBy',
          rowScope: 'row',
          fixed: 'right',
          width: 200,
        },
        {
          title: 'Action',
          dataIndex: 'action',
          rowScope: 'row',
          fixed: 'right',
          width: 200,
          render: () => {
            return (
              <Space>
                <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
                  <EditOutlined />
                  Edit
                </Button>
                <Button color="danger" variant="outlined" onClick={() => handleOpenModal('Check In', null)}>
                  <DeleteOutlined />
                  Delete
                </Button>
              </Space>
            )
          }
        },
      ]

      const formatReasonForVisit = (reason) => {
        switch (reason) {
          case 0:
            return 'Unknown reason';
          case 1:
            return 'Patient not Improving';
          case 2:
            return 'Patient deteriorating';
          case 3:
            return 'New presentation';
          case 4:
            return 'Follow up';
          default:
            return 'Unknown reason'; // Fallback if reason doesn't match
        }
      };

      const allergiesMedicationTableData = allergiesMedication?.map((allergy) => ({
        observationNo: allergy?.ObservationNo,
        complains: allergy?.Complains,
        reasonForVisit: formatReasonForVisit(allergy?.ReasonForVisit),
        foodAllergy: allergy?.FoodAllergy,
        drugAllergy: allergy?.DrugAllergy,
        assessedBy: allergy?.AssessedBy,
      }))

      console.log('Allergy and medication table data', allergiesMedication)
    
  return allergyMedicationLoading ? (
    
    <Loading/>
  ):(
    <Table dataSource={allergiesMedicationTableData} 
    columns={allergyColumns} 
    bordered size='middle' 
    style={{ marginTop: '20px' }} 
    className={styles.customTable}
    scroll={{
      x: 'max-content',
    }}
    />
  )
}

export default AllergyAndMedicationTable

//prop type validation
AllergyAndMedicationTable.propTypes = {
    handleOpenModal: PropTypes.func.isRequired,
    allergyMedicationLoading: PropTypes.bool.isRequired,
    allergiesMedication: PropTypes.array.isRequired,

}