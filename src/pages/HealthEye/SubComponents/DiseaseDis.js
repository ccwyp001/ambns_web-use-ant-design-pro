import React from 'react';
import { Axis, Chart, Coord, Geom, Guide, Label, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import { parse } from 'path-to-regexp';

class DiseaseDis extends React.Component {
  static defaultProps = {
    topData: [],
    height: 188,
  };

  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);
    this.state = {
      height: props.height,
      data: props.topData,
      displayFlag: props.topData.length - 1,
    };
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    clearTimeout(this.timer);
    this.tick();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  tick = () => {
    const { playOrNot } = this.props;
    const { data } = this.state;
    let { displayFlag } = this.state;
    this.timer = setTimeout(() => {
      if (playOrNot) {
        if (displayFlag > 0) {
          displayFlag -= 1;
        } else {
          displayFlag = data.length - 1;
        }
        this.setState(
          {
            displayFlag,
          },
          () => {
            this.tick();
          }
        );
      } else {
        // this.tick();
      }
    }, this.interval);
  };

  render() {
    const { playOrNot, colorMap } = this.props;
    const { height, data, displayFlag } = this.state;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.source(data).transform({
      type: 'sort-by',
      fields: ['y'],
      order: 'ASC',
    });
    // console.log(dv);
    return (
      <div>
        <Chart
          height={height}
          data={dv}
          forceFit
          padding={{ top: 'auto', right: 30, bottom: 'auto', left: 100 }}
          // padding={'auto'}
        >
          <Coord transpose />
          <Axis
            name="n"
            label={{
              offset: 12,
              formatter: (val) => {
                const text = val.replace('玉环市', '')
                return `${ text.length > 7 ? text.slice(0,7) + '..' : text }`
              },
            }}
          />
          <Axis name="x" visible={false} />
          <Axis name="y" visible={false} />
          <Tooltip
            // showTitle={false}
          />
          {playOrNot ? (
            <Guide>
              <Guide.Region
                top={false} // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
                start={e => [parseInt(displayFlag, 10) - 0.4, 'start']} // 辅助框起始位置，值为原始数据值，支持 callback
                end={e => [parseInt(displayFlag, 10) + 0.4, 'end']} // 辅助框结束位置，值为原始数据值，支持 callback
                style={{
                  lineWidth: 0, // 辅助框的边框宽度
                  fill: '#97c3ef', // 辅助框填充的颜色
                  fillOpacity: 0.3, // 辅助框的背景透明度
                  stroke: '#ccc', // 辅助框的边框颜色设置
                }}
              />
            </Guide>
          ) : null}
          <Geom
            type="interval"
            position="n*y*x"
            color={[
              'x',
              item => {
                return colorMap[item];
              },
            ]}
            select={[
              true,
              {
                style: {
                  fill: '#E8684A',
                },
              },
            ]}
            tooltip={['n*y*x', (n, y, x) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name: x,
                title: n,
                value: y
              };
            }]}
          >
            <Label content="y" offset={5} />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default DiseaseDis;
