import { EmailTemplateFactory } from './components/EmailTemplateFactory';
import { SeatLimitNotificationEmail } from './enterprise/SeatLimitNotificationEmail';
import { TeamSeatLimitEmail } from './enterprise/TeamSeatLimitEmail';
import { EnterpriseExpirationEmail } from './enterprise/EnterpriseExpirationEmail';

export const seatLimitNotificationEmail = (params: {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  accountLink: string;
  currentSeats: number;
  maxSeats: number;
}) => EmailTemplateFactory.createTemplate(SeatLimitNotificationEmail, params);

interface TeamSeatLimitParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  changePlanLink: string;
}

export const teamSeatLimitEmail = (params: TeamSeatLimitParams) => 
  EmailTemplateFactory.createTemplate(TeamSeatLimitEmail, params);

interface EnterpriseExpirationParams {
  userId: string;
  userName: string;
  userEmail: string;
  enterprisePlanName: string;
  expirationDate: string;
  renewLink: string;
  features: string[];
}

export const enterpriseExpirationEmail = (params: EnterpriseExpirationParams) => 
  EmailTemplateFactory.createTemplate(EnterpriseExpirationEmail, params);