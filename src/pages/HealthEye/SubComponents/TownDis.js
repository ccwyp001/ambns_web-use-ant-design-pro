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
import {Bar} from "@ant-design/charts";

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
  dv = new DataSet({
    state: {
      name: undefined,
    },
  }).createView();
  dv2 = new DataSet().createView();
  constructor(props) {
    super(props);
  }

  render() {
    const { height, townData:data, colorMap, topData, popupInfo, title } = this.props;
    const topList = [];
      topData.map(re => {
        topList.push(re.x)
      })
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
          const dict = Object.keys(row.icds).sort((a, b) => { return row.icds[a] - row.icds[b] })
          dict.map(key => {
            newRow[key] = row.icds[key];
            newRow.count += row.icds[key];
            return newRow
          });
          return newRow
        },
      })
      .transform({
        type: 'fold',
        fields: topList.length && topList || ['x'],
        key: 'icdCode',
        value: 'value',
      });
    this.dv2.source(data).transform({
      type: "sort",
      callback(a,b){
        return a.y - b.y;
      }
    })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = {...row};
          const dict = Object.keys(row.icds).sort((a, b) => { return row.icds[a] - row.icds[b] })
          dict.map(key => {
            newRow[key] = row.icds[key];
            return newRow
          });
          return newRow
        },
      })
      .transform({
        type: 'fold',
        fields: topList.length && topList || ['x'],
        key: 'icdCode',
        value: 'value',
      })
      .transform({
        type: "sort",
        callback(a,b){
          return a.x === b.x && a.value - b.value;
          }
      })
      .transform({
        type: 'filter',
        callback(item, idx) {
          return popupInfo ? item.x === popupInfo : true
        },
      })
      .transform({
          type: 'map',
          callback(row) {
            const newRow = {...row};
            newRow.icdName = topData.filter(item => item.x === newRow.icdCode)[0].n;
            // console.log(newRow);
            return newRow
          },
        });
    const config = {
      width: 220,
      isStack: true,
      xField: 'value',
      yField: 'x',
      seriesField: 'icdCode',
      color: function color(_ref) {
        const icdCode = _ref.icdCode;
        return colorMap[icdCode]
      },
      maxBarWidth: 30,
      legend: {
        position: 'bottom' ,
      },
      tooltip: {
        fields: ['x', 'y', 'icdCode', 'value'],
        formatter: (datum) => {
          return { name: datum.icdCode, value: datum.value, title: datum.x + ' 总数:' + datum.y };
        },
      },
      data: this.dv.rows.reverse(),
      yAxis: {
        label: {
          formatter: (val) => {
                const text = val.replace('玉环市', '')
                return `${ text.length > 7 ? text.slice(0,7) + '..' : text }`
              },
        }},
      scrollbar: {
        type: 'vertical' ,
        categorySize: 20,
      },
    };
    return (
      <Card
        // loading={loading}
        style={{ marginBottom: 16 , opacity:0.95}}
        bodyStyle={{ padding: 8}}
        bordered={false}
      >
        {
            popupInfo ? [
              <div key={'towndis1'}>
                <h4>{title}--{popupInfo}</h4>
                <Chart
                  height={height}
                  data={this.dv2}
                  // forceFit
                  // padding='auto'
                  padding={{ top: 'auto', right: 30, bottom: 'auto', left: 100 }}
                  // padding={{ top: 20, right: 10, bottom: 20, left: 70 }}
                  width={220}
                >
                  <Coord transpose />
                  <Axis
                    name="icdName"
                    label={{
                      offset: 6,
                      formatter: (val) => {
                        const text = val;
                        return `${ text.length > 7 ? text.slice(0,7) + '..' : text }`
                      },
                    }}
                  />
                  <Axis name="value" visible={false} />
                  <Tooltip />
                  <Geom
                    type={"interval"}
                    position="icdName*value*icdCode"
                    color={['icdCode', (item) => {
                      return colorMap[item]
                    }]}
                  >
                    <Label content="value" offset={5} />
                  </Geom>
                </Chart>
              </div>
      ] : [
        <div key={'towndis2'}>
          <h4>{title}</h4>
          <Bar {...config} onReady={(plot) => {
              plot.on('mousewheel', (evt) => {
                evt.gEvent.originalEvent.preventDefault();
                const scrollbar = plot.chart.getController('scrollbar');
                const { thumbOffset } = scrollbar.scrollbar.component.cfg;
                scrollbar.scrollbar.component.updateThumbOffset(thumbOffset + evt.event.deltaY/10);
              });
          }}/>
          {/*<Chart*/}
          {/*  height={height}*/}
          {/*  data={this.dv}*/}
          {/*  // forceFit*/}
          {/*  padding='auto'*/}
          {/*  // padding={{ top: 20, right: 10, bottom: 20, left: 70 }}*/}
          {/*  width={220}*/}
          {/*>*/}
          {/*  <Legend position='bottom-center' />*/}
          {/*  <Coord transpose />*/}
          {/*  <Axis*/}
          {/*    name="x"*/}
          {/*    label={{*/}
          {/*      offset: 12*/}
          {/*    }}*/}
          {/*  />*/}
          {/*  <Axis name="value" visible={false} />*/}
          {/*  <Tooltip />*/}
          {/*  <Geom*/}
          {/*    type={"intervalStack"}*/}
          {/*    position="x*value"*/}
          {/*    color={['icdCode', (item) => {*/}
          {/*      return colorMap[item]*/}
          {/*    }]}*/}
          {/*    tooltip={['x*y*icdCode*value', (x, y, icdCode, value) => {*/}
          {/*      return {*/}
          {/*        //自定义 tooltip 上显示的 title 显示内容等。*/}
          {/*        name: icdCode,*/}
          {/*        title: x + ' 总数:' + y,*/}
          {/*        value: value*/}
          {/*      };*/}
          {/*    }]}*/}
          {/*  />*/}
          {/*</Chart>*/}
        </div>
            ]
          }
      </Card>
    );
  }
}

export default TownDis;
