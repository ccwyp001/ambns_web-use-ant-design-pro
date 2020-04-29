import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from '../Map.less';
import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';

const OccupationDis = memo(
  ({ dropdownGroup, loading, occData, handleChangeSalesType }) => (
    <Pie
      // hasLegend
      subTitle='人数'
      tooltip={false}
      total={() => <div>{occData.reduce((pre, now) => now.y + pre, 0)}</div>}
      data={occData}
      // valueFormat={value => <Yuan>{value}</Yuan>}
      height={188}
      lineWidth={4}
      style={{ padding: '8px 0' }}
    />

  )
);

export default OccupationDis;
