import { Link } from 'react-router-dom';

function Gnb() {
  return (
    <nav>
      <h3>카테고리 </h3>

      <ul>
        <li>
          <Link to={'/'}>홈</Link>
        </li>
        <li>
          <Link to={'/product'}>상품</Link>
        </li>
        <li>
          <Link to={'/cart'}>장바구니</Link>
        </li>
        <li>
          <Link to={'/admin'}>관리자</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Gnb;
