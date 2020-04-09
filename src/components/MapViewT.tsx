import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class AMapExample extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      // 'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
      'http://localhost:8000/api/geographic/yuhuan',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.255795,28.170397],
        pitch: 0,
        style: 'dark',
        zoom: 11.0,
        token: 'a452b2ccc41c5e2e0bd9c6dade00eeb7', // 高德或者 Mapbox 的 token
        plugin: [],
      }),
    });
    const layer = new PolygonLayer({});

    const data = await response.json();
    layer
      .source(data)
      .size('name', [0, 10000, 50000, 30000, 100000])
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
        '#7bb6cf',
      ])
      .shape('fill')
      // .active(true)
      .style({
        opacity: 0.8,
      });

    const layer2 = new LineLayer({
      zIndex: 2
    })
      .source(data
      )
      .color('#fff')
      // .active(true)
      .size(1)
      .style({
        lineType: 'dash',
        dashArray: [ 2, 2 ],
        opacity: 1
      })
      // .animate({
      //   interval: 1, // 间隔
      //   duration: 1, // 持续时间，延时
      //   trailLength: 2 // 流线长度
      // })
    ;

    scene.addLayer(layer);
    scene.addLayer(layer2);


    this.scene = scene;
  }

  public render() {
    return (
      <div
        id="map"
    style={{
      position: 'relative',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      'minHeight': 500,
      'justifyContent': 'center'
    }}
    />
  );
  }
}
