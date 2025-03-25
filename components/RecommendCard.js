import CustomLink from '@/components/CustomLink'
import Image from 'next/image'

const RecommendCard = ({ title, description, href, tags, poster, showLink = true }) =>
  showLink ? (
    <CustomLink
      href={href}
      aria-label={`Link to ${title}`}
      className="max-w-sm p-2"
      showIcon={false}
    >
      <div className="h-full overflow-hidden rounded-md border-2 border-gray-200 hover:border-primary-500 dark:border-gray-800 dark:hover:border-primary-500">
        {/* Movie Poster */}
        {poster && (
          <div className="relative h-72 w-full">
            <Image
              src={poster}
              alt={`${title} poster`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
            />
          </div>
        )}

        {/* Movie Details */}
        <div className="p-4">
          <h4 className="mb-2 text-xl font-bold text-black dark:text-white">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

          {/* Tags */}
          {tags && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold dark:bg-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomLink>
  ) : (
    <div className="max-w-sm p-4">
      <div className="h-full overflow-hidden rounded-md border-2 border-gray-200 dark:border-gray-800">
        {/* Movie Poster */}
        {poster && (
          <div className="relative h-72 w-full">
            <Image
              src={poster}
              alt={`${title} poster`}
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
            />
          </div>
        )}

        {/* Movie Details */}
        <div className="p-4">
          <h4 className="mb-2 text-xl font-bold text-black dark:text-white">{title}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon: {description}</p>
        </div>
      </div>
    </div>
  )

export default RecommendCard
