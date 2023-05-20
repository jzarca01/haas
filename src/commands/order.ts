import { Command, ux } from "@oclif/core";
import inquirer from "inquirer";
import inquirerPrompt from "inquirer-autocomplete-prompt";
import { isPossiblePhoneNumber, parsePhoneNumber } from "libphonenumber-js";

import axios, { AxiosError } from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from 'axios-retry';

interface Address {
  type: string;
  public_id: string;
  description: string;
}

interface ShippingInfo {
  name: string;
  address: string;
  phoneNumber: string;
}

interface CartInfo {
  quantity: number;
  withBread: boolean;
}

interface Address {
  type: string;
  public_id: string;
  description: string;
}

interface StripeBillingAddress {
  line1: string;
  postal_code: string;
  city: string;
}

interface StripeCustomerInfo {
  name: string;
}

interface StripeShippingInfo {
  address: StripeBillingAddress;
  phone: string;
}

interface StripeCartItem {
  quantity: number;
  price: string;
}

interface StripeCartInfo {
  items: Array<StripeCartItem>;
}

interface OrderPayload {
  customer: StripeCustomerInfo;
  shipping: StripeShippingInfo;
  cart: StripeCartInfo;
}

interface CheckoutSessionResponse {
  data: {
    url: string;
    id: string;
  }
}

interface WoosResponse {
  localities: Array<Address>;
}

const WOOS_APIKEY: string = "woos-f772a53c-e68d-3eb1-b95c-061019d5bb88";
const CHECKOUT_URL: string = "https://createorder-5dg3qqswqq-uc.a.run.app";
const STATUS_URL: string = "https://getpaymentstatus-5dg3qqswqq-uc.a.run.app";

const statusInstance = axios.create({ baseURL: STATUS_URL});
const MAX_RETRIES = 100;

axiosRetry(statusInstance, { retries: MAX_RETRIES, retryDelay: (retryCount) => retryCount * 1000, retryCondition: (error: AxiosError) => {
  // @ts-ignore
  return isNetworkOrIdempotentRequestError(error) || error.response.status === 402;
}, })

export function getFormattedAddress(address: string): StripeBillingAddress {
  const [street, postal_code, city, country] = address.split(", ");

  return {
    line1: street,
    postal_code,
    city,
  };
}

export async function getAddressResults(input: string): Promise<WoosResponse> {
  const response = await axios({
    method: "GET",
    url: "https://api.woosmap.com/localities/autocomplete/",
    params: {
      input,
      key: WOOS_APIKEY,
      components: "country:FRA",
      types: "address",
    },
    headers: {
      Referer: Buffer.from('aHR0cHM6Ly9mcmFucHJpeC5mci8=', 'base64').toString('ascii'),
    },
  });

  return response.data;
}

export async function createCheckoutSession(
  orderPayload: OrderPayload
): Promise<CheckoutSessionResponse> {
  return await axios({
    method: 'POST',
    url: CHECKOUT_URL,
    data: orderPayload
    });
}

export default class OrderCommand extends Command {
  static description = "Place an order for products";

  async run() {
    try {
      // Register the autocomplete prompt with Inquirer
      inquirer.registerPrompt("autocomplete", inquirerPrompt);

      const questionsCart = [
        {
          type: "input",
          name: "quantity",
          message: "Combien de pots de houmous souhaitez-vous commander ?",
          validate: (answer: string): boolean =>
            answer.length === 1 &&
            /^\d+$/.test(answer) &&
            !Number.isNaN(answer) &&
            parseInt(answer) > 0,
        },
        {
          type: "confirm",
          name: "withBread",
          message:
            "Souhaitez-vous ajouter du pain pizza fait maison à la commande ?",
          default: false,
        },
      ];
      // Get shipping information from the user
      const questionsShipping = [
        {
          type: "input",
          name: "name",
          message: "A quelle nom sera la commande ?",
          validate: (answer: string): boolean =>
            !!(answer?.trim()).length && /^[a-z ,.'-]+$/i.test(answer),
        },
        {
          type: "input",
          name: "phoneNumber",
          message:
            "A quel numéro de téléphone pourrons-nous joindre le client ? (format international)",
          validate: (answer: string): boolean => isPossiblePhoneNumber(answer),
        },
        {
          type: "autocomplete",
          name: "address",
          message: "A quelle adresse souhaitez-vous être livré ?",
          searchText: "Recherche en cours...",
          emptyText: "Aucun résultat.",
          source: async (
            _answersSoFar: any,
            input: string
          ): Promise<Array<Address | void> | void> => {
            if (!input || input.trim() === "") {
              return [];
            }
            try {
              const { localities } = await getAddressResults(input);
              return localities.map((p: any) => p.description);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ];

      const cartInfo: CartInfo = await inquirer.prompt(questionsCart);
      const shippingInfo: ShippingInfo = await inquirer.prompt(
        questionsShipping
      );

      // Prepare the order payload
      const orderPayload = {
        quantity: cartInfo.quantity,
        withBread: cartInfo.withBread,
        shippingInfo: {
          name: shippingInfo.name,
          address: shippingInfo.address,
          phoneNumber: parsePhoneNumber(
            shippingInfo.phoneNumber
          ).formatInternational(),
        },
      };

      this.log("Recapitulatif de la commande :");
      console.log("orderPayload", orderPayload);

      const confirmationPrompt = await inquirer.prompt([
        { type: "confirm", name: "isCorrect", message: "Est-ce correct ?" },
      ]);

      if (!confirmationPrompt.isCorrect) {
        return;
      }

      const withBreadPayload = {
        quantity: orderPayload.quantity,
        price: "STRIPE_BREADPRICE",
      };

      const cartItems: Array<StripeCartItem> =[
        {
          quantity: orderPayload.quantity,
          price: "STRIPE_HOUMOUSPRICE",
        }];

        if(cartInfo.withBread) {
          cartItems.push(withBreadPayload)
        }

      // Create a checkout session using Stripe API
      const response = await createCheckoutSession({
        customer: {
          name: orderPayload.shippingInfo.name,
        },
        shipping: {
          address: getFormattedAddress(orderPayload.shippingInfo.address),
          phone: orderPayload.shippingInfo.phoneNumber,
        },
        cart: {
          items: cartItems,
        },
      });
      const { url, id: session_id } = response.data;

      this.log(`Votre commande a été créée. Il ne reste plus qu'a vous rendre sur le lien suivant pour procéder au paiement : \n\n ${url} \n \n`);

      // show on stdout instead of stderr
      ux.action.start("En attente de paiement..");
      
      await statusInstance({
        method: 'GET',
        params: {
          session_id
        }
      })

      ux.action.stop("Le paiement a bien été reçu. Merci pour votre commande."); // shows 'starting a process... custom message'
    } catch (err) {
      console.log("Une erreur est survenue lors de la commande, veuillez réessayer.", err);
    }
  }
}
