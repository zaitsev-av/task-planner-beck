import { Controller, Get, HttpCode } from '@nestjs/common'
import { StatisticService } from './statistic.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('statistic')
export class StatisticController {
	constructor(private readonly statisticService: StatisticService) {}

	@Get()
	@HttpCode(200)
	@Auth()
	async getStatistic(@CurrentUser('id') id: string) {
		return this.statisticService.getStatistics(id)
	}
}
