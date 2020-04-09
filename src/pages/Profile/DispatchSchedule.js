import React, { Fragment, memo } from 'react';
import { Badge, Card, Col, Icon, Modal, Popover, Row, Steps, Tooltip } from 'antd';
import { FormattedMessage } from 'umi/locale';
import classNames from 'classnames';
import styles from './AdvancedProfile.less';
import DoctorSvg from '@/assets/DoctorSvg';
import NurseSvg from '@/assets/NurseSvg';
import SuitSvg from '@/assets/SuitSvg';
import CardSvg from '@/assets/CardSvg';
import DriverSvg from '@/assets/DriverSvg';
import AmbulanceSvg from '@/assets/AmbulanceSvg';

const LogoDoctor = props => <Icon component={DoctorSvg} {...props} />;
const LogoNurse = props => <Icon component={NurseSvg} {...props} />;
const LogoSuit = props => <Icon component={SuitSvg} {...props} />;
const LogoCard = props => <Icon component={CardSvg} {...props} />;
const LogoDriver = props => <Icon component={DriverSvg} {...props} />;
const LogoAmbulance = props => <Icon component={AmbulanceSvg} {...props} />;

const descTitle = (
  <div className="icons-list">
    <Fragment>
      <LogoDriver style={{ fontSize: '28px', color: '#0a0cd8' }} />
      我是司机
    </Fragment>
    <Fragment>
      <LogoDoctor style={{ fontSize: '28px', color: '#0a0cd8' }} />
      我是医生
    </Fragment>
    <Fragment>
      <LogoNurse style={{ fontSize: '28px', color: '#0a0cd8' }} />
      我是护士
    </Fragment>
  </div>
);

const desc1 = (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      曲丽丽
      <Icon type="dingding-o" style={{ marginLeft: 8 }} />
    </Fragment>
    <div>2016-12-12 12:32</div>
  </div>
);

const desc2 = (
  <div className={styles.stepDescription}>
    <Fragment>
      周毛毛
      <Icon type="dingding-o" style={{ color: '#00A0E9', marginLeft: 8 }} />
    </Fragment>
    <div>实际出车时间：2016-12-12 12:32</div>
    <div>
      <div className="icons-list">
        <Tooltip
          title='穿着工作服'
        >
          <LogoSuit style={{ fontSize: '24px', color: '#CA6B4F' }} />
        </Tooltip>
        ：
        <LogoNurse style={{ fontSize: '28px', color: '#d81e06' }} />
        <LogoDoctor style={{ fontSize: '28px', color: '#0a0cd8' }} />
        <LogoDriver style={{ fontSize: '28px', color: '#d81e06' }} />
      </div>
    </div>
    <div>
      <div className="icons-list">
        <Tooltip
          title='佩戴工牌'
        >
          <LogoCard style={{ fontSize: '24px', color: '#CA6B4F' }} />
        </Tooltip>
        ：
        <LogoNurse style={{ fontSize: '28px', color: '#d81e06' }} />
        <LogoDoctor style={{ fontSize: '28px', color: '#0a0cd8' }} />
      </div>
    </div>
    <div>
      <div className="icons-list">
        <Tooltip
          title='接诊后乘坐医疗仓'
        >
          <LogoAmbulance style={{ fontSize: '24px', color: '#CA6B4F' }} />
        </Tooltip>
        ：
        <LogoNurse style={{ fontSize: '28px', color: '#d81e06' }} />
        <LogoDoctor style={{ fontSize: '28px', color: '#0a0cd8' }} />
      </div>
    </div>
  </div>
);


const steps = [
  {
    title: '派车',
    content: desc1,
  },
  {
    title: '出车',
    content: desc2,
  },
  {
    title: '到达现场',
    content: 'Last-content',
  },
  {
    title: '病人上车',
    content: 'Last-content',
  },
  {
    title: '送达医院',
    content: 'Last-content',
  },
  {
    title: '完成',
    content: 'Last-content',
  },
];

const renderExtraTitle = () => {
  return descTitle
};

const renderSteps = () => {

  return steps
};

const { Step } = Steps;

const DispatchSchedule = memo(
  ({ stepDirection, loading }) => (
    <Card loading={loading} title="出车进度" extra={renderExtraTitle()} style={{ marginBottom: 24 }} bordered={false}>
      <Steps progressDot direction={stepDirection} current={1}>
        {renderSteps().map(item => (
          <Step key={item.title} title={item.title} description={item.content} />
        ))}
      </Steps>
    </Card>
  )
);

export default DispatchSchedule;
