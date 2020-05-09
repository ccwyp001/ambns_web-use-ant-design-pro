import React from "react";
import { FormattedMessage, formatMessage } from 'umi/locale';
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
  Util,
} from "bizcharts";
import { Card } from 'antd';
import DataSet from "@antv/data-set";
import Slider from 'bizcharts-plugin-slider';

const ds = new DataSet({
  state: {
    start: 0,
    end: 1,
  },
});

class TimeDis extends React.Component {
  static defaultProps = {
    timeData: [],
    height: 188
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.timeData,
    }
  }

  handleSliderChange = e => {
    // console.log(e);
    const { startRadio, endRadio } = e;
    ds.setState('start', startRadio);
    ds.setState('end', endRadio);
  };

  render() {
    const { height } = this.props;
    const { data } = this.state;

    const timeScale = {
      type: 'time',
      // tickInterval: 7 * 24 * 60 * 60 * 1000,
      // tickCount: 12,
      // minTickInterval: 24 * 60 * 60 * 1000,
      mask: 'YYYY-MM-DD',
      range: [0, 1],
    };

    const cols = {
      x: timeScale,
    };
    const dv = ds.createView().source(data);
    const dvSlider = ds.createView().source(data);
    dvSlider.transform({
      type: 'map',
      callback(row) {
        const newRow = {...row};
        newRow.count = 0;
        Object.keys(row.icds).map(key => {
          newRow.count += row.icds[key];
          return newRow;
        });
        // console.log(newRow);
        return newRow
      },
    });

    dv.transform({
      type: 'filter',
      callback(item, idx) {
        const radio = idx / data.length;
        return radio >= ds.state.start && radio <= ds.state.end;
      },
    })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = {...row};
          newRow.count = 0;
          Object.keys(row.icds).map(key => {
            newRow[key] = row.icds[key];
            newRow.count += row.icds[key];
            return newRow;
          });
          // console.log(newRow);
          return newRow
        },
      })
      .transform({
        type: 'fold',
        fields: data[0] && Object.keys(data[0].icds), // 展开字段集
        key: 'icdCode', // key字段
        value: 'value', // value字段
      });
    return (
      <div>
        <Chart height={height} data={dv} scale={cols} forceFit padding='auto'>
          <Axis name="x" />
          <Axis name="value" />
          <Legend position={'right'} />
          <Tooltip
            crosshairs={{
            type: "line"
          }}
          />
          <Geom type="areaStack" position="x*value" color="icdCode" />
          <Geom type="lineStack" position="x*value" size={2} color="icdCode" />
        </Chart>
        <Slider
          data={dvSlider}
          padding={[60, 140, 0, 40]}
          scales={{ x: timeScale }}
          width="auto"
          xAxis="x"
          yAxis="count"
          onChange={this.handleSliderChange}
        />
      </div>
    );
  }
}

export default TimeDis;
