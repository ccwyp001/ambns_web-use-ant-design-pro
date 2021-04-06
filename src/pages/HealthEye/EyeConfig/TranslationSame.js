import React, { Fragment, PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Col, Icon, List, Tree } from 'antd';
import {connect} from "dva";
const { TreeNode } = Tree;

@connect(({ geoTrans, loading }) => ({
  geoTrans,
  loading: loading.models.geoTrans,
}))
class GeoTrans extends PureComponent {
  state = {
    selectData: '',
    treeData: [],
  };

  componentDidMount() {
    const { dispatch,  } = this.props;
    dispatch({
      type: 'geoTrans/fetch',
      payload: {
        fullname: '浙江省'
      },
      callback: () => {
        const { geoTrans: {geoTrans} } = this.props;
        console.log(geoTrans);
        this.setState({treeData: geoTrans?.children})
      }
    });
  }

  componentWillUnmount() {

  }
  onSelect = (info, e) => {
    this.setState({ selectData: info });
    // console.log(info);
    // console.log(e)
  };

  onLoadData = treeNode => {
    console.log(treeNode);
    return (
    new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        const { dispatch,  } = this.props;
        dispatch({
          type: 'geoTrans/fetch',
          payload: {
            fullname: treeNode.props.dataRef.fullname
          },
          callback: () => {
            const { geoTrans: {geoTrans} } = this.props;
            console.log(geoTrans);
            treeNode.props.dataRef.children = geoTrans?.children;
            this.setState({
              treeData: [...this.state.treeData],
            });
          }
        });
        resolve();
      }, 100);
    })
    )
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.name} dataRef={item} />;
    });

  render() {
    const {
      geoTrans: { geoTrans },
      loading,
    } = this.props;
    const { treeData, selectData } = this.state;

    return (
      <Fragment>
        <Col xl={10} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false} bodyStyle={{ height: 420 }}>
            {treeData.length ? (
              <Tree
                className="draggable-tree"
                // defaultExpandedKeys={expandedKeys}
                style={{ height: '100%', overflow: 'auto' }}
                blockNode
                loadData={this.onLoadData}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            ) : null}
          </Card>
        </Col>
        <Col xl={14} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>{selectData}</Card>
        </Col>
      </Fragment>
    );
  }
}

export default GeoTrans;
