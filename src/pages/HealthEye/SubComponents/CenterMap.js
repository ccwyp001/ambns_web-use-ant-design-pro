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
import LabelControl from '@/pages/HealthEye/SubComponents/labelControl';

const CenterMap = React.memo(({ data }) => {
  const [popupInfo, setPopupInfo] = React.useState();
  const showPopup = args => {
    // console.log(args);
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
            // select={{
            //   option: { color: '#ff1642' }
            // }}
          >
            <LayerEvent type='mousemove' handler={showPopup} />
            <LayerEvent type='mouseout' handler={()=>{setPopupInfo(undefined)}} />
          </PolygonLayer>,
          // 图层边界
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
          <LabelControl key="9" info={popupInfo} />
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

      ]}
    </MapboxScene>
  );
});


export default CenterMap;
