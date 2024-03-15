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
import { MessageInterface } from "@/components/Chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

// Uses OpenAI's API to generate a chat response based on the input chat messages
export const generateChatResponse = async (
  chatMessages: MessageInterface[]
): Promise<{
  message: OpenAI.Chat.Completions.ChatCompletionMessage;
  tokens: number | undefined;
} | null> => {
  try {
    // Creates a chat completion request to OpenAI with predefined system messages and user input
    const response = await openai.chat.completions.create({
      /**
       * A list of messages comprising the conversation so far.
       * [Example Python code](https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models).
       */
      messages: [
        { role: "system", content: "you are a helpful assistant" },
        /**
         * Error fires because ChatCompletionFunctionMessageParam requires the name property.
         * ChatCompletionFunctionMessageParam has been deprecated as well.
         * So for now I am ignoring the error.
         */
        //@ts-ignore
        ...chatMessages,
      ],
      /**
       * ID of the model to use. See the
       * [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility)
       * table for details on which models work with the Chat API.
       */
      model: "gpt-3.5-turbo",
      /**
       * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will
       * make the output more random, while lower values like 0.2 will make it more
       * focused and deterministic.
       *
       * We generally recommend altering this or `top_p` but not both.
       */
      temperature: 0,
      /**
       * The maximum number of [tokens](/tokenizer) that can be generated in the chat
       * completion.
       *
       * The total length of input tokens and generated tokens is limited by the model's
       * context length.
       */
      max_tokens: 100,
    });
    console.log("response", response.choices);
    console.log("response", response.choices[0]);
    // Returns the chat message and the number of tokens used for generating the response
    return {
      message: response.choices[0].message,
      tokens: response?.usage?.total_tokens,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Generates a personalized tour response based on the specified city and country using OpenAI
export const generateTourResponse = async ({
  city,
  country,
}: Destination): Promise<TourResponse | null> => {
  // Template query for generating the tour response
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
    // Sends the query to OpenAI and processes the response
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
    const tokensUsed = response.usage?.total_tokens;
    if (!tokensUsed) {
      console.error("Token usage data not available in OpenAI response.");
      return null;
    }
    // Returns the generated tour data and the tokens used
    return { tour: tourData.tour, tokens: tokensUsed };
  } catch (error) {
    console.error("Failed to generate tour response:", error);
    return null;
  }
};

// Retrieves an existing tour from the database based on the provided city and country
export const getExistingTour = async ({
  city,
  country,
}: Destination): Promise<TourProps | null> => {
  // Searches for a unique tour in the database where the city and country match
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
};

// Creates a new tour in the database with the provided tour details
export const createNewTour = async (
  tour: Omit<TourProps, "id" | "createdAt" | "updatedAt">
): Promise<TourProps> => {
  // Inserts a new tour record into the database
  return prisma.tour.create({
    data: tour,
  });
};

// Retrieves all tours from the database, optionally filtered by a search term
export const getAllTours = async (searchTerm?: string): Promise<ToursProps> => {
  if (!searchTerm) {
    // Fetches all tours ordered by city if no search term is provided
    const tours: ToursProps = await prisma.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  }
  // Fetches tours where the city or country contains the search term, case-insensitively
  const tours: ToursProps = await prisma.tour.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: searchTerm,
            mode: "insensitive",
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

// Retrieves a single tour from the database based on its unique ID
export const getSingleTour = async (id: string): Promise<TourProps | null> => {
  // Searches for a unique tour in the database by its ID
  return prisma.tour.findUnique({
    where: {
      id,
    },
  });
};

/**
 * Generates an image for a tour using OpenAI's image generation feature
 *
 * Not currently used in the application.
 */
export const generateTourImage = async ({ city, country }: Destination) => {
  try {
    // Requests an image generation from OpenAI based on the provided city and country
    const tourImage: OpenAI.Images.ImagesResponse =
      await openai.images.generate({
        prompt: `a panoramic view of the ${city} ${country}`,
        n: 1,
        size: "512x512",
      });
    // Returns the URL of the generated image
    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};

// Fetches the current token balance for a user based on their Clerk ID
export const fetchUserTokensById = async (
  clerkId: string
): Promise<number | null> => {
  // Searches for the user's token record in the database by Clerk ID
  const result: TokenProps | null = await prisma.token.findUnique({
    where: {
      clerkId,
    },
  });
  // Returns the current token balance, or null if not found
  return result?.tokens ?? null;
};

// Creates a new token record for a user with a default balance, if one doesn't exist
export const generateUserTokensForId = async (
  clerkId: string
): Promise<number> => {
  // Inserts a new token record into the database for the user
  const result: TokenProps = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  // Returns the initial token balance
  return result?.tokens;
};

// Ensures a user has a token balance, either by fetching the existing balance or generating a new one
export const fetchOrGenerateTokens = async (
  clerkId: string
): Promise<number> => {
  const result: number | null = await fetchUserTokensById(clerkId);
  if (result) {
    // If a token balance exists, it is returned
    return result;
  }
  // If no token balance exists, a new one is generated and returned
  return await generateUserTokensForId(clerkId);
};

// Deducts a specified number of tokens from a user's balance
export const subtractTokens = async (
  clerkId: string,
  tokens: number
): Promise<number> => {
  // Updates the user's token balance in the database, decrementing by the specified amount
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
  // Invalidates the cache for the user's profile page to reflect the new token balance
  revalidatePath("/profile");
  // Returns the new token balance
  return result.tokens;
};
