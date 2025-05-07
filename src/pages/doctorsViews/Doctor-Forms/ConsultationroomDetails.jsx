import { Tabs } from 'antd';
import {
  HeartOutlined,
  SolutionOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
// Import components
import Diagnosis from './Diagnosis';
import FourPsForm from './FourPsForm';
import PatientSigns from './PatientSigns';
import useAuth from '../../../hooks/useAuth';

const ConsultationroomDetails = ({ treatmentNo, observationNo, patientNo }) => {
  const role = useAuth().userData.departmentName;

  const items = [
    {
      label: 'Patient History Notes',
      icon: <SolutionOutlined />,
      children: <PatientSigns treatmentNo={treatmentNo} filter={'PH'} />,
    },
    ...(role === 'Doctor'
      ? [
          {
            label: 'Physical Examination',
            icon: <HeartOutlined />,
            children: (
              <PatientSigns
                treatmentNo={treatmentNo}
                filter={'PE'}
              />
            ),
          },
        ]
      : []),
    {
      label: 'Mental Status Exam',
      icon: <SolutionOutlined />,
      children: (
        <PatientSigns
          treatmentNo={treatmentNo}
          filter={'MSE'}
        />
      ),
    },
    {
      label: 'Diagnosis Formulation',
      icon: <MedicineBoxOutlined />,
      children: <Diagnosis />,
    },
    {
      label: 'Aetiology',
      icon: <HeartOutlined />,
      children: (
        <FourPsForm
          treatmentNo={treatmentNo}
          observationNo={observationNo}
          patientNo={patientNo}
        />
      ),
    },
  ];

  return (
    <Tabs
      type="card"
      items={items.map(({ label, children, icon }) => ({
        label,
        icon,
        key: label,
        children,
      }))}
    />
  );
};

export default ConsultationroomDetails;
