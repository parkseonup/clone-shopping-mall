import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

const HiddenTitle = styled.h3`
  overflow: hidden;
  position: absolute;
  clip: rect(0, 0, 0, 0);
  clip-path: circle(0);
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
`;

const GnbList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

function Gnb() {
  return (
    <nav>
      <HiddenTitle>카테고리</HiddenTitle>

      <GnbList>
        <li>
          <Link to={'/'}>홈</Link>
        </li>
        <li>
          <Link to={'/products'}>상품</Link>
        </li>
        <li>
          <Link to={'/cart'}>장바구니</Link>
        </li>
        <li>
          <Link to={'/payment'}>결제</Link>
        </li>
        <li>
          <Link to={'/admin'}>관리자</Link>
        </li>
      </GnbList>
    </nav>
  );
}

export default Gnb;
