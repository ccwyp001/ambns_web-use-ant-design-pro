import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker, Select, Spin, Empty } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../Map.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@Form.create()
class ZoneSearch2 extends PureComponent {
  static defaultProps = {
    handleSearch: () => {
    },
    handleFormReset: () => {
    },
    handleIcdList: () => {
    },
    icdList: [],
    fetching: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      formValues: {},
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 15 },
    };
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  submitSearch = (e) => {
    e.preventDefault();
    const { form, handleSearch } = this.props;
    const { formValues: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue.clinicTime;
      const rangeValue2 = fieldsValue.sickenTime;
      console.log(rangeValue);
      const formValues = {
        ...oldValue,
        ...fieldsValue,
        clinicTime: rangeValue &&
          rangeValue.length &&
          [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')] || undefined,
        sickenTime: rangeValue2 &&
          rangeValue2.length &&
          [rangeValue2[0].format('YYYY-MM-DD'), rangeValue2[1].format('YYYY-MM-DD')] || undefined,
      };
      console.log(formValues);
      this.setState(
        {
          formValues,
        },
        () => {
          handleSearch(formValues);
    },
    )

    });
  };

  formReset = () => {
    const { form, handleSearch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    },
      () => {
        handleSearch({});
      })
  };


  renderSimple() {
    const {
      form: { getFieldDecorator },
      handleFormReset,
    } = this.props;
    return (
      <Form onSubmit={this.submitSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="诊断日期" {...this.formLayout}>
              {getFieldDecorator('clinicTime')(
                <RangePicker
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="性别" {...this.formLayout}>
              {getFieldDecorator('gender')(
                <Select placeholder="请选择">
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>,
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.formReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  renderAdvanced() {
    const {
      form: { getFieldDecorator },
      icdList,
      fetching,
      handleIcdList,
    } = this.props;

    return (
      <Form onSubmit={this.submitSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="诊断日期" {...this.formLayout}>
              {getFieldDecorator('clinicTime')(
                <RangePicker
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="性别" {...this.formLayout}>
              {getFieldDecorator('gender')(
                <Select placeholder="请选择">
                  <Option value="0">男</Option>
                  <Option value="1">女</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="职业" {...this.formLayout}>
              {getFieldDecorator('occupation')(
                <Select placeholder="请选择">
                  <Option value="0">打工的</Option>
                  <Option value="1">不可能打工的</Option>
                  <Option value="2">这一辈子</Option>
                  <Option value="3">都不打工的</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <FormItem label="发病日期" {...this.formLayout}>
              {getFieldDecorator('sickenTime')(
                <RangePicker
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="乡镇" {...this.formLayout}>
              {getFieldDecorator('town')(
                <Select placeholder="请选择">
                  <Option value="0">玉城</Option>
                  <Option value="1">楚门</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="年龄" {...this.formLayout}>
              {getFieldDecorator('age')(
                <Select placeholder="请选择">
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={18} sm={24}>
            <FormItem
              label="疾病诊断"
              {...this.formLayout}
              rules={[
                {
                  type: 'array',
                  max: 6,
                  message: 'max len is 6',
                },
              ]}
            >
              {getFieldDecorator('icd10')(
                <Select
                  mode="multiple"
                  // labelInValue
                  // value={value}
                  placeholder="请输入疾病名称/IDC10编码，可输入多个"
                  notFoundContent={
                    fetching ? <Spin size="small" />
                      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                  filterOption={false}
                  onSearch={handleIcdList}
                  // onChange={this.handleChange}
                  style={{ width: '100%' }}
                >
                  {icdList.map(d => (
                    <Option key={d.id}>{d.id} {d.text}</Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.formReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvanced() : this.renderSimple();
  }
}


export default ZoneSearch2;
