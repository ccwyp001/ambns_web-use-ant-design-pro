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

class DiseaseDis extends React.Component {
  static defaultProps = {
    topData: [],
    height: 188
  };

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      data: props.topData,
    }
  }

  render() {
    const { height, data } = this.state;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: "sort-by",
      fields: ['y'],
      order: 'ASC'
    });
    return (
      <div>
        <Chart
          height={height}
          data={dv}
          forceFit
          padding={{ top: 'auto', right: 30, bottom: 'auto', left: 60 }}
        >
          <Coord transpose />
          <Axis
            name="x"
            label={{
              offset: 12
            }}
          />
          <Axis name="y" visible={false} />
          <Tooltip />
          <Geom type="interval" position="x*y" color={"x"} >
            <Label content='y' offset={5} />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default DiseaseDis;
