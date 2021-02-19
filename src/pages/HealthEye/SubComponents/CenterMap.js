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

const CenterMap = React.memo(({ data, dataPoint, townData, colorMap }) => {
  const [popupInfo, setPopupInfo] = React.useState();
  const [townDisVisible, setTownDisVisible] = React.useState(false);
  const showPopup = args => {
    // console.log(args);
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature,
    });
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
      {data && townData && [
        <PolygonLayer
          key="2"
          options={{
            autoFit: true,
          }}
          source={{
            data,
            transforms: [
              {
                type: 'join',
                sourceField: 'x', //data1 对应字段名
                targetField: 'name', // data 对应字段名 绑定到的地理数据
                data: townData,
              },]
          }}
          color={{
            field: 'name',
            values: ['#732200',
              '#CC3D00',
              '#FF6619',
              '#ff9466',
              '#FFC1A6',
              '#FCE2D7',
              '#ffe3e3'].reverse(),
          }}
          shape={{
            values: 'fill',
          }}
          style={{
            opacity: 1,
          }}
          active={{
            option: { color: '#d28329' },
          }}
          onLayerLoaded={(layer, scene) => {
            layer.setActive(1);
          }}
          // select={{
          //   option: { color: '#ff1642' }
          // }}
        >
          <LayerEvent type="click" handler={showPopup} />
          <LayerEvent
            type="unclick"
            handler={() => {
              setPopupInfo(undefined);
            }}
          />
        </PolygonLayer>,
        // 图层边界
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
            values: 12,
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
          <TownDis townData={townData} colorMap={colorMap} />
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
