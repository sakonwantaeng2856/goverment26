import Head from 'next/head';
import Router from 'next/router';
import { getAppCookies, verifyToken } from '../middleware/utils';
import NProgress from 'nprogress';
// import '../styles/globals.css'
import '../styles/default.css'
import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.css';

// Require Editor CSS files.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', url => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Import CSS for nprogress */}
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const {
    store,
    isServer,
    req,
    query: { amp },
    asPath,
  } = ctx;

  const { token } = getAppCookies(req);
  const user = token && verifyToken(token.replace('Bearer ', ''));

  let pageProps = { user, asPath };
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps({ ctx });
  }

  return { pageProps };
};

export default MyApp;
