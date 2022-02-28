import { DotsHorizontalIcon } from "@heroicons/react/outline"
import Image from "next/image"

interface Props {
  trending:{
    heading:string,
    description:string,
    tags:string[],
    img:string,
  }
}
const Trending = ({trending}: Props) => {
  return (
  <div className="hover:bg-white hover:bg-opacity-[0.03] px-4 py-2 cursor-pointer transition duration-200 ease-out flex items-center justify-between"> 
  <div className="space-y-0.5">
        <p className="text-[#6e767d] text-sm font-medium">{trending.heading}</p>
        <h6 className="font-bold max-w-[250px] text-base">
          {trending.description}
        </h6>
        <p className="text-[#6e767d] text-sm font-medium max-w-[250px]">
          Trending with{" "}
          {trending.tags.map((tag, index) => (
            <span className="tag" key={index}>
              {tag}
            </span>
          ))}
        </p>
      </div>

      {trending.img ? (
        <Image
          src={trending.img}
          width={70}
          height={70}
          objectFit="cover"
          className="rounded-2xl"
        />
      ) : (
        <div className="icon group">
          <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
        </div>
      )}</div>
  )
}
export default Trending