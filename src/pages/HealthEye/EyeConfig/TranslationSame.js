import React, { Fragment, PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Col, Icon, List, Tree } from 'antd';
const { TreeNode } = Tree;

class GeoTrans extends PureComponent {
  state = {
    selectData: '',
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  };

  componentDidMount() {}

  componentWillUnmount() {}
  onSelect = (info, e) => {
    this.setState({ selectData: info });
    // console.log(info);
    // console.log(e)
  };

  onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 1000);
    });

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

  render() {
    const { treeData, selectData } = this.state;

    return (
      <Fragment>
        <Col xl={10} lg={24} md={24} sm={24} xs={24}>
          <Card bordered={false}>
            {treeData.length ? (
              <Tree
                className="draggable-tree"
                // defaultExpandedKeys={expandedKeys}
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
