import { store } from "@/store/store";
import { Html, Head, Main, NextScript } from "next/document";
import { Provider } from "react-redux";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
