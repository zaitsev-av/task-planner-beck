import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { UserDto } from './dto/user.dto'

describe('UserController', () => {
	let controller: UserController
	let service: UserService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [UserService]
		}).compile()

		controller = module.get<UserController>(UserController)
		service = module.get<UserService>(UserService)
	})

	describe('profile', () => {
		it('should return the user profile', async () => {
			const id = 'user-id'
			// const profile = { id, name: 'John Doe' }
			const profile = {
				user: {
					id: 'clt45nb1h0000zzp3qklt5go1',
					createdAd: new Date(),
					updatedAd: new Date(),
					email: 'qwer123@asd.com',
					name: 'qwer123',
					workInterval: 45,
					breaklInterval: 15,
					intervalsCount: 5,
					tasks: [
						{
							id: 'clt5omftk0001lp0i70yof58l',
							createdAd: new Date(),
							updatedAd: new Date(),
							name: 'Hello beck',
							priority: null,
							isCompleted: false,
							userId: 'clt45nb1h0000zzp3qklt5go1'
						}
					]
				}
			}
			jest.spyOn(service, 'getProfile').mockResolvedValue(profile)

			const result = await controller.profile(id)

			expect(result).toEqual(profile)
			expect(service.getProfile).toHaveBeenCalledWith(id)
		})

		it('should throw an error if user is not authenticated', async () => {
			const id = 'user-id'
			jest
				.spyOn(service, 'getProfile')
				.mockRejectedValue(new Error('Unauthorized'))

			await expect(controller.profile(id)).rejects.toThrowError('Unauthorized')
			expect(service.getProfile).toHaveBeenCalledWith(id)
		})
	})

	describe('updateProfile', () => {
		it('should update the user profile', async () => {
			const id = 'user-id'
			const dto: UserDto = {
				name: 'Name',
				email: '1234@qwe.com',
				password: '12313423fs'
			}
			const updatedProfile = { id, name: 'John Doe', email: 'john@example.com' }
			jest.spyOn(service, 'update').mockResolvedValue(updatedProfile)

			const result = await controller.updateProfile(id, dto)

			expect(result).toEqual(updatedProfile)
			expect(service.update).toHaveBeenCalledWith(id, dto)
		})

		it('should throw an error if user is not authenticated', async () => {
			const id = 'user-id'
			const dto: UserDto = {
				name: 'Name',
				email: '1234@qwe.com',
				password: '12313423fs'
			}
			jest.spyOn(service, 'update').mockRejectedValue(new Error('Unauthorized'))

			await expect(controller.updateProfile(id, dto)).rejects.toThrowError(
				'Unauthorized'
			)
			expect(service.update).toHaveBeenCalledWith(id, dto)
		})
	})
})
