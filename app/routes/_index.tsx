import type { V2_MetaFunction } from "@remix-run/node";
import UserConfigsForm from "~/components/userConfigsFrom";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div  className="bg-gradient-to-r from-yellow-200 to-yellow-500 h-full">
      <div className="flex justify-between items-center p-8">
      <h1 className="text-7xl text-center py-8">Jokes AI</h1>
        <UserConfigsForm/>
      </div>
    </div>
  );
}
