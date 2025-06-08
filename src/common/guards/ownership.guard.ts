import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ModuleRef } from '@nestjs/core';
import { Repository } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { CustomRequest, ResourceWithUser } from '../interfaces/Authentication';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
  ) {}

  private getNestedProperty<T>(obj: unknown, path: string): T | undefined {
    if (typeof obj !== 'object' || obj === null) return undefined;

    return path.split('.').reduce<unknown>((acc, part) => {
      if (typeof acc === 'object' && acc !== null && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj) as T | undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    const resourceType = this.reflector.get<EntityClassOrSchema>(
      'resourceType',
      context.getHandler(),
    );

    const idParamName = this.reflector.get<string>(
      'idParam',
      context.getHandler(),
    );

    const userPath = this.reflector.get<string>(
      'userPath',
      context.getHandler(),
    );

    const id = +(request.params[idParamName] || request.body[idParamName]);

    const relations: string[] = [];
    const parts = userPath.split('.');
    for (let i = 0; i < parts.length; i++) {
      relations.push(parts.slice(0, i + 1).join('.'));
    }

    const repo = this.moduleRef.get<Repository<any>>(
      getRepositoryToken(resourceType),
      {
        strict: false,
      },
    );

    const resource = (await repo.findOne({
      where: { id },
      relations,
    })) as ResourceWithUser;

    if (!resource) {
      throw new NotFoundException('Recurso não encontrado!');
    }

    const resourceUser = this.getNestedProperty<{ id: number }>(
      resource,
      userPath,
    );

    if (!resourceUser || resourceUser.id !== user.sub) {
      throw new ForbiddenException('Acesso negado!');
    }

    return true;
  }
}
