import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }
}
