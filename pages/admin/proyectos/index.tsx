// Redirige a /admin para evitar página en blanco
import { GetServerSideProps } from "next";

export default function ProyectosIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: { destination: "/admin", permanent: false },
  };
};
