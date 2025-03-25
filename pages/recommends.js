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
      <div className="mx-auto max-w-3xl">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Recommends
          </h1>
          <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
            A list of recommended movies and more
          </p>
        </div>
        <div className="container py-7">
          <div className="space-y-2 pt-6 pb-8 md:space-y-5 ">
            <h2 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
              <span role="img" className="mr-4" aria-label="wave">
                🍿
              </span>
              Films
            </h2>
            <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
              Cinema is the greatest influencer.
            </p>
          </div>
          <div className="container py-4">
            <div className="-m-4 flex flex-wrap">
              {movieData.map((d) => (
                <RecommendCard
                  key={d.title}
                  title={d.title}
                  description={d.description}
                  tags={d.tags}
                  href={d.href}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
