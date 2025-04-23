export class RemoveProductFromWishlistCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
  ) {}
}
