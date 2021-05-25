import {
  LayerEvent,
  LineLayer,
  MapboxScene,
  PointLayer,
  PolygonLayer,
  Popup,
} from '@antv/l7-react';
import * as React from 'react';
import { Switch, Avatar, Col, Row, Radio } from 'antd';
import LabelControl from '@/pages/HealthEye/SubComponents/labelControl';
import styles from './CenterMap.less';
import TownDis from '@/pages/HealthEye/SubComponents/TownDis';
import Link from "umi/link";

const personCount = {
  '玉城街道': 110080,
  '坎门街道': 67244,
  '大麦屿街道': 58339,
  '楚门镇': 51990,
  '清港镇': 51359,
  '芦浦镇': 18427,
  '龙溪镇': 17672,
  '干江镇': 22096,
  '沙门镇': 25737,
  '鸡山乡': 7465,
  '海山乡': 7518,
}

const blurColorMap = [
  '#001D70',
  '#00318A',
  '#0047A5',
  '#3D76DD',
  '#5B8FF9',
  '#7DAAFF',
  '#9AC5FF',
  '#B8E1FF',
];
const redColorMap = [
  '#781d2c',
  '#cb362d',
  '#e44f35',
  '#ef7644',
  '#f6bb67',
  '#fad986',
  '#fceca8',
  '#fff4d9',
];
const bigValRange = [
  10000,
  5000,
  1000,
  500,
  200,
  100,
  50,
  10
];
const normalValRange = [
  200,
  100,
  50,
  20,
  10,
  5,
  2,
  1,
];
const ColorMap = redColorMap;
const CenterMap = React.memo(
  ({ data, dataPoint, townData, colorMap, topData }) => {
    const [selectTownInfo, setSelectTownInfo] = React.useState();
    const [fillDownTownInfo, setfillDownTownInfo] = React.useState();
    const [selectCommunityInfo, setSelectCommunityInfo] = React.useState();
    const [townDisVisible, setTownDisVisible] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState('count');
    const selectTown = args => {
      setSelectTownInfo(
        data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined
      );
    };
    const fillDownTown = args => {
      setfillDownTownInfo(
        data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined
      );
    };
    const selectCommunity = args => {
      setSelectCommunityInfo(args.feature.name);
    };
    const onChange = () => {
      setTownDisVisible(!townDisVisible);
    };
    const handleRadioChange = ({target}) => {
      setRadioValue(target.value);
    };
    return (
      <>
        {/*<Radio.Group*/}
        {/*  buttonStyle="solid"*/}
        {/*  value={radioValue}*/}
        {/*  size='small'*/}
        {/*  onChange={handleRadioChange}*/}
        {/*  style={{*/}
        {/*    width: 100,*/}
        {/*    zIndex: 2,*/}
        {/*    position: 'absolute',*/}
        {/*    right: '50px',*/}
        {/*    top: '20px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Radio.Button value='count'>例数</Radio.Button>*/}
        {/*  <Radio.Button value='rate'>按率</Radio.Button>*/}
        {/*</Radio.Group>*/}
        <Switch
          defaultChecked={false}
          onChange={onChange}
          style={{
            width: 20,
            zIndex: 2,
            position: 'absolute',
            right: '10px',
            top: '20px',
          }}
        />
        <MapboxScene
          option={{ logoVisible: false }}
          map={{
            center: [121.431049, 28.67615],
            pitch: 0,
            style: 'blank',
            // zoom: 10,
            token:
              'pk.eyJ1IjoiY2N3eXAwMDEiLCJhIjoiY2tsdWpic29tMXl5MTJ2bHdtcjYyZWVmbCJ9.yeuv6kEjLMNxO-l6_DLBxg',
            // style: 'mapbox://styles/ccwyp001/ckluk0ujf3hia17ljg8pclr60',
          }}
          style={{
            position: 'relative',
            // position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            maxHeight: '600px',
            // outlineColor: 'red',
          }}
          className={styles.mapScene}
          onSceneLoaded={scene => {
            scene.setMapStatus({ doubleClickZoom: false });
          }}
        >
          // 地图图例 左下角
          <LabelControl position="bottomleft" key="29" style={{ position: 'relative' }}>
            <div className={styles.label}>
              <Row gutter={16}>
                <div style={{ fontSize: 14 }}>{ radioValue === 'rate' && '单位：1/10万' || '单位：例'}</div>
                {ColorMap.map((item, index) =>
                  (<Col key={index} lg={24} xl={24}>
                    <Link to={null}>
                      <Avatar shape="square" size={14} style={{ backgroundColor: item}}/>
                      { !!fillDownTownInfo && `> ${normalValRange[index]}` || `> ${bigValRange[index]}`}
                    </Link>
                  </Col>))
                }
              </Row>
            </div>
          </LabelControl>
          {data &&
            townData.length && [
              <PolygonLayer
                key="2"
                options={{
                  autoFit: true,
                  visible: !fillDownTownInfo,
                }}
                source={{
                  data: data,
                  autoFit: true,
                  parser: {
                    type: 'geojson',
                  },
                  transforms: [
                    {
                      type: 'map',
                      callback: item => {
                        const townName = item.name;
                        const data = townData.filter(it => it.x === townName);
                        item.value = (data[0] && data[0].y) || 0;
                        if (radioValue === 'rate') item.value = item.value / 100000 * personCount[townName];
                        // console.log(item);
                        return item;
                      },
                    },
                  ],
                }}
                color={{
                  field: 'value',
                  values: value => {
                    for (let i=0; i<bigValRange.length; i++){
                      if (value > bigValRange[i]) return ColorMap[i]
                    }
                    return '#fdf7f7';
                  },
                }}
                shape={{
                  values: 'fill',
                }}
                style={{
                  opacity: 1,
                }}
                active={{
                  option: { color: '#c49c39' },
                }}
                onLayerLoaded={(layer, scene) => {
                  // layer.setActive(1);
                }}
                // select={{
                //   option: { color: '#ff1642' }
                // }}
              >
                <LayerEvent
                  type="click"
                  handler={e => {
                    selectTown(e);
                  }}
                />
                <LayerEvent
                  type="dblclick"
                  handler={e => {
                    fillDownTown(e);
                  }}
                />
                <LayerEvent
                  type="unclick"
                  handler={() => {
                    setSelectTownInfo(undefined);
                  }}
                />
              </PolygonLayer>,
              <LineLayer
                key="3"
                source={{ data }}
                options={{
                  visible: !fillDownTownInfo,
                }}
                color={{
                  values: ['#363535'],
                }}
                size={{
                  values: 1,
                }}
                shape={{
                  values: ['line'],
                }}
                style={{
                  opacity: 1,
                }}
              />,
              <PointLayer
                key="4"
                source={{
                  data: dataPoint,
                  parser: {
                    type: 'json',
                    x: 'x',
                    y: 'y',
                  },
                }}
                options={{
                  visible: !fillDownTownInfo,
                }}
                color={{
                  value: '#3e3e3e',
                }}
                shape={{
                  field: 'name',
                  values: 'text',
                }}
                size={{
                  values: 16,
                }}
                style={{
                  textAnchor: 'center',
                  textOffset: [0, 0],
                  opacity: 1,
                  strokeOpacity: 1,
                  strokeWidth: 0,
                  textAllowOverlap: false,
                  stroke: '#000',
                  padding: [1, 1],
                }}
              />,
            ]}
          {townDisVisible &&
            townData && [
              <LabelControl position="topright" key="19" style={{ position: 'relative' }}>
                <TownDis
                  title={fillDownTownInfo ? `村居分布-${fillDownTownInfo}` : '乡镇分布'}
                  townData={
                    fillDownTownInfo
                      ? townData.filter(it => it.x === fillDownTownInfo)[0]?.children
                      : townData
                  }
                  colorMap={colorMap}
                  topData={topData}
                  popupInfo={fillDownTownInfo ? selectCommunityInfo : selectTownInfo}
                />
              </LabelControl>,
            ]}
          {(fillDownTownInfo && [
            <PolygonLayer
              key="20"
              options={
                {
                  // autoFit: true,
                }
              }
              source={{
                data: data,
                parser: {
                  type: 'geojson',
                },
                transforms: [
                  {
                    type: 'filter',
                    callback: item => {
                      const townName = item.name;
                      return townName === fillDownTownInfo;
                    },
                  },
                ],
              }}
              color={{
                field: 'value',
                values: value => {
                  return '#fcf1f1';
                },
              }}
              shape={{
                values: 'fill',
              }}
              style={{
                opacity: 0,
              }}
              // active={{
              //   option: { color: '#c49c39' },
              // }}
              onLayerLoaded={(layer, scene) => {
                const bound = dataPoint.filter(it => it.name === fillDownTownInfo)[0]?.bound;
                setTimeout(() => scene.fitBounds(bound), 50);
                layer.on('undblclick', ev => {
                  // console.log(ev);
                  layer.fitBounds();
                  setfillDownTownInfo(undefined);
                  setSelectCommunityInfo(undefined);
                });
                // layer.setActive(1);
              }}
              // select={{
              //   option: { color: '#ff1642' }
              // }}
            />,
            <LineLayer
              key="30"
              source={{
                data: data,
                parser: {
                  type: 'geojson',
                },
                transforms: [
                  {
                    type: 'filter',
                    callback: item => {
                      const townName = item.name;
                      return townName === fillDownTownInfo;
                    },
                  },
                ],
              }}
              color={{
                values: ['#363535'],
              }}
              size={{
                values: 1,
              }}
              shape={{
                values: ['line'],
              }}
              style={{
                opacity: 1,
              }}
            />,
            <PointLayer
              key={'35'}
              source={{
                data: dataPoint.filter(it => it.name === fillDownTownInfo)[0],
                parser: {
                  type: 'geojson',
                },
                transforms: [
                  {
                    type: 'map',
                    callback: item => {
                      const comName = item.name;
                      const comData = townData.filter(it => it.x === fillDownTownInfo);
                      const data = comData[0]?.children.filter(it => it.x === comName);
                      item.value = data && data.length ? data[0]?.y : 0;
                      return item;
                    },
                  },
                ],
              }}
              scale={{
                values: {
                  value: {
                    type: 'linear',
                  },
                },
              }}
              color={{
                field: 'value',
                values: value => {
                  for (let i=0; i<normalValRange.length; i++){
                    if (value > normalValRange[i]) return ColorMap[i]
                  }
                  return 'rgba(52,255,0,0.8)';
                },
              }}
              shape={{
                values: 'circle',
              }}
              active={{
                option: {
                  color: '#0c2c84',
                },
              }}
              size={{
                field: 'value',
                values: value => {
                  if (value + 10 > 30) return 30;
                  return value + 10;
                },
              }}
              style={{
                opacity: 0.8,
              }}
            >
              <LayerEvent
                type="click"
                handler={e => {
                  selectCommunity(e);
                }}
              />
              <LayerEvent
                type="unclick"
                handler={e => {
                  setSelectCommunityInfo(undefined);
                }}
              />
            </PointLayer>,
            <PointLayer
              key="40"
              source={{
                data: dataPoint.filter(it => it.name === fillDownTownInfo)[0],
                parser: {
                  type: 'geojson',
                },
                transforms: [
                  {
                    type: 'map',
                    callback: item => {
                      const comName = item.name;
                      const comData = townData.filter(it => it.x === fillDownTownInfo);
                      const data = comData[0]?.children.filter(it => it.x === comName);
                      item.value = data && data.length ? data[0]?.y : 0;
                      return item;
                    },
                  },
                ],
              }}
              options={{}}
              color={{
                field: 'value',
                values: value => {
                  if (value > 200) return '#781d2c';
                  if (value > 100) return '#a8292f';
                  if (value > 50) return '#cb362d';
                  if (value > 20) return '#e44f35';
                  if (value > 10) return '#ef7644';
                  if (value > 5) return '#f39d54';
                  if (value > 2) return '#f6bb67';
                  if (value > 1) return '#fad986';
                  return 'rgba(52,255,0,0.8)';
                },
              }}
              // color={{
              //   values: '#ffebeb',
              // }}
              shape={{
                field: 'name',
                values: 'text',
              }}
              size={{
                values: 15,
              }}
              style={{
                textAnchor: 'center',
                textOffset: [0, 0],
                // opacity: 1,
                // spacing: 2,
                textAllowOverlap: true,
                stroke: '#000',
                strokeOpacity: 0.8,
                strokeWidth: 0.9,
                padding: [0.1, 0.1],
              }}
            />,
            // <Popup
            //   key='1'
            //   lnglat={popupInfo.lnglat}
            //   option={{
            //     closeButton: false,
            //     offsets: [0,10],
            //   }}
            // >
            //   {popupInfo.feature.properties.name}
            // </Popup>,
          ]) ||
            []}
        </MapboxScene>
      </>
    );
  },
  (next, prev) => {
    let _prev = JSON.stringify(prev);
    let _next = JSON.stringify(next);
    return _prev === _next;
  }
);

export default CenterMap;
