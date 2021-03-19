import { Control } from '@antv/l7';
import * as React from 'react';
import { useSceneValue } from '@antv/l7-react';
import { createPortal } from 'react-dom';
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

const {useEffect, useState, useCallback} = React;

export default function LabelControl(props) {
  const {children, className, style, position} = props;
  const el = document.createElement('div');
  const mapScene = useSceneValue();
  // const _useState = useState();
  // const _useState2 = _slicedToArray(_useState, 2);
  // const setControl = _useState2[1];
  const custom = new Control({
    position: position || 'bottomright'
  });

  custom.onAdd = () => {
    if (className) {
      el.className = className;
    }

    if (style) {
      el.style.cssText = Object.keys(style)
        .map(key => ''.concat(key, ':')
          .concat(style[key])).join(';');
    }
    return el;
  };
  custom.onRemove = () => {

  };
  useEffect(() => {
    // console.log(custom);
    // setControl(custom);
    mapScene.addControl(custom);
    return () => {
      // console.log(mapScene);
      mapScene.removeControl(custom);
    };
  }, [style]);
  return createPortal(children, el);
}
