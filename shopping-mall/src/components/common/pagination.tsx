import styled from 'styled-components';

export default function Pagination({
  currentPage,
  lastPage,
  onClickPrevPage,
  onClickNextPage,
  onClickPage,
}: {
  currentPage: number;
  lastPage: number;
  onClickPrevPage: () => void;
  onClickNextPage: () => void;
  onClickPage: (page: number) => void;
}) {
  if (lastPage <= 1) return null;

  return (
    <ButtonWrapper>
      <Button onClick={onClickPrevPage} disabled={currentPage <= 1}>
        이전
      </Button>
      {Array.from({ length: lastPage }, (_, i) => (
        <Button onClick={() => onClickPage(i + 1)} key={i}>
          {i + 1}
        </Button>
      ))}
      <Button onClick={onClickNextPage} disabled={currentPage >= lastPage}>
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
