import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
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
  Radio,
  Checkbox,
  Upload,
  Popover,
  Tag, Tooltip,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './TableList.less';
import DoctorSvg from '@/assets/DoctorSvg';
import NurseSvg from '@/assets/NurseSvg';
import SuitSvg from '@/assets/SuitSvg';
import CardSvg from '@/assets/CardSvg';
import DriverSvg from '@/assets/DriverSvg';
import AmbulanceSvg from '@/assets/AmbulanceSvg';

const LogoDoctor = props => <Icon component={DoctorSvg} {...props} />;
const LogoNurse = props => <Icon component={NurseSvg} {...props} />;
const LogoSuit = props => <Icon component={SuitSvg} {...props} />;
const LogoCard = props => <Icon component={CardSvg} {...props} />;
const LogoDriver = props => <Icon component={DriverSvg} {...props} />;
const LogoAmbulance = props => <Icon component={AmbulanceSvg} {...props} />;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'success'];
const status = ['出车中', '已完成'];


@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {
    },
    handleUpdateModalVisible: () => {
    },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        desc: props.values.desc,
        lsh: props.values.lsh,
        clid: props.values.clid,
        on_duty: props.values.on_duty,
        workwear: props.values.workwear,
        real_out: props.values.real_out,
        work_cards: props.values.work_cards,
        medical_warehouse: props.values.medical_warehouse,
        fileList: props.values.fileList,
      },
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
  }

  HandleOK = () => {
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
          handleUpdate(formVals);
        },
      );
    });
  };


  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="on_duty" {...this.formLayout} label="医护出勤情况">
        {form.getFieldDecorator('on_duty', {
          initialValue: formVals.on_duty,
        })(
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8}><Checkbox value="1">医师</Checkbox></Col>
              <Col span={8}><Checkbox value="2">护士</Checkbox></Col>
            </Row>
          </Checkbox.Group>,
        )}
      </FormItem>,
      <FormItem key="workwear" {...this.formLayout} label="有穿着工作服">
        {form.getFieldDecorator('workwear', {
          initialValue: formVals.workwear,
        })(
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8}><Checkbox value="4">驾驶员</Checkbox></Col>
              <Col span={8}><Checkbox value="1">医师</Checkbox></Col>
              <Col span={8}><Checkbox value="2">护士</Checkbox></Col>
            </Row>
          </Checkbox.Group>,
        )}
      </FormItem>,
      <FormItem key="work_cards" {...this.formLayout} label="有佩戴工牌">
        {form.getFieldDecorator('work_cards', {
          initialValue: formVals.work_cards,
        })(
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8}><Checkbox value="1">医师</Checkbox></Col>
              <Col span={8}><Checkbox value="2">护士</Checkbox></Col>
            </Row>
          </Checkbox.Group>,
        )}
      </FormItem>,
      <FormItem key="real_out" {...this.formLayout} label="实际出车时间">
        {form.getFieldDecorator('real_out', {
          initialValue: formVals.real_out ? moment(formVals.real_out) : null,
        })(
          <DatePicker showTime placeholder="Select Time" format="YYYY-MM-DD HH:mm:ss" />,
        )}
      </FormItem>,
      <FormItem key="medical_warehouse" {...this.formLayout} label="接诊后有乘坐医疗仓">
        {form.getFieldDecorator('medical_warehouse', {
          initialValue: formVals.medical_warehouse,
        })(
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={8}><Checkbox value="1">医师</Checkbox></Col>
              <Col span={8}><Checkbox value="2">护士</Checkbox></Col>
            </Row>
          </Checkbox.Group>,
        )}
      </FormItem>,
      <FormItem key="fileList" {...this.formLayout} label="视频截图">
        {form.getFieldDecorator('fileList', {
          valuePropName: 'fileList',
          initialValue: formVals.fileList,
          getValueFromEvent: this.normFile,
        })(
          <PicturesWall />,
        )}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="备注">
        {form.getFieldDecorator('desc', {
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="有任何情况可以在此备注" />)}
      </FormItem>,
    ];
  };

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="出车登记"
        visible={updateModalVisible}
        onOk={this.HandleOK}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}


class PicturesWall extends React.Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const fileList = props.fileList || [];
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.abc = file.response.id;
      }
      return file;
    });
    if (!('value' in this.props)) {
      this.setState({ fileList });
    }
    this.triggerChange({ fileList });
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/v1/ambul_manage/pic"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


/* eslint react/no-multi-comp:0 */
@connect(({ ambul_manage, loading }) => ({
  ambul_manage,
  loading: loading.models.ambul_manage,
}))
@Form.create()
class NewAmbulManage extends PureComponent {
  state = {
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updatePagination: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '流水号',
      dataIndex: 'lsh',
      render: (text, record) => <a onClick={() => this.previewItem(text, record.clid)}>{text}</a>,
    },
    {
      title: '车辆',
      dataIndex: 'clmc',
    },
    {
      title: '接车地址',
      dataIndex: 'yymc',
      // sorter: true,
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      render(val) {
        let state;
        if (val === '站内待命' || val === '途中待命') {
          state = 1;
        } else {
          state = 0;
        }
        return <Badge status={statusMap[state]} text={val} />;
      },
    },
    {
      title: '派车时间',
      dataIndex: 'dispatchAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        const reason = record.cancel_reason;
        const { tsqk } = record;
        if (reason !== 'None' || tsqk !== 'None') {
          const content = (
            <div>
              <p>取消原因：{reason}</p>
              <p>特殊情况：{tsqk}</p>
            </div>
          );
          return (
            <Popover content={content} title="未接到病人" trigger="hover">
              <Tag color="#87d068">无需登记</Tag>
            </Popover>
          );
        }
        return (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>{record.registered === '' ? '登记' : '已登记'}</a>
            {/* <Divider type="vertical" /> */}
          </Fragment>
        );
      },
    },
  ];

  printColumns = [
    // {
    //   title: '流水号',
    //   dataIndex: 'lsh',
    //   width: 170,
    //   render: (text, record) => <a onClick={() => this.previewItem(text, record.clid)}>{text}</a>,
    // },
    {
      title: '来电时间',
      dataIndex: 'callAt',
      width: 100,
      render: val => <span>{moment(val).format('MM-DD HH:mm')}</span>,
    },
    {
      title: '来电号码',
      dataIndex: 'call_number',
      width: 120,
    },
    {
      title: '来电地址',
      dataIndex: 'yymc',
      width: 210,
      ellipsis: true,
    },
    {
      title: '呼救原因',
      width: 110,
      dataIndex: 'call_reason',
      ellipsis: true,
      render: val => val.split('-').slice(2,3).join('-')
    },
    {
      title: '调度员',
      width: 80,
      dataIndex: 'dispatcher',
    },
    {
      title: '出车车辆',
      width: 80,
      dataIndex: 'clmc',
    },
    {
      title: '出车时间',
      width: 120,
      dataIndex: 'departureAt',
      render: (text, record)  =>
        <Fragment>
          {moment(text).format('MM-DD HH:mm')}
          <Icon type="arrow-up" style={{ fontSize: '12px', color: '#CA6B4F'}} />
        </Fragment>,
    },
    {
      title: '医护接诊',
      dataIndex: 'medical_warehouse',
      width: 70,
      render: val => {
        const tmpVal = val.sort((prev, next) => {
          return parseInt(prev, 10) - parseInt(next, 10);
        });
        const members = tmpVal.map((num) => {
          if (num.toString() === '1') {
            return <Fragment><LogoDoctor style={{ fontSize: '24px', color: '#CA6B4F' }} /></Fragment>
          }
          if (num.toString() === '2') {
            return <Fragment><LogoNurse style={{ fontSize: '24px', color: '#CA6B4F' }} /></Fragment>
          }
          return null
        });

        return (
          <div className="icons-list">
            {members}
          </div>
        )
      }
    },
    {
      title: '特殊情况',
      width: 80,
      render: (text, record) => {
        const reason = record.cancel_reason;
        const { tsqk } = record;
        if (reason !== 'None') {
          return (<span>{reason}</span>)
        }
        if (tsqk !== 'None') {
          return (<span>{tsqk}</span>)
        }
        return (
          <span>None</span>
        );
      },
    },
    {
      title: '送往医院',
      dataIndex: 'accept_hospital',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ambul_manage/fetch',
    });
    dispatch({
      type: 'ambul_manage/stations',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, updatePagination } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ambul_manage/fetch',
      payload: params,
    });
    this.setState({
      formValues: params,
    });
  };

  previewItem = (lsh, clid) => {
    router.push(`/list/ambul-detail/${lsh}/${clid}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'ambul_manage/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const {formValues} = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const rangeValue = fieldsValue.date1;
      const values = {
        ...formValues,
        ...fieldsValue,
        date1: [rangeValue[0].format('YYYY-MM-DD HH:mm:ss'), rangeValue[1].format('YYYY-MM-DD HH:mm:ss')],
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      dispatch({
        type: 'ambul_manage/fetch',
        payload: values,
      });

      this.setState({
        formValues: values,
      });
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'ambul_manage/update',
      payload: {
        query: formValues,
        body: {
          // name: fields.name,
          // desc: fields.desc,
          // key: fields.key,
          // fileList: fields.fileList,
          ...fields,
        },
      },
    });

    message.success('登记成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="流水号">
              {getFieldDecorator('lsh')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem label="起止日期">
              {getFieldDecorator('date1', {
                initialValue: [moment().startOf('day'), moment().endOf('day')],
              })(
                <RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment().startOf('day'), moment().endOf('day')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />,
              )}
            </FormItem>
          </Col>

        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              展开 <Icon type="down" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      ambul_manage: { stations },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="接车地址">
              {getFieldDecorator('yymc')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车辆状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="processing">出车中</Option>
                  <Option value="6">已完成</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分站">
              {getFieldDecorator('station')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {stations.map(station => <Option key={station.key}>{station.rp_name}</Option>)}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="流水号">
              {getFieldDecorator('lsh')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <FormItem label="起止日期">
              {getFieldDecorator('date1', {
                initialValue: [moment().startOf('day'), moment().endOf('day')],
              })(
                <RangePicker
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment().startOf('day'), moment().endOf('day')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      ambul_manage: { data },
      loading,
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues, formValues } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="出车记录">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <span>
                <ReactToPrint
                  trigger={() => <Button icon="printer" type="primary">打印出车登记表</Button>}
                  content={() => this.componentRef}
                />
              </span>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
          <div
            style={{ display: "none" }}
          >
            <StandardTable
              title={
                () => (
                  <div style={{ "text-align": "center", "font-size": "32px"}}>
                    玉环市120急救指挥中心出车情况登记表
                    <div style={{ "font-size": "15px"}}>
                      起止时间：{formValues.date1 ? formValues.date1.join('~'):null}
                    </div>
                    <div style={{ "font-size": "15px"}}>
                      打印时间：{moment().format('YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                )}
              footer={() => (
                <div style={{ "text-align": "right", "font-size": "22px"}}>
                  <div>交班人签字：____________</div>
                  <div>接班人签字：____________</div>
                </div>

              )}
              noNeedAlert
              ref={el => (this.componentRef = el)}
              rowSelection={false}
              selectedRows={selectedRows}
              loading={loading}
              pagination={false}
              data={data}
              columns={this.printColumns}
              size="small"
              tableLayout="fixed"
            />
          </div>
        </Card>
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default NewAmbulManage;
