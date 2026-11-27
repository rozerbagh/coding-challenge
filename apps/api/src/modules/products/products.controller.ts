import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('featured')
  getFeaturedProducts(): Promise<Product[]> {
    return this.productsService.getFeaturedProducts();
  }

  @Get('categories')
  getCategories(): Promise<string[]> {
    return this.productsService.getCategories();
  }

  @Get('categories/:category')
  getProductsByCategory(
    @Param('category') category: string,
  ): Promise<Product[]> {
    return this.productsService.getProductsByCategory(category);
  }

  @Get()
  searchProducts(@Query('search') search?: string): Promise<Product[]> {
    return this.productsService.searchProducts(search);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }
}
