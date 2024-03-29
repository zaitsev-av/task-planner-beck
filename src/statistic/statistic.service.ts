import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { startOfDay, subDays } from 'date-fns'
import { UserService } from '../user/user.service'

@Injectable()
export class StatisticService {
	constructor(
		private prisma: PrismaService,
		private user: UserService
	) {}

	async getStatistics(id: string) {
		const profile = await this.user.getById(id)
		const totalTasks = profile.tasks.length
		const completedTasks = await this.prisma.task.count({
			where: {
				userId: id,
				isCompleted: true
			}
		})

		const todayStart = startOfDay(new Date())
		const weekStart = startOfDay(subDays(new Date(), 7))

		const todayTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAd: {
					gte: todayStart.toISOString()
				}
			}
		})

		const weekTasks = await this.prisma.task.count({
			where: {
				userId: id,
				createdAd: {
					gte: weekStart.toISOString()
				}
			}
		})

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = profile

		return {
			user,
			statistics: [
				{ label: 'Total', value: totalTasks },
				{ label: 'Completed tasks', value: completedTasks },
				{ label: 'Today tasks', value: todayTasks },
				{ label: 'Week tasks', value: weekTasks }
			]
		}
	}
}
