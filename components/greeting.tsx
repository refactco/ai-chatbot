/**
 * Greeting Component
 *
 * This component displays a welcoming message when a chat is empty.
 * Features:
 * - Animated entrance with staggered text appearance
 * - Responsive layout with centered content
 * - Consistent styling with the application design system
 * - Simple, friendly welcome message
 * - Subtle exit animation when leaving the view
 *
 * Displayed as the initial content in a new chat before any
 * messages have been exchanged.
 */

import { motion } from 'framer-motion';

export const Greeting = () => {
  return (
    <div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20 px-8 size-full flex flex-col justify-center"
    >
      {/* First line with greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-semibold"
      >
        Hello there!
      </motion.div>

      {/* Second line with prompt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        How can I help you today?
      </motion.div>
    </div>
  );
};
