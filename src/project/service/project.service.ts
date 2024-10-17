import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectStatus } from '../types/project';
import { UpdateProjectDto } from '../dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }

  async createProject(
    project: CreateProjectDto,
    userId: number,
  ): Promise<number> {
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

  async updateProject(
    projectData: UpdateProjectDto,
    id: number,
    userId: number,
  ): Promise<void> {
    const project = await this.prismaService.project.findFirst({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'You are not allowed to update this project',
      );
    }

    await this.prismaService.project.update({
      where: { id },
      data: {
        url: projectData.url,
        name: projectData.name,
        expiredAt: projectData.expiredAt,
        status: projectData.status,
      },
    });
  }
}
