export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function fileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('gz') || mimeType.includes('rar')) return '📦';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
  if (mimeType.startsWith('text/')) return '📄';
  return '📁';
}

export function fileColorClass(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'text-purple-400';
  if (mimeType.startsWith('video/')) return 'text-blue-400';
  if (mimeType.startsWith('audio/')) return 'text-yellow-400';
  if (mimeType.includes('pdf')) return 'text-red-400';
  if (mimeType.startsWith('text/')) return 'text-gray-300';
  return 'text-green-400';
}
