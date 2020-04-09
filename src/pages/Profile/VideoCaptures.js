import React, { memo } from 'react';
import { Card, Col, Modal, Row } from 'antd';
import { FormattedMessage } from 'umi/locale';
import styles from './AdvancedProfile.less';

const VideoCaptures = memo(
  ({ fileList, loading, previewVisible, previewImage, handlePreview, handleCancel }) => (
    <Card loading={loading} title="视频截图" style={{ marginBottom: 24}} bordered={false}>
      <Row gutter={16}>
        {fileList.map(file =>
          <Col key={file.uid} span={8}>
            <Card
              bordered={false}
              cover={
                <img alt="example" src={file.url} onClick={() => {handlePreview(file)}} />
              }
            >
            </Card>
          </Col>,
        )}
      </Row>
      <Modal visible={previewVisible} bodyStyle={{ padding: '0px 0px 0px' }} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  )
);

export default VideoCaptures;
