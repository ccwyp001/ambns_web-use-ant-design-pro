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

const CenterMap = React.memo(({ data }) => {
  const [popupInfo, setPopupInfo] = React.useState();
  const showPopup = args => {
    setPopupInfo({
      lnglat: args.lngLat,
      feature: args.feature,
    })
  };

  return (
    <MapboxScene
      option={{logoVisible: false}}
      map={{
        center: [ 121.431049, 28.67615 ],
        pitch: 0,
        style: 'blank',
        zoom: 10
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
      {
        data && [
          <PolygonLayer
            key="2"
            options={{
              autoFit: true
            }}
            source={{
              data
            }}
            color={{
              field: 'name',
              values: [
                '#1d3969',
              ]
            }}
            shape={{
              values: 'fill'
            }}
            style={{
              opacity: 1
            }}
            active={{
              option: { color: '#d28329'}
            }}
            select={{
              option: { color: '#ff1642' }
            }}
          >
            <LayerEvent type='mousemove' handler={showPopup} />
            <LayerEvent type='mouseout' handler={()=>{setPopupInfo(undefined)}} />
          </PolygonLayer>,
          <LineLayer
            key="3"
            source={{data}}
            color={{
              values: [
                '#38b5d9',
              ]}}
            size={{
              values: 1,
            }}
            shape={{
              values: [
                'line',
              ]
            }}
            style={{
              opacity: 1
            }}
          />,

          // <Control key='6' type='zoom' position='bottomleft' />
        ]
      }
      {popupInfo && [
        <Popup
          key='1'
          lnglat={popupInfo.lnglat}
          option={{
            closeButton: false,
            offsets: [0,10],
          }}
        >
          {popupInfo.feature.properties.name}
        </Popup>,
        <CustomControl
          key='4'
          position="bottomright"
        >
          <ul
            key="5"
          >
            <li>现有确诊:1</li>
            <li>累计确诊:2</li>
            <li>治愈:3</li>
            <li>死亡:4</li>
          </ul>
        </CustomControl>
      ]}
    </MapboxScene>
  );
});


export default CenterMap;
