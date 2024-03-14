"use client";
import React, { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  fetchUserTokensById,
  subtractTokens,
} from "@/utils/actions";
import TourInfo from "./TourInfo";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { Destination, TourProps } from "@/types";

const NewTour: React.FC = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation<TourProps | null, Error, Destination>({
    mutationFn: async (destination: Destination) => {
      if (!userId) {
        toast.error("User ID is not available.");
        return null;
      }
      const currentTokens = await fetchUserTokensById(userId);
      // Check if currentTokens is defined
      if (!currentTokens || currentTokens < 300) {
        toast.error("Token balance too low....");
        return null;
      }

      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;

      const newTour = await generateTourResponse(destination);
      if (!newTour || !newTour.tour) {
        toast.error("No matching city found...");
        return null;
      }

      await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ city, country });
    setCity("");
    setCountry("");
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="Country"
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <button
            className="btn btn-primary join-item"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Please wait..." : "Generate Tour"}
          </button>
        </div>
      </form>
      <div className="mt-16">{tour && <TourInfo tour={tour} />}</div>
    </>
  );
};
export default NewTour;
