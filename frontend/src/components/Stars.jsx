export default function Stars({ valor, max = 5, size = 'sm' }) {
  const sz = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <span className={`${sz} leading-none`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < Math.round(valor) ? 'text-yellow-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </span>
  );
}
