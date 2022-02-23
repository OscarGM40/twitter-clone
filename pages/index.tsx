import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import Sidebar from '../components/Sidebar'



const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen bg-black max-w-[1500px] mx-auto">
        <Sidebar />
        {/* Feed */}
       <Feed /> 
        {/* Widgets */}

        {/* Modal */}
      </main>
    </div>
  )
}

export default Home
