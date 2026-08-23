export interface PaginationInput {
  page?: string | undefined;
  limit?: string | undefined;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  input: PaginationInput,
): PaginationMeta => {
  const page = Number(input.page);
  const limit = Number(input.limit);

  const currentPage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const currentLimit =
    Number.isInteger(limit) && limit > 0
      ? Math.min(limit, 100)
      : 10;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};