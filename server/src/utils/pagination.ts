export interface PaginationInput {
  page?: number | undefined;
  limit?: number | undefined;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  input: PaginationInput,
): PaginationMeta => {
  const { page, limit } = input;

  const currentPage =
    typeof page === "number" && Number.isInteger(page) && page > 0
      ? page
      : 1;

  const currentLimit =
    typeof limit === "number" && Number.isInteger(limit) && limit > 0
      ? Math.min(limit, 100)
      : 10;

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};
