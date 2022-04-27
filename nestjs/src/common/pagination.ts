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

export class Paginate {
    limit: number
    offset: number
}

export const Page = createParamDecorator(
    (data: unknown, context: ExecutionContext): Paginate => {
        const request = context.switchToHttp().getRequest()
        // Whatever logic you want to parse params in request
        const DEFAULT_PAGE_SIZE = 30

        return {
            limit: parseInt(request.query.limit, 10) || DEFAULT_PAGE_SIZE,
            offset: parseInt(request.query.offset, 10) || 1
        }
    },
    [
        (target: any, key: string) => {
            const DEFAULT_PAGE_SIZE = 30

            ApiQuery({
                name: 'limit',
                schema: { default: 1, type: 'number', minimum: 1 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key))
            ApiQuery({
                name: 'offset',
                schema: { default: DEFAULT_PAGE_SIZE, type: 'number', minimum: 1 },
                required: false
            })(target, key, Object.getOwnPropertyDescriptor(target, key))
        }
    ]
)
