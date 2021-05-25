import React, { useState, useEffect } from 'react';
import { Bar } from '@ant-design/charts';
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
  ds = new DataSet();

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let _prev = JSON.stringify(this.props)
    let _next = JSON.stringify(nextProps)
    return _prev !== _next
  }

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

    const dv = this.ds.createView().source(data);
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
        type: "filter",
        callback(row) {
          return row.count > 0
        }
      })
      .transform({
        type: 'fold',
        fields: topList.length && topList || ['x'],
        key: 'icdCode',
        value: 'value',
      })
    ;
    const config = {
      isStack: true,
      xField: 'value',
      yField: 'x',
      seriesField: 'icdCode',
      maxBarWidth: 30,
      color: function color(_ref) {
        const icdCode = _ref.icdCode;
        return colorMap[icdCode]
      },
      legend: {
        position: 'bottom' ,
        // flipPage: false,
      },
      data: dv.rows.reverse(),
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
    return <Bar {...config} onReady={(plot) => {
      plot.on('mousewheel', (evt) => {
        evt.gEvent.originalEvent.preventDefault();
        const scrollbar = plot.chart.getController('scrollbar');
        const { thumbOffset } = scrollbar.scrollbar.component.cfg;
        scrollbar.scrollbar.component.updateThumbOffset(thumbOffset + evt.event.deltaY/10);
      });
  }}/>;
  }
}

export default OrgDis;
