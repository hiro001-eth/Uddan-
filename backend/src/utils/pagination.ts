export type ListParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};

export function getPagination(params: ListParams) {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.min(100, Math.max(1, Number(params.limit || 20)));
  const skip = (page - 1) * limit;
  const take = limit;
  return { page, limit, skip, take };
}

export function getOrderBy(sort?: string, order?: 'asc' | 'desc') {
  if (!sort) return undefined as any;
  const [field] = sort.split(',');
  return { [field]: order || 'asc' } as any;
}
