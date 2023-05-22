import {
  Menu,
  PlayIcon,
  StopIcon,
  Tooltip,
  useEditorContext,
} from "@graphiql/react";
import "./execute.css";
import { useQuery } from "../convex/_generated/react";

export function ExecuteButton() {
  const { queryEditor, setOperationName } = useEditorContext({
    nonNull: true,
    caller: ExecuteButton,
  });

  const operations = queryEditor?.operations || [];
  const hasOptions = operations.length > 1;
  const isRunning = true;

  const label = `${isRunning ? "Stop" : "Execute"} query (Ctrl-Enter)`;
  const buttonProps = {
    type: "button" as const,
    className: "graphiql-execute-button",
    children: isRunning ? <StopIcon /> : <PlayIcon />,
    "aria-label": label,
  };

  return hasOptions && !isRunning ? (
    <Menu>
      <Tooltip label={label}>
        <Menu.Button {...buttonProps} />
      </Tooltip>

      <Menu.List>
        {operations.map((operation, i) => {
          const opName = operation.name
            ? operation.name.value
            : `<Unnamed ${operation.operation}>`;
          return (
            <Menu.Item
              key={`${opName}-${i}`}
              onSelect={() => {
                const selectedOperationName = operation.name?.value;
                if (
                  queryEditor &&
                  selectedOperationName &&
                  selectedOperationName !== queryEditor.operationName
                ) {
                  setOperationName(selectedOperationName);
                }
                run();
              }}
            >
              {opName}
            </Menu.Item>
          );
        })}
      </Menu.List>
    </Menu>
  ) : (
    <Tooltip label={label}>
      <button
        {...buttonProps}
        onClick={() => {
          if (isRunning) {
            stop();
          } else {
            run();
          }
        }}
      />
    </Tooltip>
  );
}

const Inner = () => {
  const result = useQuery("xcxc", {});
};
