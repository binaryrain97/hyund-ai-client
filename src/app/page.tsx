'use client';
import { useState, useEffect } from "react";
import { SaveOutlined, SearchOutlined } from "@ant-design/icons";
import styled from "styled-components";
import DocumentCard from "../components/DocumentCard";
import SaveForm from "../components/SaveForm";
import SearchForm from "../components/SearchForm";
import BackButtonInCard from "../components/BackButtonInCard";

const CardContainer = styled.div<{ isSingle?: boolean }>`
  display: flex;
  gap: 24px;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isSingle &&
    `
      flex-direction: column;
      gap: 0;
      height: 100vh;
    `}
`;

const FocusedCardWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;

export default function Page() {
  const [selectedCard, setSelectedCard] = useState<null | "save" | "search">(null);

  const handleCardClick = (type: "save" | "search") => {
    setSelectedCard(type);
    window.history.pushState({ card: type }, "card", "");
  };

  const handleBack = () => {
    window.history.back();
    setSelectedCard(null);
  };

  useEffect(() => {
    const onPopState = () => setSelectedCard(null);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
          <DocumentCard
            icon={<SaveOutlined style={{ fontSize: "100px", color: "#8fd6ff" }} />}
            title="문서 저장"
            description="문서의 내용을 기반으로 자동으로 분류합니다."
            onClick={() => handleCardClick("save")}
          />
          <DocumentCard
            icon={<SearchOutlined style={{ fontSize: "100px", color: "#8fd6ff" }} />}
            title="문서 검색"
            description="문서의 내용을 기반으로 위치를 탐색합니다."
            onClick={() => handleCardClick("search")}
          />
        </CardContainer>
      )}
      {selectedCard && (
        <FocusedCardWrapper>
          {selectedCard === "save" && (
            <DocumentCard $isFocused>
              <BackButtonInCard onClick={handleBack} />
              <SaveForm />
            </DocumentCard>
          )}
          {selectedCard === "search" && (
            <DocumentCard $isFocused>
              <BackButtonInCard onClick={handleBack} />
              <SearchForm />
            </DocumentCard>
          )}
        </FocusedCardWrapper>
      )}
    </main>
  );
}
