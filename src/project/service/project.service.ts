import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectStatus } from '../types/project';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }

  async createProject(project: CreateProjectDto, userId: number) {
    const { id } = await this.prismaService.project.create({
      data: {
        userId,
        url: project.url,
        name: project.name,
        expiredAt: project.expiredAt,
        status: ProjectStatus.ACTIVE,
      },
    });

    return id;
  }
}
