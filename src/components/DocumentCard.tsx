import { Card, Typography } from "antd";
import { ReactNode } from "react";
import styled from "styled-components";

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
  transition: transform 0.5s, box-shadow 0.5s;
  ${(props) =>
    props.$isFocused &&
    `
      transform: scale(1.15);
      z-index: 10;
      box-shadow: 0 16px 64px 0 rgba(31, 38, 135, 0.6);
      min-width: 500px;
      min-height: 500px;
      margin: 0 auto;
      cursor: default;
    `}
  &:hover {
    transform: translateY(-4px) scale(1.03);
  }
  position: relative;
`;

interface DocumentCardProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onClick?: () => void;
  $isFocused?: boolean;
  children?: ReactNode;
}

export default function DocumentCard({
  icon, title, description, onClick, $isFocused, children
}: DocumentCardProps) {
  return (
    <StyledCard hoverable onClick={onClick} $isFocused={$isFocused}>
      {icon && icon}
      {title && (
        <Typography.Title level={5} style={{ marginTop: 16, color: "#8fd6ff" }}>
          {title}
        </Typography.Title>
      )}
      {description && <p>{description}</p>}
      {children}
    </StyledCard>
  );
}
