import { formatMessage, FormattedMessage } from 'umi/locale';
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Upload, Progress,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import styles from './Datasource.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { Dragger } = Upload;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="添加数据"
      visible={modalVisible}
      footer={null}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Dragger
        accept=".csv,.xlsx"
        action="/api/v1/health_eye/config/sources"
        multiple={false}
        onChange={info => {
          const { status } = info.file;
          if (status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (status === 'done') {
            // message.success(`${info.file.name} file uploaded successfully.`);
            setTimeout(() => handleAdd(), 100);
          } else if (status === 'error') {
            message.error(`${info.file.name} 上传失败（${info.file.response.message}）`);
          }
        }}
      >
        <p className="ant-upload-drag-icon">
          {/*<Icon type="inbox" />*/}
          {/*<Icon type="file-add" />*/}
          <Icon type="upload" />
        </p>
        <p className="ant-upload-text">点击/拖拽上传文件</p>
        <p className="ant-upload-hint">支持csv文件、xlsx文件</p>
      </Dragger>
      <div style={{ textAlign: 'center' }} >
        <a href={"/api/v1/health_eye/template"}>下载模板</a>
      </div>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        id: props.values.id,
        colsConfig: props.values.colsConfig,
        cols: props.values.cols,
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  handleOptionChange = (value, option) => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      // this.setState(
      //   {
      //     formVals,
      //   },
      //   () => {
      //   }
      // );
    });
    // this.setState({ selectedItems });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    const cols_map = {
      'IDCARD': '身份证号',
      'NL': '年龄',
      'XB': '性别',
      'OCCUPATION': '职业',
      'TOWN': '乡镇',
      'COMMUNITY': '村居',
      'INS': '险种',
      'SICKEN_TIME': '发病时间',
      'CLINIC_TIME': '诊断时间',
      'ICD10': 'ICD10',
      'ORG_CODE': '诊断单位',
    };
    const colsOptions = formVals.cols;

    if (currentStep === 1) {
      return (
        <Fragment>
          {Object.keys(cols_map).map(key => (
            <FormItem
              style={{ marginBottom: 16 }}
              key={key}
              {...this.formLayout}
              label={cols_map[key]}
            >
              {form.getFieldDecorator(`colsConfig.${key}`, {
                initialValue:
                  colsOptions.includes(key) ? key :
                  colsOptions.includes(cols_map[key])
                  ? cols_map[key]
                  : undefined,
              })(
                <Select
                  showSearch
                  onChange={this.handleOptionChange}
                  style={{ width: '100%' }}
                >
                  {colsOptions.map(item => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ))}
        </Fragment>
      )
    }
    if (currentStep === 2) {
      return [
        <FormItem key="update_at" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('update_at', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="数据源名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入数据源名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="数据描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: false, message: '请输入至少五个字符的数据描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入描述" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="初始化配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置映射规则" />
          <Step title="设定附加属性" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ dataSource, loading }) => ({
  dataSource,
  loading: loading.models.dataSource,
  fetchingSource: loading.effects['dataSource/fetch'],
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  timerRate = 0;
  intervalRate = 1000;

  statusMap = {
    0: 'active',
    1: 'success',
    2: 'exception',
  }

  columns = [
    {
      title: '数据源名称',
      dataIndex: 'name',
      render: text => <a onClick={() => this.previewItem(text)}>{text}</a>,
    },
    {
      title: '特征值',
      dataIndex: 'sign',
    },
    {
      title: '更新时间',
      dataIndex: 'update_at',
      // sorter: true,
      render: val => <span>{moment(val * 1000).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '初始化进度',
      dataIndex: 'rate',
      render: (text, record) => <Progress percent={text} size="small" status={this.statusMap[record.status]} />
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record.id)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.dispatchSource({}, this.tickRate);
  };
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/clear',
    });
    clearTimeout(this.timerRate);
    // clearTimeout(this.timeoutId);
  };

  dispatchSource = (payload = {}, callback) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'dataSource/fetch',
      payload,
      callback: callback,
    });
  };

  tickRate = () => {
    this.timerRate = setTimeout(() => {
      const {
        dataSource: { source:{ list=[] } },
      } = this.props;
      let filterDataSource = [];
      // console.log(list);
      list.forEach(s => {
        if (s.rate > 0 && s.rate < 100) filterDataSource.push(s);
      })
      if (filterDataSource.length === 0){
        clearTimeout(this.timerRate)
      }
      else {
        this.handleFetchRate(this.tickRate)
      }
    }, this.intervalRate);
  };

  handleFetchRate = (callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/fetchRate',
      payload: {},
      callback: callback,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'dataSource/fetch',
      payload: params,
    });
  };

  previewItem = id => {

  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'dataSource/delete',
          payload: {
            body: {ids: selectedRows.map(row => row.id),}
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            }, ()=>{
              const { dispatch } = this.props;
              dispatch({
                type: 'dataSource/fetch',
                payload: {},
              }); });
          },
        });
        break;
      default:
        break;
    }
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
          type: 'dataSource/delete',
          payload: {
            body: {ids: [id],}
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            }, ()=>{
              const { dispatch } = this.props;
              dispatch({
                type: 'dataSource/fetch',
                payload: {},
              }); });
          },
        });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSource/fetch',
      payload: {},
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'dataSource/update',
      payload: {
        query: formValues,
        body: {
          ...fields
        },
      },
      callback: () => this.handleFetchRate(this.tickRate),
    });
    console.log(fields);
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      dataSource: { source },
      fetchingSource,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              noNeedAlert
              rowKey={'id'}
              selectedRows={selectedRows}
              loading={fetchingSource}
              data={source}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </Fragment>
    );
  }
}

export default TableList;
