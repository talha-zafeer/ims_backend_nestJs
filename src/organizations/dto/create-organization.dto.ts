export class CreateOrganizationDto {
  name: string;
  bio: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipcode: string;
  };
  repName: string;
  repContact: number;
}
