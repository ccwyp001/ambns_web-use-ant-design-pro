import {
  LayerEvent,
  LineLayer,
  MapboxScene,
  PointLayer,
  PolygonLayer,
  Popup,
} from '@antv/l7-react';
import * as React from 'react';
import {Switch} from 'antd';
import LabelControl from '@/pages/HealthEye/SubComponents/labelControl';
import TownDis from '@/pages/HealthEye/SubComponents/TownDis';

const CenterMap = React.memo(({ data, dataPoint, townData, colorMap, topData }) => {
  const [selectTownInfo, setSelectTownInfo] = React.useState();
  const [fillDownTownInfo, setfillDownTownInfo] = React.useState();
  const [selectCommunityInfo, setSelectCommunityInfo] = React.useState();
  const [townDisVisible, setTownDisVisible] = React.useState(false);
  const selectTown = args => {
    setSelectTownInfo(data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined);
  };
  const fillDownTown = args => {
    setfillDownTownInfo(data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined);
  };
  const selectCommunity = args => {
    setSelectCommunityInfo(args.feature.name);
    // setSelectTownInfo(data.features[args.featureId] ? data.features[args.featureId].properties.name : undefined);
  };
  const onChange = () => {
    setTownDisVisible(!townDisVisible)
  };
  // console.log(1111111);
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
    <MapboxScene
      option={{ logoVisible: false }}
      map={{
        center: [121.431049, 28.67615],
        pitch: 0,
        style: 'blank',
        // zoom: 10,
        token: 'pk.eyJ1IjoiY2N3eXAwMDEiLCJhIjoiY2tsdWpic29tMXl5MTJ2bHdtcjYyZWVmbCJ9.yeuv6kEjLMNxO-l6_DLBxg',
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
      }}
      onSceneLoaded={(scene) => {
        scene.setMapStatus({ doubleClickZoom: false });
      }}
    >
      {data && townData.length && [
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
                callback: (item) => {
                  const townName = item.name;
                  const data = townData.filter(it => it.x === townName)
                  item.value = data[0] && data[0].y || 0
                  // console.log(item)
                  return item;
                }
              }
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
          <LayerEvent type="click" handler={e => {selectTown(e)}} />
          <LayerEvent type="dblclick" handler={e => {fillDownTown(e)}} />
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
              type: "json",
              x: "x",
              y: "y"
            }
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
          <TownDis
            title={fillDownTownInfo ? `村居分布-${fillDownTownInfo}` :'乡镇分布'}
            townData={fillDownTownInfo ? townData.filter(it => it.x === fillDownTownInfo)[0]?.children : townData}
            colorMap={colorMap}
            topData={topData}
            popupInfo={fillDownTownInfo ? selectCommunityInfo : selectTownInfo}
          />
        </LabelControl>,]
      }
      {(fillDownTownInfo &&
        [
          <PolygonLayer
          key="20"
          options={{
            // autoFit: true,
          }}
          source={{
            data: data,
            parser: {
              type: 'geojson',
            },
            transforms: [
              {
                type: 'filter',
                callback: (item) => {
                  const townName = item.name;
                  return townName === fillDownTownInfo ;
                }
              }
            ]
          }}
          color={{
            field: 'value',
            values: (value) => {
              return '#fcf1f1'
            }
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
            setTimeout(() => scene.fitBounds(
              bound
            ), 50)
            layer.on('undblclick', (ev) => {
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
        >
        </PolygonLayer>,
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
                callback: (item) => {
                  const townName = item.name;
                  return townName === fillDownTownInfo ;
                }
              }
            ]
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
                callback: (item) => {
                  const comName = item.name;
                  const comData = townData.filter(it => it.x === fillDownTownInfo)
                  const data = comData[0]?.children.filter(it => it.x === comName)
                  item.value = data && data.length ? data[0]?.y : 0
                  return item;
                }
              }
            ]
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
              values: (value) => {
                if (value > 2000) return '#781d2c';
                if (value > 1000) return '#a8292f';
                if (value > 500) return '#cb362d';
                if (value > 200) return '#e44f35';
                if (value > 100) return '#ef7644';
                if (value > 50) return '#f39d54';
                if (value > 20) return '#f6bb67';
                if (value > 10) return '#fad986';
                if (value > 5) return '#fceca8';
                if (value > 2) return '#fff2bd';
                if (value > 1) return '#fff4d9';
                return 'rgba(52,255,0,0.8)'
              }
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
              values: (value) => {
                if (value + 10 > 30) return 30;
                return value + 10;
              }
            }}
            style={{
              opacity: 0.8,
            }}
          >
            <LayerEvent type="click" handler={e => {selectCommunity(e)}} />
            <LayerEvent type="unclick" handler={e => {setSelectCommunityInfo(undefined)}} />
          </PointLayer>,
          <PointLayer
          key="40"
          source={{
            data: dataPoint.filter(it => it.name === fillDownTownInfo)[0],
            // parser: {
            //   type: "json",
            //   x: "x",
            //   y: "y"
            // }
          }}
          options={{

          }}
          color={{
            values: '#ffebeb',
          }}
          shape={{
            field: 'name',
            values: 'text',
          }}
          size={{
            values: 13,
          }}
          style={{
            textAnchor: 'center',
            textOffset: [ 0, 0 ],
            // opacity: 1,
            // spacing: 2,
            textAllowOverlap: true,
            stroke: '#000',
            strokeOpacity: 1,
            strokeWidth: 0.3,
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
}, (next, prev)=>{
  // console.log(next);
  // console.log(prev);
  // console.log(shallowEqual(next, prev));
});

export default CenterMap;
