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
  if (!id) {
    return "https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg";
  }
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
