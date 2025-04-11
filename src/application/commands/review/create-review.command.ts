export class CreateReviewCommand {
  constructor(
    public readonly userId: number,
    public readonly productId: number,
    public readonly rating: number,
    public readonly comment: string,
  ) {}
}
