import React, { useState } from 'react'
import NurseInnerHeader from '../../partials/nurse-partials/NurseInnerHeader'
import { BiCoinStack } from 'react-icons/bi'
import { Button, Dropdown, Menu } from 'antd'
import AdvancedReceiptList from './CashPatients/AdvancedReceiptList'
import AdvancedInvoiceList from './CashPatients/AdvancedInvoiceList'

const PreviousBill = () => {
  const [selectedType, setSelectedType] = useState('cash'); // default

  const handleMenuClick = (e) => {
    if (e.key === '1') {
      setSelectedType('insurance');
    } else if (e.key === '2') {
      setSelectedType('cash');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Insurance</Menu.Item>
      <Menu.Item key="2">Cash</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <NurseInnerHeader title="Previous Bill - Advanced Search" icon={<BiCoinStack style={{ color: "#0f5689" }} />} />

      <div
        className="shadow-sm p-3 mb-3 border-top border-3"
        style={{ backgroundColor: "#fff", borderTopColor: "#0f5689" }}
      >
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight" arrow>
          <Button
            type="primary"
            className="mb-3"
            style={{
              backgroundColor: "#0f5689",
              borderColor: "#0f5689",
              color: "#fff",
            }}
          >
            Select Search Type
          </Button>
        </Dropdown>
      </div>

      <div
        className="shadow-sm p-3"
        style={{ backgroundColor: "#fff", borderTop: "3px solid #0f5689" }}
      >
        {selectedType === 'cash' ? <AdvancedReceiptList /> : <AdvancedInvoiceList />}
      </div>
    </div>
  );
};

export default PreviousBill;
