import { PartialType } from "@nestjs/swagger";
import { CreateProductDto } from "./create-product.dto";

// Todos os campos do CreateProductDto, porém opcionais (mantendo as mesmas validações quando enviados)
export class UpdateProductDto extends PartialType(CreateProductDto) {}
