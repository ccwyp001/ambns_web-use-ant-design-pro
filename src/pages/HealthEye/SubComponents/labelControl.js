import { Control } from '@antv/l7';
import * as React from 'react';
import { useSceneValue } from '@antv/l7-react';
import { createPortal } from 'react-dom';

const {useEffect, useState} = React;
export default function LabelControl(props) {
  const {children, info} = props;
  const mapScene = useSceneValue();
  const el = document.createElement('div');
  useEffect(function () {
    const custom = new Control({
      position: 'bottomright'
    });

    custom.onAdd = () => {
      el.innerHTML = `<div class='mapinfo'>
      <h4>${info && info.feature.properties.name}</h4>
      <span>数据来源：<a  target='_blank' href="https://github.com/BlankerL/DXY-COVID-19-Crawler">BlankerL</a></span>
      <span>地图可视化库：<a  target='_blank' href="https://github.com/antvis/L7">AntV | L7</a></span>
      <span>源码：<a  target='_blank' href="https://github.com/lzxue/yiqingditu">疫情地图</a></span>
    </div>`;
      return el;
    };

    mapScene.addControl(custom);
    return () => {
      mapScene.removeControl(custom);
    };
  }, [info]);
  return createPortal(children, el);
}
