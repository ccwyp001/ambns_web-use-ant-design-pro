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
    InsData: [],
    height: 188
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.InsData,
    }
  }

  handleSliderChange = e => {
    // console.log(e);
    const { startRadio, endRadio } = e;
    ds.setState('start', startRadio);
    ds.setState('end', endRadio);
  };

  render() {
    const { height, loading } = this.props;
    const data = [
      {
        year: "1750",
        country: {
        Asia: 502,
        Africa: 106,
        Europe: 200,
        Oceania: 300,}
      },
      {
        year: "1800",
        country: {
        Asia: 600,
        Africa: 206,
        Europe: 300,
        Oceania: 400,}
      },
      {
        year: "1850",
        country: {
        Asia: 702,
        Africa: 306,
        Europe: 500,
        Oceania: 600,}
      },
      {
        year: "1900",
        country: {
        Asia: 1002,
        Africa: 1106,
        Europe: 800,
        Oceania: 700,}
      },
      {
        year: "1950",
        country: {
        Asia: 1502,
        Africa: 1306,
        Europe: 1200,
        Oceania: 1300,}
      },
      {
        year: "2000",
        country: {
        Asia: 1902,
        Africa: 1406,
        Europe: 900,
        Oceania: 800,}
      },
      {
        year: "2050",
        country: {
        Asia: 1002,
        Africa: 2306,
        Europe: 1200,
        Oceania: 1300,}
      },
      {
        year: "2100",
        country: {
          Asia: 1502,
          Africa: 1106,
          Europe: 400,
          Oceania: 300,
        }
      },
    ];
    const cols = {
      year: {
        type: "linear",
        tickInterval: 50
      }
    };
    const dv = ds.createView().source(data);
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
          Object.keys(row.country).map(key => {
            newRow[key] = row.country[key];
            newRow.count += row.country[key];
            return newRow;
          });
          // console.log(newRow);
          return newRow
        },
      })
      .transform({
        type: 'fold',
        fields: Object.keys(data[0].country), // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });
    return (
      <div>
        <Card
          loading={loading}
          title={<FormattedMessage id="app.health_map.TimeDis" defaultMessage="时间分布" />}
          style={{ marginBottom: 16 }}
          // bodyStyle={{ textAlign: 'center' }}
          bordered={false}
        >
          <Chart height={height} data={dv} scale={cols} forceFit padding='auto'>
            <Axis name="year" />
            <Axis name="value" />
            {/*<Legend />*/}
            <Tooltip
              crosshairs={{
              type: "line"
            }}
            />
            <Geom type="areaStack" position="year*value" color="key" />
            <Geom type="lineStack" position="year*value" size={2} color="key" />
          </Chart>
          <Slider
            data={data}
            padding={60}
            width="auto"
            xAxis="year"
            yAxis="Asia"
            onChange={this.handleSliderChange}
          />
        </Card>
      </div>
    );
  }
}

export default TimeDis;
