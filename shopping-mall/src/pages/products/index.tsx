import ProductList from '../../components/products/list';

function ProductsPage() {
  const list = [
    {
      id: 'id...',
      title: '제목...',
      imageUrl: 'https://...',
      price: 3000,
      description: '설명...',
      createdAt: Date.now(),
    },
  ]; // TODO: fetch 받아서 상품 목록 출력

  return (
    <>
      <h2>상품 목록 페이지</h2>

      <main>
        <ProductList list={list} />
      </main>
    </>
  );
}

export default ProductsPage;
