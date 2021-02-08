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
          {
            ageData.map((item, index) => (
              <TabPane
                tab={item.groupName}
                key={`views${index}`}
              >
                <div className={styles.salesBar}>
                  <Bar
                    height={height}
                    data={item.groupData}
                  />
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      </div>
    </Card>
  )
);

export default AgeDis;
