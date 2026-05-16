import { Request, Response } from "express";
import { payOrderService } from "./payment.service";

export const payOrder = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const orderId = req.params.id;
  const { holderName, cardNumber, expirationDate, cvv } = req.body;

  const data = await payOrderService(orderId as string, {
    userId,
    holderName,
    cardNumber,
    expirationDate,
    cvv,
  });

  res.status(200).json({
    success: true,
    data,
    message: "Payment successfull",
  });
};
