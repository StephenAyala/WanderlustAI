"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useParams } from "next/navigation";

import TourInfo from "@/components/TourInfo";
import { getSingleTour } from "@/utils/actions";
import { TourProps } from "@/types";

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_API_KEY}&query=`;

const SingleTourPage: React.FC = () => {
  const { id } = useParams();
  const [tour, setTour] = useState<TourProps | null>(null);
  const [tourImage, setTourImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTourData = async () => {
      setLoading(true);
      if (!id || Array.isArray(id)) return; // Check for string ID, since Next.js router.query params can be strings or string arrays
      try {
        const fetchedTour = await getSingleTour(id);

        if (!fetchedTour) {
          setError("Tour not found.");
          return;
        }

        setTour(fetchedTour);
        const { data } = await axios.get(`${url}${fetchedTour.city}`);
        const image = data?.results[0]?.urls?.raw;
        setTourImage(image || "");
      } catch (error) {
        console.error("Failed to fetch tour data:", error);
        setError("An error occurred while fetching tour data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        Back to Tours
      </Link>
      {tourImage && (
        <Image
          src={tourImage}
          width={300}
          height={300}
          alt={tour?.title || "Tour Image"}
          className="rounded-xl shadow-xl mb-16 object-cover h-auto w-auto"
          priority
        />
      )}
      {tour && <TourInfo tour={tour} />}
    </div>
  );
};

export default SingleTourPage;
