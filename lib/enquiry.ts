/** JSON payload accepted by the enquiry endpoint. */
export type EnquiryRequest = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};
