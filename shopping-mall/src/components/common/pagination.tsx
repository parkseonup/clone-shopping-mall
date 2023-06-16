import styled from 'styled-components';

export default function Pagination({
  currentPage,
  totalPage,
  onPageChange,
}: {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPage <= 1) return null;

  const onChangeToPrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const onChangeToNextPage = () => {
    if (currentPage < totalPage) onPageChange(currentPage + 1);
  };

  return (
    <ButtonWrapper>
      <Button onClick={onChangeToPrevPage} disabled={currentPage <= 1}>
        이전
      </Button>
      {Array.from({ length: totalPage }, (_, i) => (
        <Button onClick={() => onPageChange(i + 1)} key={i}>
          {i + 1}
        </Button>
      ))}
      <Button onClick={onChangeToNextPage} disabled={currentPage >= totalPage}>
        다음
      </Button>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Button = styled.button<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${props => (props.$selected ? 'black' : 'inherit')};
  color: ${props => (props.$selected ? 'white' : 'black')};
  border: 1px solid #ddd;
  cursor: pointer;
`;
