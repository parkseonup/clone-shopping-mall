export const mockProducts = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1 + '',
  title: `제목_${i + 1}`,
  imageUrl: `https://picsum.photos/id/${i + 30}/200/300.jpg`,
  price: 3000,
  description: `설명_${i + 1}`,
  createdAt: Date.now(),
}));
