/**
 * 分页工具函数
 * @description 生成分页页码数组，智能显示省略号
 */

export type PageNumber = number | '...';

interface GeneratePageNumbersParams {
  currentPage: number;
  totalPages: number;
  delta?: number;
}

/**
 * 生成页码数组
 * @param currentPage - 当前页码
 * @param totalPages - 总页数
 * @param delta - 当前页前后显示的页码数量（默认2）
 * @returns 页码数组，包含数字和省略号
 */
export function generatePageNumbers({
  currentPage,
  totalPages,
  delta = 2
}: GeneratePageNumbersParams): PageNumber[] {
  const range: number[] = [];
  const rangeWithDots: PageNumber[] = [];

  // 总页数较少时，显示所有页码
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      range.push(i);
    }
    return range;
  }

  // 生成页码范围
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 || // 第一页
      i === totalPages || // 最后一页
      (i >= currentPage - delta && i <= currentPage + delta) // 当前页附近
    ) {
      range.push(i);
    }
  }

  // 添加省略号
  let prev = 0;
  for (const i of range) {
    if (typeof i === 'number') {
      if (prev && i - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }
  }

  return rangeWithDots;
}
