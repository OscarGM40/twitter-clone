import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/outline'
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from '@heroicons/react/solid'
import { deleteDoc, doc } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { db } from '../firebase'
import Moment from 'react-moment'
import { modalState, postIdState } from '../atoms/modalAtom'
import { useRecoilState } from 'recoil'

export interface Post {
  id: 'string'
  image: 'string'
  tag: 'string'
  text: 'string'
  timestamp: Time
  userImg: 'string'
  username: 'string'
}
interface Time {
  ut: {
    seconds: number
    nanoseconds: number
  }
  toDate: () => Date
}

interface Props {
  id: string
  post: Post
  postPage: any
}

const Post = ({ id, post, postPage }: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [liked, setLiked] = useState(false)

  const [isOpen, setIsOpen] = useRecoilState(modalState)
  const [postId, setPostId] = useRecoilState(postIdState)

  return (
    <div className="flex cursor-pointer border-b border-gray-700 p-3" onClick={() => router.push(`/${id}`)}>
      {!postPage && (
        <img
          src={post?.userImg}
          alt=""
          className="mr-4 h-11 w-11 rounded-full"
        />
      )}
      <div className="flex w-full flex-col space-y-2">
        <div className={`flex ${!postPage && 'justify-between'}`}>
          {postPage && (
            <img
              src={post?.userImg}
              alt="Profile Pic"
              className="mr-4 h-11 w-11 rounded-full"
            />
          )}
          <div className="text-[#6e767d]">
            <div className="group inline-block">
              <h4
                className={`sm-text:base text-[15px] font-bold text-[#d9d9d9] group-hover:underline ${
                  !postPage && 'inline-block'
                }`}
              >
                {post?.username}
              </h4>
              <span
                className={`text-sm sm:text-[15px] ${!postPage && 'ml-1.5'}`}
              >
                @{post?.tag}
              </span>
            </div>{' '}
            ·{' '}
            <span className="text-sm hover:underline sm:text-[15px]">
              <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
            </span>
            {!postPage && (
              <p className="mt-0.5 text-[15px] text-[#d9d9d9] sm:text-base">
                {post?.text}
              </p>
            )}
          </div>

          <div className="icon group ml-auto flex-shrink-0">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>

        {postPage && (
          <p className="mt-0.5 text-[15px] text-[#d9d9d9] sm:text-base">
            {post?.text}
          </p>
        )}

        <img
          src={post?.image}
          alt=""
          className="max-h-[700px] rounded-2xl object-cover"
        />

        <div
          className={`flex w-10/12 justify-between text-[#6e767d] ${
            postPage && 'mx-auto'
          }`}
        >
          {/* comment functionality */}
          <div
            className="group flex items-center space-x-1"
            onClick={(e) => {
              e.stopPropagation()
              setPostId(id)
              setIsOpen(true)
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="text-sm group-hover:text-[#1d9bf0]">
                {comments.length}
              </span>
            )}
          </div>

          {/* delete functionality */}
          {session?.user.uid === post?.id ? (
            <div
              className="group flex items-center space-x-1"
              onClick={(e) => {
                e.stopPropagation()
                deleteDoc(doc(db, 'posts', id))
                router.push('/')
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="group flex items-center space-x-1">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}
          {/* Like functionality */}
          {/*           <div
            className="group flex items-center space-x-1"
            onClick={(e) => {
              e.stopPropagation()
              // likePost()
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`text-sm group-hover:text-pink-600 ${
                  liked && 'text-pink-600'
                }`}
              >
                {likes.length}
              </span>
            )}
          </div> */}

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Post
