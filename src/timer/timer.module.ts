import { Module } from '@nestjs/common'
import { TimerService } from './timer.service'
import { TimerController } from './timer.controller'
import { PrismaService } from '../prisma.service'
import { UserService } from '../user/user.service'

@Module({
	controllers: [TimerController],
	providers: [TimerService, PrismaService, UserService]
})
export class TimerModule {}
