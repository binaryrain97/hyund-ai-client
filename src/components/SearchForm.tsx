import React, { useEffect, useState } from 'react';
import { Input, Button, List, Typography, Tooltip, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import axios from 'axios';

// 타입 정의
type FileType = {
  name: string;
  dir: string;
  category_kor: string;
  similarity: number;
};

const FileListContainer = styled.div`
  background: linear-gradient(135deg, #1e283ccc, #223047cc);
  border-radius: 16px;
  padding: 20px 24px;
  color: #eaf6ff;
  height: 330px;
  max-height: 330px;
  overflow-y: auto;
  margin-bottom: 36px;
  margin-top: 56px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
`;

const CenteredMessage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 500px;
`;

const StyledInput = styled(Input.TextArea)`
  resize: none !important;
  min-height: 72px !important;
  max-height: 72px !important;
  font-size: 15px;
  border-radius: 8px;
  background: rgba(30, 40, 60, 0.7) !important;
  color: #8fd6ff !important;
  border: 1px solid #8fd6ff !important;
  text-align: center;
  flex: 1;
  font-weight: 600;
  &::placeholder {
    color: #8fd6ff;
    opacity: 1;
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
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  max-width: 60%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid #2a3a5a;
  font-weight: 700;
  font-size: 14px;
  color: #8fd6ff;
`;

const HeaderItem = styled.div`
  &:first-child {
    width: 30%;
  }
  &:nth-child(2) {
    width: 60%;
    margin-left: 16px;
    font-size: 13px;
  }
  &:last-child {
    width: 10%;
    margin-left: 16px;
    font-size: 13px;
    text-align: right;
  }
`;

export default function SearchSection() {
  const [files, setFiles] = useState<FileType[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!loading && files.length > 0) {
      setVisibleCount(0);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleCount(i);
        if (i >= files.length) clearInterval(interval);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [loading, files]);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/search', { query });
      const data = Array.isArray(response.data) ? response.data : [];
      // similarity 값이 없거나 undefined이면 0으로 보정
      setFiles(
        data.map(item => ({
          name: item.name ?? '',
          dir: item.dir ?? '',
          category_kor: item.category_kor ?? '',
          similarity: typeof item.similarity === 'number' && !isNaN(item.similarity)
            ? item.similarity
            : 0
        }))
      );
    } catch (error) {
      console.error('API 호출 오류:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>
      <FileListContainer>
        <Typography.Text strong style={{ color: "#8fd6ff" }}>
          검색 결과(유사도 순서)
        </Typography.Text>
        {loading ? (
          <CenteredMessage>
            <Spin size="large" tip="검색 중..." />
          </CenteredMessage>
        ) : !searched ? (
          <CenteredMessage>
            <Typography.Text style={{ color: "#b8dfff", fontStyle: "italic" }}>
              검색어를 입력하고 검색 버튼을 눌러주세요.
            </Typography.Text>
          </CenteredMessage>
        ) : files.length === 0 ? (
          <CenteredMessage>
            <Typography.Text style={{ color: "#b8dfff", fontStyle: "italic" }}>
              검색 결과가 없습니다.
            </Typography.Text>
          </CenteredMessage>
        ) : (
          <>
            <HeaderRow>
              <HeaderItem>파일명</HeaderItem>
              <HeaderItem>경로</HeaderItem>
              <HeaderItem>유사도</HeaderItem>
            </HeaderRow>
            <List
              size="small"
              dataSource={files.slice(0, visibleCount)}
              style={{ marginTop: 8, flex: 1, overflowY: 'auto' }}
              renderItem={item => (
                <List.Item>
                  <Tooltip title={item.dir}>
                    <FileLink
                      href={`file://${item.dir}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.name}
                    </FileLink>
                  </Tooltip>
                  <Tooltip title={item.dir}>
                    <FileLink
                      href={`file://${item.dir}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 16, fontSize: 13 }}
                    >
                      {item.dir}
                    </FileLink>
                  </Tooltip>
                  {/* <div style={{ marginLeft: 16, minWidth: 60, color: '#b8dfff', textAlign: 'right' }}>
                    {(typeof item.similarity === 'number' && !isNaN(item.similarity)
                      ? item.similarity
                      : 0
                    ).toFixed(3)}
                  </div> */}
                </List.Item>
              )}
            />
          </>
        )}
      </FileListContainer>

      <SearchBarWrapper>
        <SearchBarRow>
          <StyledInput
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={" \n내용을 입력하세요."}
            autoSize={{ minRows: 3, maxRows: 3 }}
          />
          <StyledButton
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            aria-label="검색"
          />
        </SearchBarRow>
      </SearchBarWrapper>
    </div>
  );
}
