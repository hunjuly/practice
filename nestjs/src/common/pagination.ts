import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { applyDecorators, Type } from '@nestjs/common'
import { ApiOkResponse, ApiProperty, ApiQuery, getSchemaPath } from '@nestjs/swagger'

export class PaginatedDto<TData> {
    @ApiProperty()
    total: number

    @ApiProperty()
    limit: number

    @ApiProperty()
    offset: number

    results: TData[]
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                title: `PaginatedResponseOf${model.name}`,
                allOf: [
                    { $ref: getSchemaPath(PaginatedDto) },
                    {
                        properties: {
                            results: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) }
                            }
                        }
                    }
                ]
            }
        })
    )
}

export class PageDto {
    limit: number
    offset: number
}

const DEFAULT_PAGE_SIZE = 100

export const PageQuery = createParamDecorator(
    (data: unknown, context: ExecutionContext): PageDto => {
        const request = context.switchToHttp().getRequest()

        return {
            offset: parseInt(request.query.offset, 10) || 0,
            limit: parseInt(request.query.limit, 10) || DEFAULT_PAGE_SIZE
        }
    },
    [
        (target: any, key: string) => {
            ApiQuery({
                name: 'offset',
                schema: { default: 0, type: 'number', minimum: 0 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key))
            ApiQuery({
                name: 'limit',
                schema: { default: DEFAULT_PAGE_SIZE, type: 'number', minimum: 1 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key))
        }
    ]
)