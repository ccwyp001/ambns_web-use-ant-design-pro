import React, { memo } from 'react';
import { Card, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
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

function mapSum(d) {
  let count = 0;
  Object.keys(d).map(key => {
    count += d[key];
    return key
  });
  return count;
}


class TownDis extends React.PureComponent {
  static defaultProps = {
    townData: [],
    height: 425

  };
  dv = new DataSet().createView();
  constructor(props) {
    super(props);

  }

  render() {
    const { height, townData:data, colorMap } = this.props;

    this.dv.source(data);
    this.dv.source(data).transform({
      type: "sort",
      callback(a,b){
        return mapSum(a.icds) - mapSum(b.icds);
      }
    })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = {...row};
          newRow.count = 0;
          Object.keys(row.icds).map(key => {
            newRow[key] = row.icds[key];
            newRow.count += row.icds[key];
            return newRow
          });
          // console.log(newRow);
          return newRow
        },
      })
      .transform({
        type: 'fold',
        fields: data[0] && Object.keys(data[0].icds) || ['x'],
        key: 'icdCode',
        value: 'value',
      })
    ;
    return (
      <Card
        // loading={loading}
        style={{ marginBottom: 16 , opacity:0.95}}
        bodyStyle={{ padding: 8}}
        bordered={false}
      >
        <h4>乡镇分布</h4>
        <Chart
          height={height}
          data={this.dv}
          // forceFit
          padding='auto'
          // padding={{ top: 20, right: 10, bottom: 20, left: 70 }}
          width={220}
        >
          <Legend position='bottom-center' />
          <Coord transpose />
          <Axis
            name="x"
            label={{
              offset: 12
            }}
          />
          <Axis name="value" visible={false} />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="x*value"
            color={['icdCode', (item) =>{
              return colorMap[item]
            }]}
          />
        </Chart>
      </Card>
    );
  }
}

export default TownDis;
