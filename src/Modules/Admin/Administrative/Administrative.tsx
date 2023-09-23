import React from 'react';
import { Collapse } from 'antd';
import ChangeItem from './ChangeItem';
import ChangeReferralAmount from './ChangeReferralAmount';
import ChangeWithdrawAmount from './ChangeWithdrawAmount';
const { Panel } = Collapse;

const Administrative: React.FC = () => {
  return (
    <Collapse defaultActiveKey={['']}>
      <Panel header="Change Item" key="1">
        <ChangeItem />
      </Panel>
      <Panel header="Change Withdraw Amount Limit" key="2">
        <ChangeWithdrawAmount />
      </Panel>
      <Panel header="Change Referral Amount" key="3">
        <ChangeReferralAmount />
      </Panel>
    </Collapse>
  );
};

export default Administrative;