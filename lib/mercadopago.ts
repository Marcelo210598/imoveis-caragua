import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

if (!process.env.MP_ACCESS_TOKEN) {
  console.warn("Mercado Pago Access Token not found in environment variables");
}

export const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "",
});

export const preference = new Preference(mpClient);
export const payment = new Payment(mpClient);
