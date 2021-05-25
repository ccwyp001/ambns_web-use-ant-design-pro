import React from "react";
import { FormattedMessage, formatMessage } from 'umi/locale';
import DataSet from "@antv/data-set";
import { Column, Area  } from "@ant-design/charts";
import moment from "moment";

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

  render() {
    const { height, colorMap, topList } = this.props;
    const { data } = this.state;

    const dv = ds.createView().source(data);

    dv.transform({
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
        fields: topList.length && topList || ['x'], // 展开字段集
        key: 'icdCode', // key字段
        value: 'value', // value字段
      });

    const config = {
      data: dv.rows,
      maxColumnWidth: 30,
      xField: 'x',
      xAxis: {
        type: 'time',
        // tickCount: 12,
        tickMethod: 'time-pretty',
        mask: 'YYYY-MM-DD',
      },
      yField: 'value',
      isStack: true,
      seriesField: 'icdCode',
      colorField: 'icdCode', // 部分图表使用 seriesField
      color: ({icdCode}) => {
        return colorMap[icdCode]
      },
      slider: {
        trendCfg: {
          isArea: true,
        },
        formatter: (val) => {
            return moment(val).format('YYYY-MM-DD')
        },
        start: 0,
        end: 1,
      }
    }

    return (
      <div>
        <Area {...config} />
        {/*<Column {...config} />*/}
      </div>
    );
  }
}

export default TimeDis;
