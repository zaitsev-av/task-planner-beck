import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { StatisticModule } from './statistic/statistic.module';
import { TaskModule } from './task/task.module';

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, StatisticModule, TaskModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
