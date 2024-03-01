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
			email: 'exemple@exemple.com',
			name: 'exemple name',
			workInterval: 45,
			breaklInterval: 15,
			intervalsCount: 5
		}
	}
	const dto: AuthDto = {
		email: 'example@example.com',
		password: 'asdafdasd'
	}

	const TestsError = {
		getExistingUserError() {
			return {
				message: 'User already exists',
				error: 'Bad Request',
				statusCode: 400
			}
		},

		getInvalidPasswordError() {
			return {
				message: ['Password must be at least 6 characters long'],
				error: 'Bad Request',
				statusCode: 400
			}
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

	it('should return an error if the password is less than 6 characters ', async () => {
		jest
			.spyOn(service, 'login')
			.mockRejectedValue(TestsError.getInvalidPasswordError())

		// Create a mock response object
		const res = {
			cookie: jest.fn()
		}

		await expect(controller.login(dto, res as any)).rejects.toStrictEqual(
			TestsError.getInvalidPasswordError()
		)
		expect(service.login).toHaveBeenCalledWith(dto)
	})

	describe('register', () => {
		it('should return the user register data', async () => {
			jest.spyOn(service, 'register').mockResolvedValue(data)

			// Create a mock response object
			const res = {
				cookie: jest.fn()
			}

			const result = await controller.register(dto, res as any)
			//refreshToken записывается у куки, он не приходит юзеру в ответе
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { refreshToken, ...rest } = data

			expect(result).toEqual(rest)
			expect(service.register).toHaveBeenCalledWith(dto)
		})
	})

	it('should return an error if a user with such a mail already exists ', async () => {
		jest
			.spyOn(service, 'register')
			.mockRejectedValue(TestsError.getExistingUserError())

		// Create a mock response object
		const res = {
			cookie: jest.fn()
		}

		await expect(controller.register(dto, res as any)).rejects.toStrictEqual(
			TestsError.getExistingUserError()
		)
		expect(service.register).toHaveBeenCalledWith(dto)
	})

	describe('logout', () => {
		it('should return true if user logout', async () => {
			// Create a mock response object
			const res = {
				cookie: jest.fn(),
				value: true
			}

			jest
				.spyOn(service, 'removeRefreshTokenFromResponse')
				.mockResolvedValue(res as never)

			const result = await controller.logout(res as never)

			expect(result).toBeTruthy()
			expect(service.removeRefreshTokenFromResponse).toHaveBeenCalledWith(
				res as never
			)
		})
	})
})
