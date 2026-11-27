import { Module } from '@nestjs/common';
import { FakeStoreProductProvider } from './fake-store-product.provider';
import { ProductProvider } from './product.provider';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    { provide: ProductProvider, useClass: FakeStoreProductProvider },
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
