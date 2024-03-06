import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRestaurantDto {
  @ApiProperty({
    description: "식당 이름",
    maxLength: 40,
    example: "식당",
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "식당 타입",
    maxLength: 100,
    example: "한식",
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: "식당 주소",
    maxLength: 100,
    example: "식당 주소",
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: "식당 전화번호",
    maxLength: 20,
    example: "010-1234-5678",
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "식당 설명",
    required: false,
    maxLength: 2000,
    example: "식당 설명",
  })
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    description: "기타 부대시설",
    required: false,
    maxLength: 500,
    example: "기타 부대시설",
  })
  @IsOptional()
  etc?: string | null;

  constructor(
    name: string,
    type: string,
    address: string,
    phone: string,
    description?: string | null,
    etc?: string | null
  ) {
    this.name = name;
    this.type = type;
    this.address = address;
    this.phone = phone;
    this.description = description;
    this.etc = etc;
  }
}
