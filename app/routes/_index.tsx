import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <div  className="bg-gradient-to-r from-yellow-200 to-yellow-500 h-full">
      <h1 className="text-7xl text-center py-8">Jokes AI</h1>
    </div>
  );
}
