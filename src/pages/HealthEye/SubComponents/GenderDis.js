import React, { memo } from 'react';
import { Col } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { Pie } from '@/components/Charts';


const GenderDis = memo(
  ({genderData:[x1, x2]}) => (
    <div>
      <Col span={12}>
        <Pie
          animate={false}
          percent={x1}
          subTitle={
            <FormattedMessage id="app.health_map.GenderDis.Male" defaultMessage="Male" />
          }
          total={`${x1}%`}
          height={128}
          lineWidth={2}
        />
      </Col>

      <Col span={12}>
        <Pie
          animate={false}
          color="#f759ab"
          percent={x2}
          subTitle={
            <FormattedMessage id="app.health_map.GenderDis.Female" defaultMessage="Female" />
          }
          total={`${x2}%`}
          height={128}
          lineWidth={2}
        />
      </Col>
    </div>
  ),
);

export default GenderDis;
