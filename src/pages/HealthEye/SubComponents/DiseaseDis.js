import React from 'react';
import { Axis, Chart, Coord, Geom, Guide, Label, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';

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
    // console.log(dv);
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
          <Tooltip showTitle={false} />
          <Guide>
            <Guide.Region
              top={false} // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
              start={(e)=>([-0.4, 'start'])} // 辅助框起始位置，值为原始数据值，支持 callback
              end={(e)=>([0.4, 'end'])}// 辅助框结束位置，值为原始数据值，支持 callback
              style={{
              lineWidth: 0, // 辅助框的边框宽度
              fill: '#ff1151', // 辅助框填充的颜色
              fillOpacity: 0.3, // 辅助框的背景透明度
              stroke: '#ccc' // 辅助框的边框颜色设置
            }} // 辅助框的图形样式属性
            />
          </Guide>
          <Geom
            type="interval"
            position="x*y"
            color="x"
            select={[true, {
              style: {
                fill: '#E8684A',
              }
            }
            ]}
          >
            <Label content='y' offset={5} />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default DiseaseDis;
