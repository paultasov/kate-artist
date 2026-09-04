const PLACEHOLDER_GRADIENTS = [
  'radial-gradient(circle at 30% 25%, #ff9472, transparent 55%), radial-gradient(circle at 70% 70%, #ffcf7a, transparent 55%), linear-gradient(150deg, #f2b84b, #e2795a)',
  'radial-gradient(circle at 40% 30%, #b19cd9, transparent 55%), linear-gradient(150deg, #8f7bc9, #6f5fa3)',
  'radial-gradient(circle at 55% 35%, #ffe08a, transparent 55%), linear-gradient(150deg, #f6c561, #d99b34)',
  'radial-gradient(circle at 35% 30%, #f6a6c1, transparent 55%), linear-gradient(150deg, #e082a3, #d1567e)',
  'radial-gradient(circle at 45% 30%, #8fc6e0, transparent 55%), linear-gradient(150deg, #6ea8c9, #4a7fa5)',
  'radial-gradient(circle at 50% 35%, #7fb69e, transparent 55%), linear-gradient(150deg, #5c9a83, #3f7d68)',
  'radial-gradient(circle at 40% 25%, #e2795a, transparent 55%), linear-gradient(150deg, #c9603f, #a8452c)',
];

export function placeholderGradientFor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length];
}
