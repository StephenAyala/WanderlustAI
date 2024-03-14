"use server";
import OpenAI from "openai";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import {
  Destination,
  TokenProps,
  TourProps,
  TourResponse,
  ToursProps,
} from "@/types";
import { ChatCompletionMessage } from "openai/resources";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

export const generateChatResponse = async (
  chatMessages: ChatCompletionMessage[]
) => {
  try {
    const response: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          { role: "system", content: "you are a helpful assistant" },
          ...chatMessages,
        ],
        model: "gpt-3.5-turbo",
        temperature: 0,
        max_tokens: 100,
      });
    return {
      message: response.choices[0].message,
      tokens: response?.usage?.total_tokens,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateTourResponse = async ({
  city,
  country,
}: Destination): Promise<TourResponse | null> => {
  const query = `Find a exact ${city} in this exact ${country}.
  If ${city} and ${country} exist, create a list of things families can do in this ${city}, ${country}. 
  Once you have a list, create a one-day tour. Response should be in the following JSON format: 
  {
    "tour": {
      "city": "${city}",
      "country": "${country}",
      "title": "title of the tour",
      "description": "short description of the city and tour",
      "stops": ["stop name", "stop name", "stop name"]
    }
  }
  "stops" property should include only three stops.
  If you can't find info on exact ${city}, or ${city} does not exist, or its population is less than 1, or it is not located in the following ${country}, return { "tour": null }, with no additional characters.`;

  try {
    const response: OpenAI.Chat.Completions.ChatCompletion =
      await openai.chat.completions.create({
        messages: [
          { role: "system", content: "you are a tour guide" },
          {
            role: "user",
            content: query,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0,
      });

    const messageContent = response.choices[0].message.content;
    if (!messageContent) {
      console.error("No content in OpenAI response");
      return null;
    }

    const tourData = JSON.parse(messageContent);
    if (!tourData.tour) {
      console.error("No tour data found in OpenAI response");
      return null;
    }
    const tokensUsed = response.usage?.total_tokens ?? 0;
    return { tour: tourData.tour, tokens: tokensUsed };
  } catch (error) {
    console.error("Failed to generate tour response:", error);
    return null;
  }
};

export const getExistingTour = async ({
  city,
  country,
}: Destination): Promise<TourProps | null> => {
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
};

export const createNewTour = async (
  tour: Omit<TourProps, "id" | "createdAt" | "updatedAt">
): Promise<TourProps> => {
  return prisma.tour.create({
    data: tour,
  });
};

export const getAllTours = async (searchTerm?: string): Promise<ToursProps> => {
  if (!searchTerm) {
    const tours: ToursProps = await prisma.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  }
  const tours: ToursProps = await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    },
    orderBy: {
      city: "asc",
    },
  });
  return tours;
};

export const getSingleTour = async (id: string): Promise<TourProps | null> => {
  return prisma.tour.findUnique({
    where: {
      id,
    },
  });
};

export const generateTourImage = async ({ city, country }: Destination) => {
  try {
    const tourImage: OpenAI.Images.ImagesResponse =
      await openai.images.generate({
        prompt: `a panoramic view of the ${city} ${country}`,
        n: 1,
        size: "512x512",
      });
    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};

export const fetchUserTokensById = async (clerkId: string) => {
  const result: TokenProps | null = await prisma.token.findUnique({
    where: {
      clerkId,
    },
  });

  return result?.tokens;
};

export const generateUserTokensForId = async (
  clerkId: string
): Promise<number> => {
  const result: TokenProps = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (
  clerkId: string
): Promise<number> => {
  const result: number | undefined = await fetchUserTokensById(clerkId);
  if (result) {
    return result;
    // return result.tokens;
  }
  return await generateUserTokensForId(clerkId);
  // return (await generateUserTokensForId(clerkId)).tokens;
};

export const subtractTokens = async (
  clerkId: string,
  tokens: number
): Promise<number> => {
  const result = await prisma.token.update({
    where: {
      clerkId,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  revalidatePath("/profile");
  // Return the new token value
  return result.tokens;
};
