import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectStatus } from '../types/project';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { Pagination } from '../types/pagination';
import { PROJECT_NOT_ALLOWED, PROJECT_NOT_FOUND } from '../project.constants';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjects(userId: number, pagination: Pagination, search?: string) {
    const filters = {
      userId,
      status: { not: ProjectStatus.ARCHIVED },
    };

    if (search) {
      filters['OR'] = [
        { name: { contains: search } },
        { url: { contains: search } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prismaService.project.findMany({
        where: filters,
        skip: pagination.offset,
        take: pagination.limit,
      }),
      this.prismaService.project.count({ where: filters }),
    ]);

    const result = {
      projects,
      pagination: {
        total,
        limit: pagination.limit,
        offset: pagination.offset,
      },
    };

    return result;
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
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(PROJECT_NOT_ALLOWED);
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

  async deleteProject(projectId: number, userId: number) {
    const project = await this.prismaService.project.findFirst({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(PROJECT_NOT_FOUND);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(PROJECT_NOT_ALLOWED);
    }

    await this.prismaService.project.update({
      where: { id: projectId },
      data: { status: ProjectStatus.ARCHIVED },
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async expireProjects() {
    const now = new Date();
    const projects = await this.prismaService.project.findMany({});
    const expireProjects = projects
      .filter((project) => {
        return new Date(project.expiredAt) < now;
      })
      .map((project) => project.id);

    await this.prismaService.project.updateMany({
      where: { id: { in: expireProjects } },
      data: {
        status: ProjectStatus.EXPIRED,
      },
    });
  }
}
