import type { NextPageContext } from 'next'
import Feed from '../components/Feed'
import { getProviders, getSession } from 'next-auth/react'
import Wrapper from '../components/Wrapper'
import axios from 'axios'
import https from 'node:https'

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
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
 /*  const [trendingResults, followResults] = await Promise.all([
    await instance.get('https://jsonkeeper.com/b/NKEV'),
    await instance.get('https://jsonkeeper.com/b/WWMJ'),
  ]) */
  /* providers me devolverá todos los providers,en este caso solo uno */
  const providers = await getProviders()
  const session = await getSession(context)

  return {
    props: {
    /*   trendingResults:trendingResults.data,
      followResults:followResults.data, */
      providers,
      session,
    },
  }
}
