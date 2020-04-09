// @ts-ignore
import { PolygonLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as dat from 'dat.gui';
import * as React from 'react';

export default class AdvancedAPI extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    if (this.gui) {
      this.gui.destroy();
    }
    if (this.$stats) {
      document.body.removeChild(this.$stats);
    }
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [110.19382669582967, 50.258134],
        pitch: 0,
        zoom: 3,
      }),
    });
    const layer = new PolygonLayer({
      enablePicking: true,
      enableHighlight: true,
      highlightColor: [0, 0, 1, 1],
      onHover: (pickedFeature) => {
        // tslint:disable-next-line:no-console
      },
      onClick: (pickedFeature) => {
        // tslint:disable-next-line:no-console
      },
    });

    layer
      .source(await response.json())
      .size('name', [0, 10000, 50000, 30000, 100000])
      .active({
        color: 'red',
      })
      .color('name', [
        '#2E8AE6',
        '#69D1AB',
        '#DAF291',
        '#FFD591',
        '#FF7A45',
        '#CF1D49',
      ])
      .shape('fill')
      .style({
        opacity: 0.8,
      });
    scene.addLayer(layer);
    layer.on('click', (e) => {
      console.log(e);
    });

    this.scene = scene;

    /*** 运行时修改样式属性 ***/
    const gui = new dat.GUI();
    this.gui = gui;
    const styleOptions = {
      enablePicking: true,
      enableHighlight: true,
      highlightColor: [1, 0, 0],
      pickingX: window.innerWidth / 2,
      pickingY: window.innerHeight / 2,
      visible: true,
    };
    const pointFolder = gui.addFolder('非鼠标 hover 交互');
    pointFolder
      .add(styleOptions, 'enableHighlight')
      .onChange((enableHighlight: boolean) => {
        layer.style({
          enableHighlight,
        });
        scene.render();
      });
    pointFolder.add(styleOptions, 'visible').onChange((visible: boolean) => {
      layer.style({
        visible,
      });
      scene.render();
    });
    pointFolder
      .add(styleOptions, 'pickingX', 0, window.innerWidth)
      .onChange((pickingX: number) => {
        layer.setActive({ x: pickingX, y: styleOptions.pickingY });
      });
    pointFolder
      .add(styleOptions, 'pickingY', 0, window.innerHeight)
      .onChange((pickingY: number) => {
        layer.setActive({ x: styleOptions.pickingX, y: pickingY });
      });
    pointFolder
      .addColor(styleOptions, 'highlightColor')
      .onChange((highlightColor: number[]) => {
        const [r, g, b] = highlightColor.map((c) => c / 255);
        layer.setActive(
          { x: styleOptions.pickingX, y: styleOptions.pickingY },
          { color: [r, g, b, 1] },
        );
        scene.render();
      });
    pointFolder.open();
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
