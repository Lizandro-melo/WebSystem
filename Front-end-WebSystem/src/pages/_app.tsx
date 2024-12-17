import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {MainProvider} from "@/provider/main-provider";
import ContainerRoot from "@/components/container/container-root";
import {Modals} from "@/components/modal/modals";
require('dotenv/config');

export default function App({Component, pageProps}: AppProps) {

    return (
        <MainProvider>
            <ContainerRoot>
                <Modals/>
                <Component {...pageProps} />
                
            </ContainerRoot>
        </MainProvider>
    );
}
