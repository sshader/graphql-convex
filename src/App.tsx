import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { graphql } from "cm6-graphql";
import {
  getIntrospectionQuery,
  buildClientSchema,
  GraphQLSchema,
} from "graphql";
import { useQuery } from "../convex/_generated/react";
ConvexHttpClient;

import { GraphiQLProvider, DocExplorer } from "@graphiql/react";
import { ConvexHttpClient } from "convex/browser";

import throttle from "lodash.throttle";

const initialValue = `
{
  hero { name }
}
`;

function App() {
  const introspectionJson = useQuery("xcxc", {
    query: getIntrospectionQuery(),
  });
  if (introspectionJson !== undefined) {
    const schema = buildClientSchema(introspectionJson.data);
    const client = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);
    return (
      <GraphiQLProvider
        fetcher={async (graphQLParams: {
          query: string;
          operationName?: string | null;
          variables?: any;
        }) => {
          return await client.query("xcxc", { ...graphQLParams });
        }}
      >
        <InnerApp schema={schema}></InnerApp>
      </GraphiQLProvider>
    );
  } else {
    return <div>Loading...</div>;
  }
}

function InnerApp(props: { schema: GraphQLSchema }) {
  const [queryValue, setQueryValue] = useState(initialValue);
  const debouncedCallback = throttle(
    (v) => {
      console.log(v);
      setQueryValue(v);
    },
    1000,
    { leading: false }
  );
  const result = useQuery("xcxc", { query: queryValue });
  return (
    <div>
      {/* <DocExplorer /> */}
      <div style={{ display: "flex", width: "100vw" }}>
        <Editor onChange={debouncedCallback} schema={props.schema} />
        <CodeMirror
          value={JSON.stringify(result, null, 2)}
          width="50vw"
          height="50vh"
        ></CodeMirror>
      </div>
    </div>
  );
}

function Editor(props: {
  onChange: (v: string) => void;
  schema: GraphQLSchema;
}) {
  const [value, setValue] = useState(initialValue);
  return (
    <CodeMirror
      value={value}
      height="50vh"
      width="50vw"
      extensions={[graphql(props.schema)]}
      onChange={(v) => {
        setValue(v);
        props.onChange(v);
      }}
    />
  );
}
export default App;
