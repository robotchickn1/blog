import siteMetadata from '@/data/siteMetadata'
import movieData from '@/data/movieData'
import musicData from '@/data/musicData'
import RecommendCard from '@/components/RecommendCard'
import { PageSEO } from '@/components/SEO'

export default function Recommends() {
  return (
    <>
      <PageSEO
        title={`Recommendations - ${siteMetadata.author}`}
        description="Recommended movies and music albums"
      />
      <div className="mx-auto max-w-5xl px-4">
        <div className="space-y-2 pt-6 pb-8 text-center md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
            Recommendations
          </h1>
          <p className="text-md leading-7 text-gray-500 dark:text-gray-400">
            A list of recommended films, albums, and other things.
          </p>
        </div>

        {/* 🎬 Films Section */}
        <div className="py-10">
          <h2 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            🍿 Films
          </h2>
          <p className="text-md text-center leading-7 text-gray-500 dark:text-gray-400">
            "Cinema is the most beautiful fraud in the world."
          </p>

          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3">
            {movieData.map((movie) => (
              <RecommendCard
                key={movie.title}
                title={movie.title}
                description={movie.description}
                tags={movie.tags}
                href={movie.href}
                poster={movie.poster}
              />
            ))}
          </div>
        </div>

        {/* 🎵 Music Section */}
        <div className="py-10">
          <h2 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            🎷 Music Albums
          </h2>
          <p className="text-md text-center leading-7 text-gray-500 dark:text-gray-400">
            "Music is the divine way to tell beautiful, poetic things to the heart."
          </p>

          <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 md:grid-cols-3">
            {musicData.albums.map((album) => (
              <RecommendCard
                key={album.title}
                title={album.title}
                description={album.description}
                tags={album.tags}
                href={album.href}
                poster={album.poster}
              />
            ))}
          </div>
        </div>

        {/* 🎹 Bonus Album Section - Centered */}
        <div className="py-10">
          <h2 className="text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
            🎹 Bonus Album
          </h2>

          <div className="flex justify-center py-6">
            {musicData.bonusAlbums.map((album) => (
              <RecommendCard
                key={album.title}
                title={album.title}
                description={album.description}
                tags={album.tags}
                href={album.href}
                poster={album.poster}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
