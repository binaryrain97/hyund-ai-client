'use client';
import { Card, Button, Typography, Upload, Input, message } from "antd";
import { SaveOutlined, SearchOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import styled, { css } from "styled-components";
import { useState, useEffect } from "react";
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';


const { Dragger } = Upload;

const StyledCard = styled(Card)<{ $isFocused?: boolean }>`
  background: rgba(24, 28, 36, 0.85);
  color: #eaf6ff;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255,255,255,0.12);
  min-width: 350px;
  max-width: 90vw;
  text-align: center;
  margin: 10px;
  cursor: pointer;
  transition:
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  ${(props) =>
    props.$isFocused &&
    css`
      transform: scale(1.15);
      z-index: 10;
      box-shadow: 0 16px 64px 0 rgba(31, 38, 135, 0.6);
      min-width: 500px;
      min-height: 500px;
      margin: 0 auto;
      cursor: default;
      pointer-events: none; /* 커진 카드에서는 클릭 이벤트 비활성화 */
    `}
  &:hover {
    transform: translateY(-4px) scale(1.03);
  }
  position: relative;
`;

const CardContainer = styled.div<{ isSingle?: boolean }>`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isSingle &&
    css`
      flex-direction: column;
      gap: 0;
      height: 100vh;
    `}
`;

const BackButtonInCard = styled(Button)`
  position: absolute !important;
  top: 24px;
  left: 24px;
  z-index: 10;
  pointer-events: auto !important; /* 카드의 pointer-events: none을 무시하고 버튼만 클릭 가능 */
  background: rgba(0,0,0,0.12);
  border: none;
  color: #8fd6ff;
  font-weight: 600;
  box-shadow: none;
  &:hover {
    background: rgba(0,0,0,0.24);
    color: #40a9ff;
  }
`;

const FocusedCardWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

const FormSection = styled.div`
  margin: 32px auto 0 auto;
  max-width: 400px;
  width: 100%;
  text-align: left;
`;

const StyledInput = styled(Input)`
  font-size: 1.1em;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StyledDragger = styled(Dragger)`
  background: rgba(255,255,255,0.05) !important;
  border: 2px dashed #8fd6ff !important;
  border-radius: 12px !important;
  margin-bottom: 24px;
  .ant-upload-drag-icon {
    margin-top: 16px;
  }
  .ant-upload-text {
    color: #eaf6ff;
    font-size: 1.1em;
  }
  .ant-upload-hint {
    color: #8fd6ff;
  }
`;

const Page : React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<null | "save" | "search">(null);
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  // 카드 클릭 시 상태 변경 & 히스토리 추가
  const handleCardClick = (type: "save" | "search") => {
    setSelectedCard(type);
    window.history.pushState({ card: type }, "card", "");
  };

  // 뒤로가기 버튼 동작
  const handleBack = () => {
    window.history.back();
    setSelectedCard(null);
  };

  // popstate 이벤트로 뒤로가기 감지
  useEffect(() => {
    const onPopState = () => setSelectedCard(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // 파일 업로드 props
  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: true,
    beforeUpload: (file: File) => {
      message.success(`${file.name} 파일이 업로드 준비되었습니다.`);
      return false;
    },
    onChange(info: UploadChangeParam<UploadFile<unknown>>) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 파일 업로드 성공.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 파일 업로드 실패.`);
      }
    },
  };

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 1
    }}>
      {!selectedCard && (
        <CardContainer>
          <StyledCard hoverable onClick={() => handleCardClick("save")}>
            <SaveOutlined style={{ fontSize: '100px', color: '#8fd6ff' }} />
            <Typography.Title level={5} style={{ marginTop: 16, color: "#8fd6ff"}}>
              문서 저장
            </Typography.Title>
            <p>문서의 내용을 기반으로 자동으로 분류합니다.</p>
          </StyledCard>
          <StyledCard hoverable onClick={() => handleCardClick("search")}>
            <SearchOutlined style={{ fontSize: '100px', color: '#8fd6ff' }} />
            <Typography.Title level={5} style={{ marginTop: 16, color: "#8fd6ff"}}>
              문서 검색
            </Typography.Title>
            <p>문서의 내용을 기반으로 위치를 탐색합니다.</p>
          </StyledCard>
        </CardContainer>
      )}
      {selectedCard && (
        <FocusedCardWrapper>
          {selectedCard === "save" && (
            <StyledCard $isFocused>
              <BackButtonInCard
                type="text"
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={handleBack}
                tabIndex={0}
                style={{ pointerEvents: "auto" }}
              >
                뒤로가기
              </BackButtonInCard>
              <SaveOutlined style={{ fontSize: '120px', color: '#8fd6ff', marginTop: 40 }} />
              <h1 style={{ color: "#8fd6ff", marginTop: 24, fontSize: 25 }}>문서 저장</h1>
              <p style={{ fontSize: "1.2em" }}>문서를 저장하는 기능을 수행합니다.</p>
              <FormSection>
                <label style={{ color: "#8fd6ff", fontWeight: 500, display: "block", marginBottom: 8 }}>
                  위치 입력
                </label>
                <StyledInput
                  placeholder="예: 서울 강남구"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  allowClear
                />
                <label style={{ color: "#8fd6ff", fontWeight: 500, display: "block", marginBottom: 8 }}>
                  파일 업로드
                </label>
                <StyledDragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: '48px', color: '#8fd6ff' }} />
                  </p>
                  <p className="ant-upload-text">파일을 드래그하거나 클릭하여 업로드하세요</p>
                  <p className="ant-upload-hint">여러 파일을 한 번에 업로드할 수 있습니다.</p>
                </StyledDragger>
              </FormSection>
            </StyledCard>
          )}
          {selectedCard === "search" && (
            <StyledCard $isFocused>
              <BackButtonInCard
                type="text"
                icon={<ArrowLeftOutlined />}
                size="large"
                onClick={handleBack}
                tabIndex={0}
                style={{ pointerEvents: "auto" }}
              >
                뒤로가기
              </BackButtonInCard>
              <SearchOutlined style={{ fontSize: '120px', color: '#8fd6ff', marginTop: 40 }} />
              <h1 style={{ color: "#8fd6ff", marginTop: 24 }}>문서 검색</h1>
              <p style={{ fontSize: "1.2em" }}>문서를 검색하는 기능을 수행합니다.</p>
              <FormSection>
                <label style={{ color: "#8fd6ff", fontWeight: 500, display: "block", marginBottom: 8 }}>
                  자연어로 검색
                </label>
                <StyledInput
                  placeholder="예: 강남구에서 회의록 찾기"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  allowClear
                />
                <Button type="primary" size="large" style={{ width: "100%", marginTop: 8 }}>
                  검색
                </Button>
              </FormSection>
            </StyledCard>
          )}
        </FocusedCardWrapper>
      )}
    </main>
  );
};

export default Page;
