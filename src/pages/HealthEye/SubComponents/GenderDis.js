import React, { memo } from 'react';
import { Col } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { Pie } from '@/components/Charts';

const colors = {
  男: 'rgba(24, 144, 255, 0.85)',
  女: '#f759ab',
  未知: '#7f7c7c',
};
const GenderDis = memo(({ genderData }) => {
  let list = Object.keys(genderData);
  let total = list.reduce((sum, val) => sum + parseInt(genderData[val], 10), 0);
  return (
    <div>
      {list.map(key => (
        <Col span={24 / list.length} key={key}>
          <Pie
            animate={false}
            color={colors[key]}
            percent={((parseInt(genderData[key], 10) / total) * 100).toFixed(1)}
            subTitle={
              key
              // <FormattedMessage id="app.health_map.GenderDis.Male" defaultMessage="Male"/>
            }
            total={`${((parseInt(genderData[key], 10) / total) * 100).toFixed(1)}%`}
            height={128}
            lineWidth={2}
          />
        </Col>
      ))}
    </div>
  );
  //
  //   <Col span={12}>
  //     <Pie
  //       animate={false}
  //       color="#f759ab"
  //       percent={x2}
  //       subTitle={
  //         <FormattedMessage id="app.health_map.GenderDis.Female" defaultMessage="Female" />
  //       }
  //       total={`${x2}%`}
  //       height={128}
  //       lineWidth={2}
  //     />
  //   </Col>
  // </div>
});

export default GenderDis;
