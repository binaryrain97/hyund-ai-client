import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledBackButton = styled(Button)`
  position: absolute !important;
  top: 24px;
  left: 24px;
  z-index: 10;
  pointer-events: auto !important;
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

export default function BackButtonInCard({ onClick }: { onClick: () => void }) {
  return (
    <StyledBackButton
      type="text"
      icon={<ArrowLeftOutlined />}
      size="large"
      onClick={onClick}
      tabIndex={0}
      style={{ pointerEvents: "auto" }}
    >
      뒤로가기
    </StyledBackButton>
  );
}
