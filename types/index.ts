export type TourProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  country: string;
  title: string;
  description: string;
  image?: string | null;
  stops: any;
};
export type ToursProps = TourProps[];
export type TourDataProps = {
  data: ToursProps;
};
export type Destination = {
  city: string;
  country: string;
};

export type TokenProps = {
  clerkId: string;
  tokens: number;
};
export type TourResponse = {
  tour: TourProps | null;
  tokens: number;
};
