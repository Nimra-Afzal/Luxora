export default function AboutPage() {
  return (
    <main className="bg-blue-50 dark:bg-gray-900 min-h-screen p-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
          About Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
          Welcome to{" "}
          <span className="font-semibold text-black dark:text-white">
            Promptopia
          </span>{" "}
          — your space to discover, create, and share AI prompts with the world.
        </p>

        <div className="space-y-6 text-left">
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              🌍 Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We aim to make AI accessible for everyone. Whether you’re a student,
              developer, or just curious, Promptopia provides a collection of
              useful prompts to spark creativity and productivity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              💡 What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Curated AI prompts for learning and fun</li>
              <li>A simple way to share your own prompts</li>
              <li>Community-driven ideas to inspire innovation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              🤝 Join Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Promptopia is built by a community of learners and creators.
              Share your best ideas, learn from others, and let’s grow together
              in the world of AI!
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
