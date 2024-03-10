import { ApiProperty } from "@nestjs/swagger";

export interface IPage<T> {
  page: number;
  offset: number;
  total: number;
  data: T;
}

export class PageDto<T> {
  @ApiProperty({
    description: "page",
  })
  page: number;

  @ApiProperty({
    description: "offset",
  })
  offset: number;

  @ApiProperty({
    description: "total",
  })
  total: number;

  @ApiProperty({
    description: "data",
  })
  data: T;

  constructor({ page, offset, total, data }: IPage<T>) {
    this.page = page;
    this.offset = offset;
    this.total = total;
    this.data = data;
  }
}
