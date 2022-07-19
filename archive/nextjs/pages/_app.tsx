import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { clientSide } from "lib/request";
import "./globals.css";
import { UserContext, useUserContext } from "../context/UserContext";

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const user = useUserContext();

  const getLayout =
    Component.getLayout ??
    ((page) => {
      return <div>GLOBAL LAYOUT {page}</div>;
    });

  return getLayout(
    <UserContext.Provider value={user}>
      <SWRConfig
        value={{
          fetcher: (path: string) => clientSide.get(path),
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </UserContext.Provider>
  );
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
