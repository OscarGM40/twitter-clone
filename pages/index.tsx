import type { NextPageContext } from 'next'
import Feed from '../components/Feed'
import { getProviders, getSession } from 'next-auth/react'
import Wrapper from '../components/Wrapper'

interface Props {
  providers: any
  trendingResults: any
  followResults: any
}
const Home = ({ providers, trendingResults, followResults }: Props) => {
  return (
    <Wrapper
      providers={providers}
      title="Home / Twitter"
      trendingResults={trendingResults}
      followResults={followResults}
    >
      <Feed />
    </Wrapper>
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
