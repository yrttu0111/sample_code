import { DistrictResponseDto } from "@districts/dto/response-district.dto";
import { FileDto } from "@files/dto/file.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Menu, Restaurant, Status } from "@prisma/client";
import { IsNotEmpty, IsOptional } from "class-validator";

export class RestaurantResponseDto {
  @ApiProperty({
    description: "id",
  })
  id?: string;

  @ApiProperty({
    enum: Status,
    example: Status.NORMAL,
    description: `상태
    Status.NORMAL: 정상\n
    Status.WITHDRAWAL: 삭제됨\n
    `,
  })
  status?: Status;

  @ApiProperty({
    description: "생성일자",
  })
  createdAt?: Date;

  @ApiProperty({
    description: "생성일자",
  })
  updatedAt?: Date;

  @ApiProperty({
    description: "식당 이름",
    example: "맛나 포차",
  })
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: "식당 타입",
    example: "한식",
  })
  @IsNotEmpty()
  type?: string;

  @ApiProperty({
    description: "식당 주소",
    maxLength: 100,
  })
  @IsNotEmpty()
  address?: string;

  @ApiProperty({
    description: "식당 전화번호",
    maxLength: 30,
  })
  @IsNotEmpty()
  phone?: string;

  @ApiProperty({
    description: "식당 설명",
    maxLength: 2000,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "기타 부대시설",
  })
  etc?: string | null;

  @ApiProperty({
    description: "가까운 지하철역",
  })
  subway?: string | null;

  @ApiProperty({
    description: "가까운 지하철역 거리",
  })
  subwayDistance?: number | null;

  @ApiProperty({
    description: "식당 위치한 시도",
  })
  district?: DistrictResponseDto | null;

  @ApiProperty({
    description: "식당 위치한 x 좌표",
  })
  x?: number;

  @ApiProperty({
    description: "식당 위치한 y 좌표",
  })
  y?: number;

  @ApiProperty({
    type: FileDto,
    description: "식당 사진",
  })
  images?: FileDto[];

  @ApiProperty({
    description: "식당 메뉴",
  })
  menu?: MenuResponseDto[] | null;

  @ApiProperty({
    description: "거리",
  })
  distance?: number;

  constructor(
    restaurant:
      | (Restaurant & {
          menu?: Menu[] | null;
        } & {
          images?: FileDto[];
        } & {
          distance?: number;
        })
      | null
  ) {
    this.id = restaurant?.id;
    this.status = restaurant?.status;
    this.createdAt = restaurant?.createdAt;
    this.updatedAt = restaurant?.updatedAt;
    this.name = restaurant?.name ?? "이름없음";
    this.type = restaurant?.type ?? undefined;
    this.address = restaurant?.address ?? undefined;
    this.phone = restaurant?.phone ?? undefined;
    this.description = restaurant?.description ?? undefined;
    this.etc = restaurant?.etc ?? undefined;
    this.subway = restaurant?.subway ?? undefined;
    this.subwayDistance = restaurant?.subwayDistance?.toNumber() ?? undefined;
    this.x = restaurant?.x?.toNumber();
    this.y = restaurant?.y?.toNumber();
    this.menu = restaurant?.menu?.map((menu) => new MenuResponseDto(menu));
    this.images = restaurant?.images ?? undefined;
    this.distance = restaurant?.distance
      ? Number(restaurant?.distance?.toFixed(2))
      : undefined;
  }
}
