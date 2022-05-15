export function makeLineClampStyle(lineHeight: number, clamp: number) {
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
