import { TourProps } from "@/types";
import Link from "next/link";

const TourCard = ({ tour }: { tour: TourProps }) => {
  const { city, id, country } = tour;
  return (
    <Link
      href={`/tours/${id}`}
      className="card card-compact rounded-xl bg-base-100"
    >
      <div className="card-body items-center text-center">
        <h2 className="!mb-0 card-title text-center">
          {city}, {country}
        </h2>
      </div>
    </Link>
  );
};
export default TourCard;
