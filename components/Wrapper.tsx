import type { NextPageContext } from 'next'
import Head from 'next/head'
import Sidebar from './Sidebar'
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  useSession,
} from 'next-auth/react'
import BuiltInProviderType from 'next-auth/providers'
import Login from './Login'
import Modal from './Modal'
import { modalState } from '../atoms/modalAtom'
import { useRecoilValue } from 'recoil'
import Widgets from './Widgets'

type Props = {
  trendingResults: any
  followResults: any
  //@ts-ignore
  providers: Record< LiteralUnion<typeof BuiltInProviderType, string>,
    ClientSafeProvider
  > | null
  children?: JSX.Element | JSX.Element[]
  title?: string
}

const Wrapper = ({
  trendingResults,
  followResults,
  providers,
  children,
  title,
}: Props) => {
  const { data: session } = useSession()
  const isOpen = useRecoilValue(modalState)

  if (!session) return <Login providers={providers!} />

  return (
    <div className="">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-[1500px] bg-black">
        <Sidebar />
        {children}
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
        {isOpen && <Modal />}
      </main>
    </div>
  )
}

export default Wrapper

