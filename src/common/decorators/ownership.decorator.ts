import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { OwnershipGuard } from '../guards/ownership.guard';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export function CheckOwnership(
  resourceType: EntityClassOrSchema,
  idParam = 'id',
  userPath = 'user',
) {
  return applyDecorators(
    SetMetadata('resourceType', resourceType),
    SetMetadata('idParam', idParam),
    SetMetadata('userPath', userPath),
    UseGuards(OwnershipGuard),
  );
}
