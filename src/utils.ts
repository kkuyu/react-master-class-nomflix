export function makeLineClampStyle(lineHeight: number, clamp: number) {
  if (clamp === 1) {
    return `
      & {
        display: block;
        line-height: ${lineHeight};
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }`;
  }
  return `& {
    display: block;
    display: -webkit-box;
    max-height: ${lineHeight * clamp}em;
    line-height: ${lineHeight};
    -webkit-line-clamp: ${clamp};
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }`;
}

export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
