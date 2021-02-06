import React, { Fragment, PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Tag,
  Transfer,
  message,
  Switch,
} from 'antd';

import Result from '@/components/Result';

import styles from './AgeSplit.less';
import Popconfirm from 'antd/es/popconfirm';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;
const mockData = [];
for (let i = 0; i < 100; i += 1) {
  mockData.push({
    key: i,
    str: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
  });
}
@connect(({ ageGroup, loading }) => ({
  ageGroup,
  loading: loading.models.ageGroup,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 15 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ageGroup/fetchAgeGroup',
      payload: {},
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleChange = targetKeys => {
    const { form } = this.props;
    const obj = {};
    obj.group = targetKeys.sort((prev, next) => {
      return prev - next;
    });
    form.setFieldsValue(obj);
  };

  filterOption = (inputValue, option) => option.str.indexOf(inputValue) > -1;

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    // setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      if (id) {
        dispatch({
          type: 'ageGroup/update',
          payload: {
            query: {
              id: id,
            },
            body: {
              ...fieldsValue,
            },
          },
          callback: () =>
            dispatch({
              type: 'ageGroup/fetchAgeGroup',
            }),
        });
      } else {
        dispatch({
          type: 'ageGroup/create',
          payload: {
            body: {
              ...fieldsValue,
            },
          },
          callback: () =>
            dispatch({
              type: 'ageGroup/fetchAgeGroup',
            }),
        });
      }
    });
  };

  deleteItem = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ageGroup/delete',
      payload: item.id,
      callback: () =>
        dispatch({
          type: 'ageGroup/fetchAgeGroup',
        }),
    });
    message.success('删除成功');
  };

  render() {
    const {
      ageGroup: { ageGroup },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      defaultPageSize: 10,
      // total: 50,
    };

    const ListContent = ({ data: { disabled, update_at } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>更新时间</span>
          <p>{moment(parseInt(update_at, 10) * 1000).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>状态</span>
          <p>{disabled ? '停用' : '可用'}</p>
        </div>
      </div>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description=""
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="名称" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入年龄组名称' }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="年龄组" {...this.formLayout}>
            {getFieldDecorator('group', {
              rules: [{ required: true, message: '请输入年龄组' }],
              initialValue: current.group,
              valuePropName: 'targetKeys',
            })(
              <Transfer
                dataSource={mockData}
                showSearch
                listStyle={{
                  // width: 300,
                  height: 300,
                }}
                filterOption={this.filterOption}
                // targetKeys={[1,2,3]}
                onChange={this.handleChange}
                // onSearch={this.handleSearch}
                render={item => item.key}
              />
            )}
          </FormItem>
          <FormItem label="停用" {...this.formLayout}>
            {getFieldDecorator('disabled', {
              initialValue: current.disabled,
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <Fragment>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            // title="   "
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            // extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={ageGroup}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      编辑
                    </a>,
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.deleteItem(item);
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={item.logo} shape="square" size="large" />}
                    title={item.name}
                    description={item.group.map(tag => (
                      <Tag key={`${item.name} ${tag}`}>{tag}</Tag>
                    ))}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `年龄组${current.id ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </Fragment>
    );
  }
}

export default BasicList;
