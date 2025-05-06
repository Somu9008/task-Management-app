import Layout from "@/components/layout";
import Navbar from "@/components/navbar";
import PopUp from "@/components/popUp";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";
import { clearUser, setUser } from "@/features/auth/authSlice";
import { closePopUp } from "@/features/task/taskSlice";
import { store } from "@/store/store.js";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

function AuthInitializer() {
  const { data, error, isLoading } = useGetCurrentUserQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user));
    } else if (error) {
      dispatch(clearUser());
      router.push("/login");
    }
  }, [data, error, dispatch]);

  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <AuthInitializer />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
