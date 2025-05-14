import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GiPayMoney } from 'react-icons/gi';
import { Form, Space, Table, Typography } from 'antd';

import {
  pharmacyQuotationSearchDrugsColumns,
  pharmacyQuotationCurrentSelectionColumns,
} from './pharmacy-utils';
import { SearchDrugTable } from './SearchDrugTable';
import { PharmacyCurrentSelection } from './PharmacyCurrentSelection';

import { getItemsSlice } from '../../actions/triage-actions/getItemsSlice';

export default function PharmacyQuotation() {
  const dispatch = useDispatch();

  const { Text } = Typography;
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const { items, loadingItems } = useSelector((state) => state.getItems);

  const { Cell: TableSummaryCell, Row: TableSummaryRow } = Table.Summary;

  useEffect(() => {
    dispatch(getItemsSlice());
  }, []);

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      console.log({ row, record });
      const { Quantity } = row;

      const newRecord = { ...record, Quantity };
      const indexToReplace = selectedDrugs.findIndex(
        (item) => item.No === record.No,
      );
      var newSelected = [...selectedDrugs];
      newSelected.splice(indexToReplace, 1, newRecord);

      setSelectedDrugs(newSelected);
      setEditingKey('');
    } catch (error) {
      console.log({ error });
    }
  };

  const cancel = () => setEditingKey('');

  const isEditing = (record) => record.No === editingKey;

  const handleAddDrug = (drugNo) => {
    const drug = items.find((item) => item.No === drugNo);
    setSelectedDrugs(Array.from([...selectedDrugs, drug]));
  };

  const deleteItem = ({ No }) => {
    setSelectedDrugs(
      selectedDrugs.filter((selectedDrug) => selectedDrug.No !== No),
    );
  };

  const pharmacyCurrentSelectionSummary = (pageData) => {
    const totalValue = pageData.reduce(
      (acc, { Quantity, UnitPrice }) => (acc += Quantity * UnitPrice),
      0,
    );

    return pageData.length ? (
      <TableSummaryRow>
        <TableSummaryCell
          index={0}
          colSpan={4}
        />
        <TableSummaryCell index={0}>
          <Text style={{ fontWeight: 'bold', color: '#0f5689' }}>Total</Text>
        </TableSummaryCell>
        <TableSummaryCell index={1}>
          <Text style={{ fontWeight: 'bold', color: '#0f5689' }}>
            {new Intl.NumberFormat('en-US').format(Math.round(totalValue))}
          </Text>
        </TableSummaryCell>
        <TableSummaryCell index={2} />
      </TableSummaryRow>
    ) : (
      <></>
    );
  };

  return (
    <div style={{ color: 'rgba(0, 0, 0, 0.88)' }}>
      <div
        className="d-flex"
        style={{ color: '#0f5689', gap: '8px', padding: '8px 0' }}
      >
        <GiPayMoney size={20} />
        <h6>Pharmacy Quotation</h6>
      </div>

      <Space
        direction="vertical"
        style={{ width: '100%' }}
      >
        <Form
          form={form}
          component={false}
        >
          <PharmacyCurrentSelection
            style={{ width: '100%' }}
            summary={pharmacyCurrentSelectionSummary}
            data={selectedDrugs.map((selectedDrug, index) => ({
              ...selectedDrug,
              Index: selectedDrug.Index || index + 1,
              Quantity: selectedDrug.Quantity || 0,
            }))}
            columns={pharmacyQuotationCurrentSelectionColumns(
              edit,
              save,
              cancel,
              isEditing,
              deleteItem,
            )}
          />
        </Form>
        <SearchDrugTable
          items={items}
          loading={loadingItems}
          columns={pharmacyQuotationSearchDrugsColumns(handleAddDrug)}
        />
      </Space>
    </div>
  );
}
