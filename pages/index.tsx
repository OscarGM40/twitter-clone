import type { NextPageContext } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import Sidebar from '../components/Sidebar'
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  useSession,
} from 'next-auth/react'
import BuiltInProviderType from 'next-auth/providers'
import Login from '../components/Login'
import Modal from '../components/Modal'
import { modalState } from '../atoms/modalAtom'
import { useRecoilState } from 'recoil'

type Props = {
  trendingResults: any
  followResults: any
  //@ts-ignore
  providers: Record<LiteralUnion<typeof BuiltInProviderType, string>,
    ClientSafeProvider
  > | null
}

const Home = ({ trendingResults, followResults, providers }: Props) => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useRecoilState(modalState)

  if (!session) return <Login providers={providers} />

  return (
    <div className="">
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen max-w-[1500px] bg-black">
        <Sidebar />
        <Feed />
        {/* Widgets */}

        {isOpen && <Modal />}
      </main>
    </div>
  )
}

export default Home

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
