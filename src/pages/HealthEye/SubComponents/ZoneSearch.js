import React, { PureComponent } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker, Select, Spin } from 'antd';
import { FormattedMessage } from 'umi/locale';
import moment from 'moment';
import styles from '../Map.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { Option } = Select;
const ZoneSearch = Form.create()( props => {
  const { handleSearch, handleFormReset, form } = props;
  const { getFieldDecorator } = form;
  const [ expandForm, setExpandForm] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
  };

  const toggleForm = () => {
    setExpandForm(!expandForm)
  };
  const fetchUser = value => {
    console.log('fetching user', value);
    fetch('https://randomuser.me/api/?results=5')
      .then(response => response.json())
      .then(body => {
        const data2 = body.results.map(user => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        setData(data2);
        setFetching(false);
      });
  };
  const renderSimple = () =>(
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={10} sm={24}>
          <FormItem label="诊断日期" {...formLayout}>
            {getFieldDecorator('date1')(
              <RangePicker
                // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                format="YYYY-MM-DD"
              />,
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="性别" {...formLayout}>
            {getFieldDecorator('sex')(
              <Select placeholder="请选择">
                <Option value="0">男</Option>
                <Option value="1">女</Option>
              </Select>
            )}
          </FormItem>
        </Col>

        <Col md={6} sm={24}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={toggleForm}>
                展开 <Icon type="down" />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );

  const renderAdvanced = () =>(
    <Form onSubmit={handleSearch} layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={10} sm={24}>
          <FormItem label="诊断日期" {...formLayout}>
            {getFieldDecorator('date1')(
              <RangePicker
                // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                format="YYYY-MM-DD"
              />,
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="性别" {...formLayout}>
            {getFieldDecorator('sex')(
              <Select placeholder="请选择">
                <Option value="0">男</Option>
                <Option value="1">女</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="职业" {...formLayout}>
            {getFieldDecorator('ins')(
              <Select placeholder="请选择">
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
        <Col md={10} sm={24}>
          <FormItem label="发病日期" {...formLayout}>
            {getFieldDecorator('date2')(
              <RangePicker
                // defaultValue={[moment().startOf('day'), moment().endOf('day')]}
                format="YYYY-MM-DD"
              />,
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <FormItem label="乡镇" {...formLayout}>
            {getFieldDecorator('town')(
              <Select placeholder="请选择">
                <Option value="0">玉城</Option>
                <Option value="1">楚门</Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem label="年龄" {...formLayout}>
            {getFieldDecorator('age')(
              <Select placeholder="请选择">
                <Option value="0">0</Option>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={18} sm={24}>
          <FormItem
            label="疾病诊断"
            {...formLayout}
            rules={[
              {
                type: 'array',
                max: 6,
                message: 'max len is 6'
              }
            ]}
          >
            {getFieldDecorator('date3')(
              <Select
                mode="multiple"
                labelInValue
                // value={value}
                placeholder="请输入疾病名称/IDC10编码，可输入多个"
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={fetchUser}
                // onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                {data.map(d => (
                  <Option key={d.value}>{d.text}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={toggleForm}>
                收起 <Icon type="up" />
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Form>
  );

  return expandForm ? renderAdvanced() : renderSimple();
  }
);

export default ZoneSearch;
