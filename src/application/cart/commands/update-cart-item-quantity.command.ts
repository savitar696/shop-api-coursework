export class UpdateCartItemQuantityCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
    public readonly quantity: number,
  ) {}
}
