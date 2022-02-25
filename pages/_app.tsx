import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'

export default function MyApp({
  Component,
  // `session` comes from `getServerSideProps` or `getInitialProps`.
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    /* hace poll de la session cada 300 segundos */
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  )
}
