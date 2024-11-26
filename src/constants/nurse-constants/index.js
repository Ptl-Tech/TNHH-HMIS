

const totalDoctorsLineGraphData = [
    { date: '2024-09-01', value: 2 },
    { date: '2024-10-02', value: 4 },
    { date: '2024-11-03', value: 6 },
    { date: '2024-12-04', value: 12 },
    { date: '2025-01-05', value: 10 },
  ]

  const totalNursesLineGraphData = [
    { date: '2024-09-01', value: 2 },
    { date: '2024-10-02', value: 10 },
    { date: '2024-11-03', value: 6 },
    { date: '2024-12-04', value: 12 },
    { date: '2025-01-05', value: 10 },
  ]

  const totalAppointmentsLineGraphData = [
    { date: '2024-09-01', value: 5 },
    { date: '2024-10-02', value: 4 },
    { date: '2024-11-03', value: 6 },
    { date: '2024-12-04', value: 2 },
    { date: '2025-01-05', value: 10 },
  ]

  const totalPatientsLineGraphData = [
    { date: '2024-09-01', value: 8 },
    { date: '2024-10-02', value: 4 },
    { date: '2024-11-03', value: 6 },
    { date: '2024-12-04', value: 12 },
    { date: '2025-01-05', value: 5 },
  ]

  const lastSixMonthsTotalPatientsLineGraphData = [
    { date: '2025-06-01', value: 65 },
    { date: '2025-7-02', value: 70 },
    { date: '2025-8-03', value: 6 },
    { date: '2025-10-04', value: 30 },
    { date: '2025-11-05', value: 10 },
    { date: '2025-12-06', value: 80 },
  ]

  export const totalDoctorsLineGraphConfig = {
    data: totalDoctorsLineGraphData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 80,
    width: 80,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        lineWidth: 1,
      },
    },
    axis: {
        x: null,
        y: null
    },
    tooltip: false,
    shapeField: 'smooth',
    color: '#6643b5',
  };

  export const totalNursesLineGraphConfig = {
    data: totalNursesLineGraphData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 80,
    width: 80,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        lineWidth: 1,
      },
    },
    axis: {
        x: null,
        y: null
    },
    tooltip: false,
    shapeField: 'smooth',
    color: '#6643b5',
  };

  export const totalAppointmentsLineGraphConfig = {
    data: totalAppointmentsLineGraphData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 80,
    width: 80,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        lineWidth: 1,
      },
    },
    axis: {
        x: null,
        y: null
    },
    tooltip: false,
    shapeField: 'smooth',
    color: '#6643b5',
  };

  export const totalPatientsLineGraphConfig = {
    data: totalPatientsLineGraphData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 80,
    width: 80,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        lineWidth: 1,
      },
    },
    axis: {
        x: null,
        y: null
    },
    tooltip: false,
    shapeField: 'smooth',
    color: '#6643b5',
  };

export const lastSixMonthsTotalPatientsLineGraphConfig = {
    data: lastSixMonthsTotalPatientsLineGraphData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    height: 260,
    width: 550,
    point: {
      size: 4,
      shape: 'circle',
      style: {
        lineWidth: 1,
      },
    },
    shapeField: 'smooth',
    color: '#6643b5',
  };

  // wards 

  export const hospitalBranchesTotalWards = [
    {
      name: 'Aspen',
      path: 'Aspen'
    },
    {
      name: 'Birch',
      path: 'Birch'
    },
    {
      name: 'Boardroom',
      path: 'Boardroom'
    },
    {
      name: 'Bonsai',
      path: 'Bonsai'
    },
    {
      name: 'Chogoria Ground Floor',
      path: 'ChogoriaGroundFloor'
    },
    {
      name: 'Discharge Ward',
      path: 'DischargeWard'
    },
    {
      name: 'Dorothy Wing',
      path: 'DorothyWing'
    },
    {
      name: 'Elgon Ward',
      path: 'ElgonWard'
    },
    {
      name: 'Hazel',
      path: 'Hazel'
    },
    {
      name: 'Holly',
      path: 'Holly'
    },
    {
      name: 'Irowan',
      path: 'Irowan'
    },
    {
      name: 'Maple',
      path: 'Maple'
    },
    {
      name: 'Oak',
      path: 'Oak'
    },
    {
      name: 'Private',
      path: 'Private'
    },
    {
      name: 'Rahab Suits',
      path: 'RahabSuits'
    },
    {
      name: 'Silver Fir',
      path: 'SilverFir'
    },
    {
      name: 'Simon Wing',
      path: 'SimonWing'
    },
    {
      name: 'Willow',
      path: 'Willow'
    },
  ]

