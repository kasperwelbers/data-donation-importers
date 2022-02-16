import React, { useEffect } from "react";
import { Checkbox, Dropdown, Grid, Form, Input } from "semantic-ui-react";
import { transformerFunctions } from "../lib/transformers/transformerFunctions";
import ListInputs from "./ListInputs";

const [TRANSFORMERWIDTH, COLUMNWIDTH, NEWCOLUMNWIDTH] = [8, 4, 4];

const TRANSFORMER_OPTIONS = Object.keys(transformerFunctions).map((key) => ({
  key,
  value: key,
  text: transformerFunctions[key].label,
  content: (
    <>
      {transformerFunctions[key].label}
      <br />
      <span style={{ color: "grey", fontSize: "0.7em" }}>
        {transformerFunctions[key].description}
      </span>
    </>
  ),
}));

const CreateTransformers = ({ recipe, setRecipe }) => {
  useEffect(() => {
    const transformers = recipe.transformers || [];
    const notEmpty = (transformer) => transformer.transformer !== null;
    const newtransformers = transformers.filter(notEmpty);
    newtransformers.push({ transformer: null, column: "", new_column: "" });
    if (
      newtransformers.length === transformers.length &&
      !notEmpty(transformers[transformers.length - 1])
    )
      return;
    setRecipe((recipe) => ({ ...recipe, transformers: newtransformers }));
  }, [recipe.transformers, setRecipe]);

  if (!recipe.transformers) return null;

  return (
    <Grid style={{ paddingBottom: "30px" }}>
      <Grid.Row style={{ paddingBottom: "0" }}>
        <Grid.Column width={TRANSFORMERWIDTH}>
          <b>Transformer</b>
        </Grid.Column>
        <Grid.Column width={COLUMNWIDTH}>
          <b>Column</b>
        </Grid.Column>
        <Grid.Column width={NEWCOLUMNWIDTH}>
          <b>New Column</b>
        </Grid.Column>
      </Grid.Row>
      {recipe.transformers.map((transformer, i) => (
        <Transformer
          key={"transformer" + i}
          i={i}
          transformers={recipe.transformers}
          setTransformers={(value) => setRecipe((recipe) => ({ ...recipe, transformers: value }))}
        />
      ))}
    </Grid>
  );
};

const Transformer = ({ i, transformers, setTransformers }) => {
  const setColumn = (value) => {
    transformers[i].column = value;
    setTransformers([...transformers]);
  };

  const setTransformer = (value) => {
    if (value) {
      transformers[i].transformer = value;
      transformers[i].arguments = transformerFunctions[value].arguments.reduce((obj, arg) => {
        obj[arg.name] = arg.default;
        return obj;
      }, {});
    } else {
      transformers[i].transformer = null;
      delete transformers[i].arguments;
    }
    setTransformers([...transformers]);
  };

  const setNewColumn = (value) => {
    transformers[i].new_column = value;
    setTransformers([...transformers]);
  };

  const setArgs = (value) => {
    transformers[i].arguments = value;
    setTransformers([...transformers]);
  };

  return (
    <>
      <Grid.Row style={{ padding: "1px 0" }}>
        <Grid.Column width={TRANSFORMERWIDTH}>
          <Dropdown
            fluid
            selection
            clearable
            search
            options={TRANSFORMER_OPTIONS}
            value={transformers[i].transformer || null}
            onChange={(e, d) => setTransformer(d.value)}
            style={{ maxHeight: "30px" }}
          />
        </Grid.Column>
        <Grid.Column width={COLUMNWIDTH} style={{ paddingLeft: "0" }}>
          <Input
            fluid
            placeholder="column"
            value={transformers[i].column || ""}
            onChange={(e, d) => setColumn(d.value)}
          />
        </Grid.Column>

        <Grid.Column width={NEWCOLUMNWIDTH} style={{ paddingLeft: "0" }}>
          <Input
            fluid
            placeholder="optional"
            value={transformers[i].new_column || ""}
            onChange={(e, d) => setNewColumn(d.value)}
          />
        </Grid.Column>
      </Grid.Row>
      <TransformerArguments
        transformer={transformers[i].transformer}
        args={transformers[i].arguments}
        setArgs={setArgs}
      />
    </>
  );
};

const TransformerArguments = React.memo(({ transformer, args, setArgs }) => {
  const setValue = (name, value) => {
    const newArgs = { ...args };
    if (JSON.stringify(newArgs[name]) === JSON.stringify(value)) return;
    newArgs[name] = value;
    setArgs(newArgs);
  };

  if (!transformerFunctions?.[transformer]?.arguments) return null;
  return (
    <Grid.Row style={{ padding: "0", marginLeft: "30px" }}>
      <Grid.Column
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignContent: "stretch",
        }}
      >
        {transformerFunctions[transformer].arguments.map((arg, i) => {
          return (
            <Form.Field
              key={arg.name + i}
              style={{ paddingRight: "5px", flex: arg.type === "bool" ? "0 1 auto" : "1 1 auto" }}
            >
              <label style={{ fontSize: "0.7em", marginBottom: "0" }}>
                {arg.name}
                {arg.link ? (
                  <a href={arg.link} target="_blank" rel="noopener noreferrer">
                    {"   "}(help)
                  </a>
                ) : null}
              </label>
              <ArgInput
                arg={arg}
                value={args[arg.name] || arg.default}
                setValue={(value) => setValue(arg.name, value)}
              />
            </Form.Field>
          );
        })}
      </Grid.Column>
    </Grid.Row>
  );
});

const ArgInput = ({ arg, value, setValue }) => {
  switch (arg.type) {
    case "string":
      return (
        <Input
          size="mini"
          placeholder={arg.placeholder}
          value={value}
          onChange={(e, d) => setValue(d.value)}
          fluid
        />
      );
    case "number":
      return (
        <Input
          type="number"
          placeholder={arg.placeholder}
          size="mini"
          value={value}
          onChange={(e, d) => setValue(d.value)}
          fluid
        />
      );
    case "bool":
      return (
        <Checkbox size="mini" checked={value} onChange={(e, d) => setValue(d.checked)} toggle />
      );
    case "option":
      const options = arg.options.map((a) => ({ key: a, value: a, text: a }));
      return (
        <Dropdown
          button
          size="mini"
          options={options}
          value={value}
          onChange={(e, d) => setValue(d.value)}
          style={{ padding: "8px", marginBottom: "10px" }}
        />
      );
    case "string_multiple":
      return <ListInputs values={value} setValues={setValue} message={arg.placeholder} />;
    default:
      return null;
  }
};

export default CreateTransformers;
