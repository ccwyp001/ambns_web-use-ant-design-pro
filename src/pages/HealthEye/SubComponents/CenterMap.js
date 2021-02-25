import {
  HeatmapLayer,
  LayerEvent,
  LineLayer,
  MapboxScene,
  Marker,
  PointLayer,
  PolygonLayer,
  Popup,
  CustomControl,
  Control,
} from '@antv/l7-react';
import * as React from 'react';
import {Select, Switch} from 'antd';
import LabelControl from '@/pages/HealthEye/SubComponents/labelControl';
import TownDis from '@/pages/HealthEye/SubComponents/TownDis';
const { Option } = Select;

const CenterMap = React.memo(({ data, dataPoint, townData, colorMap, topData }) => {
  const [popupInfo, setPopupInfo] = React.useState();
  const [townDisVisible, setTownDisVisible] = React.useState(false);
  const showPopup = args => {
    // console.log(args);
    setPopupInfo(data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined);
  };
  const onChange = () => {
    setTownDisVisible(!townDisVisible)
  };

  return (
    <>
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
    {/*<Select*/}
    {/*  defaultValue="黑龙江省"*/}
    {/*  style={{*/}
    {/*    width: 120,*/}
    {/*    zIndex: 2,*/}
    {/*    position: 'absolute',*/}
    {/*    right: '10px',*/}
    {/*    top: '30px',*/}
    {/*  }}*/}
    {/*>*/}
    {/*  <Option value="month">月</Option>*/}
    {/*  <Option value="week">周</Option>*/}
    {/*</Select>*/}
    <MapboxScene
      option={{ logoVisible: false }}
      map={{
        center: [121.431049, 28.67615],
        pitch: 0,
        style: 'blank',
        zoom: 10,
      }}
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        maxHeight: '600px',
      }}
    >
      {data && townData.length && [
        <PolygonLayer
          key="2"
          options={{
            autoFit: true,
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
                callback: (item) => {
                  const townName = item.name;
                  const data = townData.filter(it => it.x === townName)
                  item.value = data[0] && data[0].y || 0
                  // console.log(item)
                  return item;
                }
              }
              // {
              //   type: 'join',
              //   sourceField: 'properties.name',
              //   targetField: 'x', // data 对应字段名 绑定到的地理数据
              //   data: townData,
              //   callback: () => console.log('123345'),
              // }
            ]
          }}
          color={{
            field: 'value',
            values: (value) => {
              if (value > 20000) return '#781d2c';
              if (value > 10000) return '#a8292f';
              if (value > 5000) return '#cb362d';
              if (value > 2000) return '#e44f35';
              if (value > 1000) return '#ef7644';
              if (value > 500) return '#f39d54';
              if (value > 200) return '#f6bb67';
              if (value > 100) return '#fad986';
              if (value > 50) return '#fceca8';
              if (value > 20) return '#fff2bd';
              if (value > 10) return '#fff4d9';
              return '#ffeeee'
            }
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
          <LayerEvent type="click" handler={e => {showPopup(e)}} />
          <LayerEvent
            type="unclick"
            handler={() => {
              setPopupInfo(undefined);
            }}
          />
        </PolygonLayer>,
        <LineLayer
          key="3"
          source={{ data }}
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
          // source={{data}}
          source={{
            data: dataPoint,
            parser: {
              type: "json",
              x: "x",
              y: "y"
            }
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
            textOffset: [ 0, 0 ],
            opacity: 1,
            strokeOpacity: 1,
            strokeWidth: 0,
            textAllowOverlap: false,
            stroke: '#000',
            padding: [1, 1],
          }}
        />,
      ]}
      {townDisVisible && townData && [
        <LabelControl position="topright" key="19" style={{ position: 'relative' }}>
          <TownDis townData={townData} colorMap={colorMap} topData={topData} popupInfo={popupInfo} />
        </LabelControl>,]
      }
      {(popupInfo &&
        [
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
          // <LabelControl
          //   key="9"
          // >
          //   {popupInfo.feature.properties.name}
          // </LabelControl>,
        ]) ||
        []}
    </MapboxScene>
    </>
  );
});

export default CenterMap;
