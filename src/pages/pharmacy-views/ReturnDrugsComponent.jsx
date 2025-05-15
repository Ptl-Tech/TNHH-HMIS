import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Drawer, Form, Input, message } from 'antd';

import { RETURN_DRUGS_RESET, returnDrugs } from '../../actions/pharmacy-actions/returnDrugs';

export const ReturnDrugsComponent = ({ record }) => {
  const dispatch = useDispatch();

  const { Item: FormItem } = Form;
  const { DrugName, Description, SystemId, Quantity } = record;

  const [open, setOpen] = useState(false);
  const { data, loading, error } = useSelector((state) => state.returnDrugs);

  useEffect(() => {
    if (data) {
      message.success('The return was successful');
      setOpen(false);
    }

    if (error) {
      message.error('Something went wrong when removing the drugs');
    }

    if (data || error) {
      dispatch({ type: RETURN_DRUGS_RESET });
    }
  }, [data, error]);

  const handleSubmit = (values) => {
    dispatch(returnDrugs(values));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Return Drug</Button>
      <Drawer
        open={open}
        width={360}
        destroyOnHidden={true}
        onClose={() => setOpen(false)}
        title={`Return ${DrugName || Description}`}
        children={
          <Form
            layout="vertical"
            initialValues={{ recId: SystemId }}
            onFinish={handleSubmit}
          >
            <FormItem
              name="returnQty"
              label="Number to return"
              rules={[{ required: true, message: 'Quantity is required' }]}
            >
              <Input
                min={1}
                required
                type="number"
                max={Quantity}
              />
            </FormItem>
            <small>
              Value must be <strong>greater</strong> than <strong>0</strong> or
              less than <strong>{Quantity + 1}</strong>
            </small>
            <FormItem
              name="returnRemarks"
              label="Reason of returning"
              rules={[
                { required: true, message: 'Please enter reason of returning' },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="Reason of returning"
              />
            </FormItem>
            <Button
              type="primary"
              disabled={loading}
              htmlType="submit"
            >
              Submit
            </Button>
            <FormItem
              name="recId"
              rules={[{ required: true, message: 'Record ID is required' }]}
            >
              <Input
                type="hidden"
                max={Quantity}
              />
            </FormItem>
          </Form>
        }
      />
    </>
  );
};
