"use client";

import { getAllTours } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import ToursList from "./ToursList";
import { useState, useEffect } from "react";
import debounce from "@/third-party/debounce/debounce";

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  // Debounce search value
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    handler();

    // Cleanup debounce
    return () => {
      handler.cancel();
    };
  }, [searchValue]);

  const { data, isPending, error } = useQuery({
    queryKey: ["tours", debouncedSearchValue],
    queryFn: () => getAllTours(debouncedSearchValue),
  });
  return (
    <>
      <form className="max-w-lg mb-12">
        <div className="join w-full">
          <input
            type="text"
            name="search"
            placeholder="Enter city or country..."
            aria-label="Search for tours by city or country"
            className="input input-bordered join-item w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
          />
          <button
            className="btn btn-primary join-item"
            type="button"
            disabled={isPending}
            onClick={() => setSearchValue("")}
          >
            {isPending ? "Please wait..." : "Reset"}
          </button>
        </div>
      </form>

      {isPending ? (
        <span className="loading">Loading...</span>
      ) : error ? (
        <p>Error fetching tours.</p>
      ) : data?.length > 0 ? (
        <ToursList data={data} />
      ) : (
        <p>No tours found.</p>
      )}
    </>
  );
};
export default ToursPage;
