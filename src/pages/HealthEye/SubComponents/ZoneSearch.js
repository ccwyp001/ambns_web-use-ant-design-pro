import React, { Fragment, PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker, Select, Spin, Empty, Modal, Radio } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../Map.less';
import debounce from 'lodash/debounce';
import Result from '@/components/Result';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;

@Form.create()
class ZoneSearch2 extends PureComponent {
  static defaultProps = {
    handleSearch: () => {},
    handleFormReset: () => {},
    handleIcdList: () => {},
    handleModalVisible: () => {},
    icdList: [],
    sourceList: [],
    ageGroups: [],
    fetching: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      formValues: {},
      scrollPage: 1,
      icd10Value: '',
      icd10Level: 4,
    };
    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 7 },
    };
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  submitSearch = e => {
    e.preventDefault();
    const { form, handleSearch, handleModalVisible } = this.props;
    const { formValues: oldValue } = this.state;
    handleModalVisible(true);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rangeValue = fieldsValue.clinicTime;
      const rangeValue2 = fieldsValue.sickenTime;
      console.log(rangeValue);
      const formValues = {
        ...oldValue,
        ...fieldsValue,
        clinicTime:
          (rangeValue &&
            rangeValue.length && [
              rangeValue[0].format('YYYY-MM-DD'),
              rangeValue[1].format('YYYY-MM-DD'),
            ]) ||
          undefined,
        sickenTime:
          (rangeValue2 &&
            rangeValue2.length && [
              rangeValue2[0].format('YYYY-MM-DD'),
              rangeValue2[1].format('YYYY-MM-DD'),
            ]) ||
          undefined,
      };
      console.log(formValues);
      this.setState(
        {
          formValues,
        },
        () => {
          handleSearch(formValues);
        }
      );
    });
  };

  formReset = () => {
    const { form, handleSearch } = this.props;
    form.resetFields();
    this.setState(
      {
        formValues: {},
      },
      () => {
        handleSearch({});
      }
    );
  };

  getIcdList = value => {
    const { handleIcdList } = this.props;
    const { scrollPage, icd10Value, icd10Level } = this.state;
    let page = scrollPage;
    if (value) {
      page = 1;
      console.log(value);
    }
    value = value || icd10Value;
    if (value.length < 2) {
      return;
    }
    this.setState(
      {
        icd10Value: value,
        scrollPage: page,
      },
      () => {
        handleIcdList({
          q: value,
          level: icd10Level,
          per_page: page * 10,
        });
      }
    );
  };

  icdListScroll = e => {
    e.persist();
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const { scrollPage } = this.state;
      const nextScrollPage = scrollPage + 1;
      console.log(nextScrollPage);
      this.setState(
        {
          scrollPage: nextScrollPage,
        },
        () => {
          this.getIcdList();
        }
      );
    }
  };

  handleFormLayoutChange = e => {
    const { form } = this.props;
    form.setFieldsValue({icd10: []})
    this.setState(
      {icd10Level: e.target.value},
      () => {this.getIcdList()}
    )
  }

  renderSimple() {
    const {
      form: { getFieldDecorator },
      handleFormReset,
      handleModalVisible,
      sourceList,
    } = this.props;
    return (
      <Form onSubmit={this.submitSearch} {...this.formLayout} labelAlign="right">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据源">
              {getFieldDecorator('source', {
                initialValue: sourceList[0] ? sourceList[0].id : undefined,
              })(
                <Select
                  placeholder="请选择"
                  // style={{ width: '100%' }}
                >
                  {sourceList.map(d => (
                    <Option key={d.id}>
                      {d.id} {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
            <FormItem label="诊断日期">
              {getFieldDecorator('clinicTime')(
                <RangePicker
                  style={{ width: '100%' }}
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />
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
  }

  renderAdvanced() {
    const {
      form: { getFieldDecorator },
      icdList,
      sourceList,
      ageGroups,
      fetching,
    } = this.props;

    return (
      <Form onSubmit={this.submitSearch} {...this.formLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="数据源" {...this.formLayout}>
              {getFieldDecorator('source', {
                initialValue: sourceList[0] ? sourceList[0].id : undefined,
              })(
                <Select
                  placeholder="请选择"
                  // style={{ width: '100%' }}
                >
                  {sourceList.map(d => (
                    <Option key={d.id}>
                      {d.id} {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="诊断日期" {...this.formLayout}>
              {getFieldDecorator('clinicTime')(
                <RangePicker
                  // style={{ width: '100%' }}
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="乡镇" {...this.formLayout}>
              {getFieldDecorator('town')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  <Option value="0">玉城</Option>
                  <Option value="1">楚门</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="年龄组" {...this.formLayout}>
              {getFieldDecorator('age')(
                <Select placeholder="请选择" mode="multiple" style={{ width: '100%' }}>
                  {ageGroups.map(d => (
                    <Option key={d.id}>
                      {d.id} {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发病日期" {...this.formLayout}>
              {getFieldDecorator('sickenTime')(
                <RangePicker
                  style={{ width: '100%' }}
                  // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                  format="YYYY-MM-DD"
                />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="职业" {...this.formLayout}>
              {getFieldDecorator('occupation')(
                <Select allowClear placeholder="请选择">
                  <Option value="0">打工的</Option>
                  <Option value="1">不可能打工的</Option>
                  <Option value="2">这一辈子</Option>
                  <Option value="3">都不打工的</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={6} sm={24}>*/}
          {/*  <FormItem label="性别" {...this.formLayout}>*/}
          {/*    {getFieldDecorator('gender')(*/}
          {/*      <Select allowClear placeholder="请选择">*/}
          {/*        <Option value="0">男</Option>*/}
          {/*        <Option value="1">女</Option>*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          <Col md={6} sm={24}>
            <FormItem label="icd层级" {...this.formLayout}>
              {getFieldDecorator('level', {
                initialValue: 4,
              })(
                <Radio.Group
                  onChange={this.handleFormLayoutChange}
                >
                  <Radio.Button value={2}>类目</Radio.Button>
                  <Radio.Button value={3}>亚目</Radio.Button>
                  <Radio.Button value={4}>编码</Radio.Button>
                </Radio.Group>
              )}
            </FormItem>
          </Col>
          <Col md={18} sm={24}>
            <FormItem label="疾病诊断" {...this.formLayout}>
              {getFieldDecorator('icd10', {
                rules: [{ type: 'array', max: 6, message: 'max len is 6' }],
              })(
                <Select
                  mode="multiple"
                  // labelInValue
                  // value={value}
                  placeholder="请输入疾病名称/IDC10编码，可输入多个"
                  notFoundContent={
                    fetching ? (
                      <Spin size="small" />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )
                  }
                  filterOption={false}
                  onSearch={debounce(this.getIcdList, 500)}
                  onPopupScroll={this.icdListScroll}
                  // onChange={this.handleChange}
                  style={{ width: '100%' }}
                >
                  {icdList.map(d => (
                    <Option key={d.code}>
                      {d.code} {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
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
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvanced() : this.renderSimple();
  }
}

export default ZoneSearch2;
