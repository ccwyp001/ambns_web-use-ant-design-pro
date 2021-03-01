import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from '../Map.less';
import { Pie } from '@/components/Charts';
import Yuan from '@/utils/Yuan';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";

class InsuranceDis extends React.Component {
  static defaultProps = {
    InsData: [],
    height: 188
  };

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      data: props.InsData,
    }
  }

  render() {
    const { height, data } = this.state;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: "sort",
      callback(a, b) {
        // 排序依据，和原生js的排序callback一致
        return a.y - b.y > 0;
      }
    });
    return (
      <div>
        <Chart height={height} data={dv} forceFit padding='auto'>
          <Coord transpose />
          <Axis
            name="x"
            label={{
              offset: 12
            }}
          />
          <Axis name="y" visible={false} />
          <Tooltip showTitle={false} />
          <Geom
            type="interval"
            position="x*y"
            tooltip={['x*y', (x, y) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: x,
                value: y
              };
            }]}
          />
        </Chart>
      </div>
    );
  }
}

export default InsuranceDis;
