import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class ViewProductObjectDto {
	@IsString()
	@IsNotEmpty()
	productName: string;

	@IsInt()
	@IsPositive()
	quantity: number;
}
