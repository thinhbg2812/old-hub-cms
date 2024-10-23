import { sendGetRequest } from "./service";

export const listOrderRequest = async ({
  orderCode,
  receiverPhone,
  senderPhone,
  pageIndex,
  pageSize,
}) => {
  let params = {
    pageIndex,
    pageSize,
    orderCode,
    receiverPhone,
    senderPhone,
  };
  return await sendGetRequest("/api/private/order", params);
};
