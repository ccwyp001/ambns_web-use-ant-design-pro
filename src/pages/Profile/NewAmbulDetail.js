import React, { Component, Suspense } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Card,
  Badge,
  Table,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AdvancedProfile.less';

const { Description } = DescriptionList;

const VideoCaptures = React.lazy(() => import('./VideoCaptures'));
const DispatchSchedule = React.lazy(() => import('./DispatchSchedule'));

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const operationTabList = [
  {
    key: 'tab1',
    tab: '操作日志',
  },

];

const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },

];


@connect(({ ambulDetail, loading }) => ({
  ambulDetail,
  loading: loading.effects['ambulDetail/fetchAdvanced'],
}))
class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
    previewVisible: false,
    previewImage: '',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    dispatch({
      type: 'ambulDetail/fetchAdvanced',
      payload: { lsh: params.lsh, clid: params.clid },
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  renderDescription() {
    const { ambulDetail } = this.props;
    const { dispatchInfo } = ambulDetail;
    return (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="调度员">{dispatchInfo.dispatcher}</Description>
        <Description term="受理来源">电话呼救</Description>
        <Description term="受理时间">{moment(dispatchInfo.dispatchAt).format('YYYY-MM-DD HH:mm')}</Description>
        <Description term="呼叫类型">普通急救</Description>
        <Description term="呼叫原因">常规急救-创伤-跌倒</Description>
        <Description term="现场地址">{dispatchInfo.yymc}</Description>
      </DescriptionList>
    );
  }

  renderExtra() {
    const { ambulDetail } = this.props;
    const { dispatchInfo } = ambulDetail;
    return (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>车牌号</div>
          <div className={styles.heading}>{dispatchInfo.clmc}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>出车序号</div>
          <div className={styles.heading}>1</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{dispatchInfo.status}</div>
        </Col>
      </Row>
    );
  }


  render() {
    const { stepDirection, operationkey, previewVisible, previewImage } = this.state;
    const { ambulDetail, loading } = this.props;
    const { dispatchInfo, advancedOperation1 } = ambulDetail;
    const contentList = {
      tab1: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation1}
          columns={columns}
        />
      ),
    };

    return (
      <PageHeaderWrapper
        title={`流水号：${dispatchInfo.lsh}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        // action={action}
        content={this.renderDescription()}
        extraContent={this.renderExtra()}
        // tabList={tabList}
      >

        <Suspense fallback={null}>
          <DispatchSchedule
            stepDirection={stepDirection}
            loading={loading}
          />
        </Suspense>

        <Suspense fallback={null}>
          <VideoCaptures
            fileList={dispatchInfo.fileList}
            loading={loading}
            previewVisible={previewVisible}
            previewImage={previewImage}
            handlePreview={this.handlePreview}
            handleCancel={this.handleCancel}
          />
        </Suspense>

        <Card title="录音" style={{ marginBottom: 24 }} bordered={false}>
          <div className={styles.noData}>
            <Icon type="frown-o" />
            暂无数据
          </div>
        </Card>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[operationkey]}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedProfile;
