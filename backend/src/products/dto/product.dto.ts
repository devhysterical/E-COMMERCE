import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt({ message: 'Giá phải là số nguyên' })
  @Min(0, { message: 'Giá không được nhỏ hơn 0' })
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty({ message: 'CategoryId không được để trống' })
  categoryId: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
