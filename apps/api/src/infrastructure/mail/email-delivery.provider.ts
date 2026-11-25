export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export abstract class EmailDeliveryProvider {
  abstract assertReady(): void;
  abstract send(message: EmailMessage): Promise<void>;
}
