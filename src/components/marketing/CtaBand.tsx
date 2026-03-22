import Link from "next/link";

export function CtaBand() {
  return (
    <section className="bg-brand px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Your Future University Awaits
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Join 50,000+ students who structure their prep with Cognitive
          Sanctuary—practice smarter, not longer.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 min-w-[220px] items-center justify-center rounded-lg bg-white px-8 text-base font-bold text-brand shadow-lg transition hover:bg-blue-50"
        >
          Get Started for Free
        </Link>
      </div>
    </section>
  );
}
