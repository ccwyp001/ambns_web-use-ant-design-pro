import React, { Component, Suspense } from 'react';
import { AsyncLoadBizCharts } from '@/components/Charts/AsyncLoadBizCharts';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Row, Col, Card, Tooltip, Radio, Dropdown, Icon } from 'antd';
import { Pie, WaterWave, Gauge, TagCloud } from '@/components/Charts';
import NumberInfo from '@/components/NumberInfo';
import CountDown from '@/components/CountDown';
import ActiveChart from '@/components/ActiveChart';
import numeral from 'numeral';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import styles from './Map.less';
import MapviewT from '@/components/MapViewT.tsx';
import OccupationDis from './SubComponents/OccupationDis';
import ZoneSearch from './SubComponents/ZoneSearch';
import GenderDis from './SubComponents/GenderDis';
import InsuranceDis from './SubComponents/InsuranceDis';
import AgeDis from '@/pages/HealthEye/SubComponents/AgeDis';
import TimeDis from '@/pages/HealthEye/SubComponents/TimeDis';
import DiseaseDis from '@/pages/HealthEye/SubComponents/DiseaseDis';
import OrgDis from '@/pages/HealthEye/SubComponents/OrgDis';
// import CenterMap from '@/pages/HealthEye/SubComponents/CenterMap';

const { Secured } = Authorized;
const CenterMap = React.lazy(() => import('./SubComponents/CenterMap'));
// const OccupationDis = React.lazy(() => import('./SubComponents/OccupationDis'));
// const ZoneSearch = React.lazy(() => import('./SubComponents/ZoneSearch'));
// const GenderDis = React.lazy(() => import('./SubComponents/GenderDis'));
// const InsuranceDis = React.lazy(() => import('./SubComponents/InsuranceDis'));
// const AgeDis = React.lazy(() => import('./SubComponents/AgeDis'));
// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 300);
});

@Secured(havePermissionAsync)
@connect(({ map, loading }) => ({
  map,
  loading: loading.models.map,
  fetchingOrgData: loading.effects['map/fetchOrgData'],
  fetchingTimeData: loading.effects['map/fetchTimeData'],
  fetchingTopData: loading.effects['map/fetchTopData'],
  fetchingInsData: loading.effects['map/fetchInsData'],
  fetchingAgeData: loading.effects['map/fetchAgeData'],
  fetchingGenData: loading.effects['map/fetchGenData'],
  fetchingOccData: loading.effects['map/fetchOccData'],
  fetchingGeoData: loading.effects['map/fetchGeoData'],
  fetchingIcdList: loading.effects['map/fetchIcdList'],
}))
class HealthMap extends Component {

  state = {
    playOrNot: false,
  };

  colors = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E8684A',
    '#6DC8EC',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ];

  componentDidMount() {

    this.reqRef = requestAnimationFrame(() => {
      this.dispatchAll()
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/clear',
    });
    cancelAnimationFrame(this.reqRef);
    // clearTimeout(this.timeoutId);
  }

  playRound=()=> {
    const {playOrNot} = this.state;
    this.setState({
      playOrNot: !playOrNot,
      });
  };

  handleSearch = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchInsData',
      payload: params,
    });
    // this.dispatchAll();
  };

  handleIcdList = (value) => {
    const { dispatch } = this.props;
    if (value.length < 2){
      return
    }
    dispatch({
      type: 'map/fetchIcdList',
      payload: {
        q: value
      },
    });
  };


  dispatchAll=(payload={})=> {
    const { dispatch } = this.props;
    dispatch({
      type: 'map/fetchOccData',
      payload,
    });
    dispatch({
      type: 'map/fetchGeoData',
      payload,
    });
    dispatch({
      type: 'map/fetchAgeData',
      payload,
    });
    dispatch({
      type: 'map/fetchGenData',
      payload,
    });
    dispatch({
      type: 'map/fetchInsData',
      payload,
    });
    dispatch({
      type: 'map/fetchTopData',
      payload,
    });
    dispatch({
      type: 'map/fetchOrgData',
      payload,
    });
    dispatch({
      type: 'map/fetchTimeData',
      payload,
    });
    dispatch({
      type: 'map/fetchTownData',
      payload,
    });
  };

  render() {
    const { map, loading, fetchingTopData,
      fetchingOrgData,fetchingGeoData,
      fetchingTimeData, fetchingInsData,
      fetchingAgeData,fetchingGenData,fetchingOccData,
      fetchingIcdList,
    } = this.props;
    const { occData, ageData, geo, genderData, insData,
      topData, orgData, timeData, townData, icdList } = map;
    const { playOrNot } = this.state;
    const colorMap = {};
    topData.map((item, index) =>{
      colorMap[item.x] = this.colors[index];
      return item;
      }
    );

    return (
      <GridContent>
        <Row gutter={16}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              // loading={loading}
              style={{ marginBottom: 16 }}
              bodyStyle={{ padding: 16}}
              bordered={false}
            >
              <div className={styles.tableListForm}>
                <ZoneSearch
                  handleSearch={this.handleSearch}
                  handleFormReset={this.handleSearch}
                  handleIcdList={this.handleIcdList}
                  fetching={fetchingIcdList}
                  icdList={icdList}
                />
              </div>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <Card
                loading={fetchingTopData}
                title={<FormattedMessage id="app.health_map.DiseaseDis" defaultMessage="疾病分布" />}
                style={{ marginBottom: 16 }}
                bodyStyle={{ textAlign: 'center' }}
                bordered={false}
                extra={
                  <div className={styles.salesCardExtra}>
                    <span className={styles.iconGroup} onClick={this.playRound}>
                      {playOrNot ? <Icon type="pause-circle" /> : <Icon type="play-circle" />}
                    </span>
                  </div>
                }
              >
                <DiseaseDis
                  topData={topData}
                  height={336}
                  playOrNot={playOrNot}
                  colorMap={colorMap}
                />
              </Card>
            </Suspense>
            <Suspense fallback={null}>
              <Card
                loading={fetchingOrgData}
                title={<FormattedMessage id="app.health_map.OrgDis" defaultMessage="机构分布" />}
                style={{ marginBottom: 16 }}
                bodyStyle={{ textAlign: 'center' }}
                bordered={false}
              >
                <OrgDis
                  orgData={orgData}
                  height={336}
                  colorMap={colorMap}
                />
              </Card>
            </Suspense>
          </Col>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Row gutter={16}>
              <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 16 }}>
                <Suspense fallback={null}>
                  <Card
                    loading={fetchingGeoData}
                    title={
                      <FormattedMessage
                        id="app.health_map.map"
                        defaultMessage="Disease Distribution Map"
                      />
              }
                    bordered={false}
                  >
                    <div className={styles.mapChart}>
                      <CenterMap
                        data={geo}
                        townData={townData}
                        colorMap={colorMap}
                      />
                    </div>
                  </Card>
                </Suspense>
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                <Suspense fallback={null}>
                  <Card
                    loading={fetchingOccData}
                    title={
                      <FormattedMessage
                        id="app.health_map.OccupationDis"
                        defaultMessage="Occupational Distribution"
                      />
              }
                    style={{ marginBottom: 16 }}
                    bordered={false}
                  >
                    <OccupationDis occData={occData} />
                  </Card>
                </Suspense>
                <Suspense fallback={null}>
                  <Card
                    loading={fetchingInsData}
                    title={<FormattedMessage id="app.health_map.InsuranceDis" defaultMessage="Insurance Distribution" />}
                    style={{ marginBottom: 16 }}
                    bodyStyle={{ textAlign: 'center' }}
                    bordered={false}
                  >
                    <InsuranceDis InsData={insData} />
                  </Card>
                </Suspense>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={16} lg={24} sm={24} xs={24} style={{ marginBottom: 16 }}>
                <Suspense fallback={null}>
                  <AgeDis
                    ageData={ageData}
                    loading={fetchingAgeData}
                    height={151}
                  />
                </Suspense>
              </Col>
              <Col xl={8} lg={24} sm={24} xs={24} style={{ marginBottom: 16 }}>
                <Suspense fallback={null}>
                  <Card
                    loading={fetchingGenData}
                    title={
                      <FormattedMessage
                        id="app.health_map.GenderDis"
                        defaultMessage="GenderDis"
                      />
              }
                    bordered={false}
                    className={styles.pieCard}
                  >
                    <Row style={{ padding: '16px 0' }}>
                      <GenderDis genderData={genderData} />
                    </Row>
                  </Card>
                </Suspense>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xl={24} lg={24} sm={24} xs={24} style={{ marginBottom: 16 }}>
            <Suspense fallback={null}>
              <Card
                loading={fetchingTimeData}
                title={<FormattedMessage id="app.health_map.TimeDis" defaultMessage="时间分布" />}
                style={{ marginBottom: 16 }}
                // bodyStyle={{ textAlign: 'center' }}
                bordered={false}
              >
                <TimeDis height={163} timeData={timeData} />
              </Card>
            </Suspense>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default props => (
  <AsyncLoadBizCharts>
    <HealthMap {...props} />
  </AsyncLoadBizCharts>
);

