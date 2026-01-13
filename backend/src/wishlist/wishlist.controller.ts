import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  // GET /wishlist - Lấy danh sách wishlist
  @Get()
  getWishlist(@Request() req: { user: { userId: string } }) {
    return this.wishlistService.getWishlist(req.user.userId);
  }

  // POST /wishlist/:productId - Thêm vào wishlist
  @Post(':productId')
  addToWishlist(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.addToWishlist(req.user.userId, productId);
  }

  // DELETE /wishlist/:productId - Xóa khỏi wishlist
  @Delete(':productId')
  removeFromWishlist(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.removeFromWishlist(req.user.userId, productId);
  }

  // POST /wishlist/:productId/toggle - Toggle wishlist
  @Post(':productId/toggle')
  toggleWishlist(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    return this.wishlistService.toggleWishlist(req.user.userId, productId);
  }

  // GET /wishlist/:productId/check - Kiểm tra sản phẩm có trong wishlist
  @Get(':productId/check')
  async checkWishlist(
    @Request() req: { user: { userId: string } },
    @Param('productId') productId: string,
  ) {
    const inWishlist = await this.wishlistService.isInWishlist(
      req.user.userId,
      productId,
    );
    return { inWishlist };
  }
}
