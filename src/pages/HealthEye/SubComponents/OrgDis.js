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

function mapSum(d) {
  let count = 0;
  Object.keys(d).map(key => {
    count += d[key];
    return key
  });
  return count;
}


class OrgDis extends React.Component {
  static defaultProps = {
    orgData: [],
    height: 188
  };

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      data: props.orgData,
    }
  }

  render() {
    const { height, data } = this.state;
    const { colorMap, topList } = this.props;

    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
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
        fields: topList.length && topList || ['x'],
        key: 'icdCode',
        value: 'value',
      })
    ;
    return (
      <div>
        <Chart
          height={height}
          data={dv}
          forceFit
          // padding={[ 'auto', 'auto', 'auto', 100]}
          padding={'auto'}
        >
          <Legend />
          <Coord transpose />
          <Axis
            name="x"
            label={{
              offset: 10,
              formatter: (val) => {
                const text = val.replace('玉环市', '')
                return `${ text.length > 7 ? text.slice(0,7) + '..' : text }`
              },

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
      </div>
    );
  }
}

export default OrgDis;
