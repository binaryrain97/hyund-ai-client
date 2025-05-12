import React, { useEffect, useState } from 'react';
import { Input, Button, List, Typography, Tooltip, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const FileListContainer = styled.div`
  background: linear-gradient(135deg, #1e283ccc, #223047cc);
  border-radius: 16px;
  padding: 20px 24px;
  color: #eaf6ff;
  max-height: 360px;
  overflow-y: auto;
  margin-bottom: 36px;
  margin-top: 56px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

// const FileListItem = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 8px 12px;
//   border-bottom: 1px solid #2a3a5a;
//   transition: background-color 0.3s ease;
//   cursor: pointer;
//   &:hover {
//     background-color: #2a3a5a;
//   }
// `;

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
  background: rgba(122, 162, 243, 0.89);
  color:rgb(1, 3, 4);
  text-align: center;
  flex: 1;
  &::placeholder {
    color:rgb(9, 72, 109);
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

// const FilePath = styled.span`
//   color: #b8dfff;
//   font-size: 12px;
//   max-width: 35%;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   font-style: italic;
// `;

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
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

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

  const handleSearch = () => {
    setLoading(true);
    // 검색 로직 (예시로 2초 후 검색 완료)
    setTimeout(() => {
      setLoading(false);
      // setFiles(검색 결과); // 실제로는 검색 결과로 파일 목록 갱신
    }, 2000);
  };
  

  return (
    <div style={{ maxWidth: 500, width: '100%', margin: '0 auto' }}>
      {/* 파일 목록 */}
      <FileListContainer>
      <Typography.Text strong style={{ color: "#8fd6ff" }}>
        유사한 파일 목록
      </Typography.Text>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 180 }}>
            <Spin size="large" tip="검색 중..." />
          </div>
        ) : (
          <List
            size="small"
            dataSource={files.slice(0, visibleCount)}
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
        )}
        {/* 검색 버튼은 필요에 따라 추가 */}
      </FileListContainer>

      {/* 검색 바 */}
      <SearchBarRow>
        <StyledInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={" \n찾고 싶은 파일의 내용을 입력하세요."}
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
