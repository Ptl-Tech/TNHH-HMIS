import { Tag } from "antd";

export const labLinesColumns = [
  {
    title: "Lab Number",
    dataIndex: "Laboratory_No",
    key: "Laboratory_No",
  },
  {
    title: "Test Name",
    dataIndex: "LaboratoryTestName",
    key: "LaboratoryTestName",
  },
  {
    title: "Status",
    dataIndex: "Completed",
    key: "Completed",
    render: (_, record) =>
      record.Completed ? (
        <Tag color="cyan">Completed</Tag>
      ) : !record.Completed ? (
        <Tag color="volcano">Incomplete</Tag>
      ) : (
        record.Completed
      ),
  },
];

export const labResultsColumns = [
  {
    title: "Specimen Code",
    dataIndex: "Specimen_Code",
    key: "Specimen_Code",
  },
  {
    title: "Specimen Name",
    dataIndex: "Specimen_Name",
    key: "Specimen_Name",
  },
  {
    title: "Lab Results",
    dataIndex: "Results",
    key: "Results",
    editable: true,
  },
  {
    title: "Unit",
    dataIndex: "Measuring_Unit_Code",
    key: "Measuring_Unit_Code",
  },
  {
    title: "Reference Range",
    dataIndex: "Test_Normal_Ranges",
    key: "Test_Normal_Ranges",
  },
  {
    title: "Flag",
    dataIndex: "Results",
    key: "Test_Normal_Ranges",
    render: (value, record) => {
      const { Test_Normal_Ranges } = record;
      var [minNum, maxNum] = Test_Normal_Ranges.split(" - ");
      try {
        minNum = parseFloat(minNum);
        maxNum = parseFloat(maxNum);
        var result = parseFloat(value);

        if (typeof minNum == "number" && typeof maxNum == "number" && typeof result == "number") {
          if (result < minNum) return <span style={{ color: "red" }}>LOW</span>;
          if (result > maxNum)
            return <span style={{ color: "red" }}>HIGH</span>;
          if (result >= minNum && result <= maxNum)
            return <span style={{ color: "green" }}>NORMAL</span>;
        }
      } catch (error) {
        return "";
      }
    },
  },
  {
    key: "Remarks",
    editable: true,
    title: "Remarks",
    dataIndex: "Remarks",
  },
];

export const filterByCategory = (labRequest, variant) => {
  var returnValue;
  switch (variant) {
    case "All":
      returnValue = true;
      break;
    case "Walk-In":
      returnValue = labRequest.Walk_In;
      break;
    case "Inpatient":
      returnValue = labRequest.Inpatient;
      break;
    case "Outpatient":
      returnValue = !labRequest.Inpatient && !labRequest.Walk_In;
      break;
    default:
      returnValue = true;
      break;
  }

  return returnValue;
};

export const filterByStatus = (labRequest, status) =>
  status ? labRequest.Status === status : true;
