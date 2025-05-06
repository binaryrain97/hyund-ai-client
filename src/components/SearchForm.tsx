import React, { useState } from 'react';
import { Input, Button, List, Typography, Tooltip } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const FileListContainer = styled.div`
  background: rgba(30, 40, 60, 0.7);
  border-radius: 12px;
  padding: 16px 20px;
  color: #eaf6ff;
  max-height: 340px;
  overflow-y: auto;
  margin-bottom: 32px;
  margin-top: 48px; /* 위와 겹치지 않게 아래로 내림 */
`;

const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StyledInput = styled(Input.TextArea)`
  resize: none !important;
  min-height: 72px !important;
  max-height: 72px !important;
  font-size: 15px;
  border-radius: 8px;
  background: rgba(30, 40, 60, 0.7);
  color: #eaf6ff;
  text-align: center;
  flex: 1;
  &::placeholder {
    color: #b8dfff;
    opacity: 0.8;
    text-align: center;
    width: 100%;
    display: block;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 8px !important;
  height: 72px !important;
  font-size: 22px !important;
  background: rgba(30, 40, 60, 0.7) !important;
  color: #8fd6ff !important;
  border: 1px solid #8fd6ff !important;
  font-weight: 600;
  min-width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
  &:hover, &:focus {
    background: #223047 !important;
    color: #fff !important;
    border-color: #40a9ff !important;
  }
`;

const FileLink = styled.a`
  color: #8fd6ff;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #40a9ff;
  }
`;

export default function SearchSection() {
  const [files] = useState([
    { name: "sample.pdf", path: "/Users/yourname/Documents/sample.pdf" },
    { name: "test.docx", path: "/Users/yourname/Desktop/test.docx" },
    { name: "longnamefile1.txt", path: "/Users/yourname/Downloads/longnamefile1.txt" },
    { name: "longnamefile2.txt", path: "/Users/yourname/Downloads/longnamefile2.txt" },
    { name: "longnamefile3.txt", path: "/Users/yourname/Downloads/longnamefile3.txt" },
    { name: "longnamefile4.txt", path: "/Users/yourname/Downloads/longnamefile4.txt" },
    { name: "longnamefile5.txt", path: "/Users/yourname/Downloads/longnamefile5.txt" },
  ]);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // 검색 로직
    console.log('검색:', query);
  };

  return (
    <div style={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>
      {/* 파일 목록 */}
      <FileListContainer>
        <Typography.Text strong style={{ color: "#8fd6ff" }}>
          업로드된 파일 목록
        </Typography.Text>
        <List
          size="small"
          dataSource={files}
          style={{ marginTop: 8 }}
          renderItem={item => (
            <List.Item>
              <Tooltip title={item.path}>
                <FileLink
                  href={`file://${item.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.name}
                </FileLink>
              </Tooltip>
              <Tooltip title={item.path}>
                <FileLink
                  href={`file://${item.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: 16, fontSize: 13 }}
                >
                  {item.path}
                </FileLink>
              </Tooltip>
            </List.Item>
          )}
        />
      </FileListContainer>

      {/* 검색 바 */}
      <SearchBarRow>
        <StyledInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={" \n검색어를 입력하세요"}
          autoSize={{ minRows: 3, maxRows: 3 }}
        />
        <StyledButton
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          aria-label="검색"
        />
      </SearchBarRow>
    </div>
  );
}
