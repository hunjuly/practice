import { Test } from '@nestjs/testing'
import { Readable } from 'stream'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

function createTestingModule() {
    return Test.createTestingModule({
        controllers: [FilesController],
        providers: [
            {
                provide: FilesService,
                useValue: {
                    create: jest.fn().mockResolvedValue(oneFile),
                    findAll: jest.fn().mockResolvedValue(fileArray),
                    findOne: jest.fn().mockResolvedValue(oneFile),
                    remove: jest.fn()
                }
            }
        ]
    }).compile()
}

const fileArray = [
    {
        id: 'uuid#1',
        category: 'category#1',
        originalName: 'filename.json',
        mimeType: 'application/json',
        size: 5000
    },
    {
        id: 'uuid#2',
        category: 'category#1',
        originalName: 'filename.txt',
        mimeType: 'application/text',
        size: 6000
    }
]

const oneFile = {
    id: 'uuid#1',
    category: 'category#1',
    originalName: 'filename.json',
    mimeType: 'application/json',
    size: 5000
}

describe('FilesController', () => {
    let controller: FilesController
    let service: FilesService

    beforeEach(async () => {
        const module = await createTestingModule()

        controller = module.get<FilesController>(FilesController)
        service = module.get<FilesService>(FilesService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('upload a file', async () => {
        const dto = {
            fieldName: 'string'
        }

        const file = {
            originalname: 'string',
            mimetype: 'string',
            size: 0,
            destination: 'string',
            filename: 'string',
            path: 'string'
        } as Express.Multer.File

        const actual = await controller.create(dto, file)
        const expected = oneFile

        expect(actual).toEqual(expected)
        expect(service.create).toHaveBeenCalledWith(expect.objectContaining(dto))
    })
})
