import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 25;

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: FindManyOptions<T>,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
) {
  const [items, total] = await repository.findAndCount({
    ...options,
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    items,
  };
}
