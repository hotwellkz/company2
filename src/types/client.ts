export interface Client {
  id: string;
  clientNumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  iin: string;
  constructionAddress: string;
  livingAddress: string;
  objectName: string;
  constructionDays: number;
  totalAmount: number;
  deposit: number;
  firstPayment: number;
  secondPayment: number;
  thirdPayment: number;
  fourthPayment: number;
  year: number;
  createdAt?: any;
}

export interface NewClient {
  id?: string;
  clientNumber: string;
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  iin: string;
  constructionAddress: string;
  livingAddress: string;
  objectName: string;
  constructionDays: number;
  totalAmount: number;
  deposit: number;
  firstPayment: number;
  secondPayment: number;
  thirdPayment: number;
  fourthPayment: number;
  year: number;
  createdAt?: any;
}

export const initialClientState: NewClient = {
  clientNumber: '',
  lastName: '',
  firstName: '',
  middleName: '',
  phone: '',
  email: '',
  iin: '',
  constructionAddress: '',
  livingAddress: '',
  objectName: '',
  constructionDays: 45,
  totalAmount: 0,
  deposit: 75000,
  firstPayment: 0,
  secondPayment: 0,
  thirdPayment: 0,
  fourthPayment: 0,
  year: new Date().getFullYear()
};