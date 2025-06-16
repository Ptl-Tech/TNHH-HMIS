import { Card } from "antd";

import { SearchDrugTable } from "../../pharmacy-views/SearchDrugTable";

const PrescriptionForm = () => {
  return (
    <Card title="Create Prescription">
      <SearchDrugTable items={[]} loading={false} columns={[]} />
    </Card>
  );
};

export default PrescriptionForm;
