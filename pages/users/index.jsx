import Layout from "@/components/layouts/internal";
import Breadcrumb from "@/components/breadcrumb";
import withSession from "@/lib/session";
import auth from "@/lib/middleware";
import { AppContext } from "@/components/context";
import Link from "next/link";
import { useEffect, useState } from "react";

export const getServerSideProps = withSession(auth);

export default function Index(props) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        console.error("Error:", err);
        setError("Could not load users");
      });
  }, []);

  return (
    <AppContext.Provider value={props.configBundle}>
      <Layout location="users">
        <Breadcrumb links={[{ label: "Users", url: "/users" }]} />

        <div className="my-4">
          <header className="text-4xl text-gray-600">Users</header>
          <p>
            <small>Create and manage user accounts.</small>
          </p>
        </div>

        <div className="my-10">
          <div className="my-4">
            <Link href="/users/create" className="btn btn-primary">
              New User
            </Link>
          </div>

          {error && (
            <div className="text-red-500 my-2">
              <p>{error}</p>
            </div>
          )}

          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="border border-gray-300 p-4 rounded shadow-sm"
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </AppContext.Provider>
  );
}
