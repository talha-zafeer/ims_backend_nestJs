export class CreateOrganizationDto {
  name: string;
  bio: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipcode: string;
  };
  rep_name: string;
  rep_contact: string;
  logo: string;
}
