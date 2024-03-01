import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PrismaService } from '../prisma.service'
import { AuthDto } from './dto/auth.dto'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

describe('AuthController', () => {
	let controller: AuthController
	let service: AuthService

	const data = {
		accessToken: 'asdasdas',
		refreshToken: 'asasdasd',
		user: {
			id: 'clt45nb1h0000zzp3qklt5go1',
			createdAd: new Date(),
			updatedAd: new Date(),
			email: 'qwer123@asd.com',
			name: 'qwer123',
			workInterval: 45,
			breaklInterval: 15,
			intervalsCount: 5
		}
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService, PrismaService, JwtService, UserService]
		}).compile()

		controller = module.get<AuthController>(AuthController)
		service = module.get<AuthService>(AuthService)
	})

	describe('login', () => {
		it('should return the user data', async () => {
			const dto: AuthDto = {
				email: 'example@example.com',
				password: 'asdafdasd'
			}
			jest.spyOn(service, 'login').mockResolvedValue(data)

			// Create a mock response object
			const res = {
				cookie: jest.fn()
			}

			const result = await controller.login(dto, res as any)
			//refreshToken записывается у куки, он не приходит юзеру в ответе
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { refreshToken, ...rest } = data

			expect(result).toEqual(rest)
			expect(service.login).toHaveBeenCalledWith(dto)
		})
	})
})
