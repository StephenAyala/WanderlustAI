# Welcome to Wanderlust AI

Wanderlust AI is an innovative travel exploration web application designed to ignite the wanderlust in every user. By harnessing the power of artificial intelligence, particularly OpenAI's GPT model, Wanderlust AI offers a unique approach to discovering and planning your next travel adventure.

This application stands out by dynamically generating personalized tours based on user preferences, providing rich descriptions, curated stops, and stunning visuals of cities and countries around the globe. With its user-friendly interface and responsive design, Wanderlust AI ensures a seamless and engaging experience across all devices.

## Key Features

- **AI-Powered Tour Generation**: Enter a city and country, and let the AI create a detailed one-day itinerary tailor-made for you, complete with must-visit stops.
- **Stunning Imagery**: Browse through beautiful, high-resolution images from Unsplash, bringing destinations to life right on your screen.
- **Interactive Chat**: Engage with our AI chatbot for instant recommendations, tips, and answers to your travel queries.
- **User-Friendly Interface**: A clean, intuitive design makes navigation a breeze, allowing you to focus on what truly matters—planning your next escape.
- **Personalization**: Log in to save your favorite tours, customize your preferences, and manage your profile for a more personalized experience.
- **Token Management**: Users can generate new tours with ease, thanks to a straightforward token management system ensuring access to the app's premium features.

Wanderlust AI is more than just a travel app; it's your gateway to the world, designed to inspire and facilitate unforgettable journeys with just a few clicks. Whether you're a seasoned traveler or dreaming of your first trip, Wanderlust AI is here to guide you every step of the way.

Start exploring today and let Wanderlust AI turn your travel dreams into reality!

# Project Setup Guide

This guide covers the setup processes for DaisyUI, Clerk integration in a Next.js application, and configuring the OpenAI API.

## DaisyUI Setup

DaisyUI extends Tailwind CSS with additional components. Begin by cleaning up your global styles and configuring Tailwind CSS to include DaisyUI.

### Step 1: Clean `globals.css`

Remove any default or unnecessary code from `globals.css` to avoid conflicts with Tailwind CSS and DaisyUI styles.

### Step 2: Update `tailwind.config.js`

Configure Tailwind CSS to include DaisyUI and any other necessary plugins like typography:

```js
{
plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
```

## Clerk Integration

Clerk provides user management and authentication for web applications. Follow these steps to integrate Clerk with a Next.js application.

### Documentation

Refer to the [Clerk Documentation](https://clerk.com/) for comprehensive guides and API references.

### Setup Process

1.  **Create a Clerk Account:** Sign up at [Clerk](https://clerk.com/) and log in.
2.  **Create a New Application:** In your Clerk dashboard, set up a new application.
3.  **Complete the Next.js Integration:**

    - Install the Clerk Next.js package:

      ```sh
      bun add @clerk/nextjs
      ```

    - Configure your environment variables in `.env.local`:

      ```sh
      # .env.local
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_publishable_key>
      CLERK_SECRET_KEY=<your_secret_key>
      ```

#### Note on Environment Variables

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Use them for public configurations:

```js
// Accessing a public API key in your code
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
```

## OpenAI API Configuration

For projects utilizing OpenAI's services, follow these steps to set up and secure your API key.

### Pricing and Plans

Check [OpenAI Pricing](https://openai.com/pricing) to choose a plan that fits your project's needs.

### Integration Steps

1.  **Install the OpenAI Package:**

    ```sh
    bun add openai
    ```

2.  **Generate an API Key:** Log in to your OpenAI account and create a new API key.
3.  **Secure Your API Key:** Store your API key in `.env.local` to keep it secure and accessible within your application:

    ```sh
    # .env.local
    OPENAI_API_KEY=<your_openai_api_key>
    ```

## NeonTech Documentation

Welcome to the NeonTech documentation. Here you will find all the necessary steps to set up your environment, connect to your database, and define your data model using Prisma with a PostgreSQL database.

### Getting Started

---

Before you begin, make sure you have Prisma set up in your project. If you haven't done so yet, refer to the official Prisma documentation to get started:

[Prisma Setup Guide](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)

### Initial Setup Commands

---

Once Prisma is set up, use the following commands to generate the Prisma client and apply initial migrations to your database:

1.  Add Prisma
    ```sh
    bun add -d prisma
    bun add @prisma/client
    ```
2.  Create your Prisma Schema file if not already created:
    ```sh
    bunx prisma init
    ```
3.  Generate the Prisma client:

    ```sh
    bunx prisma generate
    ```

4.  Create and apply initial migrations:

    ```sh
    bunx prisma migrate dev --name init
    ```

### Defining the Data Model

---

Below is the Prisma model definition for a `Tour` entity. This model includes fields such as `id`, `createdAt`, `updatedAt`, `city`, `country`, `title`, `description`, `image`, and `stops`, with specific attributes defining their behavior in the database.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Tour {
  id String @id @default(uuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  city String
  country String
  title String
  description String @db.Text
  image String? @db.Text
  stops Json
  @@unique([city, country])
}

model Token {
  clerkId String @id
  tokens Int @default (1000)
}
```

### Additional Commands

---

After defining your model, use these commands to push the schema to your database and launch Prisma Studio:

- Push the schema to the database:

  ```sh
  npx prisma db push
  ```

- Launch Prisma Studio for a visual representation of your data:

  ```sh
  npx prisma studio
  ```

### Attribute Explanations

---

- `@db.Text`: This attribute is used to specify the type of the column in the underlying database. When you use @db.Text, you're telling Prisma that the particular field should be stored as a text column in the database. Text columns can store large amounts of string data, typically used for long-form text that exceeds the length limits of standard string columns. This is often used for descriptions, comments, JSON-formatted strings, etc.
- `@@unique`: This attribute is used at the model level to enforce the uniqueness of a specific combination of fields within the database. In this case, @@unique([city, country]) ensures that no two rows in the table have the same combination of city and country. This means you can have multiple tours in the same city or country, but not multiple tours with the same city and country combination. It essentially acts as a composite unique constraint on the two fields.

With this setup, you're ready to integrate Prisma into your project and start working with your database effectively.

## Image Resources and Cost Efficiency

- **Unsplash Integration:** For projects requiring image generation, integrating Unsplash as the image source can be a cost-effective alternative to using more expensive services like OpenAI. Unsplash offers a wide range of high-quality images that can be used for various applications.

## Security and User Management Enhancements (Clerk Logic)

### Account Deletion Restrictions

To enhance user management and prevent the exploitation of new account benefits, the following adjustments are recommended:

- **Disable Account Deletion:** Remove the option for users to delete their accounts. This change aims to deter users from deleting their accounts with the intention of creating new ones to gain additional tokens or benefits.

  - Navigate to: `User & Authentication` > `Email, Phone, & Username` settings.
  - Action: Disable the option that allows users to delete their accounts.

### Email Validation Improvements

Implement stricter email validation rules to enhance security and reduce the potential for abuse:

- **Block Disposable Emails:** Prevent users from registering with disposable email addresses. Disposable emails are often used to bypass registration restrictions, create multiple accounts, or engage in fraudulent activities.

  - Navigate to: `User & Authentication` > `Restrictions` settings.
  - Action: Enable settings to block email subaddresses and sign-ups using disposable email addresses.

By implementing these measures, the system will be more secure and less susceptible to common exploits that undermine the integrity of user management and authentication processes.

## Acknowledgments

This project was initially inspired by a [Udemy course on Next.js and OpenAI](https://www.udemy.com/course/nextjs-open-ai/learn/lecture/40901338#overview) and the corresponding [GitHub repository by John Smilga](https://github.com/john-smilga/nextjs-course-openai/tree/main/02-gptgenius). The original concepts and implementations provided a solid foundation for understanding the integration of Next.js with OpenAI's GPT-3.

As the project evolved, I transitioned to using PostgreSQL for the database to leverage its robust features and compatibility with Prisma ORM, which streamlined database management and schema migrations. Additionally, I migrated the codebase to TypeScript to enhance code reliability, readability, and maintainability through static typing and advanced type checking.

These updates significantly improved the project's structure and scalability, allowing for more complex features and a more stable application environment.
