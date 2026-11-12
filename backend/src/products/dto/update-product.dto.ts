import { PartialType } from "@nestjs/mapped-types";
import { CreateProductDto } from "./create-product.dto";

// Todos os campos do CreateProductDto, porém opcionais (mantendo as mesmas validações quando enviados)
export class UpdateProductDto extends PartialType(CreateProductDto) {}
