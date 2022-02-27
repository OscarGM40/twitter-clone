import { useRecoilState, useRecoilValue } from 'recoil'
import { modalState, postIdState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, MouseEvent, useEffect, useState } from 'react'
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from '@heroicons/react/outline'
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useSession } from 'next-auth/react'
import Moment from 'react-moment'
import { useRouter } from 'next/router'

interface Props {}
const Modal = (props: Props) => {
  const { data: session } = useSession()
  const router = useRouter()

  const [isOpen, setIsOpen] = useRecoilState(modalState)
  const postId = useRecoilValue(postIdState)
  const [post, setPost] = useState<DocumentData>()
  const [comment, setComment] = useState('')

  useEffect(
    () =>
      onSnapshot(doc(db, 'posts', postId), (snapshot) =>
        setPost(snapshot.data())
      ),
    [db, postId]
  )

  const sendComment = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        comment,
        username: session?.user.name,
        userImg: session?.user.image,
        tags: session?.user.tag,
        timestamp: serverTimestamp(),
      })
      setComment('')
      setIsOpen(false)
      router.push(`/${postId}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 pt-8" onClose={setIsOpen}>
        <div className="modalWrapper">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block transform overflow-hidden rounded-2xl bg-black text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:align-middle">
              <div className="flex items-center border-b border-gray-700 px-1.5 py-2">
                <div
                  className="hoverAnimation flex h-9 w-9 items-center justify-center xl:px-0"
                  onClick={() => setIsOpen(false)}
                >
                  <XIcon className="h-[22px] text-white" />
                </div>
              </div>
              <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                <div className="w-full">
                  <div className="relative flex gap-x-3 text-[#6e767d]">
                    <span className="absolute left-5 top-11 z-[-1] h-full w-0.5 bg-gray-600"></span>
                    <img
                      src={post?.userImg}
                      alt=""
                      className="
                    h-11 w-11 rounded-full"
                    />
                    <div className="">
                      <div className="group inline-block">
                        <h4 className="inline-block text-[15px] font-bold text-[#d9d9d9] group-hover:underline sm:text-base">
                          {post?.username}
                        </h4>
                        <span className="ml-1.5 text-sm sm:text-[15px]">
                          @{post?.tag}
                        </span>
                      </div>{' '}
                      ·{' '}
                      <span className="text-sm hover:underline sm:text-[15px]">
                        <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                      </span>
                      <p className="text-[15px] text-[#d9d9d9] sm:text-base">
                        {post?.text}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex w-full space-x-3 ">
                    <img
                      src={session?.user.image!}
                      alt=""
                      className="h-11 w-11 rounded-full"
                    />
                    <div className="mt-2 flex-grow">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={2}
                        placeholder="Tweet your reply"
                        className="min-h-[80px] w-full bg-transparent text-lg tracking-wide text-[#d9d9d9] placeholder-gray-500 outline-none"
                      ></textarea>
                      <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                          <div className="icon">
                            <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                          </div>

                          <div className="icon rotate-90">
                            <ChartBarIcon className="h-[22px] text-[#1d9bf0]" />
                          </div>

                          <div className="icon">
                            <EmojiHappyIcon className="h-[22px] text-[#1d9bf0]" />
                          </div>

                          <div className="icon">
                            <CalendarIcon className="h-[22px] text-[#1d9bf0]" />
                          </div>
                        </div>
                        <button
                          className="rounded-full bg-[#1d9bf0] px-4 py-1.5 font-bold text-white shadow-md hover:bg-[#1a8cd8] disabled:cursor-default disabled:opacity-50 disabled:hover:bg-[#1d9bf0]"
                          type="submit"
                          onClick={sendComment}
                          disabled={!comment.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default Modal
