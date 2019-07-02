import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title='总接警数'
        action={
          <Tooltip
            title='通过120特服号码呼入的电话总数'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        loading={loading}
        total={numeral(126560).format('0,0')}
        footer={
          <Field
            label='日接警数'
            value={numeral(12423).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='受理数'
        action={
          <Tooltip
            title='调度人员接听的急救需求电话总数'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(6560).format('0,0')}
        footer={
          <Field
            label='日受理数'
            value={numeral(1423).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniBar data={visitData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='出车数'
        action={
          <Tooltip
            title='救护车出车总数'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(8846).format('0,0')}
        footer={
          <Field
            label='日出车数'
            value={numeral(1234).format('0,0')}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={visitData} />
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title='2分钟内出车率'
        action={
          <Tooltip
            title='接警后2分钟出车率'
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="99.8%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>0.2%</span>
            </Trend>
            <Trend flag="down">
              <FormattedMessage id="app.analysis.day" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>0.1%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={99.8} strokeWidth={8} target={95} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
