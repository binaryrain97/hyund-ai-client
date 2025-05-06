'use client';

import React, { useState } from 'react';
import { Upload, message, Typography, List, Tag } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';
import type { UploadChangeParam, UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const FormSection = styled.div`
  margin: 0 auto;
  max-width: 400px;
  width: 100%;
  text-align: left;
  padding-top: 60px;
`;

const FileListContainer = styled.div`
  margin-top: 20px;
  background: rgba(30, 40, 60, 0.7);
  border-radius: 12px;
  padding: 12px 16px;
  color: #eaf6ff;
  max-height: 200px;
  overflow-y: auto;
`;

function getStatusTag(status?: string) {
  switch (status) {
    case 'uploading':
      return (
        <Tag color="#20E070" style={{ fontWeight: 600 }}>
          <LoadingOutlined style={{ marginRight: 6 }} spin />
          업로드 중
        </Tag>
      );
    case 'done':
      return (
        <Tag color="#1890ff" style={{ fontWeight: 600 }}>
          <CheckCircleOutlined style={{ marginRight: 6 }} />
          완료
        </Tag>
      );
    case 'error':
      return (
        <Tag color="#ff4d4f" style={{ fontWeight: 600 }}>
          <CloseCircleOutlined style={{ marginRight: 6 }} />
          실패
        </Tag>
      );
    case 'removed':
      return null;
    default:
      return (
        <Tag color="#bfbfbf" style={{ fontWeight: 600 }}>
          <ClockCircleOutlined style={{ marginRight: 6 }} />
          대기
        </Tag>
      );
  }
}

export default function SaveForm() {
  const [fileList, setFileList] = useState<UploadFile<unknown>[]>([]);

  // 동기적으로 하나씩 업로드하는 onChange
  const onChange = async (info: UploadChangeParam<UploadFile<unknown>>) => {
    // 새로 업로드한 파일만 추출
    const newFiles = info.fileList.filter(
      (file) => !file.status || file.status === 'done' || file.status === 'error' || file.status === 'uploading'
    );

    // 상태 초기화
    setFileList(
        newFiles.map(f => ({
          ...f,
          status: 'waiting' as UploadFileStatus, // 타입 단언
        }))
      );
      

    // 파일을 하나씩 순차적으로 업로드
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      // 상태: 업로드 중
      setFileList(prev =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading' } : f
        )
      );
      const formData = new FormData();
      if (file.originFileObj) {
        formData.append('file', file.originFileObj as File);
      } else {
        message.error('파일을 찾을 수 없습니다.');
        return;
      }

      try {
        await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // 상태: 완료
        setFileList(prev =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'done' } : f
          )
        );
      } catch (error) {
        console.error('파일 업로드 실패:', error); // 에러 로그 추가
        setFileList(prev =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'error' } : f
          )
        );
      }      
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    beforeUpload: (file: File) => {
      message.success(`${file.name} 파일이 업로드 준비되었습니다.`);
      return false; // 수동 업로드
    },
    onChange,
  };

  return (
    <FormSection>
      <Dragger
        {...uploadProps}
        style={{
          marginBottom: 24,
          borderRadius: 12,
          background: 'rgba(30,40,60,0.7)',
          color: '#eaf6ff',
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined style={{ fontSize: '48px', color: '#8fd6ff' }} />
        </p>
        <p className="ant-upload-text" style={{ color: '#eaf6ff' }}>
          파일을 드래그하거나 클릭하여 업로드하세요
        </p>
        <p className="ant-upload-hint" style={{ color: '#b8dfff' }}>
          여러 파일을 한 번에 업로드할 수 있습니다.
        </p>
      </Dragger>

      <FileListContainer>
        <Typography.Text strong style={{ color: '#8fd6ff' }}>
          업로드된 파일 목록
        </Typography.Text>
        <List
          size="small"
          dataSource={fileList}
          renderItem={(item) => (
            <List.Item style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Typography.Text style={{ color: '#eaf6ff', flex: 1 }}>
                {item.name}
              </Typography.Text>
              {getStatusTag(item.status)}
            </List.Item>
          )}
        />
      </FileListContainer>
    </FormSection>
  );
}
