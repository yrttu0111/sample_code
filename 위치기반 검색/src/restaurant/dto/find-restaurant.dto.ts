import { BaseQueryDto } from "@common/request/base-query.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsLatitude, IsLongitude, IsOptional } from "class-validator";

export class FindRestaurantDto extends BaseQueryDto {
  @ApiProperty({
    description: "행정구역 코드",
    required: false,
  })
  @IsOptional()
  districtCode?: string;

  @ApiProperty({
    description: "트레이너 정렬 거리순 0, 추천순 1",
    required: false,
  })
  @IsOptional()
  @IsInt()
  sort?: number;

  @ApiProperty({ description: "최대 거리", required: false })
  @IsOptional()
  maxDistance?: number;

  @ApiProperty({ description: "lng", required: false })
  @IsOptional()
  @IsLongitude()
  x?: number;

  @ApiProperty({ description: "lat", required: false })
  @IsOptional()
  @IsLatitude()
  y?: number;

  constructor(
    page?: number,
    offset?: number,
    districtCode?: string,
    sort?: number,
    maxDistance?: number,
    x?: number,
    y?: number
  ) {
    super(page, offset);
    this.districtCode = districtCode;
    this.sort = sort;
    this.maxDistance = maxDistance;
    this.x = x;
    this.y = y;
  }
}
