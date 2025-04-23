export class AddProductToWishlistCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
  ) {}
}
