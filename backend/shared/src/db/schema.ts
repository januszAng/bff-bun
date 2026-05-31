import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  real,
} from "drizzle-orm/pg-core";

// 1. Decks Table
// Represents a collection of flashcards owned by a specific user
export const decks = pgTable("decks", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Logical reference to the user from the external auth-service
  userId: uuid("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

// 2. Flashcards Table
// Represents individual cards inside a deck with SM-2 Spaced Repetition fields
export const flashcards = pgTable("flashcards", {
  id: uuid("id").defaultRandom().primaryKey(),
  deckId: uuid("deck_id")
    .notNull()
    .references(() => decks.id, { onDelete: "cascade" }), // Cascades deletion if the deck is deleted
  front: text("front").notNull(), // The question or term to learn
  back: text("back").notNull(), // The answer or translation
  imageUrl: varchar("image_url", { length: 500 }), // Optional hint image hosted on the BFF

  // --- SM-2 Algorithmic Fields for Spaced Repetition ---
  // The exact date and time when the user should review this card next
  nextReview: timestamp("next_review").defaultNow().notNull(),
  // The current repetition interval in days (how long to wait before next review)
  interval: integer("interval").default(0).notNull(),
  // Number of times the card has been successfully reviewed in a row
  repetitions: integer("repetitions").default(0).notNull(),
  // Difficulty coefficient (starts at 2.5, decreases if card is hard, increases if easy)
  easeFactor: real("ease_factor").default(2.5).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
