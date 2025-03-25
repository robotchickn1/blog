import siteMetadata from '@/data/siteMetadata'
import movieData from '@/data/movieData'
import RecommendCard from '@/components/RecommendCard'
import { PageSEO } from '@/components/SEO'

export default function Recommends() {
  return (
    <>
      <PageSEO
        title={`Recommendations - ${siteMetadata.author}`}
        description="Recommended movies and more"
      />
      <div className="mx-auto max-w-5xl px-4">
        <div className="space-y-2 pt-6 pb-8 text-center md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Recommends
          </h1>
          <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
            A list of recommended movies and more
          </p>
        </div>

        {/* Films Section */}
        <div className="py-10">
          <h2 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            <span role="img" className="mr-4" aria-label="film">
              🍿
            </span>
            Films
          </h2>
          <p className="text-md text-center leading-7 text-gray-500 dark:text-gray-400">
            Cinema is the greatest influencer.
          </p>

          {/* Movie Cards Grid */}
          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3">
            {movieData.map((movie) => (
              <RecommendCard
                key={movie.title}
                title={movie.title}
                description={movie.description}
                tags={movie.tags}
                href={movie.href}
                poster={movie.poster} // Pass movie poster
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
