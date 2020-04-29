import React, { memo } from 'react';
import { Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import numeral from 'numeral';
import styles from '../Map.less';
import { Bar } from '@/components/Charts';

const { TabPane } = Tabs;

const AgeDis = memo(
  ({ ageData, loading, height }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab='年龄分布'
            key="sales"
          >
            <div className={styles.salesBar}>
              <Bar
                height={height}
                data={ageData}
              />
            </div>
          </TabPane>
          <TabPane
            tab='自定义组1'
            key="views1"
          >
            <div className={styles.salesBar}>
              <Bar
                height={height}
                data={ageData}
              />
            </div>
          </TabPane>
          <TabPane
            tab='自定义组2'
            key="views2"
          >
            <div className={styles.salesBar}>
              <Bar
                height={height}
                data={ageData}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  )
);

export default AgeDis;
