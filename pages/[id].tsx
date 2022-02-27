import { collection, doc, DocumentData, onSnapshot, orderBy, query } from 'firebase/firestore'
import { getProviders, getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { db } from '../firebase'
import Wrapper from '../components/Wrapper'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import Post from '../components/Post'
import Comment from '../components/Comment'
import { NextPageContext } from 'next'

interface Props {
  providers: any
  trendingResults:any
  followResults:any
}
const PostPage = ({ providers, trendingResults,followResults }: Props) => {
  const router = useRouter()
  const { id } = router.query

  const { data: session } = useSession()
  const isOpen = useRecoilValue(modalState)
  const [post, setPost] = useState<DocumentData>()
  const [comments, setComments] = useState<DocumentData[]>([])

  useEffect(
    () =>
      onSnapshot(doc(db, 'posts', id as string), (snapshot) =>
        setPost(snapshot.data())
      ),
    [db, id]
  )

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id as string, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  )
  return (
    <Wrapper
      providers={providers}
      title={`${post?.username} on Twitter: ${post?.text}`}
      trendingResults={trendingResults}
      followResults={followResults}
    >
      <div className="max-w-2xl flex-grow border-l border-r border-gray-700 sm:ml-[73px] xl:ml-[370px]">
        <div className="sticky top-0 z-50 flex items-center gap-x-4 border-b border-gray-700 bg-black px-1.5 py-2 text-xl font-semibold text-[#d9d9d9]">
          <div
            className="hoverAnimation flex h-9 w-9 items-center justify-center xl:px-0"
            onClick={() => router.push('/')}
          >
            <ArrowLeftIcon className="h-5 text-white" />
          </div>
          Tweet
        </div>

        <Post id={id as string} post={post!} postPage />
        {comments.length > 0 && (
          <div className="pb-72">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                comment={comment.data()}
              />
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  )
}
export default PostPage

export async function getServerSideProps(context: NextPageContext) {
  const [trendingResults, followResults] = await Promise.all([
    fetch('https://jsonkeeper.com/b/NKEV').then((res) => res.json()),
    fetch('https://jsonkeeper.com/b/WWMJ').then((res) => res.json()),
  ])
  /* providers me devolverá todos los providers,en este caso solo uno */
  const providers = await getProviders()
  const session = await getSession(context)

  return {
    props: {
      trendingResults,
      followResults,
      providers,
      session,
    },
  }
}