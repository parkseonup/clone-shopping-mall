export default function ErrorFallback({
  resetErrorBoundary,
}: {
  resetErrorBoundary: (...args: any[]) => void;
}) {
  return (
    <div>
      <h3>서비스에 접속할 수 없습니다.</h3>
      <p>새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.</p>

      <button type="button" onClick={resetErrorBoundary}>
        새로고침
      </button>
    </div>
  );
}
